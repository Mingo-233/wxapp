Page({
  data: {
  },
  handleGetUserInfo(e){
    console.log(e);
    let {userInfo}=e.detail;
    wx.setStorageSync("userInfo", userInfo);
    wx.navigateBack({
      delta: 1
    });
      
  }

})