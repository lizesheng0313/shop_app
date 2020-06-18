import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View, Swiper, SwiperItem, Button, Navigator, Text, Block, Input, Image, RichText } from '@tarojs/components';
import { AtSegmentedControl } from 'taro-ui';
import { getGoodsDetails, apiRandShop } from '../../services/goods';
import { apiRegisterUser } from "../../services/user"
import parse from 'mini-html-parser2';


import './index.less';

@connect(({ user }) => ({
  userInfo: user.userInfo,
  user_id: user.user_id
}))

class Goods extends Component {

  config = {
    navigationBarTitleText: '商品详情'
  }

  state = {
    woqu: "",
    goods: {},
    openAttr: false,
    openShare: false,
    tagInfo: [
      "免押金",
      "分期月付",
      "可续租",
      "可买断"
    ],
    goodsInfo: {},
    nodes: [],
    zlNodex: [],
    currentObj: {},
    orderObj: {
      checkedSpecText: '',
      coupons: ""
    },
    current: 0,
    likeList: [],
    currentPack: 0,
    currDay: 0,
    orderDetails: {
      goods_item_id: "",
      countPrice: "",
      day: "",
      goods_id: "",
      pic: "",
      name: "",
      yj_money: "",
      goodsName: ""
    }
  }

  componentWillMount() {
  }

  componentDidMount() {
    this.fetchGoodsInfo();
    this.fetchRandList()
    this.state.orderDetails.goods_id = this.$router.params.id
  }

  fetchGoodsInfo = () => {
    Taro.showLoading({
      title: "加载中"
    })
    getGoodsDetails({
      id: this.$router.params.id
    }).then(res => {
      Taro.hideLoading()
      this.setState({
        goodsInfo: res.data,
        currentObj: res.data.itemList[0],
        currDay: res.data.itemList[0].dayItem.length - 1
      })
      this.state.orderDetails.goodsName = res.data.name
      let content = res.data.content.replace(/\<img/gi, '<img style="width:100%" mode="widthFix"')
      parse(content, (err, nodes) => {
        if (!err) {
          this.setState({
            nodes
          });
        }
      })
      parse(res.data.dianpu_info.zl_txt, (err, nodes) => {
        if (!err) {
          this.setState({
            zlNodex: nodes
          });
        }
      })
    });
  }

  fetchRandList() {
    apiRandShop({ id: this.$router.params.id }).then(res => {
      this.setState({
        likeList: res.data
      })
    })
  }

  closeAttr = () => {
    this.setState({
      openAttr: false,
    });
  }

  handleClick(value) {
    this.setState({
      current: value
    })
  }


  clickSkuValue = (item, index) => {
    this.state.orderDetails.goods_item_id = item.id;
    this.state.orderDetails.name = item.name;
    this.state.orderDetails.yj_money = item.yj_money;
    this.state.orderDetails.pic = item.pic;
    this.state.orderDetails.day = this.state.currentObj.dayItem[0].day;
    this.setState({
      currentPack: index,
      currentObj: item,
      currDay: 0
    })
  }

  handleSwitchIndex = () => {
    Taro.switchTab({
      url: '/pages/index/index'
    });
  }

  handleToStore = (id) => {
    Taro.navigateTo({
      url: '/pages/store/index?id=' + id
    });
  }

  handleToCoupons() {
    Taro.navigateTo({
      url: '/pages/ucenter/coupons/index'
    });
  }

  handleSelectDay(item, index) {
    this.state.orderDetails.day = item.day
    this.setState({
      currDay: index
    })
  }

