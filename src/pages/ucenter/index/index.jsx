import Taro, { Component, clearStorage } from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { apiFindList } from '../../../services/home';
import { apiFindActiveList } from '../../../services/catalog';
import Customer from '../../../components/customer'
import './index.less';
import d1 from "../../../assets/images/mine/d1.png"
import d2 from "../../../assets/images/mine/d2.png"
import d3 from "../../../assets/images/mine/d3.png"
import d4 from "../../../assets/images/mine/d4.png"
import d5 from "../../../assets/images/mine/d5.png"
import l1 from "../../../assets/images/mine/l1.png"
import l2 from "../../../assets/images/mine/l2.png"
import l3 from "../../../assets/images/mine/l3.png"
import l4 from "../../../assets/images/mine/l4.png"
import l5 from "../../../assets/images/mine/l5.png"
import l6 from "../../../assets/images/mine/l6.png"
import recommended from "../../../assets/images/mine/recommended.png"


@connect(({ user }) => ({
  userInfo: user.userInfo
}))

class Index extends Component {
  state = {
    list: [],
    isShowCustomer: false,
    orderTypeList: [
      { title: "待付款", src: d1, url: "", index: 1, status: 0 },
      { title: "待收货", src: d2, url: "", index: 3, status: 4 },
      { title: "租用中", src: d3, url: "", index: 5, status: 55 },
      { title: "已逾期", src: d4, url: "", index: 6, status: 66 },
      { title: "已完结", src: d5, url: "", index: 8, status: 88 }
    ],
    otherTypeList: [
      { title: "我的优惠券", src: l1, url: "/pages/ucenter/coupons/index" },
      { title: "我的地址", src: l2, url: "/pages/ucenter/address/index" },
      { title: "申诉反馈", src: l4, url: "/pages/ucenter/feedback/index" },
      { title: "实名认证", src: l5, url: "/pages/ucenter/realnameAuth/index" },
      { title: "身份信息", src: l6, url: "/pages/ucenter/auth/index" },
      { title: "在线客服", src: l3, url: "", type: 'weapp' },
    ]
  }

  config = {
    'navigationBarTitleText': '我的'
  }

  componentDidMount() {
    this.getData();
  }

  async getData() {
    let id
    await apiFindList({ type: 4 }).then(res => {
      id = res.data[0].id;
    })
    await apiFindActiveList({
      acId: id
    }).then(res => {
      this.setState({
        list: res.data
      })
    })
  }

  handleToOrder = (item) => {
    Taro.navigateTo({
      url: "/pages/ucenter/order/index?index=" + item.index + '&status=' + item.status
    });
  }

  handleCloseCumster() {
    this.setState({
      isShowCustomer: false
    })
  }

  handleToUrl = (item) => {
    if (item.type) {
      this.setState({
        isShowCustomer: true
      })
      return;
    }
    Taro.navigateTo({
      url: item.url
    });
  }

  render() {
    const { userInfo } = this.props;
    const { isShowCustomer } = this.state;
    return (
      <View className='container'>
        <View className='profile-info' onClick={this.goLogin}>
          <Image className='avatar' src={userInfo.avatar}></Image>
          <View className='info'>
            <Text className='name'>{userInfo.nickName}</Text>
          </View>
        </View>

        <View className='user_area'>
          <View className='user_row' onClick={this.goOrder}>
            <View className='user_row_left'>我的订单</View>
            <View className='user_row_right flex-space_center' onClick={this.handleToOrder.bind(this, {index:0,status:""})}>全部订单
               <Text className='at-icon at-icon-chevron-right'></Text>
            </View>
          </View>
          <View className='user_column'>
            {
              this.state.orderTypeList.map((item, index) => {
                return <View className='user_column_item' onClick={this.handleToOrder.bind(this, item)}>
                  <Image className='user_column_item_image' src={item.src}></Image>
                  <View className='user_column_item_text'>{item.title}</View>
                </View>
              })
            }
          </View>
        </View>

        <View className="mine_other_type">
          {
            this.state.otherTypeList.map((item => {
              // return item.type === 'weapp' ?
              // <View className="user_other_item">
              //   <contact-button className="user_other_item" session-from='weapp' size='27' icon={item.src}>
              //     <Image src={item.src} className="icon"></Image>
              //   </contact-button>
              //   <View class="title service_title">{item.title}</View>
              // </View> :
              return <View className="user_other_item" onClick={this.handleToUrl.bind(this, item)}>
                <Image src={item.src} className="icon"></Image>
                <View class="title">{item.title}</View>
              </View>
            }))
          }
        </View>

        <View className="recommended">
          <Image src={recommended}></Image>
        </View>

        <View className="recommended_list">
          {
            list.length > 0 &&
            list.map(item => {
              return <View className='item' key={item.id}>
                <Navigator url={`/pages/goods/goods?id=${item.id}`}>
                  <Image className='img' src={'http://app.zuyuanzhang01.com/' + item.title_pic}></Image>
                  <View class="tag">
                    {item.tag ? <Text>{item.tag}</Text> : ""}
                    {item.address ? <Text>{item.address}</Text> : ""}
                  </View>
                  <Text className='name'>{item.name}</Text>
                  <View className="flex-space_center">
                    <Text className="price"><Text class="icon">￥</Text>{item.price}元/天<Text className="start">起</Text></Text>
                    <Text className="time">{item.day}天起租</Text>
                  </View>
                </Navigator>
              </View>
            })
          }
        </View>
        {
          isShowCustomer ? <Customer handleCloseCumster={this.handleCloseCumster.bind(this)}></Customer> : ""
        }
      </View>
    );
  }
}
export default Index
