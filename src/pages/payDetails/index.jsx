import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, Navigator, Input } from '@tarojs/components';
import * as ApiOrder from '../../../services/order';
import './index.less';

class Index extends Component {

  config = {
    navigationBarTitleText: '支付详情'
  }

  state = {
    num: 1,
    isAddress: false
  }

  componentDidMount() {

  }

  handleToAddress(flag) {
    Taro.navigateTo({
      url: "/pages/ucenter/addressAdd/index"
    })
  }

  handleToRedu(num) {
    console.log(this.state.num)
    if (this.state.num !== 1) {
      this.setState({
        num: num - 1
      })
    }
  }

  handleToAdd(num) {
    console.log(this.state.num)
    this.setState({
      num: num + 1
    })
  }

  handleToConpons() {
    Taro.navigateTo({
      url: "/pages/ucenter/coupons/index"
    })
  }

  render() {
    const { num, isAddress } = this.state
    return (
      <View className='order-details'>
        <View className="address_box">
          {
            isAddress ? <View className="flex-space_center">
              <View>
                <View class="name">粉色公主<Text className="txt">15840834280</Text></View>
                <View class="address">辽宁省大连市甘井子区高新园区银海万向</View>
              </View>
              <View className="modify" onClick={this.handleToAddress.bind(this,'modify')}>编辑</View>
            </View>
              : <View className="add_res" onClick={this.handleToAddress.bind(this,'add')}>
                +新增收货地址
              </View>
          }

        </View>
        <View className="goods_details">
          <View className="flex-start_center ">
            <Image className="image"></Image>
            <View className="goods_details_right">
              <View className="title">【全新国行】ThinkPad X1c 极速版14英寸</View>
              <View className="sp">规格：15/28G/256G/黑色</View>
              <View className="total">总租金: ￥23720.50</View>
            </View>
            <View className="number">
              <View className="sym1 sym" onClick={this.handleToRedu.bind(this, num)}>-</View>
              <View className="num">{num}</View>
              <View className="sym2 sym" onClick={this.handleToAdd.bind(this, num)}>+</View>
            </View>
          </View>
        </View>
        <View className="coupons">
          <View className="flex-space_center title">
            <View>优惠券</View>
            <View className="select_con" onClick={this.handleToConpons.bind(this)}>
              请选择优惠卷
              <View className='at-icon  at-icon-chevron-right'></View>
            </View>
          </View>
          <View className="flex-space_center">
            <View>第1期租金</View>
            <View className="bold">￥939.25</View>
          </View>
          <View className="flex-space_center c9">
            <View>剩余付款计划</View>
            <View>11期×￥197.80</View>
          </View>
          <View className="freight">
            <View className="flex-space_center">
              <View>运费</View>
              <View>￥0.00</View>
            </View>
            <View className="flex-space_center">
              <View>应付押金（根据个人信用减免）</View>
              <View>￥0.00</View>
            </View>
          </View>
          <View className="c9 deposit">
            <View className="flex-space_center">
              <View>商品总押金 </View>
              <View>￥3300.00</View>
            </View>
            <View className="flex-space_center">
              <View>最高押金减免</View>
              <View>-￥3300.00</View>
            </View>
          </View>
        </View>
        <View className="message">
          <Text>留言：</Text>
          <Input placeholder="请在这里留下您的备注" placeholderClass="plcss" className="input"></Input>
        </View>
        <View className="footer_btn">
          <View className="total_box">预计：<Text className="symbol">￥</Text><Text className="total">197.80</Text></View>
          <View className="btn">去支付</View>
        </View>
      </View>

    );
  }
}
export default Index;