  addFast = () => {
    this.setState({
      openAttr: true
    })

  }
  //租用
  handleRent() {
    if (!this.state.orderDetails.goods_item_id) {
      this.state.orderDetails.goods_item_id = this.state.currentObj.id;
      this.state.orderDetails.name = this.state.currentObj.name;
      this.state.orderDetails.yj_money = this.state.currentObj.yj_money;
      this.state.orderDetails.day = this.state.currentObj.dayItem[0].day;
      this.state.orderDetails.pic = this.state.currentObj.pic
    }
    this.state.orderDetails.countPrice = this.state.currentObj.dayItem[this.state.currDay].monery * this.state.currentObj.dayItem[this.state.currDay].day
    this.setState({
      openAttr: false,
    })
    Taro.navigateTo({
      url: '/pages/payDetails/index?details=' + JSON.stringify(this.state.orderDetails)
    });
  }

  async onGetAuthorize(res) {
    const { user_id, dispatch } = this.props
    let user_info = await Taro.getOpenUserInfo()
    this.setState({
      woqu: JSON.stringify(user_info)
    })
    user_info = JSON.parse(user_info.response).response
    await apiRegisterUser({
      user_id,
      avatar: user_info.avatar,
      nickName: user_info.nickName
    })
    await dispatch({ type: 'user/apiFindUserByUserId', payload: user_id })
  }

  handleToProduct() {
    Taro.navigateTo({
      url: "/pages/productList/index"
    });
  }


