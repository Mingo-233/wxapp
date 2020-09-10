import {getSetting,openSetting,chooseAddress,showModal,showToast} from '../../utils/asyncWx'
Page({
  data: {
    address:[],
    cart:[],
    checkall:false,
    totalPrice:0,
    totalNum:0
  },
  //添加收货地址
  async add_address(){
    try {
      const res = await getSetting()
      const scopeAddress = res.authSetting["scope.address"]
      if(scopeAddress === false){
      //用户以前拒绝授予权限，诱导用户打开授权页面
        await openSetting()
      }
      let address = await chooseAddress()
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      //存入到缓存中
      wx.setStorageSync("address", address);
      console.log(address);
    } catch (error) {
      console.log(error);
    }
  },
  //商品多选框改变
  checkboxChange(e){
    //获取要被修改的商品的id
    let id = e.currentTarget.dataset.id;
    //获取购物车数组
    const cart = this.data.cart
    //找到想要改变的商品在购物车数组中的索引位置
    let index =cart.findIndex(item=>id===item.goods_id)
    //选中状态取反
    cart[index].checked = !cart[index].checked
    this.setCart(cart)
  },
  //全选按钮
  handleCheckAll(){
    let {cart,checkall}=this.data
    checkall = !checkall;
    //循环修改cart数组中商品的选中状态
    cart.forEach(item=>item.checked=checkall)
    this.setCart(cart)
  },
  // 设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart){
        //every方法遍历数组，当所有对象符合条件时返回true，有一个回调函数返回false，则终止遍历，返回false。   另外：该方法若遍历空数组，会返回true
    // const checkall = cart.length?cart.every(item=>item.checked):false
    let totalPrice = 0;
    let totalNum = 0;
    let checkall = true;
    cart.forEach(item => {
      if(item.checked){
        totalPrice += item.goods_price*item.num
        totalNum += item.num
      }else{
        //如果有一项没选中，则全选按钮的状态就为不选中
        checkall = false
      }
    });
    //判断数组是否为空，控制全选框的勾选
    checkall=cart.length?checkall:false
    this.setData({
      cart:cart,
      checkall:checkall,
      totalPrice:totalPrice,
      totalNum:totalNum
    })
    wx.setStorageSync("cart", cart);
  },
  //商品数量加减操作
  async handle_numEdit(e){
    //接收传递过来的参数值
    let {id,operation} = e.currentTarget.dataset
    let {cart} = this.data
    const index = cart.findIndex(item => {
      return item.goods_id === id
    });
    if(cart[index].num == 1 && operation==-1){
      const res = await showModal('是否从购物车中移除此商品')
          if (res.confirm) {
            console.log('用户点击确定')
            cart.splice(index,1);
            this.setCart(cart);
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
    }else{
          //operation 是1或者-1,1就是按了加-1就是按了减
    cart[index].num +=operation
    this.setCart(cart)
    }
  },
  //支付
  async handlePay(){
    const {address,totalNum} = this.data
    if(!address.userName){
       await showToast("您还没有填写地址")
       return
    }
    if(totalNum == 0){
      await showToast("您还没有选择商品")
      return
    }
    wx.navigateTo({
      url: '/pages/pay/index'
    });
      

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //从缓存中读取数据
    const address = wx.getStorageSync("address");
    const cart =wx.getStorageSync("cart")||[]
    this.setData({
      address:address})
    this.setCart(cart)
  }
})