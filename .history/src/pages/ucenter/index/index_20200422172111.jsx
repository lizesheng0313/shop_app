import Taro, { Component, clearStorage } from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import { connect } from '@tarojs/redux';
import { bindPhone, logOut } from '../../../services/auth';
import { getUserIndex } from '../../../services/user';
import { set as setGlobalData, get as getGlobalData } from '../../../global_data';
import * as images from '../../../static/images/index';
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


@connect(({ home, goods }) => ({
   data: home.data
 }))

class Index extends Component {
    state = {
      userInfo: {
        nickName: '',
        avatarUrl: '/static/images/my.png'
      },
      orderTypeList: [
        { title: "待付款", src: d1, url: "" },
        { title: "待收货", src: d2, url: "" },
        { title: "租用中", src: d3, url: "" },
        { title: "已逾期", src: d4, url: "" },
        { title: "已完结", src: d5, url: "" }
      ],
      otherTypeList: [
        { title: "我的优惠券", src: l1, url: "" },
        { title: "我的地址", src: l2, url: "" },
        { title: "申诉反馈", src: l4, url: "" },
        { title: "实名认证", src: l5, url: "" },
        { title: "身份信息", src: l6, url: "" },
        { title: "在线客服", src: l3, url: "", type: 'weapp' },
      ]
    }

    config = {
      'navigationBarTitleText': '我的'
    }

    componentDidMount() {
      //获取用户的登录信息
      if (getGlobalData('hasLogin')) {
        let userInfo = Taro.getStorageSync('userInfo');
        this.setState({
          userInfo: userInfo,
          hasLogin: true
        });

        getUserIndex().then(res => {
          this.setState({
            order: res.order
          });
        });
      }
    }

    goGroupon = () => {
      if (this.state.hasLogin) {
        Taro.navigateTo({
          url: "/pages/groupon/myGroupon/myGroupon"
        });
      } else {
        Taro.navigateTo({
          url: "/pages/auth/login/login"
        });
      };
    }

    render() {
      const { userInfo } = this.state;
      const { data } = this.props;
      return (
        <View className='container'>
          <View className='profile-info' onClick={this.goLogin}>
            <Image className='avatar' src={userInfo.avatarUrl}></Image>
            <View className='info'>
              <Text className='name'>{userInfo.nickName}</Text>
            </View>
          </View>

          <View className='user_area'>
            <View className='user_row' onClick={this.goOrder}>
              <View className='user_row_left'>我的订单</View>
              <View className='user_row_right flex-space_center'>全部订单
               <Text className='at-icon at-icon-chevron-right'></Text>
              </View>
            </View>
            <View className='user_column'>
              {
                this.state.orderTypeList.map(item => {
                  return <View className='user_column_item' onClick={this.goAfterSale}>
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
                return item.type === 'weapp' ?
                  <View className="user_other_item">
                    <contact-button className="user_other_item" session-from='weapp' size='27' icon={item.src}>
                      <Image src={item.src} className="icon"></Image>
                    </contact-button>
                    <View class="title service_title">{item.title}</View>
                  </View> :
                  <View className="user_other_item">
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
              data.newGoodsList && data.newGoodsList.length > 0 &&
              data.newGoodsList.map(item => {
                return <View className='item' key={item.id}>
                  <Navigator url={`../goods/goods?id=${item.id}`}>
                    <Image className='img' src={item.picUrl}></Image>
                    <View class="tag">
                      <Text>全新</Text>
                      <Text>大连发货</Text>
                    </View>
                    <Text className='name'>{item.name}</Text>
                    <View className="flex-space_center">
                      <Text className="price"><Text class="icon">￥</Text>{item.retailPrice}<Text class="start">起</Text></Text>
                      <Text className="time">90天起租</Text>
                    </View>
                  </Navigator>
                </View>
              })
            }
          </View>

        </View>
      );
    }
  }
  export default Index
