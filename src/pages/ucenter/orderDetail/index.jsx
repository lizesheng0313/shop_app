import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, Navigator } from '@tarojs/components';
import { actionOrderDetails } from "../../../services/order"
import { connect } from '@tarojs/redux';
import './index.less';
@connect(({ order, user }) => ({
  userInfo: user.userInfo,
}))

class Index extends Component {

  config = {
    navigationBarTitleText: '订单详情'
  }

  state = {
    order_id: "",
    orderInfo: {}
  }

  componentDidShow() {
    const { userInfo } = this.props
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

  handleAuth() {
    Taro.navigateTo({
      url: "/pages/ucenter/auth/index"
    })
  }

  handleCooy(id) {
    my.setClipboard({
      text: id,
      success(res) {
        Taro.showToast({
          title: '复制成功'
        })
      }, fail(err) {
        Taro.showToast({
          title: '复制失败'
        })
      }
    })
    // my.getClipboard({
    //   success: ({ text }) => {
    //     console.log(text)
    //     Taro.showToast({
    //       title: text
    //     })
    //   },
    //   fail(err) {
    //     console.log(err)
    //   }
    // })
  }

  render() {
    const { orderInfo } = this.state
    const { userInfo } = this.props
    return (
      <View className='order-details'>
        <View className="goods_details">
          <View className="flex-start_center ">
            <Image className="image" mode="widthFix" src={'https://app.zuyuanzhang01.com/' + orderInfo.pic}></Image>
            <View className="goods_details_right">
              <View className="title">{orderInfo.goodName}</View>
              <View className="sp">规格：{orderInfo.goodItemName}</View>
              <View className="total">总租金: {orderInfo.countPrice}</View>
            </View>
          </View>
        </View>
        <View className="flex-space_center buy">
          <View>买断金额</View>
          <View>￥{orderInfo.md_money}</View>
        </View>
        <View className="coupons">
          <View className="flex-space_center">
            <View>优惠券</View>
            <View>-￥{orderInfo.youhui_money}</View>
          </View>
          <View className="flex-space_center">
            <View>第1期租金</View>
            <View>￥{orderInfo.fast_pay_money - orderInfo.youhui_money}</View>
          </View>
          <View className="flex-space_center">
            <View>运费</View>
            <View>运费到付</View>
          </View>
        </View>
        <View className="coupons calc_amount">
          <View className="flex-space_center">
            <View>首期实付</View>
            <View className="bold">￥{orderInfo.fast_pay_money}</View>
          </View>
          <View className="flex-space_center">
            <View>免押金金额</View>
            <View className="bold">￥{orderInfo.credit_amout}</View>
          </View>
          <View className="flex-space_center">
            <View>实缴金额<Text className="txt">（可退）</Text></View>
            <View className="total bold">￥{orderInfo.fund_amount}</View>
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
            <View>{orderInfo.create_time}</View>
          </View>
          {
            orderInfo.end_date ? <View className="flex-space_center">
              <View>租还时间</View>
              <View>{orderInfo.end_date}</View>
            </View>
              : ""
          }
        </View>
        {orderInfo.status !== 0 ?
          <View className="contract flex-space_center">
            <View>租赁合同</View>
            <View className="look_contract">查看</View>
          </View>
          : ""
        }
        <View className="footer_btn flex-box">
          {
            userInfo.card_img1 && userInfo.card_img2 ? "" : <View className="btn upload" onClick={this.handleAuth.bind(this)}>上传证件</View>
          }
          <View className="btn" onClick={this.handleToBill.bind(this)}>分期账单</View>
        </View>
      </View >

    );
  }
}
export default Index;
