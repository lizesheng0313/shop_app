import Taro, { PureComponent } from '@tarojs/taro'
import { View, Text, Navigator, Swiper, SwiperItem, Image, ScrollView, Block, Input } from '@tarojs/components'
import { connect } from '@tarojs/redux';
import { get as getGlobalData } from '../../global_data';
import { apiGetType, apiGetShop } from '../../services/catalog';



//图片
import back from "../../assets/images/store/back.png"
import phone from "../../assets/images/home/sb.png"
import service from "../../assets/images/store/service.png"

import './index.less'

// @connect(({ home }) => ({
//   data: home.data
// }))

class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      likeList: [],
      list: []
    }
  }

  config = {
    navigationBarTitleText: '店铺',
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    apiGetType({ id: this.$router.params.id }).then(res => {
      this.setState({
        likeList: res.data
      })
    })
  }

  getStoreList = (id) => {
    apiGetShop({ type_id: id, id: this.$router.params.id }).then(res => {
      this.setState({
        list: res.data
      })
    })
  }

  render() {
    const { likeList } = this.state;
    return (
      <View className='container'>
        <View className="header">
          <Image src={back} className="back" />
        </View>
        <Image src={service} className="service"></Image>
        <View className="like">
          <ScrollView scrollX scrollWithAnimation className="scroll_view">
            {
              likeList.map(item => {
                return <View className="like_type" onClick={this.getStoreList.bind(this, item.id)}>
                  <Text className="top">
                    <Image src={'http://app.zuyuanzhang01.com/' + item.likeList} />
                  </Text>
                  <Text className="title">{item.name}</Text>
                </View>
              })
            }
          </ScrollView>
        </View>
        <View className="recommended_list">
          {
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
                    <Text className="price"><Text className="icon">￥</Text>{item.price}<Text className="start">起</Text></Text>
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
