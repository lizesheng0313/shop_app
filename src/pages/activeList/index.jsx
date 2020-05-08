import Taro, { PureComponent } from '@tarojs/taro'
import { View, Text, Navigator, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux';
import { AtDrawer } from 'taro-ui'
import { get as getGlobalData } from '../../global_data';

//图片
import active1 from "../../assets/images/activeList/active1.png"
import icon from "../../assets/images/activeList/icon.png"
import active2 from "../../assets/images/activeList/active2.jpg"

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
    }
  }

  config = {
    navigationBarTitleText: '产品列表',
  }

  componentDidMount() {
    // this.getData();
  }

  getData = () => {

  }

  componentWillMount() {

  }

  onClose() {
    this.setState({
      show: false
    })
  }

  render() {
    const { data } = this.props;
    return (
      <View className='container'>
        <Image src={active1} className="header_image"></Image>
        <View className="back">
          <Image src={icon} className="icon"></Image>
          <Text className="txt">爆款电脑</Text>
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
        </View>
      </View >
    )
  }
}

export default Index
