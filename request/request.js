// 同时发送异步代码的次数(每次发送请求时都会触发加载动画，如果多个异步请求一起触发，需要判断所有请求全部结束后，执行加载动画结束代码)
let ajaxTimes=0;
export const request=(params)=>{
    // 判断 url中是否带有 /my/ 请求的是私有的路径 带上header token
    let header={...params.header};
    if(params.url.includes("/my/")){
    // 拼接header 带上token
        header["Authorization"]=wx.getStorageSync("token");
    }


    //每次发送请求时，就执行加载中的动画
    wx.showLoading({
        title: '加载中',
        mask:true
    })
    ajaxTimes++;
    //定义公共url
    const baseUrl ="https://api-hmugo-web.itheima.net/api/public/v1"
    return new Promise((resolve,rejects)=>{
        wx.request({         
            ...params,
            url:baseUrl+params.url,
            success(result){
                resolve(result)
            },
            fail(err){
                rejects(err)
            },
            //complete不论失败或成功都会执行
            complete(){
                ajaxTimes--
                if(ajaxTimes===0){
                    //请求完成关闭加载动画
                    wx.hideLoading()
                }
                
            }
        })
    })
};
// exports.request = request;

