import Taro, { PureComponent } from '@tarojs/taro'
import { View, Text, Navigator, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux';
import { apiFindActiveList } from '../../services/catalog';

//图片

import './index.less'

@connect(({ home }) => ({
  data: home.data,
}))

class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      show: false,
      list: []
    }
  }

  config = {
    navigationBarTitleText: '活动列表',
  }

  componentDidMount() {
    this.fetActiveList();
  }

  fetActiveList = () => {
    apiFindActiveList({
      acId: this.$router.params.id
    }).then(res => {
      this.setState({
        list: res.data
      })
    })
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
        <Image src="http://app.zuyuanzhang01.com/shop_app/activeList/active1.png" className="header_image"></Image>
        <View className="back">
          <Image src="http://app.zuyuanzhang01.com/shop_app/activeList/icon.png" className="header_icon"></Image>
          <Text className="txt">爆款电脑</Text>
          <View className="recommended_list">
            {
              list.map(item => {
                return <View className='item' key={item.id}>
                  <Navigator url={`../goods/goods?id=${item.id}`}>
                    <Image className='img' src={'http://app.zuyuanzhang01.com/' + item.title_pic}></Image>
                    <View className="tag">
                      {item.tag ? <Text>{item.tag}</Text> : ""}
                      {item.address ? <Text>{item.address}</Text> : ""}
                    </View>
                    <Text className='name'>{item.name}</Text>
                    <View className="flex-space_center">
                      <Text className="price"><Text className="icon">￥</Text>{item.price}<Text className="start">起</Text></Text>
                      <Text className="time">{item.day}天起租</Text>
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
