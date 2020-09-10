import {request} from "../../request/request.js"
import regeneratorRuntime, { async } from '../../lib/runtime/runtime';
Page({
  data: {
    goods:[],
    // 取消 按钮 是否显示
    isFlag:false,
    // 输入框的值
    inpValue:""
  },
  //设了一个全局定时器
  timer:'',
  handleInput(e){
    let {value} = e.detail;
    // 2 检测合法性
    if(!value.trim()){
      //输入框没有数据的时候清空列表框
      this.setData({
        goods:[],
        isFlag:false
      })
      // 值不合法
      return;
    }
    //输入时让取消按钮隐藏
    this.setData({
      isFlag:true
    })
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.qsearch(value)
    }, 1000);

  },
  async qsearch(query){
    const res = await request({url:"/goods/qsearch",data:{query}})
    console.log(res);
    this.setData({
      goods:res.data.message
    })
    console.log(this.data.goods);
  },
    // 点击 取消按钮
    handleCancel(){
      this.setData({
        inpValue:"",
        isFlag:false,
        goods:[]
      })
    }
})