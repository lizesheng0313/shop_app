import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View, Swiper, SwiperItem, Button, Navigator, Text, Block, Input, Image, RichText } from '@tarojs/components';
import { AtSegmentedControl } from 'taro-ui';
import { getGoodsDetails, apiRandShop } from '../../services/goods';
import { apiRegisterUser } from "../../services/user"
import parse from 'mini-html-parser2';

import home from "../../assets/images/goods/home.png"
import shape from "../../assets/images/goods/shape.png"
import customer from "../../assets/images/goods/customer.png"
import zm from "../../assets/images/goods/zm.png"

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
    choosePackage: "请选择规格",
    goods: {},
    attribute: [],
    issueList: [],
    comment: {},
    brand: {},
    specificationList: [],
    productList: [],
    relatedGoods: [],
    cartGoodsCount: 0,
    userHasCollect: 0,
    number: 1,
    tmpSpecText: '请选择规格数量',
    checkedSpecPrice: 0,
    openAttr: false,
    openShare: false,
    collect: false,
    shareImage: '',
    canWrite: false, //用户是否获取了保存相册的权限
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
    }
  }

  componentWillMount() {

  }

  componentDidMount() {
    this.fetchGoodsInfo();
    this.fetchRandList()
  }

  fetchGoodsInfo = () => {
    getGoodsDetails({
      id: this.$router.params.id
    }).then(res => {
      this.setState({
        goodsInfo: res.data,
        currentObj: res.data.itemList[0]
      })
      parse(res.data.content, (err, nodes) => {
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

  componentDidShow() { }

  switchAttrPop = () => {
    if (this.state.openAttr == false) {
      this.setState({
        openAttr: !this.state.openAttr
      });
    }
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
    console.log(item)
    this.setState({
      currentPack: index,
      currentObj: item,
      currDay: 0
    })
  }

  cutNumber = () => {
    this.setState({
      number: (this.state.number - 1 > 1) ? this.state.number - 1 : 1
    });
  }

  addNumber = () => {
    this.setState({
      number: this.state.number + 1
    });
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
    const { userInfo } = this.props
    if (this.state.choosePackage === "请选择规格") {
      this.setState({
        openAttr: true
      })
      return;
    }
    Taro.navigateTo({
      url: '/pages/payDetails/index?details='+this.state.orderDetails
    });
  }
  //租用
  handleRent() {
    if (this.state.choosePackage === "请选择规格") {
      this.setState({
        choosePackage: this.state.currentObj.name
      })
    }
    this.state.orderDetails.countPrice = this.state.currentObj.dayItem[this.state.currDay].monery * this.state.currentObj.dayItem[this.state.currDay].day
    this.setState({
      openAttr: false,
    })

  }

  async onGetAuthorize(res) {
    const { user_id, dispatch, userInfo } = this.props
    let user_info = await Taro.getOpenUserInfo()
    user_info = JSON.parse(user_info.response).response
    await apiRegisterUser({
      user_id,
      avatar: user_info.avatar,
      nickName: user_info.nickName
    })
    await dispatch({ type: 'user/apiFindUserByUserId', payload: user_id })
  }


  render() {
    const { userInfo } = this.props
    const { choosePackage, current, nodes, currentObj, tagInfo, goodsInfo, openAttr, goods, orderObj, likeList } = this.state;
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
            <Image src={zm} className="zm_icon"></Image>
          </View>

          <View className='goods-info'>
            <View className='price'>￥{currentObj.price}</View>
            <View className="tag">
              {
                goodsInfo.tag.map((item => {
                  return <Text>{item}</Text>
                }))
              }
            </View>
            <View className='title'>{currentObj.name}</View>
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


          <View className='section-nav section-attr' onClick={this.switchAttrPop}>
            <View className='t'>
              {
                orderObj.checkedSpecText ? orderObj.checkedSpecText : <Text className="tips">{choosePackage}</Text>
              }
            </View>
            <Text className='at-icon at-icon-chevron-right'></Text>
          </View>



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
              <Text className="check_all">查看全部<Text className='at-icon at-icon-chevron-right'></Text></Text>
            </View>
            <ScrollView scrollX scrollWithAnimation className="scroll_view">
              {
                likeList.map(item => {
                  return <Navigator openType="redirect" url={`/pages/goods/goods?id=${item.id}`} key={item.id} className="item" >
                    <Text className="num">{item.tag}</Text>
                    <Image className='icon' src={'http://app.zuyuanzhang01.com/' + item.title_pic}></Image>
                    <Text className='txt'>{item.name}</Text>
                    <Text className="money">￥{item.price}/<Text className="symbol">{item.day}</Text></Text>
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
                ? <View className='tab-content'>标签2的内容</View>
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
          <View className='attr-pop-box' style={{ display: !openAttr ? 'none' : 'block' }}>
            <View className='attr-pop'>
              <View className='close' onClick={this.closeAttr}>
                <View className='at-icon at-icon-close'></View>
              </View>
              <View className='img-info'>
                <View className="tag-box">
                  <Image className='img' src={'http://app.zuyuanzhang01.com/' + currentObj.pic}>
                  </Image>
                  <Text className="tag">{goodsInfo.old_new_type}</Text>
                </View>
                <View className='info'>
                  <View className='c'>
                    <View className='p'>￥{currentObj.dayItem[currDay].monery}元/天</View>
                    <View className='total'>总租金：￥{currentObj.dayItem[currDay].monery * currentObj.dayItem[currDay].day}</View>
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
        }

        <View className='bottom-btn'>
          <View className='l l-cart' onClick={this.handleSwitchIndex}>
            <Image src={home}></Image>
            首页
          </View>
          <View className='l l-cart' onClick={this.handleToStore.bind(this, goodsInfo.id)}>
            <Image src={shape}></Image>
            店铺
          </View>
          <View className='l l-cart'>
            <Image src={customer}></Image>
            客服
          </View>

          {userInfo.nickName ? <View className='c' onClick={this.addFast}>免押租赁</View> :
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