  render() {
    const { userInfo } = this.props
    const { current, nodes, currentObj, tagInfo, goodsInfo, openAttr, goods, orderObj, likeList, currDay } = this.state;
    return (
      <Block>
        <View className='container'>
          <Swiper className='goodsimgs' indicator-dots='true' autoplay='true' interval='5000' duration='1000'>
            {goodsInfo.title_pic.map(item => {
              return <SwiperItem key={item}>
                <Image className='img' src={'http://app.zuyuanzhang01.com/' + item} background-size='cover'></Image>
              </SwiperItem>
            })}
          </Swiper>

          <View>
            <Image src="http://app.zuyuanzhang01.com/shop_app/goods/zm.png" className="zm_icon"></Image>
          </View>

          <View className='goods-info'>
            <View className='price'>￥{currentObj.dayItem[currDay].monery}元/天</View>
            <View className="tag">
              {
                goodsInfo.tag.map((item => {
                  return <Text>{item}</Text>
                }))
              }
            </View>
            <View className='title'>{goodsInfo.name} {currentObj.name}</View>
            <View className="courier flex-space_center">
              <View>不包邮</View>
              {/* <View>{goodsInfo.kd}</View> */}
            </View>
            <View className="other_info">
              {
                tagInfo.map((item => {
                  return <View className="item">
                    <View className='at-icon at-icon-check-circle'></View>
                    <Text className="name">{item}</Text>
                  </View>
                }))
              }
            </View>
          </View>


          {/* <View className='section-nav section-attr' onClick={this.switchAttrPop}>
            <View className='t'>
              {
                orderObj.checkedSpecText ? orderObj.checkedSpecText : <Text className="tips">{choosePackage}</Text>
              }
            </View>
            <Text className='at-icon at-icon-chevron-right'></Text>
          </View> */}



          <View className='section-nav section-attr' onClick={this.handleToCoupons.bind(this)}>
            <View className='t'>
              {
                orderObj.coupons ? <View className="coupons">{orderObj.coupons}</View> : <Text className="tips">请选择优惠券</Text>
              }
            </View>
            <Text className='at-icon at-icon-chevron-right'></Text>
          </View>


          <View className="recommend_list">
            <View className="header">
              <Text className="title">为您推荐</Text>
              <Text className="check_all" onClick={this.handleToProduct.bind(this)}>查看全部<Text className='at-icon at-icon-chevron-right'></Text></Text>
            </View>
            <ScrollView scrollX scrollWithAnimation className="scroll_view">
              {
                likeList.map(item => {
                  return <Navigator openType="redirect" url={`/pages/goods/goods?id=${item.id}`} key={item.id} className="item" >
                    <Text className="num">{item.tag}</Text>
                    <Image className='icon' src={'http://app.zuyuanzhang01.com/' + item.title_pic}></Image>
                    <Text className='txt'>{item.name}</Text>
                    <Text className="money">￥{item.price}</Text>
                  </Navigator>
                })
              }
            </ScrollView>
          </View>
          <View className="goods_detils">
            <AtSegmentedControl
              values={['商品详情', '租赁说明', '租赁规则']}
              onClick={this.handleClick.bind(this)}
              current={current}
            />
            {
              nodes && current === 0
                ? <View className='tab-content'><RichText nodes={nodes} /></View>
                : null
            }
            {
              current === 1
                ? <View className='tab-content'>
                  <Image className='in_img' mode="widthFix" src="http://app.zuyuanzhang01.com/shop_app/goods/in1.jpg" />
                  <Image className='in_img' mode="widthFix" src="http://app.zuyuanzhang01.com/shop_app/goods/in2.jpg" />
                  <Image className='in_img' mode="widthFix" src="http://app.zuyuanzhang01.com/shop_app/goods/in3.jpg" />
                </View>
                : null
            }
            {
              zlNodex && current === 2
                ? <View className='tab-content'><RichText nodes={zlNodex} /></View>
                : null
            }
          </View>

        </View>

        {
          openAttr === true ?
            <View className='attr-pop-box'>
              <View className='attr-pop'>
                <View className='close' onClick={this.closeAttr}>
                  <View className='at-icon at-icon-close'></View>
                </View>
                <View className='img-info'>
                  <View className="tag-box">
                    <Image className='img' src={'http://app.zuyuanzhang01.com/' + currentObj.pic}>
                    </Image>
                  </View>
                  <View className='info'>
                    <View className='c'>
                      <View className='p'>￥{currentObj.dayItem[currDay].monery}元/天</View>
                      <View className='total'>总租金：￥{Math.round(currentObj.dayItem[currDay].monery * currentObj.dayItem[currDay].day)}</View>
                      <View className='buy'>买断金：￥{currentObj.dayItem[currDay].full_money}</View>
                    </View>
                  </View>
                </View>
                <View className='spec-con'>
                  <View className='spec-item'>
                    <View className='name'>套餐</View>
                    <View className="package">
                      {
                        goodsInfo.itemList && goodsInfo.itemList.map((item, index) => {
                          return <View className={`value ${currentPack === index ? 'selected' : ''}`} onClick={() => this.clickSkuValue(item, index)}>{item.name}</View>
                        })
                      }
                    </View>
                  </View>
                </View>
                <View className='spec-con rent_day'>
                  <View className='spec-item'>
                    <View className='name'>租用天数（最少30天，最多365天）</View>
                    <View className="package">
                      {
                        currentObj.dayItem && currentObj.dayItem.map((item, index) => {
                          return <View className={`value ${currDay === index ? 'selected' : ''}`} onClick={() => this.handleSelectDay(item, index)}>{item.day + '天'}</View>
                        })
                      }
                    </View>
                  </View>
                </View>
                <View className="btn_rent" onClick={this.handleRent.bind(this)}>立即租用</View>
              </View>
            </View>
            : ""
        }

        <View className='bottom-btn'>
          <View className='l l-cart' onClick={this.handleSwitchIndex}>
            <Image src="http://app.zuyuanzhang01.com/shop_app/goods/home.png"></Image>
            首页
          </View>
          <View className='l l-cart' onClick={this.handleToStore.bind(this, goodsInfo.dId)}>
            <Image src="http://app.zuyuanzhang01.com/shop_app/goods/shape.png"></Image>
            店铺
          </View>
          <View className='l l-cart'>
            <Image src="http://app.zuyuanzhang01.com/shop_app/goods/customer.png"></Image>
            客服
          </View>
          {userInfo.avatar ? <View className='c' onClick={this.addFast}>免押租赁</View> :
            <Button
              openType="getAuthorize"
              scope="userInfo"
              onClick={this.onGetAuthorize.bind(this)}
              type="primary"
              className="c"
            >
              免押租赁
           </Button>}
        </View>
      </Block>
    );
  }
}
export default Goods;
