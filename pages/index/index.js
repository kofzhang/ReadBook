//wx-drawer
var common = require('../../utils/common.js');
var Bmob = require("../../utils/bmob.js");
var util = require('../../utils/util.js');
var app = getApp();

var that;

Page({
  
  data: {
    storageInfo:{
      my_nick:'',
      my_avatar:'',
      my_studyname:'',
      my_followCount:0,
      my_followerCount:0,
      my_updatingCount:0,
      my_storageCount:0,
      my_storagePic:'',
      my_storageSummary:'',
      my_reviewCount:0,
      my_reviewPic:'',
      my_reviewSummary:'',
      my_annotationCount:0,
      my_annotationPic:'',
      my_annotationSummary:''

    },
    
    
    dialog: false,

    ui: {
      windowWidth: 0     
    },
    buttonClicked: false, //是否点击跳转
    //--------首页显示内容---------
    postsList: [], //总的活动
    
    currentPage: 0, //要跳过查询的页数
    limitPage: 3,//首先显示3条数据（之后加载时都增加3条数据，直到再次加载不够3条）
    isEmpty: false, //当前查询出来的数据是否为空
    totalCount: 0, //总活动数量
    endPage: 0, //最后一页加载多少条
    totalPage: 0, //总页数
    
    windowHeight1: 0,
    windowWidth1: 0,

  },

 

  


  onLoad(t) {
    var self = this;
    //this.getAll();
    //this.fetchTopThreePosts(); //获取轮播图的3篇文章
    try {
      let res = wx.getSystemInfoSync();
      this.windowWidth = res.windowWidth;     
      this.data.ui.windowWidth = res.windowWidth;
      this.setData({ ui: this.data.ui })
    } catch (e) {
    }
  },

  onShow: function (e) {
    this.getAll();
    this.getStorageInfomation();
    //this.onLoad();
    console.log('加载头像');
    var that = this;

    
    
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight1: res.windowHeight,
          windowWidth1: res.windowWidth,
          autoplay: true
        })
      }
    })
  },
  getStorageInfomation:function(){
    var that=this;
    this.data.storageInfo.my_nick = wx.getStorageSync('my_nick');
    this.data.storageInfo.my_avatar = wx.getStorageSync('my_avatar');
    this.data.storageInfo.my_studyname = wx.getStorageSync('my_studyname');
    this.data.storageInfo.my_followCount = wx.getStorageSync('my_followCount');
    this.data.storageInfo.my_updatingCount = wx.getStorageSync('my_updatingCount');
    this.data.storageInfo.my_storageCount = wx.getStorageSync('my_storageCount');
    this.data.storageInfo.my_storagePic = wx.getStorageSync('my_storagePic');
    this.data.storageInfo.my_storageSummary = wx.getStorageSync('my_storageSummary');
    this.data.storageInfo.my_reviewCount = wx.getStorageSync('my_reviewCount');
    this.data.storageInfo.my_reviewPic = wx.getStorageSync('my_reviewPic');
    this.data.storageInfo.my_reviewSummary = wx.getStorageSync('my_reviewSummary');
    this.data.storageInfo.my_annotationCount = wx.getStorageSync('my_annotationCount');
    this.data.storageInfo.my_annotationPic = wx.getStorageSync('my_annotationPic');
    this.data.storageInfo.my_annotationSummary = wx.getStorageSync('my_annotationSummary');
    
    that.setData({
      storageInfo:this.data.storageInfo});
      
  },

  //数据存储
  onSetData: function (data) {
    console.log(data.length);
    let page = this.data.currentPage + 1;
    //设置数据
    data = data || [];
    this.setData({
      postsList: page === 1 || page === undefined ? data : this.data.postsList.concat(data),
    });
    console.log(this.data.postsList, page);
  },

  //获取总的活动数
  getAll: function () {
    self = this;
    var Diary = Bmob.Object.extend("Events");
    var query = new Bmob.Query(Diary);
    query.equalTo("isShow", 1); //只统计公开显示的活动
    query.count({
      success: function (count) {
        var totalPage = 0;
        var endPage = 0;
        if (count % self.data.limitPage == 0) {//如果总数的为偶数
          totalPage = parseInt(count / self.data.limitPage);
        } else {
          var lowPage = parseInt(count / self.data.limitPage);
          endPage = count - (lowPage * self.data.limitPage);
          totalPage = lowPage + 1;
        }
        self.setData({
          totalCount: count,
          endPage: endPage,
          totalPage: totalPage
        })
        console.log("共有" + count + " 条记录");
        console.log("共有" + totalPage + "页");
        console.log("最后一页加载" + endPage + "条");
      },
    });
  },






  //获取首页列表文章
  fetchPostsData: function (data) {
    var self = this;
    //获取详询活动信息
    var molist = new Array();
    var Diary = Bmob.Object.extend("Events");
    var query = new Bmob.Query(Diary);
    query.equalTo("isShow", 1); //公开显示的
    query.limit(self.data.limitPage);
    console.log(self.data.limitPage);
    query.skip(3 * self.data.currentPage);
    query.descending("createdAt"); //按照时间降序
    query.include("publisher");
    query.find({
      success: function (results) {
        for (var i = 0; i < results.length; i++) {
          var publisherId = results[i].get("publisher").objectId;
          var title = results[i].get("title");
          var content = results[i].get("content");
          var acttype = results[i].get("acttype");
          var endtime = results[i].get("endtime");
          var address = results[i].get("address");
          var acttypename = getTypeName(acttype); //根据类型id获取类型名称
          var isShow = results[i].get("isShow");
          var peoplenum = results[i].get("peoplenum");
          var likenum = results[i].get("likenum");
          var liker = results[i].get("liker");
          var isLike = 0;
          var commentnum = results[i].get("commentnum");
          var id = results[i].id;
          var createdAt = results[i].createdAt;
          var pubtime = util.getDateDiff(createdAt);
          var _url
          var actpic = results[i].get("actpic");
          if (actpic) {
            _url = results[i].get("actpic")._url;
          } else {
            _url = "http://bmob-cdn-14867.b0.upaiyun.com/2017/12/01/89a6eba340008dce801381c4550787e4.png";
          }
          var publisherName = results[i].get("publisher").nickname;
          var publisherPic = results[i].get("publisher").userPic;
          var jsonA;
          jsonA = {
            "title": title || '',
            "content": content || '',
            "acttype": acttype || '',
            "acttypename": acttypename || '',
            "isShow": isShow,
            "endtime": endtime || '',
            "address": address || '',
            "peoplenum": peoplenum || '',
            "id": id || '',
            "publisherPic": publisherPic || '',
            "publisherName": publisherName || '',
            "publisherId": publisherId || '',
            "pubtime": pubtime || '',
            "actPic": _url || '',
            "likenum": likenum,
            "commentnum": commentnum,
            "is_liked": isLike || ''
          }
          molist.push(jsonA);
        }
        self.onSetData(molist, self.data.currentPage);

        setTimeout(function () {
          wx.hideLoading();
        }, 900);
      },
      error: function (error) {
        console.log(error)
      }
    })
  },

  //加载下一页
  loadMore: function () {
    wx.showLoading({
      title: '正在加载',
      mask: true
    });
    //一秒后关闭加载提示框
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
    var self = this;
    self.setData({
      currentPage: self.data.currentPage + 1
    });
    console.log("当前页" + self.data.currentPage);
    //先判断是不是最后一页
    if (self.data.currentPage + 1 == self.data.totalPage) {
      self.setData({
        isEmpty: true
      })
      if (self.data.endPage != 0) { //如果最后一页的加载不等于0
        self.setData({
          limitPage: self.data.endPage,
        })
      }
      this.fetchPostsData(self.data);
    } else {
      this.fetchPostsData(self.data);
    }
  },


  //点击刷新
  onPullDownRefresh: function () {
    this.setData({
      postsList: [], //总的活动
      postsShowSwiperList: [], //轮播图显示的活动
      currentPage: 0, //要跳过查询的页数
      limitPage: 3,//首先显示3条数据（之后加载时都增加3条数据，直到再次加载不够3条）
      isEmpty: false, //当前查询出来的数据是否为空
      totalCount: 0, //总活动数量
      endPage: 0, //最后一页加载多少条
      totalPage: 0, //总页数
      curIndex: 0,
      windowHeight1: 0,
      windowWidth1: 0,
    })
    this.onShow();
    wx.stopPullDownRefresh();
  },

  // 点击活动进入活动详情页面
  click_activity: function (e) {
    if (!this.buttonClicked) {
      util.buttonClicked(this);
      let actid = e.currentTarget.dataset.actid;
      let pubid = e.currentTarget.dataset.pubid;
      let user_key = wx.getStorageSync('user_key');
      wx.navigateTo({
        url: '/pages/detail/detail?actid=' + actid + "&pubid=" + pubid
      });
    }
  },






  //-----------------------------------------------------------------------------------------
  
//点击头像进入个人信息页面
  clickAvatarTap(e) {
    if (!this.buttonClicked) {
      util.buttonClicked(this);
      wx.navigateTo({
        url: '/pages/profile/profile',
      });
    }
  },
})

//根据活动类型获取活动类型名称
function getTypeName(acttype) {
  var acttypeName = "";
  if (acttype == 1) acttypeName = "运动";
  else if (acttype == 2) acttypeName = "游戏";
  else if (acttype == 3) acttypeName = "交友";
  else if (acttype == 4) acttypeName = "旅行";
  else if (acttype == 5) acttypeName = "读书";
  else if (acttype == 6) acttypeName = "竞赛";
  else if (acttype == 7) acttypeName = "电影";
  else if (acttype == 8) acttypeName = "音乐";
  else if (acttype == 9) acttypeName = "其他";
  return acttypeName;
}