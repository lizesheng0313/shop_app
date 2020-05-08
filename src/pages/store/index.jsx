import Taro, { PureComponent } from '@tarojs/taro'
import { View, Text, Navigator, Swiper, SwiperItem, Image, ScrollView, Block, Input } from '@tarojs/components'
import { connect } from '@tarojs/redux';
import { get as getGlobalData } from '../../global_data';
import { apiFindList } from '../../services/home';

//图片
import back from "../../assets/images/store/back.png"
import phone from "../../assets/images/home/sb.png"
import service from "../../assets/images/store/service.png"

import './index.less'

@connect(({ home, goods }) => ({
  data: home.data,
  goodsCount: goods.goodsCount,
}))

class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
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
    navigationBarTitleText: '店铺',
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

  render() {
    const { data } = this.props;
    return (
      <View className='container'>
        <View className="header">
          <Image src={back} className="back" />
        </View>
        <Image src={service} className="service"></Image>
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
