import Taro from '@tarojs/taro';
import {showErrorToast} from '../utils/util';


/**
 * 封封微信的的request
 */
function request(url, data = {}) {
  return new Promise(function(resolve, reject) {
    Taro.request({
      url: "https://app.zuyuanzhang01.com/core_api/"+url,
      data: data,
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // 'X-Litemall-Token': Taro.getStorageSync('token')
      },
      success: function(res) {
        console.log(res)
        if (res.statusCode == 200) {
          if (res.data.errno == 501) {
            // 清除登录相关内容
            // try {
            //   Taro.removeStorageSync('userInfo');
            //   Taro.removeStorageSync('token');
            // } catch (e) {
            //   // Do something when catch error
            // }
            // 切换到登录页面
            // Taro.navigateTo({
            //   url: '/pages/auth/login/login'
            // });
          } else if(res.data.errno == 0) {
            resolve(res.data.data);
          }
        } else {
          showErrorToast(res.data.errmsg);
          reject(res.data.errmsg);
          reject(res.errMsg);
        }

      },
      fail: function(err) {
        reject(err)
      }
    })
  });
}

export default request;
