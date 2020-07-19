import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, Navigator, Radio } from '@tarojs/components';
import { actionTradeCreate, actionUpdateBill } from '../../services/order';
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
    index: "",
    billId: "",
    didNotReturn: 0,
    hasAlso: 0,
    orderInfo: {},
  }

  componentDidShow() {
    let hasAlso = 0;
    let data = JSON.parse(this.$router.params.info)
    data.list.forEach((item, index) => {
      item.checked = false;
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

  handleToPay() {
    if (this.state.billId) {
      Taro.showLoading({
        title: "支付中"
      })
      actionTradeCreate({
        outTradeMo: this.state.orderInfo.id,
        amount: this.state.orderInfo.countPrice,
        subject: this.state.orderInfo.goodName,
        buyerId: this.state.orderInfo.operation_id
      }).then(res => {
        if (res.success) {
          actionUpdateBill({
            id: this.state.billId
          }).then(res => {
            if (res.success) {
              let data = this.state.orderInfo.list;
              data[this.state.index].status = 1;
              this.state.orderInfo.list = data;
              this.setState({
                orderInfo: this.state.orderInfo
              })
              Taro.hideLoading()
            }
          }).catch(err => {
            Taro.hideLoading()
          })
        }
      }).catch(err => {
        Taro.hideLoading()
      })
    }
  }

  handleSelectBill(item, index) {
    let data = this.state.orderInfo.list;
    data[index].checked = !item.checked;
    if (data[index].checked) {
      this.state.billId = item.id;
      this.state.index = index
    }
    else {
      this.state.billId = "";
      this.state.index = ""
    }
    this.state.orderInfo.list = data;
    this.setState({
      orderInfo: this.state.orderInfo
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
            return <View onClick={this.handleSelectBill.bind(this, item, index)} className="coupons">
              <View className="nper">{index + 1}/{orderInfo.list.length}期</View>
              <View className="flex-space_center">
                <View className="total">￥{item.money}</View>
                <Radio checked={item.checked} disabled={item.status !== 0} color="#F71279"></Radio>
              </View>
              <View className="flex-space_center time_border">
                <View>还款时间：{item.formatDate}</View>
                <View>{status[item.status]}</View>
              </View>
            </View>
          })
        }
        <View className="btn_submit" onClick={this.handleToPay.bind(this)}>支付</View>
      </View >
    );
  }
}
export default Index;
