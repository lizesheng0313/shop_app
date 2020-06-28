import Taro, { Component, clearStorage } from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtTimeline } from 'taro-ui'
import './index.less';
import { actionrealPersonCreate, actionUserUpdate } from "../../../services/user"

@connect(({ user }) => ({
  userInfo: user.userInfo,
  user_id: user.user_id
}))

class Index extends Component {
  state = {
    addressInfo: {
      info: '北京朝阳区管庄西里南幸福小区37号楼3单元301',
      title: "百事快递",
      order: '234234234234234'
    }
  }

  config = {
    'navigationBarTitleText': '物流信息'
  }

  componentDidMount() {
    this.setState({
      orderDetails: this.$router.params.orderDetails
    })
  }

  render() {
    const { userInfo } = this.props
    const { addressInfo } = this.state
    return (
      <View className="logistics">
        <View className="info">{addressInfo.info}</View>
        <View className="courier">
          <View class="courier_title">
            {addressInfo.title}
          </View>
          <View class="order">
            {addressInfo.order}
          </View>
          <AtTimeline
            pending
            items={[
              { title: '刷牙洗脸', content: ['大概8:00'], color: 'yellow' },
              { title: '吃早餐', content: ['牛奶+面包'] },
              { title: '上班', content: ['查看邮件'] },
              { title: '睡觉', content: ['不超过23:00'] }
            ]}
          >
          </AtTimeline>
        </View>
      </View>
    );
  }
}
export default Index
