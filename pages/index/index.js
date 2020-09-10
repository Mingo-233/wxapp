import {request} from "../../request/request.js"

Page({
  data: {
    //轮播图数组
    swiperList:[],
    //导航数组
    cateList:[],
    //楼层数组
    floorList:[]
  },
  // 获取轮播图数据
  getSwiperList(){
    request({url:"/home/swiperdata"})
    .then(result =>{
      this.setData({
        swiperList:result.data.message
      })
      console.log(this.data.swiperList);
      
    })
  },
  // 获取 分类导航数据
  getCateList(){
    request({url:"/home/catitems"})
    .then(result=>{
      // console.log(result);
      this.setData({
        cateList:result.data.message
      })
    })
  },
  // 获取 楼层数据
  getFloorList(){
    request({url:"/home/floordata"})
    .then(result=>{
      console.log(result);
      this.setData({
        floorList:result.data.message
      })
    })
  },

  onLoad: function(options) {
    this.getSwiperList()
    this.getCateList()
    this.getFloorList()
  },
  onReady: function() {
  }, 
  onShow: function() {
    
  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function() {

  },
  onPageScroll: function() {

  },
  //item(index,pagePath,text)
  onTabItemTap:function(item) {

  }
});
  