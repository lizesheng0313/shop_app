import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { AtCheckbox } from 'taro-ui'
import { View, Text, Image, Navigator, Input, Checkbox } from '@tarojs/components';
import { actionGetOneBill, actionSubOrder, actionFundAuthOrderAppFreeze } from "../../services/order"
import { actionGetPhoneNumber, actionUserUpdate } from "../../services/user"
import './index.less';

@connect(({ order, user }) => ({
  addressInfo: order.addressInfo,
  userInfo: user.userInfo,
  user_id: user.user_id,
  conponsId: user.conponsId,
  conponsMoney: user.conponsMoney
}))

class Index extends Component {

  config = {
    navigationBarTitleText: '支付详情'
  }

  state = {
    coupons: '请选择优惠卷',
    num: 1,
    orderDetails: {
      yhj_id: 0,
      order_id: "",
      operation_id: "",
      descption: "",
      user_id: "",
      credit_amout: "",
      fund_amount: "",
      isAuthorization: ""
    },
    bill: {},
    isAddress: false,
    checkboxOption: [{
      value: 'list1',
      label: '',
    }],
    checkedList: ['list1']
  }



  async componentWillMount() {
    console.log(this.$router.params.details)
    const { dispatch } = this.props;
    this.setState({
      orderDetails: { ...this.state.orderDetails, ...JSON.parse(this.$router.params.details) },
    }, () => {
      this.actionGetBill()
    })
    await dispatch({
      type: 'user/saveConpons', payload: {
        id: "",
        sub_money: '请选择优惠卷'
      }
    })
  }

  componentDidShow() {
    const { addressInfo, conponsId, conponsMoney } = this.props;
    console.log(conponsId, conponsMoney)
    const { bill_money, orderDetails } = this.state
    if (addressInfo.id) {
      this.setState({
        isAddress: true
      })
      this.state.orderDetails.address_id = addressInfo.id;
    }
    if (conponsId) {
      orderDetails.yhj_id = conponsId
      orderDetails.countPrice = orderDetails.countPrice - Number(conponsMoney)
      this.setState({
        orderDetails,
        coupons: conponsMoney
      },()=>{
         this.actionGetBill()
      })
    }
    else {
      orderDetails.yhj_id = 0
      this.setState({
        orderDetails
      })
    }
  }

  actionGetBill = () => {
    Taro.showLoading({
      title:'加载中',
      mask:true
    })
    actionGetOneBill({
      countPrice: this.state.orderDetails.countPrice,
      day: this.state.orderDetails.day
    }).then(res => {
      Taro.hideLoading()
      this.setState({
        bill: res.data,
        bill_money: res.data.bill_money
      })
    })
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
      url: "/pages/ucenter/coupons/index?fr=pay&countPrice=" + this.state.orderDetails.countPrice
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

  handleChangeCheck() {
    if (this.state.checkedList.includes("list1")) {
      this.setState({
        checkedList: []
      })
    }
    else {
      this.setState({
        checkedList: ["list1"]
      })
    }
  }

  handleToAGreement() {
    Taro.showLoading({
      title: "加载中"
    })
    my.downloadFile({
      url: 'https://app.zuyuanzhang01.com/ext_api/upload/%E5%B9%B3%E5%8F%B0%E7%94%A8%E6%88%B7%E5%8D%8F%E8%AE%AE.pdf',
      success({ apFilePath }) {
        Taro.hideLoading();
        my.openDocument({
          filePath: apFilePath,
          fileType: 'pdf',
          success: (res) => {
            console.log('open document success')
          }
        })
      }
    })
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

    if (!this.state.checkedList.includes("list1")) {
      Taro.showToast({
        title: "请先阅读并同意协议"
      })
      return;
    }

    await actionFundAuthOrderAppFreeze({
      orderTitle: this.state.orderDetails.goodsName,
      amount: this.state.orderDetails.yj_money,
      // amount: 1
    }).then(res => {
      that.state.orderDetails.order_id = res.data.outOrderNo;
      my.tradePay({
        orderStr: res.data.orderStr,
        success: async (res) => {
          that.state.orderDetails.isAuthorization = false;
          if (res.resultCode === "9000") {
            let data = JSON.parse(res.result)
            that.state.orderDetails.isAuthorization = true;
            that.state.orderDetails.order_id = data.alipay_fund_auth_order_app_freeze_response.out_order_no
            that.state.orderDetails.operation_id = data.alipay_fund_auth_order_app_freeze_response.auth_no
            that.state.orderDetails.credit_amout = data.alipay_fund_auth_order_app_freeze_response.credit_amount || 0
            that.state.orderDetails.fund_amount = data.alipay_fund_auth_order_app_freeze_response.fund_amount || 1
          }
          let queryForm = { ...that.state.orderDetails };
          delete queryForm.yj_money;
          let resultData = await actionSubOrder(queryForm)
          Taro.redirectTo({
            url: "/pages/ucenter/order/index?isPay=true&id=" + resultData.data
          })

        },
        fail: (err) => {
          console.log(err)
        }
      });
    })
  }

  render() {
    const { bill_money, num, isAddress, orderDetails, bill, checkboxOption, checkedList } = this.state
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
              {coupons}
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
        <View className="footer_btn flex-space_center">
          <View>
            <View>
              <View className="total_box">预计：<Text className="symbol">￥</Text><Text className="total">{bill_money}</Text></View>
              <View>
                <AtCheckbox
                  size="5"
                  options={checkboxOption}
                  selectedList={checkedList}
                  onChange={this.handleChangeCheck.bind(this)}
                />
                <Text>同意</Text>
                <Text className="agreement" onClick={this.handleToAGreement.bind(this)}>《租元章用户交易服务协议》</Text>
              </View>
            </View>
          </View>
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
