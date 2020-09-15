import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import icon from "../../../assets/images/coupons/icon.png"
import first from "../../../assets/images/coupons/first.png"
import second from "../../../assets/images/coupons/second.png"
import nothing from "../../../assets/images/nothing.jpg"
import { actionUserList } from "../../../services/user"

import './index.less';

@connect(({ user }) => ({
  userInfo: user.userInfo
}))

class Index extends Component {

  config = {
    "navigationBarTitleText": "我的优惠券"
  }

  state = {
    couponList: []
  }

  componentDidMount() {

    let { userInfo } = this.props
    actionUserList({
      user_id: userInfo.user_id
    }).then(res => {
      this.setState({
        couponList: res.data
      })
    })
  }

  selected(item) {
    const { dispatch } = this.props;
    const param = this.$router
    console.log(param)
    if(Number(param.params.conponsId) == item.id){
      Taro.showToast({
        title: '已选中该优惠卷'
      })
      return
    }
    if (param.params.fr) {
      if (Number(param.params.countPrice) >= item.full_money) {
        dispatch({
          type: 'user/saveConpons', payload: {
            id: item.id,
            sub_money: item.sub_money
          }
        })
        Taro.navigateBack({
          delta: 1
        })
      }
      else {
        Taro.showToast({
          title: '满' + item.full_money + '可用'
        })
        return
      }
    }
  }

  render() {
    return (
      <View className='container coupons'>
        <View className="coupons_list" >
          {
            this.state.couponList.length > 0 ? this.state.couponList.map((item, index) => {
              return <View className="coupon_list_item" onClick={this.selected.bind(this, item)}>
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
        {/* {
          this.state.couponList.length > 0 ? <View className="btn_submit">兑换优惠券</View> : ""
        } */}
      </View>
    );
  }
}
export default Index;
