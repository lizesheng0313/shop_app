import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, Navigator } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import nothing from "../../../assets/images/nothing1.jpg"
import { actionOrderlist, actionCancelOrder, actionFundAuthOrderAppFreeze, actionUpdateOrder, actionReceiptSub } from "../../../services/order"
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
      { title: "待风控", status: 1 },
      { title: "待发货", status: 4 },
      { title: "待收货", status: 41 },
      { title: "租用中", status: 55 },
      { title: "已逾期", status: 66 },
      { title: "归还中", status: 7 },
      { title: "已完成", status: 88 },
    ],
    status: '',
    list: []
  }


  componentDidShow() {
    this.setState({
      status: this.$router.params.status,
      current: Math.floor(this.$router.params.index)
    }, () => {
      this.getOrderList();
    })
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

  handleToCancelOrder(id, e) {
    e.stopPropagation();
    Taro.showModal({
      cancelText: '取消',
      title: '确认取消订单吗',
      success(res) {
        if (res.confirm) {
          Taro.showLoading({
            title: "确认中"
          })
          actionCancelOrder({
            order_id: id
          }).then(res => {
            Taro.hideLoading()
            this.getOrderList();
          })
        }
      }
    })
  }

  async handleToPay(item, e) {
    e.stopPropagation();
    let orderDetails = {};
    orderDetails.order_id = item.id;
    await actionFundAuthOrderAppFreeze({
      orderTitle: item.goodName,
      amount: item.yj_money,
    }).then(res => {
      my.tradePay({
        orderStr: res.data.orderStr,
        success: async (res) => {
          if (res.resultCode === "9000") {
            let data = JSON.parse(res.result)
            orderDetails.operation_id = data.alipay_fund_auth_order_app_freeze_response.auth_no;
            orderDetails.credit_amout = data.alipay_fund_auth_order_app_freeze_response.credit_amount || 0;
            orderDetails.fund_amount = data.alipay_fund_auth_order_app_freeze_response.fund_amount || 1;
            await actionUpdateOrder(orderDetails).then(res => {
              this.getOrderList();
            })
          }
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

  handleSubmitGoods(item, e) {
    e.stopPropagation();
    Taro.showModal({
      cancelText: '取消',
      title: '确认收货吗',
      success(res) {
        if (res.confirm) {
          Taro.showLoading({
            ttile: "确认中"
          })
          actionReceiptSub({
            order_id: item.id
          }).then(res => {
            this.getOrderList();
          })
        }
      }
    })
  }

  handleShowCustomer(e) {
    e.stopPropagation();
    this.setState({
      isShowCustomer: true
    })
  }

  handleRenewal(item,e) {
    let data = {...item}
    data.descption = ""
    e.stopPropagation();
    Taro.navigateTo({
      url:"/pages/xzPayDetails/index?details="+JSON.stringify(data)
    })
  }

  handleToRefund(item, e) {
    e.stopPropagation();
    Taro.navigateTo({
      url: '/pages/ucenter/refund/index?orderDetails=' + JSON.stringify(item)
    })
  }
  handleToLogistics(item, e) {
    console.log(e, item)
    e.stopPropagation();
    Taro.navigateTo({
      url: '/pages/ucenter/logistics/index?id=' + item.id
    })
  }

  render() {
    const { list, isShowCustomer } = this.state
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
                  item.status === 0 || item.status === 4 ? <View className="btn" onClick={this.handleToCancelOrder.bind(this, item.id)}>取消订单</View> : ""
                }
                {
                  item.status === 0 ? <View className="btn_pay btn" onClick={this.handleToPay.bind(this, item)}>去支付</View> : ""
                }
                {
                  item.status === 41 ? <View className="btn" onClick={this.handleToLogistics.bind(this, item)}>查看物流</View> : ""
                }
                {
                  item.status === 41 ? <View className="btn" onClick={this.handleSubmitGoods.bind(this, item)}>确认收货</View> : ""
                }
                {/* {
                  item.status === 55 ? <View className="btn" onClick={this.handleRenewal.bind(this, item)}>续租</View> : ""
                } */}
                <View className="btn" onClick={this.handleRenewal.bind(this, item)}>续租</View> 
                {
                  item.status === 55 ? <View className="btn" onClick={this.handleToRefund.bind(this, item)}>退还</View> : ""
                }
              </View>
            </View >
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
