import Taro from '@tarojs/taro';
import { showErrorToast } from '../utils/util';

function request(url, data = {}) {
  return new Promise(function (resolve, reject) {
    Taro.request({
      url: "https://app.zuyuanzhang01.com/" + url,
      data: data,
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // 'X-Litemall-Token': Taro.getStorageSync('token')
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.code === 200) {
            resolve(res.data);
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
          } else if (res.data.data !== 200) {
            showErrorToast(res.data.msg);
            reject(res.data);
          }
        } else {
          showErrorToast(res.data.msg);
          reject(res.data.msg);
        }

      },
      fail: function (err) {
        reject(err)
      }
    })
  });
}

export default request;
