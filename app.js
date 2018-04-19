//app.js
import Touches from './utils/Touches.js'
var Bmob = require("utils/bmob.js");
var common = require("utils/common.js");
const __utils = require('utils/util');

Bmob.initialize("53bf2d9ed6c3fd7c7146cca79f66523b", "6e2f20f3f4a9d053d1460e957997f99d");
App({
  version:'v1.0.0',//版本号
  onLaunch: function () {
    var that = this;
    //调用系统API获取设备的信息
    wx.getSystemInfo({
      success: function (res) {
        var kScreenW = res.windowWidth / 375
        var kScreenH = res.windowHeight / 603
        wx.setStorageSync('kScreenW', kScreenW)
        wx.setStorageSync('kScreenH', kScreenH)
      }
    })
    //调用API从本地缓存中获取数据
    try {
      var value = wx.getStorageSync('user_openid');
      if (value) {

      } else {
        console.log('执行login1');
        wx.login({
          success: function (res) {
            if (res.code) {
              console.log('执行login2', res);
            }
          }
        });
        wx.login({
          success: function (res) {
            if (res.code) {
              Bmob.User.requestOpenId(res.code, {
                success: function (userData) {
                  wx.getUserInfo({
                    success: function (result) {
                      var userInfo = result.userInfo;
                      var nickName = userInfo.nickName;
                      var avatarUrl = userInfo.avatarUrl;
                      var sex = userInfo.gender;
                      Bmob.User.logIn(nickName, userData.openid, {
                        success: function (user) {
                          try {
                            wx.setStorageSync('user_openid', user.get('userData').openid);
                            wx.setStorageSync('user_id', user.id);
                            wx.setStorageSync('my_nick', user.get("nickname"));
                            wx.setStorageSync('my_username', user.get("username"));
                            wx.setStorageSync('my_sex', user.get("sex"));
                            wx.setStorageSync('my_avatar', user.get("userPic"));
                            wx.setStorageSync('my_studyname', user.get("studyname"));
                            var Profile = Bmob.Object.extend("UserProfile");
                            var query = new Bmob.Query(Profile);
                            query.equalTo("user", Bmob.User.current());
                            query.first({
                              success: function (result) {
                                console.log("取个人数据");
                                wx.setStorageSync("my_storageCount", result.get("storageCount"));
                                wx.setStorageSync("my_storagePic", result.get("storagePic"));
                                wx.setStorageSync("my_storageSummary", result.get("storageSummary"));
                                wx.setStorageSync("my_reviewCount", result.get("reviewCount"));
                                wx.setStorageSync("my_reviewPic", result.get("reviewPic"));
                                wx.setStorageSync("my_reviewSummary", result.get("reviewSummary"));
                                wx.setStorageSync("my_annotationCount", result.get("annotationCount"));
                                wx.setStorageSync("my_annotationPic", result.get("annotationPic"));
                                wx.setStorageSync("my_annotationSummary", result.get("annotationSummary"));
                                wx.setStorageSync("my_followCount", result.get("followCount"));
                                wx.setStorageSync("my_followerCount", result.get("followerCount"));
                                wx.setStorageSync("my_updatingCount", result.get("updatingCount"));
                              },
                              error: function (result, error) {
                                console.log("取数据出错" + error.message);
                              }
                            }

                            )
                            
                          } catch (e) {
                          }
                          console.log("登录成功");
                        },
                        error: function (user, error) {
                          if (error.code == '101') {
                            var user = new Bmob.User();//开始注册用户
                            user.set('username', nickName);
                            user.set('password', userData.openid);
                            user.set("nickname", nickName);
                            user.set("userPic", avatarUrl);
                            user.set("userData", userData);
                            user.set('sex', sex);
                            user.set('feednum', 0);
                            user.set('studyname',nickName+'的书房');
                            user.signUp(null, {
                              success: function (result) {
                                console.log('注册成功');
                                try {//将返回的3rd_session存储到缓存中
                                  wx.setStorageSync('user_openid', user.get('userData').openid);
                                  wx.setStorageSync('user_id', user.id);
                                  wx.setStorageSync('my_nick', user.get("nickname"));
                                  wx.setStorageSync('my_username', user.get("username"));
                                  wx.setStorageSync('my_sex', user.get("sex"));
                                  wx.setStorageSync('my_avatar', user.get("userPic"));
                                  wx.setStorageSync('my_studyname', user.get("studyname"));
                                } catch (e) {
                                }
                              },
                              error: function (userData, error) {
                                console.log("openid=" + userData);
                                console.log(error);
                              }
                            });
                            var Profile = Bmob.Object.extend("UserProfile");
                            var profile=new Profile();
                            
                            
                            profile.set("user", user);
                            profile.set("annotationCount",0);
                            profile.set("annotationPic","https://img3.doubanio.com/f/shire/5522dd1f5b742d1e1394a17f44d590646b63871d/pics/book-default-lpic.gif");
                            profile.set("annotationSummary","您暂时还没有任何读书笔记。");
                            profile.set("followCount",0);
                            profile.set("followerCount",0);
                            profile.set("updatingCount",0);
                            profile.set("storageCount",0);
                            profile.set("storagePic","https://img3.doubanio.com/f/shire/5522dd1f5b742d1e1394a17f44d590646b63871d/pics/book-default-lpic.gif");
                            profile.set("storageSummary","您暂时还没有库存图书。");
                            profile.set("reviewCount",0);
                            profile.set("reviewPic","https://img3.doubanio.com/f/shire/5522dd1f5b742d1e1394a17f44d590646b63871d/pics/book-default-lpic.gif");
                            profile.set("reviewSummary","您暂时还没有任何书评。");
                            profile.save(null,{
                              success:function(result){
                                wx.setStorageSync("my_annotationCount", profile.get("annotationCount"));
                                wx.setStorageSync("my_annotationPic", profile.get("annotationPic"));
                                wx.setStorageSync("my_annotationSummary", profile.get("annotationSummary"));
                                wx.setStorageSync("my_followCount", profile.get("followCount"));
                                wx.setStorageSync("my_followerCount", profile.get("followerCount"));
                                wx.setStorageSync("my_updatingCount", profile.get("updatingCount"));
                                wx.setStorageSync("my_storageCount", profile.get("storageCount"));
                                wx.setStorageSync("my_storagePic", profile.get("storagePic"));
                                wx.setStorageSync("my_storageSummary", profile.get("storageSummary"));
                                wx.setStorageSync("my_reviewCount", profile.get("reviewCount"));
                                wx.setStorageSync("my_reviewPic", profile.get("reviewPic"));
                                wx.setStorageSync("my_reviewSummary", profile.get("reviewSummary"));
                              },
                              error:function(result,error){
                                console.log("添加失败"+error.code+error.message);
                              }
                            });

                          }
                        }
                      });
                    }
                  })
                },
                error: function (error) {
                  console.log("Error: " + error.code + " " + error.message);
                }
              });
            } else {
              console.log('获取用户登录态失败1！' + res.errMsg);
            }
          },
          complete: function (e) {
            console.log('获取用户登录态失败2！' + e);
          }
        });
      }
    } catch (e) {
      console.log("登陆失败");
    }
    wx.checkSession({
      success: function () {
      },
      fail: function () {
        //登录态过期，重新登录
        wx.login();
      }
    });

  },
  onShow: function () {

  },
  formate_data: function (date) {
    let month_add = date.getMonth() + 1;
    var formate_result = date.getFullYear() + '年'
      + month_add + '月'
      + date.getDate() + '日'
      + ' '
      + date.getHours() + '点'
      + date.getMinutes() + '分';
    return formate_result;
  },
  getUserInfo: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      });
    }
  },
  
  globalData: {
    userInfo: null
  },
  onPullDownRefresh: function () {
    //wx.stopPullDownRefresh()
  },
  onError: function (msg) {
  },
  Touches: new Touches(),
  util: __utils,
})