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
      my_friendCount:0,
      my_lendingCount:0,
      my_borrowingCount:0,
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
    
    
   

    ui: {
      windowWidth: 0     
    },
    buttonClicked: false, //是否点击跳转
    
    
    windowHeight1: 0,
    windowWidth1: 0,

  },

 

  


  onLoad(t) {
    var self = this;
    
    try {
      let res = wx.getSystemInfoSync();
      this.windowWidth = res.windowWidth;     
      this.data.ui.windowWidth = res.windowWidth;
      this.setData({ ui: this.data.ui })
    } catch (e) {
    }
  },

  onShow: function (e) {
    
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
    this.data.storageInfo.my_friendCount = wx.getStorageSync('my_friendCount');
    this.data.storageInfo.my_lendingCount = wx.getStorageSync('my_lendingCount');
    this.data.storageInfo.my_borrowingCount = wx.getStorageSync('my_borrowingCount');
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
  clickFriendTap(e) {
    if (!this.buttonClicked) {
      util.buttonClicked(this);
      wx.navigateTo({
        url: '/pages/friend/friend',
      });
    }
  },
  clickLendingTap(e) {
    if (!this.buttonClicked) {
      util.buttonClicked(this);
      wx.navigateTo({
        url: '/pages/lending/lending',
      });
    }
  },
  clickBorrowingTap(e) {
    if (!this.buttonClicked) {
      util.buttonClicked(this);
      wx.navigateTo({
        url: '/pages/borrowing/borrowing',
      });
    }
  },
  clickStorageTap(e) {
    if (!this.buttonClicked) {
      util.buttonClicked(this);
      wx.navigateTo({
        url: '/pages/storage/storage',
      });
    }
  },
  clickReviewTap(e) {
    if (!this.buttonClicked) {
      util.buttonClicked(this);
      wx.navigateTo({
        url: '/pages/review/review',
      });
    }
  },
  clickAnnotationTap(e) {
    if (!this.buttonClicked) {
      util.buttonClicked(this);
      wx.navigateTo({
        url: '/pages/annotation/annotation',
      });
    }
  },
  onPullDownRefresh:function(){
    wx.stopPullDownRefresh()
  }
})

