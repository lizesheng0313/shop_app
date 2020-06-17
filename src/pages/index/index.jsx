import Taro, { PureComponent } from '@tarojs/taro'
import { View, Text, Navigator, Swiper, SwiperItem, Image, ScrollView, Block, Input } from '@tarojs/components'
import { connect } from '@tarojs/redux';
import { get as getGlobalData } from '../../global_data';
import { apiFindList, apiuserOauthToken, apiIndexList } from '../../services/home';
import { apiCatalogList } from "../../services/catalog"

//图片

import './index.less'

@connect(({ user }) => ({
  userInfo: user.userInfo
}))

class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      banner: [],
      currentBrand: -1,
      list: [],
      value: "",
      menuList: [],
      likeList: []
    }
  }

  config = {
    navigationBarTitleText: '首页',
  }


  async componentWillMount() {
    Taro.showLoading({
      title: '加载中'
    })
    const { dispatch } = this.props;
    let authCode, user_id;
    await my.getAuthCode({
      scopes: 'auth_base',
      success: (res) => {
        authCode = res.authCode
      },
    });
    //拿到用户id
    await apiuserOauthToken({
      authCode
    }).then(res => {
      user_id = res.data.alipay_system_oauth_token_response.user_id
    })
    //获取用户信息
    await dispatch({ type: 'user/apiFindUserByUserId', payload: user_id })
  }

  async componentDidShow() {
    Taro.showLoading({
      title: '加载中'
    })
    this.getData();
  }

  getData = () => {
    apiFindList({ type: 3 }).then(res => {
      this.setState({
        banner: res.data
      })
    })
    apiFindList({ type: 2 }).then(res => {
      this.setState({
        likeList: res.data
      })
      this.handleLikelist(0, -1)
    })
    apiCatalogList({ index: 1 }).then(res => {
      this.setState({
        menuList: res.data
      })
      Taro.hideLoading()
    })
  }

  handleLikelist(acId, index) {
    apiIndexList({ acId }).then(res => {
      this.setState({
        list: res.data,
        currentBrand: index
      })
    })
  }

  handleToProduct() {
    Taro.navigateTo({
      url: "/pages/productList/index?txt=" + this.state.value
    });
  }

  handleOnInput(e) {
    this.setState({
      value: e.detail.value
    })
  }

  render() {
    const { menuList, banner, list, likeList, value, currentBrand } = this.state;
    return (
      <View className='container'>
        <View className="header">
          <View className="search_box" >
            <View className='search'>
              <Input type='text' onInput={this.handleOnInput.bind(this)} value={value} placeholder='请输入商品关键词' placeholderStyle='color:rgba(255,255,255,1);' />
            </View>
            <Image src="http://app.zuyuanzhang01.com/shop_app/home/category.png" className="category" onClick={this.handleToProduct.bind(this, value)} />
          </View>
          <View className="swiper_box">
            <Swiper className='banner' autoplay interval='3000' duration='100'>
              {
                banner.map(item => {
                  return <SwiperItem key={item.id}>
                    <Navigator url={`/pages/activeList/index?id=${item.id}`}>
                      <Image className='img' src={'https://app.zuyuanzhang01.com/' + item.title_pic} />
                    </Navigator>
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

        <ScrollView scrollX scrollWithAnimation className="menu_list">
          {
            menuList.map(item => {
              return <Navigator className="menu_item" url={`/pages/catalog/catalog?id=${item.id}`}>
                <Image className="img" src={'http://app.zuyuanzhang01.com/' + item.type_img} />
                <Text >{item.name}</Text>
              </Navigator>
            })
          }
        </ScrollView>

        <View>
          <Image src="http://app.zuyuanzhang01.com/shop_app/home/coupons.png" className="coupons" />
        </View>
        <View className="like">
          <View className="like_title like_type" onClick={this.handleLikelist.bind(this, 0, -1)}>
            <Text className={`top ${currentBrand === -1 ? 'active' : ''}`}>猜你喜欢</Text>
            <Text className="title">随便逛逛</Text>
          </View>
          <ScrollView scrollX scrollWithAnimation className="scroll_view">
            {
              likeList.map((item, index) => {
                return <View className="like_type" onClick={this.handleLikelist.bind(this, item.id, index)}>
                  <Text className={`top ${currentBrand === index ? 'active' : ''}`}>
                    <Image src={'http://app.zuyuanzhang01.com/' + item.title_pic} />
                  </Text>
                  <Text className="title">{item.name}</Text>
                </View>
              })
            }
          </ScrollView>
        </View>
        <View className="recommended_list">
          {
            list.length > 0 &&
            list.map(item => {
              return <View className='item' key={item.id}>
                <Navigator url={`/pages/goods/goods?id=${item.id}`}>
                  <Image className='img' src={'http://app.zuyuanzhang01.com/' + item.title_pic}></Image>
                  <View className="tag">
                    {item.tag ? <Text>{item.tag}</Text> : ""}
                    {item.address ? <Text>{item.address}</Text> : ""}
                  </View>
                  <Text className='name'>{item.name}</Text>
                  <View className="flex-space_center">
                    <Text className="price"><Text className="icon">￥</Text>{item.price}元/天<Text className="start">起</Text></Text>
                    <Text className="time">{item.day}天起租</Text>
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
