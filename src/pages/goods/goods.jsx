import Taro, { Component } from '@tarojs/taro';
import { View, Swiper, SwiperItem, Button, Navigator, Text, Block, Input, Image, RichText } from '@tarojs/components';
import { AtSegmentedControl } from 'taro-ui';
import { getGoodsDetail, getGoodsRelated } from '../../services/goods';
import { getCartGoodsCount } from '../../services/cart';


import home from "../../assets/images/goods/home.png"
import shape from "../../assets/images/goods/shape.png"
import customer from "../../assets/images/goods/customer.png"
import zm from "../../assets/images/goods/zm.png"



import './index.less';

class Goods extends Component {

  config = {
    navigationBarTitleText: '商品详情'
  }

  state = {
    canShare: false,
    id: 0,
    goods: {},
    groupon: [], //该商品支持的团购规格
    grouponLink: {}, //参与的团购
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
    isGroupon: false, //标识是否是一个参团购买
    soldout: false,
    canWrite: false, //用户是否获取了保存相册的权限


    goodsInfo: {
      price: '25/天',
      title: "【全新国行】ThinkPad X1c 极速版14英寸笔记本电脑",
      xiao: "3061",
      kd: "包邮",
      info: [
        "免押金",
        "分期月付",
        "可续租",
        "可买断"
      ],
      tag: [
        "大连发货",
        '全新',
        '好用'
      ]
    },
    orderObj: {
      checkedSpecText: '',
      coupons: ""
    },
    current: 0,
    likeList: [
      { id: 123, picUrl: "", name: 'Iphone8PLUS 95新' },
      { id: 123, picUrl: "", name: 'Iphone8PLUS 95新' },
      { id: 123, picUrl: "", name: 'Iphone8PLUS 95新' },
      { id: 123, picUrl: "", name: 'Iphone8PLUS 95新' },
      { id: 123, picUrl: "", name: 'Iphone8PLUS 95新' },
      { id: 123, picUrl: "", name: 'Iphone8PLUS 95新' }
    ],
    specifInfo: {
      tag: "全新",
      price: "21.5/天",
      total_rent: "￥11800",
      month_rent: "￥700",
      money: "￥800",
      color: ["黑色", '白色'],
      package: ["套餐一", "套餐二"]
    }
  }

  componentWillMount() {

  }
  componentDidMount() {
    const id = 1181000;
    if (id) {
      this.setState({
        id: parseInt(id),
      }, () => {
        this.getGoodsInfo();
      })
    }
  }

  componentDidShow() {
    // // 页面显示
    // getCartGoodsCount().then(res => {
    //   this.setState({
    //     cartGoodsCount: res || 0
    //   });
    // })
  }



