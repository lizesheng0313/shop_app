import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, Navigator } from '@tarojs/components';
import * as ApiOrder from '../../../services/order';
import './index.less';

class Index extends Component {

  config = {
    navigationBarTitleText: '订单详情'
  }

  state = {

  }

  componentDidMount() {

  }

  handleCooy() {
    my.setClipboard({
      text: "23423423",
      success(res) {
        console.log("成功", res)
      }, fail(err) {
        console.log('失败', err)
      }
    })
    my.getClipboard({
      success: ({ text }) => {
        console.log(text)
        Taro.showToast({
          title: text
        })
      },
      fail(err) {
        console.log(err)
      }
    })
  }

  render() {
    return (
      <View className='order-details'>
        <View className="goods_details">
          <View className="flex-start_center ">
            <Image className="image"></Image>
            <View className="goods_details_right">
              <View className="title">【全新国行】ThinkPad X1c 极速版14英寸</View>
              <View className="sp">规格：15/28G/256G/黑色</View>
              <View className="total">总租金: ￥23720.50</View>
            </View>
          </View>
        </View>
        <View className="flex-space_center buy">
          <View>买断金额</View>
          <View>￥939.25</View>
        </View>
        <View className="coupons">
          <View className="flex-space_center">
            <View>优惠券</View>
            <View>-￥0.00</View>
          </View>
          <View className="flex-space_center">
            <View>第1期租金</View>
            <View>￥939.25</View>
          </View>
          <View className="flex-space_center">
            <View>运费（运费到付）</View>
            <View>￥939.25</View>
          </View>
        </View>
        <View className="coupons calc_amount">
          <View className="flex-space_center">
            <View>首期实付</View>
            <View className="bold">-￥0.00</View>
          </View>
          <View className="flex-space_center">
            <View>冻结押金</View>
            <View className="bold">￥1200.00</View>
          </View>
          <View className="flex-space_center">
            <View>合计金额<Text className="txt">（押金可退）</Text></View>
            <View className="total bold">￥939.25</View>
          </View>
        </View>
        <View className="coupons order_info">
          <View className="flex-space_center">
            <View>订单编号</View>
            <View className="flex-space_center">1000000000000000
              <Text className="copy" onClick={this.handleCooy.bind(this)}>复制</Text>
            </View>
          </View>
          <View className="flex-space_center">
            <View>下单时间</View>
            <View>2020年04月15日 22:00</View>
          </View>
          <View className="flex-space_center">
            <View>租还时间</View>
            <View>2020年04月18日-2020年04月17日</View>
          </View>
        </View>
        <View className="contract flex-space_center">
          <View>租赁合同</View>
          <View className="look_contract">查看</View>
        </View>
        <View className="footer_btn flex-box">
          <View className="btn upload">上传证件</View>
          <View className="btn">分期账单</View>
        </View>
      </View>

    );
  }
}
export default Index;
