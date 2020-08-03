import Taro, { PureComponent } from '@tarojs/taro'
import { View, Text, Navigator, Swiper, SwiperItem, Image, ScrollView, Block, Input } from '@tarojs/components'
import { connect } from '@tarojs/redux';
import { get as getGlobalData } from '../../global_data';
import { apiGetType, apiGetShop } from '../../services/catalog';
import { apiGetDP } from "../../services/goods"
import Customer from '../../components/customer'



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
      storePhoneInfo: {
        service_tel: "",
        isDp: true
      },
      isShowCustomer: false,
      likeList: [],
      currentBrand: 0,
      list: []
    }
  }

  config = {
    navigationBarTitleText: '店铺',
  }

  componentDidShow() {
    this.getData();
    this.getStoreInfo()
  }

  getData = () => {
    apiGetType({ id: this.$router.params.id }).then(res => {
      this.setState({
        likeList: res.data
      })
      this.getStoreList(res.data[0].id, 0)

    })
  }

  getStoreList = (id, index) => {
    apiGetShop({ type_id: id, id: this.$router.params.id }).then(res => {
      this.setState({
        list: res.data,
        currentBrand: index
      })
    })
  }

  getStoreInfo = () => {
    apiGetDP({
      id: this.$router.params.id
    }).then(res => {
      const { service_tel } = res.data;
      const { storePhoneInfo } = this.state;
      this.setState({
        storePhoneInfo: {
          ...storePhoneInfo,
          service_tel
        }
      })

    })
  }

  handleCloseCumster() {
    this.setState({
      isShowCustomer: false
    })
  }


  handleShowCustomer() {
    this.setState({
      isShowCustomer: true
    })
  }

  render() {
    const { likeList, currentBrand, isShowCustomer, storePhoneInfo } = this.state;
    return (
      <View className='container'>
        {
          isShowCustomer ? <Customer storePhoneInfo={storePhoneInfo} handleCloseCumster={this.handleCloseCumster.bind(this)}></Customer> : ""
        }
        <View className="header">
          <Image src={back} className="back" />
        </View>
        <Image src={service} className="service" onClick={this.handleShowCustomer.bind(this)}></Image>
        <View className="like">
          <ScrollView scrollX scrollWithAnimation className="scroll_view">
            {
              likeList.map((item, index) => {
                return <View className="like_type" onClick={this.getStoreList.bind(this, item.id, index)}>
                  <Text className={`top ${currentBrand === index ? 'active' : ''}`}>
                    <Image src={'http://app.zuyuanzhang01.com/' + item.type_img} />
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