  getGoodsInfo = () => {
    const { id } = this.state;
    getGoodsDetail(id).then(res => {
      console.log('----res--------', res);

      let _specificationList = res.specificationList
      // 如果仅仅存在一种货品，那么商品页面初始化时默认checked
      if (_specificationList.length == 1) {
        if (_specificationList[0].valueList.length == 1) {
          _specificationList[0].valueList[0].checked = true

          // 如果仅仅存在一种货品，那么商品价格应该和货品价格一致
          // 这里检测一下
          let _productPrice = res.productList[0].price;
          let _goodsPrice = res.info.retailPrice;
          if (_productPrice != _goodsPrice) {
            console.error('商品数量价格和货品不一致');
          }

          this.setState({
            checkedSpecText: _specificationList[0].valueList[0].value,
            tmpSpecText: '已选择：' + _specificationList[0].valueList[0].value,
          });
        }
      }

      res.info.detail2 = res.info.detail.replace(/style=\"\"/gi, `style="width: 100%;height: ${Taro.pxTransform(375)}"`)

      this.setState({
        goods: res.info,
        attribute: res.attribute,
        issueList: res.issue,
        comment: res.comment,
        brand: res.brand,
        specificationList: res.specificationList,
        productList: res.productList,
        userHasCollect: res.userHasCollect,
        shareImage: res.shareImage,
        checkedSpecPrice: res.info.retailPrice,
        groupon: res.groupon,
        canShare: res.share,
      });

      //如果是通过分享的团购参加团购，则团购项目应该与分享的一致并且不可更改
      if (this.state.isGroupon) {
        let groupons = this.state.groupon;
        for (var i = 0; i < groupons.length; i++) {
          if (groupons[i].id != this.state.grouponLink.rulesId) {
            groupons.splice(i, 1);
          }
        }
        groupons[0].checked = true;
        //重设团购规格
        this.setState({
          groupon: groupons
        });

      }

      this.setState({
        collect: res.userHasCollect == 1
      });

      // WxParse.wxParse('goodsDetail', 'html', res.info.detail, that);
      //获取推荐商品
      setTimeout(() => {
        this.getGoodsRelated();
      }, 5)

    });
  }

  getGoodsRelated = () => {
    const { id } = this.state;

    getGoodsRelated(id).then(res => {
      this.setState({
        relatedGoods: res.list,
      });
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

  //获取选中的规格信息
  getCheckedSpecValue = () => {
    let checkedValues = [];
    let _specificationList = this.state.specificationList;
    for (let i = 0; i < _specificationList.length; i++) {
      let _checkedObj = {
        name: _specificationList[i].name,
        valueId: 0,
        valueText: ''
      };
      for (let j = 0; j < _specificationList[i].valueList.length; j++) {
        if (_specificationList[i].valueList[j].checked) {
          _checkedObj.valueId = _specificationList[i].valueList[j].id;
          _checkedObj.valueText = _specificationList[i].valueList[j].value;
        }
      }
      checkedValues.push(_checkedObj);
    }

    return checkedValues;
  }

  isCheckedAllSpec = () => {
    return !this.getCheckedSpecValue().some(function (v) {
      if (v.valueId == 0) {
        return true;
      }
    });
  }

  getCheckedProductItem = (key) => {
    return this.state.productList.filter(function (v) {
      if (v.specifications.toString() == key.toString()) {
        return true;
      } else {
        return false;
      }
    });
  }

  getCheckedSpecKey = () => {
    let checkedValue = this.getCheckedSpecValue().map(function (v) {
      return v.valueText;
    });
    return checkedValue;
  }



  clickSkuValue = (data) => {
    console.log(data)
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

  addFast = () => {

  }

  render() {
    const { goodsInfo, specifInfo, soldout, openAttr, goods, orderObj } = this.state;
    return (
      <Block>
        <View className='container'>

          <Swiper className='goodsimgs' indicator-dots='true' autoplay='true' interval='3000' duration='1000'>
            {Array.isArray(goods.gallery) && goods.gallery.map(item => {
              return <SwiperItem key={item}>
                <Image className='img' src={item} background-size='cover'></Image>
              </SwiperItem>
            })}
          </Swiper>

          <View>
            <Image src={zm} className="zm_icon"></Image>
          </View>

          <View className='goods-info'>
            <View className='price'>￥{goodsInfo.price}</View>
            <View className="tag">
              {
                goodsInfo.tag.map((item => {
                  return <Text>{item}</Text>
                }))
              }
            </View>
            <View className='title'>{goodsInfo.title}</View>
            <View className="courier flex-space_center">
              <View>销量:{goodsInfo.xiao}件</View>
              <View>{goodsInfo.kd}</View>
            </View>
            <View className="other_info">
              {
                goodsInfo.info.map((item => {
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
                orderObj.checkedSpecText ? orderObj.checkedSpecText : <Text className="tips">请选择规格</Text>
              }
            </View>
            <Text className='at-icon at-icon-chevron-right'></Text>
          </View>



          <View className='section-nav section-attr'>
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
                this.state.likeList.map(item => {
                  return <Navigator url={`/pages/category/category?id=${item.id}`} key={item.id} className="item" >
                    <Text className="num">95新</Text>
                    <Image className='icon' src={item.picUrl}></Image>
                    <Text className='txt'>{item.name}</Text>
                    <Text className="money">￥8/<Text className="symbol">天</Text></Text>
                  </Navigator>
                })
              }
            </ScrollView>
          </View>

          {/* <View className='detail'>
            {goods.detail && <RichText style={{ fontSize: 0 }} nodes={goods.detail2} />}
          </View> */}
          <View className="goods_detils">
            <AtSegmentedControl
              values={['商品详情', '租赁说明', '租赁规则']}
              onClick={this.handleClick.bind(this)}
              current={this.state.current}
            />
            {
              this.state.current === 0
                ? <View className='tab-content'>标签1的内容</View>
                : null
            }
            {
              this.state.current === 1
                ? <View className='tab-content'>标签2的内容</View>
                : null
            }
            {
              this.state.current === 2
                ? <View className='tab-content'>标签3的内容</View>
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
                  <Image className='img' src={goods.picUrl}>
                  </Image>
                  <Text className="tag">{specifInfo.tag}</Text>
                </View>
                <View className='info'>
                  <View className='c'>
                    <View className='p'>￥{specifInfo.price}</View>
                    <View className='total'>总租金：￥{specifInfo.total_rent}</View>
                    <View className='month'>月租金：￥{specifInfo.month_rent}</View>
                    <View className='buy'>买断金：￥{specifInfo.money}</View>
                  </View>
                </View>
              </View>
              <View className='spec-con'>
                <View className='spec-item'>
                  <View className='name'>套餐</View>
                  <View className="package">
                    {
                      Array.isArray(specifInfo.package) && specifInfo.package.map(item => {
                        return <View className={`value ${item.checked ? 'selected' : ''}`} onClick={() => this.clickSkuValue(item)}>{item}</View>
                      })
                    }
                  </View>
                </View>
              </View>
              <View className="btn_rent">立即租用</View>
            </View>
          </View>
        }

        <View className='bottom-btn'>
          <View className='l l-cart' onClick={this.handleSwitchIndex}>
            <Image src={home}></Image>
            首页
          </View>
          <View className='l l-cart'>
            <Image src={shape}></Image>
            店铺
          </View>
          <View className='l l-cart'>
            <Image src={customer}></Image>
            客服
          </View>
          {!soldout && <View className='c' onClick={this.addFast}>免押租赁</View>}
        </View>
      </Block>
    );
  }
}
export default Goods;
