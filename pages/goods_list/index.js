import {request} from "../../request/request.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    tabs:[{
      id: 0,
      name:"综合",
      isActive: true
    },
    {
      id: 1,
      name: "销量",
      isActive: false
    },
    {
      id: 2,
      name: "价格",
      isActive: false
    }],
    goodsList:[]
  },
  //接口参数
  queryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  //总页数
  totalPages:1,

  //tab标签切换
  handleTabChange(e){
    console.log(e);
    let currentIndex=e.detail.index 
    let tabs = this.data.tabs
    tabs.forEach((item,i)=>{
      return i == currentIndex?item.isActive=true:item.isActive=false
    })
    this.setData({
      tabs:tabs
    })
  },
  //发起商品列表数据请求
  async getGoodsList(){
    const res = await request({url:"/goods/search",data:this.queryParams}) 
    console.log(res);
    let total = res.data.message.total
    //计算总页数
    this.totalPages = Math.ceil(total/this.queryParams.pagesize) 
    this.setData({
      goodsList:[...this.data.goodsList,...res.data.message.goods]
    })
    // 关闭下拉刷新的窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错 
    wx.stopPullDownRefresh() 
  },
  //滑动页面触底
  onReachBottom(){
    if(this.queryParams.pagenum>=this.totalPages){
      wx.showToast({
        title: '滑到底了啦',
      });
        
    }else{
      this.queryParams.pagenum++
      this.getGoodsList()
    }
  },
  // 触发下拉刷新时执行
  onPullDownRefresh(){
        // 1 重置数组
        this.setData({
          goodsList:[]
        })
        // 2 重置页码
        this.queryParams.pagenum=1;
        // 3 发送请求
        this.getGoodsList();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.queryParams.cid = options.cid
    this.getGoodsList()
  }
})