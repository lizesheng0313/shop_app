import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import 'taro-ui/dist/style/index.scss';
import "./assets/font/iconfont.css"
import dva from './dva';
import models from './models';
import * as user from './utils/user';
import { set as setGlobalData, get as getGlobalData } from './global_data';

import Index from './pages/index'

// import configStore from './store'

import './app.less'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

// const store = configStore()

const dvaApp = dva.createApp({
  initialState: {},
  models: models,
  onError(e, dispatch) {
    console.log('系统出错了!');
    // dispatch(action("sys/error", e));
  },
});
const store = dvaApp.getStore();

class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      'pages/billDetails/index',
      'pages/payDetails/index',
      'pages/productList/index',
      'pages/store/index',
      'pages/ucenter/index/index',
      'pages/goods/goods',
      'pages/catalog/catalog',
      'pages/activeList/index',
      'pages/xzPayDetails/index',
      
      'pages/ucenter/refund/index',
      'pages/ucenter/logistics/index',
      'pages/ucenter/orderDetail/index',
      'pages/ucenter/addressAdd/index',
      'pages/ucenter/address/index',
      'pages/ucenter/realnameAuth/index',
      'pages/ucenter/auth/index',
      'pages/ucenter/order/index',
      'pages/ucenter/coupons/index',
      'pages/ucenter/feedback/index',
      'pages/ucenter/platformCoupons/index'

    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      "backgroundColor": "#fafafa",
      "borderStyle": "white",
      "selectedColor": "#D1A0FE",
      "color": "#39383D",
      "list": [{
        "pagePath": "pages/index/index",
        "iconPath": './static/tab/home.png',
        "selectedIconPath": './static/tab/homeselected.png',
        "text": "首页"
      }, {
        "pagePath": "pages/catalog/catalog",
        "iconPath": './static/tab/category.png',
        "selectedIconPath": './static/tab/categoryselected.png',
        "text": "分类"
      }, {
        "pagePath": 'pages/ucenter/index/index',
        "iconPath": './static/tab/my.png',
        "selectedIconPath": './static/tab/myselected.png',
        "text": "我的"
      }]
    },
    "networkTimeout": {
      "request": 10000,
      "downloadFile": 10000
    },
    "debug": true,
  }



  // update = () => {
  //   if (process.env.TARO_ENV === 'weapp') {
  //     const updateManager = Taro.getUpdateManager();
  //     Taro.getUpdateManager().onUpdateReady(function () {
  //       Taro.showModal({
  //         title: '更新提示',
  //         content: '新版本已经准备好，是否重启应用？',
  //         success: function (res) {
  //           if (res.confirm) {
  //             // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
  //             updateManager.applyUpdate()
  //           }
  //         }
  //       })
  //     })
  //   }
  // }


  componentDidHide() { }

  componentDidCatchError() { }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
