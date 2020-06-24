import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, Navigator } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import nothing from "../../../assets/images/nothing1.jpg"
import { actionOrderlist, actionCancelOrder, actionFundAuthOrderAppFreeze } from "../../../services/order"
import './index.less';
import Customer from '../../../components/customer'

@connect(({ order, user }) => ({
  user_id: user.user_id
}))
class Index extends Component {

  config = {
    "navigationBarTitleText": "我的订单"
  }

  state = {
    isShowCustomer: false,
    current: 0,
    orderType: [
      { title: "全部", status: "" },
      { title: "待付款", status: 0 },
      { title: "待风控", status: 2 },
      { title: "待发货", status: 4 },
      { title: "待收货", status: 41 },
      { title: "租用中", status: 5 },
      { title: "已逾期", status: 6 },
      { title: "已完结", status: 7 },
    ],
    status: '',
    list: []
  }

  componentDidMount() {
    this.setState({
      current: Math.floor(this.$router.params.index)
    })


  }

  componentDidShow() {
    this.getOrderList();
  }

  handleChangeCurrent(index, item) {
    this.setState({
      status: item.status,
      current: index
    }, () => {
      this.getOrderList();
    })
  }

  handleToDetails(id) {
    Taro.navigateTo({
      url: "/pages/ucenter/orderDetail/index?id=" + id
    })
  }

  getOrderList = () => {
    Taro.showLoading({
      title: '加载中',
    })
    const { user_id } = this.props
    actionOrderlist({
      user_id,
      status: this.state.status
    }).then(res => {
      Taro.hideLoading()
      this.setState({
        list: res.data
      });
    })
  }

  handleToCancelOrder(id) {
    Taro.showModal({
      title: '确认取消订单吗',
      success() {
        actionCancelOrder({
          order_id: id
        }).then(res => {
          this.getOrderList();
        })
      }
    })
  }

  async handleToPay(item) {
    await actionFundAuthOrderAppFreeze({
      orderTitle: item.goodName,
      amount: this.state.orderDetails.yj_money,
    }).then(res => {
      my.tradePay({
        orderStr: res.data,
        success: async (res) => {
          console.log(res)
          that.state.orderDetails.isAuthorization = false;
          if (res.resultCode === "9000") {
            let data = JSON.parse(res.result)
            that.state.orderDetails.isAuthorization = true;
            that.state.orderDetails.operation_id = data.alipay_fund_auth_order_app_freeze_response.auth_no
            that.state.orderDetails.credit_amout = data.alipay_fund_auth_order_app_freeze_response.credit_amout || 0
            that.state.orderDetails.fund_amount = data.alipay_fund_auth_order_app_freeze_response.fund_amount || 1
          }
          let resultData = await actionSubOrder(that.state.orderDetails)
          Taro.redirectTo({
            url: "/pages/ucenter/orderDetail/index?id=" + resultData.data
          })
        },
        fail: (err) => {
          console.log(err)
        }
      });
    })
  }

  handleCloseCumster() {
    this.setState({
      isShowCustomer: false
    })
  }


  handleShowCustomer(e) {
    e.stopPropagation();
    this.setState({
      isShowCustomer: true
    })
  }

  render() {
    const { list,isShowCustomer} = this.state
    return (
      <View className='container'>
        {
          isShowCustomer ? <Customer handleCloseCumster={this.handleCloseCumster.bind(this)}></Customer> : ""
        }
        <ScrollView scrollX scrollWithAnimation className="orders-switch">
          {
            this.state.orderType.map((item, index) => {
              return <View onClick={this.handleChangeCurrent.bind(this, index, item)} className={`item ${this.state.current === index ? 'active' : ''} `}> {item.title} </View>
            })

          }

        </ScrollView>
        {
          list.length > 0 ? list.map((item, index) => {
            return <View className="order_list" onClick={this.handleToDetails.bind(this, item.id)}>
              <View className="flex-space_center top">
                <Text>{item.create_time}</Text>
                <Text>{item.statusName}</Text>
              </View>
              <View className="flex-space_center c">
                <View className="flex-start_center">
                  <Image src={'https://app.zuyuanzhang01.com/' + item.goodItemPic} mode="widthFix" className='img'></Image>
                  <View>
                    <Text className="title">{item.goodName}</Text>
                    <View className="color">{item.goodItemName}</View>
                    <View className="total">总租金：<Text class="t">{item.countPrice}</Text></View>
                  </View>
                </View>
                <Text className='at-icon at-icon-chevron-right'></Text>
              </View>
              <View className="button_group">
                <View className="btn" onClick={this.handleShowCustomer.bind(this)}>联系商家</View>
                {
                  item.status === 2 ? <View className="btn" onClick={this.handleToCancelOrder.bind(this, item.id)}>取消订单</View> : ""
                }
                <View className="btn_pay btn" onClick={this.handleToPay.bind(this, item)}>去支付</View>
              </View>
            </View>
          })
            : <View className="nothing">
              <Image src={nothing} className="img"></Image>
              <Text className="tips">暂无订单</Text>
            </View>
        }
      </View >
    );
  }
}
export default Index;
