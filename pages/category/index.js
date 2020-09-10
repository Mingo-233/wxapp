import {request} from "../../request/request.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    //左侧的菜单数据
    leftMenuList:[],
    //右侧的商品数据
    rightGoods:[],
    //被点击的左侧菜单
    currentIndex:0,
    //右侧内容的滚动条距离顶部的距离
    srollTop:0
  },
  //接口返回的数据
  Cates:[],

  async getCates(){
    const res = await request({url:"/categories"});
    console.log(res);
    this.Cates=res.data.message;
    wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});
      
    //构造左侧的菜单数据
    let leftMenuList=this.Cates.map(item=>{
      return item.cat_name
    })
    //构造右侧的商品数据
    let rightGoods=this.Cates[0].children;
    this.setData({
      leftMenuList:leftMenuList,
      rightGoods:rightGoods
    })

  },
  handletap(e){

    let index = e.currentTarget.dataset.index
    let rightGoods=this.Cates[index].children;
    this.setData({
      currentIndex:index,
      rightGoods:rightGoods,
      srollTop:0
    })


    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  // 1 先判断一下本地存储中有没有旧的数据
  //   {time:Date.now(),data:[...]}
  // 2 没有旧数据 直接发送新请求 
  // 3 有旧的数据 同时 旧的数据也没有过期 就使用 本地存储中的旧数据即可
    const Cates = wx.getStorageSync("cates");
    if(!Cates){
      //若为空 发送请求获取数据
      this.getCates();
    }else{
      if(Date.now()-Cates.time > 1000*300){
        this.getCates();
      }else{
        // 可以使用旧的数据
        this.Cates=Cates.data;
        console.log("可以使用旧的数据");
        //渲染页面
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightGoods=this.Cates[0].children;
        this.setData({
          leftMenuList:leftMenuList,
          rightGoods:rightGoods
        })
      }
    }
      
      
  }


})