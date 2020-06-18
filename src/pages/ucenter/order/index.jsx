import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, Navigator } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import nothing from "../../../assets/images/nothing1.jpg"
import { actionOrderlist } from "../../../services/order"
import './index.less';

@connect(({ order, user }) => ({
  user_id: user.user_id
}))
class Index extends Component {

  config = {
    "navigationBarTitleText": "我的订单"
  }

  state = {
    current: 0,
    orderType: [
      { title: "全部", status: "" },
      { title: "待付款", status: 0 },
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
    this.getOrderList();
  }

  componentDidShow() {
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
    const { user_id } = this.props
    actionOrderlist({
      user_id,
      status: this.state.status
    }).then(res => {
      this.setState({
        list: res.data
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
    const { list } = this.state
    return (
      <View className='container'>
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
                <View className="btn">联系商家</View>
                {/* <View className="btn">联系商家</View> */}
                <View className="btn_pay btn">去支付</View>
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
