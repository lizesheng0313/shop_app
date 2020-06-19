import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, Navigator, Radio } from '@tarojs/components';
import * as ApiOrder from '../../../services/order';
import './index.less';

class Index extends Component {
  s

  config = {
    navigationBarTitleText: '账单详情'
  }

  state = {
    orderInfo: {},
  }

  componentDidShow() {
    console.log(this.$router.params)
    let data = JSON.parse(this.$router.params.info)
    this.setState({
      orderInfo: data
    })
  }

  render() {
    const { orderInfo } = this.state
    return (
      <View className='order-details'>
        <View className="goods_details">
          <View className="flex-start_center ">
            <Image className="image"></Image>
            <View className="goods_details_right">
              <View className="title">{orderInfo.goodName}</View>
              <View className="sp">规格：{orderInfo.goodItemName}</View>
              <View className="total">总租金: ￥{orderInfo.countPrice}</View>
            </View>
          </View>
          <View className="flex-around_center total_info">
            <View className="flex_dir_center">
              <View className="c9">应还金额(元)</View>
            </View>
            <View className="flex_dir_center">
              <View>{orderInfo.wh_money}</View>
              <View className="c9">未还金额(元)</View>
            </View>
            <View className="flex_dir_center">
              <View>{orderInfo.yh_money}</View>
              <View className="c9">已还金额(元)</View>
            </View>
          </View>
        </View>
        <View className="tips">可提前归还本金</View>
        {
          orderInfo.list.map((item) => {
            return <View className="coupons">
              <View className="nper">{item.nepr}期</View>
              <View className="flex-space_center">
                <View className="total">{item.total}</View>
                <Radio checked={item.checked} color="#F71279"></Radio>
              </View>
              <View className="flex-space_center time_border">
                <View>还款时间：{item.time}</View>
                <View>{item.type}</View>
              </View>
            </View>
          })
        }
        <View className="btn_submit">支付</View>
      </View>
    );
  }
}
export default Index;
