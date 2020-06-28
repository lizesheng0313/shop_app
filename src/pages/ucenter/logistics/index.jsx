import Taro, { Component, clearStorage } from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtTimeline } from 'taro-ui'
import './index.less';
import { actionSeachAddress } from "../../../services/order"


class Index extends Component {
  state = {
    addressInfo: {
    },
    list: []
  }

  config = {
    'navigationBarTitleText': '物流信息'
  }

  componentDidMount() {
    actionSeachAddress({
      order_id: this.$router.params.id
    }).then(res => {

      let arr = [];
      res.data.list.forEach(item => {
        arr.push({
          title: item.txt,
          content: [item.ftime]
        })
      })
      this.setState({
        addressInfo: res.data,
        list: arr
      })
    })
  }

  render() {
    const { addressInfo,list } = this.state
    return (
      <View className="logistics">
        <View className="info">{addressInfo.addr.address}</View>
        <View className="courier">
          <View class="courier_title">
            {addressInfo.express_name}
          </View>
          <View class="order">
            {addressInfo.express_code}
          </View>
          <AtTimeline
            pending
            items={list}
          >
          </AtTimeline>
        </View>
      </View>
    );
  }
}
export default Index
