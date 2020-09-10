Page({
  data: {
    collect:[]
  },
  onShow(){
    const collect=wx.getStorageSync("collect")||[];
    this.setData({
      collect
    }); 
  }
 
})