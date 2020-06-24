import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, Navigator, Radio } from '@tarojs/components';
import * as ApiOrder from '../../../services/order';
import './index.less';

class Index extends Component {

  config = {
    navigationBarTitleText: '账单详情'
  }

  state = {
    status: {
      0: "待扣款",
      1: '已扣款',
      2: '扣款失败'
    },
    didNotReturn: 0,
    hasAlso: 0,
    orderInfo: {},
  }

  componentDidShow() {
    let hasAlso = 0;
    let data = JSON.parse(this.$router.params.info)
    data.list.forEach((item, index) => {
      if (item.status === 1) {
        hasAlso += item.money
      }
    })
    this.setState({
      didNotReturn: (data.countPrice - hasAlso).toFixed(2),
      hasAlso: hasAlso.toFixed(2),
      orderInfo: data
    })
  }

  render() {
    const { orderInfo, status, didNotReturn, hasAlso } = this.state
    return (
      <View className='order-details'>
        <View className="goods_details">
          <View className="flex-start_center ">
            <Image className="image" mode="widthFix" src={'https://app.zuyuanzhang01.com/' + orderInfo.pic}></Image>
            <View className="goods_details_right">
              <View className="title">{orderInfo.goodName}</View>
              <View className="sp">规格：{orderInfo.goodItemName}</View>
              <View className="total">总租金: ￥{orderInfo.countPrice}</View>
            </View>
          </View>
          <View className="flex-around_center total_info">
            <View className="flex_dir_center">
              <View>{orderInfo.countPrice}</View>
              <View className="c9">应还金额(元)</View>
            </View>
            <View className="flex_dir_center">
              <View>{didNotReturn}</View>
              <View className="c9">未还金额(元)</View>
            </View>
            <View className="flex_dir_center">
              <View>{hasAlso}</View>
              <View className="c9">已还金额(元)</View>
            </View>
          </View>
        </View>
        <View className="tips">可提前归还本金</View>
        {
          orderInfo.list.map((item, index) => {
            return <View className="coupons">
              <View className="nper">{index + 1}/{orderInfo.list.length}期</View>
              <View className="flex-space_center">
                <View className="total">￥{item.money}</View>
                <Radio checked={item.checked} color="#F71279"></Radio>
              </View>
              <View className="flex-space_center time_border">
                <View>还款时间：{item.formatDate}</View>
                <View>{status[item.status]}</View>
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
