import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View, Text, Image, Navigator, Input } from '@tarojs/components';
import { actionGetOneBill, actionSubOrder, actionFundAuthOrderAppFreeze, actionTradePay } from "../../services/order"
import { actionGetPhoneNumber, actionUserUpdate } from "../../services/user"
import './index.less';

@connect(({ order, user }) => ({
  addressInfo: order.addressInfo,
  userInfo: user.userInfo,
  user_id: user.user_id
}))

class Index extends Component {

  config = {
    navigationBarTitleText: '支付详情'
  }

  state = {
    num: 1,
    orderDetails: {
      descption: "",
      user_id: ""
    },
    bill: {},
    isAddress: false,
  }

  componentWillMount() {
    this.setState({
      orderDetails: { ...this.state.orderDetails, ...JSON.parse(this.$router.params.details) },
    }, () => {
      actionGetOneBill({
        countPrice: this.state.orderDetails.countPrice,
        day: this.state.orderDetails.day
      }).then(res => {
        this.setState({
          bill: res.data
        })
      })
    })
  }

  componentDidShow() {
    const { addressInfo } = this.props;
    if (addressInfo.id) {
      this.setState({
        isAddress: true
      })
      this.state.orderDetails.address_id = addressInfo.id;
    }
  }

  handleToAddress(flag) {
    Taro.navigateTo({
      url: "/pages/ucenter/address/index?order=yes"
    })
  }

  handleToRedu(num) {
    if (this.state.num !== 1) {
      this.setState({
        num: num - 1
      })
    }
  }

  handleToAdd(num) {
    this.setState({
      num: num + 1
    })
  }

  handleToConpons() {
    Taro.navigateTo({
      url: "/pages/ucenter/coupons/index"
    })
  }

  handleToAuth() {
    Taro.navigateTo({
      url: "/pages/ucenter/realnameAuth/index"
    })
  }

  onGetPhoneNumber() {
    const { user_id, dispatch } = this.props
    let bind_phone;
    my.getPhoneNumber({
      success: async (res) => {
        let encryptedData = res.response;
        await actionGetPhoneNumber({
          encryptedData
        }).then(res => {
          bind_phone = res.data.mobile
        })
        await actionUserUpdate({
          user_id,
          bind_phone
        })
        await dispatch({ type: 'user/apiFindUserByUserId', payload: user_id })
      }
    });
  }

  handleInput(e) {
    this.state.orderDetails.descption = e.detail.value;
  }

  async handlePay() {
    let that = this;
    const { user_id, userInfo } = this.props;
    this.state.orderDetails.user_id = user_id
    if (!this.state.orderDetails.address_id) {
      Taro.showToast({
        title: "请添加收货地址"
      })
      return;
    }
    if (!userInfo.card_num) {
      Taro.showToast({
        title: "请先完成实名认证"
      })
      return;
    }
    let res = await actionSubOrder(this.state.orderDetails)
    if (res.code === 200) {
      await actionFundAuthOrderAppFreeze({
        orderTitle: this.state.orderDetails.goodsName,
        // amount: this.state.orderDetails.yj_money
        amount:0.01
      }).then(res => {
        my.tradePay({
          orderStr: res.data,
          success: (res) => {
            let data = JSON.parse(res.result)
            actionTradePay({
              authNo: data.alipay_fund_auth_order_app_freeze_response.auth_no,
              payerUserId: data.alipay_fund_auth_order_app_freeze_response.payer_user_id,
              // amount: that.bill.bill_money,
              amount:0.05,
              subject: that.state.orderDetails.goodsName
            }).then(res => {
                if(res.data.alipay_trade_pay_response.code === "10000"){
                  Taro.redirectTo({
                    url:"/pages/ucenter/order/index"
                  })
                }
            })
          },
          fail: (err) => {
            console.log(err)
          }
        });
      })
    }
  }




  render() {
    const { num, isAddress, orderDetails, bill } = this.state
    const { addressInfo, userInfo } = this.props
    return (
      <View className='order-details'>
        <View className="address_box">
          {
            isAddress ? <View className="flex-space_center">
              <View>
                <View class="name">{addressInfo.name}<Text className="txt">{addressInfo.phone}</Text></View>
                <View class="address">{addressInfo.region}{addressInfo.address}</View>
              </View>
              <View className="modify" onClick={this.handleToAddress.bind(this, 'modify')}>编辑</View>
            </View>
              : <View className="add_res" onClick={this.handleToAddress.bind(this, 'add')}>
                +新增收货地址
              </View>
          }
        </View>
        {
          userInfo.bind_phone ? "" :
            <Button
              openType="getAuthorize"
              scope="phoneNumber"
              onClick={this.onGetPhoneNumber.bind(this)}
              type="primary"
              className="auth_button"
            >
              <View className="auth">
                <View className="flex-space_center title">
                  <View>实名认证</View>
                  <View className="select_con" >
                    还未进行实名认证，去认证
                    <View className='at-icon  at-icon-chevron-right'></View>
                  </View>
                </View>
              </View>
            </Button>
        }
        {
          userInfo.bind_phone && !userInfo.card_num ?
            <View className="auth">
              <View className="flex-space_center title">
                <View>实名认证</View>
                <View className="select_con" onClick={this.handleToAuth.bind(this)}>
                  还未进行实名认证，去认证
              <View className='at-icon  at-icon-chevron-right'></View>
                </View>
              </View>
            </View> : ""
        }
        <View className="goods_details">
          <View className="flex-start_center ">
            <Image className="image" src={'https://app.zuyuanzhang01.com/' + orderDetails.pic}></Image>
            <View className="goods_details_right">
              <View className="title">{orderDetails.goodsName}</View>
              <View className="sp">规格：{orderDetails.name}</View>
              <View className="total">总租金: ￥{orderDetails.countPrice}</View>
            </View>
            {/* <View className="number">
              <View className="sym1 sym" onClick={this.handleToRedu.bind(this, num)}>-</View>
              <View className="num">{num}</View>
              <View className="sym2 sym" onClick={this.handleToAdd.bind(this, num)}>+</View>
            </View> */}
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
            <View className="bold">￥{bill.bill_money}</View>
          </View>
          <View className="flex-space_center c9">
            <View>剩余付款计划</View>
            <View>{bill.bill_month}期×￥{bill.bill_money}</View>
          </View>
          <View className="freight">
            <View className="flex-space_center">
              <View>运费</View>
              <View>到付</View>
            </View>
            <View className="flex-space_center">
              <View>商品总押金 </View>
              <View>￥{orderDetails.yj_money}</View>
            </View>
            <View className="flex-space_center">
              <View>最高押金减免</View>
              <View>￥{orderDetails.yj_money}</View>
            </View>
          </View>
        </View>
        <View className="message">
          <Text>留言：</Text>
          <Input placeholder="请在这里留下您的备注" onInput={this.handleInput.bind(this)} placeholderClass="plcss" className="input" value={orderDetails.descption}></Input>
        </View>
        <View className="footer_btn">
          <View className="total_box">预计：<Text className="symbol">￥</Text><Text className="total">{bill.bill_money}</Text></View>
          {userInfo.bind_phone ? <View className='btn' onClick={this.handlePay.bind(this)}>去支付</View> :
            <Button
              openType="getAuthorize"
              scope="phoneNumber"
              onClick={this.onGetPhoneNumber.bind(this)}
              type="primary"
              className="btn"
            >
              去支付
           </Button>}
        </View>
      </View>

    );
  }
}
export default Index;
