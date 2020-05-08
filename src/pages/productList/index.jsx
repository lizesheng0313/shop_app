import Taro, { PureComponent } from '@tarojs/taro'
import { View, Text, Navigator, Swiper, SwiperItem, Image, ScrollView, Block, Input } from '@tarojs/components'
import { connect } from '@tarojs/redux';
import { AtDrawer } from 'taro-ui'
import { get as getGlobalData } from '../../global_data';
import { apiFindList } from '../../services/home';

//图片
import phone from "../../assets/images/home/sb.png"

import './index.less'

@connect(({ home, goods }) => ({
  data: home.data,
  goodsCount: goods.goodsCount,
}))

class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      show: false,
      likeList: [
        { title: "iPhone", src: phone },
        { title: "华为", src: phone },
        { title: "左从", src: phone },
        { title: "THink", src: phone },
        { title: "iPhone", src: phone },
        { title: "iPhone", src: phone }
      ],
      quickList: [
        '全新',
        '非全新'
      ],
      tab: [
        {
          title: "综合",
          icon: ""
        },
        {
          title: "价格",
          icon: "icon-shangxiajiantouheise"
        },
        {
          title: "筛选",
          icon: "icon-shaixuan"
        }
      ]
    }
  }

  config = {
    navigationBarTitleText: '产品列表',
  }

  componentDidMount() {
    // this.getData();
  }

  getData = () => {
    apiFindList({ type: 2 }).then(res => {
    })
  }

  componentWillMount() {

  }
  
  onClose() {
    this.setState({
      show: false
    })
  }

  handleToggleTab(index) {
    console.log(index)
    if (index === 2) {
      this.setState({
        show: true
      })
    }
    console.log(this.state.show)
    this.setState({
      current: index
    })
  }

  render() {
    const { data } = this.props;
    const { tab, current, likeList, quickList } = this.state;
    return (
      <View className='container'>
        <View className="header flex-around_center">
          {
            tab.map((item, index) => {
              return <View onClick={this.handleToggleTab.bind(this, index)} className={`item ${current === index ? 'active' : ""}`}>
                {item.title}
                <Text className={`iconfont ${item.icon}`}></Text>
              </View>
            })
          }
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
        <AtDrawer
          show={this.state.show}
          right
          onClose={this.onClose.bind(this)} 
          width="300px"
          mask
        >
          <View className="right_drawer">
            <View>
              <View className="title">品牌专栏</View>
              <View className="like_type">
                {
                  likeList.map(item => {
                    return <View className="top">
                      <Image src={item.src} className="image" />
                    </View>
                  })
                }
              </View>
              <View className="title second_title">快捷筛选</View>
              <View className="like_type">
                {
                  quickList.map(item => {
                    return <View className="top">
                      {item}
                    </View>
                  })
                }
              </View>
              <View className="title second_title">起租日</View>
              <View className="like_type">
                {
                  quickList.map(item => {
                    return <View className="top">
                      {item}
                    </View>
                  })
                }
              </View>
              <View className="footer_button">
                <View className="reset btn">重置</View>
                <View className="submit btn">确定</View>
              </View>
            </View>
          </View>
        </AtDrawer>
      </View >
    )
  }
}

export default Index