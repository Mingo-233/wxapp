import {request} from "../../request/request.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    goodsObj:{},
    // 商品是否被收藏
    isCollect:false
  },
  // 商品对象
  GoodsInfo: {},
  //获取商品详情数据
  async getGoodsDetail(goods_id){
    const res = await request({url:'/goods/detail',data:{ goods_id }})
    const goodsObj = res.data.message
    this.GoodsInfo = goodsObj;
    console.log(res);
    this.setData({
      goodObj:{
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        // iphone部分手机 不识别 webp图片格式 
        // 最好找到后台 让他进行修改 
        // 临时自己改 确保后台存在 1.webp => 1.jpg 
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics: goodsObj.pics
      }
    })
    console.log(this.data.goodObj);
  },
  // 点击轮播图 放大预览
  handlePreview(e){
    console.log(e);
    // 1 先构造要预览的图片数组 
    const urls = this.GoodsInfo.pics.map(item=>item.pics_mid)
    // 2 接收传递过来的图片url
    const current = e.currentTarget.dataset.url
    wx.previewImage({
      current: current,
      urls: urls
    });
      
  },
  //添加购物车
  cart_add(){
    //获取缓存中的购物车 数组
    let cart = wx.getStorageSync("cart")||[];
    let index = cart.findIndex(item=>item.goods_id === this.GoodsInfo.goods_id)      
    if(index == -1){
      //没有添加过该商品到购物车
      this.GoodsInfo.num = 1
      this.GoodsInfo.checked= true
      cart.push(this.GoodsInfo)
    }else{
      cart[index].num++
    }
    //把购物车重新添加回缓存中
    wx.setStorageSync("cart", cart);
    wx.showToast({
      title: '添加成功',
      mask: true,
    });
      
  },
    // 点击 商品收藏图标
    handleCollect(){
      let isCollect=false;
      // 1 获取缓存中的商品收藏数组
      let collect=wx.getStorageSync("collect")||[];
      // 2 判断该商品是否被收藏过
      let index=collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
      // 3 当index！=-1表示 已经收藏过 
      if(index!==-1){
        // 能找到 已经收藏过了  在数组中删除该商品
        collect.splice(index,1);
        isCollect=false;
        wx.showToast({
          title: '取消成功',
          icon: 'success',
          mask: true
        });
          
      }else{
        // 没有收藏过
        collect.push(this.GoodsInfo);
        isCollect=true;
        wx.showToast({
          title: '收藏成功',
          icon: 'success',
          mask: true
        });
      }
      // 4 把数组存入到缓存中
      wx.setStorageSync("collect", collect);
      // 5 修改data中的属性  isCollect
      this.setData({
        isCollect
      })
    },
  onShow: function () {
    //这里是从页面栈中那到上个页面传递过来的参数值
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
    const { goods_id } = options;
    this.getGoodsDetail(goods_id);
  }
})