import Taro, { PureComponent } from '@tarojs/taro'
import { View, Text, Navigator, Swiper, SwiperItem, Image, ScrollView, Block, Input } from '@tarojs/components'
import { connect } from '@tarojs/redux';
import { get as getGlobalData } from '../../global_data';
import { apiFindList, apiuserOauthToken,apiIndexList } from '../../services/home';

//图片
import category from "../../assets/images/home/category.png"
import adv from "../../assets/images/home/adv.png"
import phone from "../../assets/images/home/sb.png"
import coupons from "../../assets/images/home/coupons.png"

import './index.less'

@connect(({ home, goods }) => ({
  data: home.data,
  goodsCount: goods.goodsCount,
}))

class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      menuList: [
        { title: '智能手机', src: phone },
        { title: '智能手机', src: phone },
        { title: '智能手机', src: phone },
        { title: '智能手机', src: phone },
        { title: '智能手机', src: phone }
      ],
      likeList: [
        { title: "iPhone", src: phone },
        { title: "华为", src: phone },
        { title: "左从", src: phone },
        { title: "THink", src: phone },
        { title: "iPhone", src: phone },
        { title: "iPhone", src: phone }
      ]
    }
  }

  config = {
    navigationBarTitleText: '首页',
  }

  componentDidMount() {
    my.getAuthCode({
      scopes: 'auth_base',
      success: (res) => {
        apiuserOauthToken({
          authCode: res.authCode
        })
      },
    });
    this.getData();
  }

  getData = () => {
    apiIndexList().then(res=>{
      
    })
    apiFindList({ type: 2 }).then(res => {
    })
  }

  componentWillMount() {

  }

  async onGetAuthorize(res) {
    let userInfo = await Taro.getOpenUserInfo()
    userInfo = JSON.parse(userInfo.response).response
    console.log(userInfo)
  }

  onShareAppMessage() {
    return {
      title: 'Taro mall小程序商场',
      desc: 'Taro 开源微信小程序商城',
      path: '/pages/index/index'
    }
  }

  getCoupon = (e) => {
    if (!getGlobalData('hasLogin')) {
      Taro.navigateTo({
        url: "/pages/auth/login/login"
      });
    }

    let couponId = e.currentTarget.dataset.index;
    couponReceive({
      couponId: couponId
    }).then(() => {
      Taro.showToast({
        title: "领取成功"
      })
    })
  }

  render() {
    const { data } = this.props;
    return (
      <View className='container'>
        {/* <Button
          openType="getAuthorize"
          scope="userInfo"
          onClick={this.onGetAuthorize.bind(this)}
          type="primary"
          className="login-button"
        >
          支付宝登录
      </Button> */}
        <View className="header">
          <View className="search_box">
            <View className='search'>
              <Input type='text' placeholder='请输入商品关键词' placeholderStyle='color:rgba(255,255,255,1);' />
            </View>
            <Image src={category} className="category" />
          </View>
          <View className="swiper_box">
            <Swiper className='banner' autoplay interval='3000' duration='100'>
              {
                data.banner && data.banner.map(item => {
                  return <SwiperItem key={item.id}>
                    {
                      item.link > 0 ? <Navigator url={`/pages/goods/goods?id=${item.link}`}>
                        <Image className='img' src={item.url} />
                      </Navigator> : <Image className='img' src={item.url} />
                    }
                  </SwiperItem>
                })
              }
            </Swiper>
          </View>
        </View>
        <View className="nav_box">
          <Image src="http://app.zuyuanzhang01.com/shop_app/home/adv.png" className="adv" mode="widthFix" />
        </View>

        <View className="process">
          <View className="process_box"><Text className="num">1</Text>选品下单 ---</View>
          <View className="process_box"> <Text className="num">2</Text>信用免押 ---</View>
          <View className="process_box"> <Text className="num">3</Text>月付租金 ---</View>
          <View className="process_box"><Text className="num">4</Text>续租/买断/归还</View>
        </View>

        <View className="menu_list">
          {
            this.state.menuList.map(item => {
              return <Navigator className="menu_item" url={`/pages/category/category?id=${item.id}`}>
                <Image className="img" src={item.src} />
                <Text>{item.title}</Text>
              </Navigator>
            })
          }
        </View>

        <View>
          <Image src={coupons} className="coupons" />
        </View>

        <View className="like">
          <View className="like_title like_type">
            <Text className="top">猜你喜欢</Text>
            <Text className="title">随便逛逛</Text>
          </View>
          <ScrollView scrollX scrollWithAnimation className="scroll_view">
            {
              this.state.likeList.map(item => {
                return <View className="like_type">
                  <Text className="top">
                    <Image src={item.src} />
                  </Text>
                  <Text className="title">{item.title}</Text>
                </View>
              })
            }
          </ScrollView>
        </View>
        <View className="recommended_list">
          {
            data.newGoodsList && data.newGoodsList.length > 0 &&
            data.newGoodsList.map(item => {
              return <View className='item' key={item.id}>
                <Navigator url={`../goods/goods?id=${item.id}`}>
                  <Image className='img' src={item.picUrl}></Image>
                  <View className="tag">
                    <Text>全新</Text>
                    <Text>大连发货</Text>
                  </View>
                  <Text className='name'>{item.name}</Text>
                  <View className="flex-space_center">
                    <Text className="price"><Text className="icon">￥</Text>{item.retailPrice}<Text className="start">起</Text></Text>
                    <Text className="time">90天起租</Text>
                  </View>
                </Navigator>
              </View>
            })
          }
        </View>
      </View >
    )
  }
}

export default Index
