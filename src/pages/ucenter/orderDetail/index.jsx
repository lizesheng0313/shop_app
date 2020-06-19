import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, Navigator } from '@tarojs/components';
import { actionOrderDetails } from "../../../services/order"
import './index.less';

class Index extends Component {

  config = {
    navigationBarTitleText: '订单详情'
  }

  state = {
    order_id: "",
    orderInfo: {}
  }

  componentDidShow() {
    this.setState({
      order_id: this.$router.params.id
    }, () => {
      actionOrderDetails({
        order_id: this.state.order_id
      }).then(res => {
        this.setState({
          orderInfo: res.data
        })
      })
    })
  }

  handleToBill() {
    Taro.navigateTo({
      url: "/pages/billDetails/index?info=" + JSON.stringify(this.state.orderInfo)
    })
  }

  handleCooy(id) {
    console.log(id)
    my.setClipboard({
      text: id,
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
    const { orderInfo } = this.state
    return (
      <View className='order-details'>
        <View className="goods_details">
          <View className="flex-start_center ">
            <Image className="image"></Image>
            <View className="goods_details_right">
              <View className="title">{orderInfo.goodName}</View>
              <View className="sp">规格：{orderInfo.goodItemName}</View>
              <View className="total">总租金: {orderInfo.countPrice}</View>
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
            <View>运费</View>
            <View>运费到付</View>
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
            <View className="flex-space_center">{orderInfo.id}
              <Text className="copy" onClick={this.handleCooy.bind(this, this.state.orderInfo.id)}>复制</Text>
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
          <View className="btn" onClick={this.handleToBill.bind(this)}>分期账单</View>
        </View>
      </View>

    );
  }
}
export default Index;
