import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View, Text, Image, Navigator, Input, Checkbox, Picker } from '@tarojs/components';
import { AtList, AtListItem, AtCheckbox } from 'taro-ui'
import { actionGetOneBill, actionSubOrder, actionFundAuthOrderAppFreeze,actionxzSubOrder } from "../../services/order"
import { getGoodsDetails } from '../../services/goods';
import './index.less';

@connect(({ order, user }) => ({
  addressInfo: order.addressInfo,
  userInfo: user.userInfo,
  user_id: user.user_id
}))

class Index extends Component {

  config = {
    navigationBarTitleText: '续租'
  }

  state = {
    index: 0,
    goodsTimeList: [],
    selector: [],
    selectorChecked: "",
    num: 1,
    orderDetails: {
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



  componentWillMount() {
    let data = JSON.parse(this.$router.params.details)

    this.setState({
      orderDetails: { ...this.state.orderDetails, ...data },
      selectorChecked: data.goods_day.toString()
    }, () => {
      this.state.orderDetails.address_id = ""
      this.fetchBill()
      this.fetchDetails();
    })
  }

  async fetchDetails() {
    getGoodsDetails({
      id: this.state.orderDetails.goods_id
    }).then(res => {
      let dayItem;
      let current;
      res.data.itemList.forEach((item) => {
        if (item.id === this.state.orderDetails.goods_item_id) {
          dayItem = item.dayItem
        }
      })
      let selector = []
      dayItem.forEach((item, index) => {
        if (this.state.selectorChecked == item.day) {
          current = index
        }
        selector.push(item.day)
      })
      this.setState({
        goodsTimeList: dayItem,
        selector,
        current
      })
    })
  }

  async fetchBill() {
    Taro.showLoading({
      title: "加载中"
    })
    actionGetOneBill({
      countPrice: this.state.orderDetails.countPrice,
      day: this.state.selectorChecked
    }).then(res => {
      Taro.hideLoading()
      this.setState({
        bill: res.data
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

  async onChange(e) {
    this.state.orderDetails.countPrice = (this.state.goodsTimeList[e.detail.value].monery * this.state.goodsTimeList[e.detail.value].day).toFixed(2)
    this.setState({
      current:e.detail.value,
      selectorChecked: this.state.selector[e.detail.value]
    },()=>{
      this.fetchBill();
    })
  }

  handleToAddress() {
    Taro.navigateTo({
      url: "/pages/ucenter/address/index?order=yes"
    })
  }

  handleToConpons() {
    Taro.navigateTo({
      url: "/pages/ucenter/coupons/index"
    })
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
    const { user_id } = this.props;
    this.state.orderDetails.user_id = user_id
    if (!this.state.orderDetails.address_id) {
      Taro.showToast({
        title: "请添加收货地址"
      })
      return;
    }

    if (!this.state.checkedList.includes("list1")) {
      Taro.showToast({
        title: "请先阅读并同意协议"
      })
      return;
    }
    let queryForm = {};
    queryForm.old_order_id = this.state.orderDetails.id;
    queryForm.day = this.state.goodsTimeList[this.state.current].day
    queryForm.countPrice= (this.state.goodsTimeList[this.state.current].monery * this.state.goodsTimeList[this.state.current].day).toFixed(2)
    await actionFundAuthOrderAppFreeze({
      orderTitle: this.state.orderDetails.goodName,
      amount: this.state.orderDetails.yj_money,
      outOrderNo: this.state.orderDetails.id
    }).then(res => {
      queryForm.new_order_id = res.data.outOrderNo;
      my.tradePay({
        orderStr: res.data.orderStr,
        success: async (res) => {
          console.log(res)
         queryForm.isAuthorization = false;
          if (res.resultCode === "9000") {
            let data = JSON.parse(res.result)
           queryForm.isAuthorization = true;
          //  queryForm.order_id = data.alipay_fund_auth_order_app_freeze_response.out_order_no
           queryForm.operation_id = data.alipay_fund_auth_order_app_freeze_response.auth_no
           queryForm.credit_amout = data.alipay_fund_auth_order_app_freeze_response.credit_amount || 0
           queryForm.fund_amount = data.alipay_fund_auth_order_app_freeze_response.fund_amount || 1
          }
          let resultData = await actionxzSubOrder(queryForm)
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

  render() {
    const { num, isAddress, orderDetails, bill, checkboxOption, checkedList, selector, selectorChecked } = this.state
    const { addressInfo } = this.props
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
        <View className="goods_details">
          <View className="flex-start_center ">
            <Image className="image" src={'https://app.zuyuanzhang01.com/' + orderDetails.goodItemPic}></Image>
            <View className="goods_details_right">
              <View className="title">{orderDetails.goodName}</View>
              <View className="sp">规格：{orderDetails.goodItemName}</View>
              <View className="total">总租金: ￥{orderDetails.countPrice}</View>
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
        <View className="selector">
          <Picker mode='selector' range={selector} title='选择租期' onChange={this.onChange} >
            <View class="selector-box">
              <Text className="express_title">选择租期</Text>
              <Text className="express_value">{selectorChecked}</Text>
            </View>
          </Picker>
        </View>
        <View className="message">
          <Text>留言：</Text>
          <Input placeholder="请在这里留下您的备注" onInput={this.handleInput.bind(this)} placeholderClass="plcss" className="input" value={orderDetails.descption}></Input>
        </View>
        <View className="footer_btn flex-space_center">
          <View>
            <View>
              <View className="total_box">预计：<Text className="symbol">￥</Text><Text className="total">{bill.bill_money}</Text></View>
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
          <View className='btn' onClick={this.handlePay.bind(this)}>去支付</View>
        </View>
      </View>

    );
  }
}
export default Index;
