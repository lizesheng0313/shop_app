import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';

import icon from "../../../assets/images/coupons/icon.png"
import first from "../../../assets/images/coupons/first.png"
import second from "../../../assets/images/coupons/second.png"
import nothing from "../../../assets/images/nothing.jpg"
import { connect } from '@tarojs/redux';
import { actionCouponapiList, actionSetUserCoupon } from "../../../services/user"

import './index.less';

@connect(({ user }) => ({
  userInfo: user.userInfo
}))


class Index extends Component {

  config = {
    "navigationBarTitleText": "平台优惠券"
  }

  state = {
    couponList: []
  }

  componentDidMount() {
    actionCouponapiList().then(res => {
      this.setState({
        couponList: res.data
      })
    })
  }

  getCoupon(item) {
    let { userInfo } = this.props
    actionSetUserCoupon({
      user_id: userInfo.user_id,
      coupon_id: item.id
    }).then(res => {
      console.log(res)
    })
  }

  render() {
    return (
      <View className='container coupons'>
        <View className="coupons_list">
          {
            this.state.couponList.length > 0 ? this.state.couponList.map((item, index) => {
              return <View className="coupon_list_item" onClick={this.getCoupon.bind(this, item)}>
                {
                  index % 2 === 0 ? <Image src={first} className="back"></Image> : <Image src={second} className="back"></Image>
                }
                <View className="item">
                  <View>
                    <Image src={icon} className="icon"></Image>
                    <View className='flex_dir_start'>
                      <Text className="rules">商品满{item.full_money}元使用</Text>
                      <Text className="overdue">有效期至：{item.end_date}</Text>
                    </View>
                  </View>
                  <View className="flex-start_top">
                    <Text className="symbol">￥</Text>
                    <Text className="lines">{item.sub_money}</Text>
                  </View>
                </View>
              </View>
            })
              : <View className="nothing">
                <Image src={nothing} className="img"></Image>
                <Text className="tips">暂无优惠券</Text>
              </View>
          }
        </View>
      </View>
    );
  }
}
export default Index;
