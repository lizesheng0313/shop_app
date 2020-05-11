import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, Navigator } from '@tarojs/components';

import nothing from "../../../assets/images/nothing.jpg"
import { getOrderListApi } from '../../../services/order';

import './index.less';

class Index extends Component {

  config = {
    "navigationBarTitleText": "我的订单"
  }

  state = {
    current: 0,
    orderType: [
      "全部",
      "待付款",
      "待发货",
      "待收货",
      "租用中",
      "已逾期",
      "已完结"
    ],
    list: [
      {
        time: "2020-03-03 10:14:57",
        type: "等待支付",
        img: "",
        title: "全新国行 iphone 6s plus",
        color: "规格灰色 16GB",
        total: "￥1496.5"
      },
      {
        time: "2020-03-03 10:14:57",
        type: "等待支付",
        img: "",
        title: "全新国行 iphone 6s plus",
        color: "规格灰色 16GB",
        total: "￥1496.5"
      }
    ]
  }

  componentDidMount() {
    this.setState({
      current: Math.floor(this.$router.params.index)
    })
  }

  componentDidShow() {
    // this.getOrderList();
  }

  handleChangeCurrent(index) {
    this.setState({
      current: index
    })
  }

  handleToDetails() {
    Taro.navigateTo({
      url:"/pages/ucenter/orderDetail/index"
    })
  }

  getOrderList = () => {
    getOrderListApi({
      showType: this.state.showType,
      page: this.state.page,
      limit: this.state.limit
    }).then(res => {
      console.log(res.data);
      this.setState({
        orderList: this.state.orderList.concat(res.list),
        totalPages: res.pages
      });
    })
  }
  // onReachBottom = () => {
  //   if (this.state.totalPages > this.state.page) {
  //     this.setState({
  //       page: this.state.page + 1
  //     }, () => {
  //       this.getOrderList();
  //     });
  //   } else {
  //     Taro.showToast({
  //       title: '没有更多订单了',
  //       icon: 'none',
  //       duration: 2000
  //     });
  //     return false;
  //   }
  // }

  render() {
    return (
      <View className='container'>
        <ScrollView scrollX scrollWithAnimation className="orders-switch">
          {
            this.state.orderType.map((item, index) => {
              return <View onClick={this.handleChangeCurrent.bind(this, index)} className={`item ${this.state.current === index ? 'active' : ''} `}> {item} </View>
            })

          }

        </ScrollView>
        {
          this.state.list.length > 0 ? this.state.list.map((item, index) => {
            return <View className="order_list" onClick={this.handleToDetails.bind(this)}>
              <View className="flex-space_center top">
                <Text>{item.time}</Text>
                <Text>{item.type}</Text>
              </View>
              <View className="flex-space_center c">
                <View className="flex-start_center">
                  <Image src={item.src} className='img'></Image>
                  <View>
                    <Text className="title">{item.title}</Text>
                    <View className="color">{item.color}</View>
                    <View className="total">总租金：<Text class="t">{item.total}</Text></View>
                  </View>
                </View>
                <Text className='at-icon at-icon-chevron-right'></Text>
              </View>
              <View className="button_group">
                <View className="btn">联系商家</View>
                <View className="btn">联系商家</View>
                <View className="btn_pay btn">联系商家</View>
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
