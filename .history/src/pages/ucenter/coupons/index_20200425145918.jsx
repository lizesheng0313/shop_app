import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';

import icon from "../../../assets/images/coupons/icon.png"

import './index.less';

class Index extends Component {

  config = {
    "navigationBarTitleText": "我的优惠券"
  }

  state = {
    couponList: [{
      title: '123'
    }, {
      title: '123'
    }, {
      title: '123'
    }, {
      title: '123'
    }],
  }

  componentDidMount() {
  }

  render() {
    return (
      <View className='container coupons'>
        <View className="coupons_list">
          {
            this.state.couponList.map((item, index) => {
              return <View className={`item ${index % 2 === 0 ? "first" : "second"}`}>
                <View>
                  <Image src={icon} className="icon"></Image>
                  <View className='flex_dir_start'>
                    <Text className="rules">商品满100元使用</Text>
                    <Text className="overdue">有效期至：2020.04.05</Text>
                  </View>
                </View>
                <View className="flex-start_top">
                  <Text className="symbol">￥</Text>
                  <Text className="lines">15</Text>
                </View>
              </View>
            })
          }
        </View>
      </View>
    );
  }
}
export default Index;
