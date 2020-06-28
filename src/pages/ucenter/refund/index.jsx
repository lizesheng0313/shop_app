import Taro, { Component, clearStorage } from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtInput, AtForm, AtButton, AtToast } from 'taro-ui'
import './index.less';
import name from "../../../assets/images/mine/name.png"
import reset from "../../../assets/images/mine/reset.png"
import { actionrealPersonCreate, actionUserUpdate } from "../../../services/user"

@connect(({ user }) => ({
  userInfo: user.userInfo,
  user_id: user.user_id
}))

class Index extends Component {
  state = {
    orderDetails: "",
    queryObj: {
      certName: "",
      certNo: "",
    }
  }

  config = {
    'navigationBarTitleText': '退租单'
  }

  componentDidMount() {
    this.setState({
      orderDetails: this.$router.params.orderDetails
    })
  }

  onSubmit() {
    let that = this;
    const { dispatch, user_id } = this.props
    if (!this.state.queryObj.certName) {
      Taro.showToast({
        title: '请输入快递公司'
      })
      return;
    }
    if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.state.queryObj.certNo)) {
      Taro.showToast({
        title: '请输入快递单号'
      })
      return;
    }
    Taro.showLoading({
      title: '提交中'
    })
  }



  handleChange(e, value) {
    let data = Object.assign({}, this.state.queryObj, { [e]: value })
    this.setState({
      queryObj: data
    })
  }

  render() {
    const { userInfo } = this.props
    const { queryObj,orderDetails } = this.state
    return (
      <View className="refund">
        <View className="first_title">设备退还地址</View>
        <View className="adress_info">
          <View>
            <Text className="title">收件人：</Text>
            <Text>梁青山</Text>
          </View>
          <View>
            <Text className="title">联系电话：</Text>
            <Text>18610223553</Text>
          </View>
          <View>
            <Text className="title">收货地址：</Text>
            <Text>北京市昌平区关环岛西关科技孵化中心4层404</Text>
          </View>
        </View>
        <View className="first_title">设备信息</View>
        <View className="goods_details">
          <View className="flex-start_center ">
            <Image className="image" src={'https://app.zuyuanzhang01.com/' + orderDetails.pic}></Image>
            <View className="goods_details_right">
              <View className="title">{orderDetails.goodsName}</View>
              <View className="sp">规格：{orderDetails.name}</View>
              <View className="total">总租金: ￥{orderDetails.countPrice}</View>
            </View>
          </View>
        </View>
        <View className="first_title">发货人信息</View>
        < AtForm
          className='realname-auth container'
          onSubmit={this.onSubmit.bind(this)}
        >
          <View className="auth_box">
            <View className="auth_input">
              <AtInput
                title='快递公司'
                type='text'
                className="name"
                placeholder='请输入快递公司'
                value={queryObj.certName}
                placeholderClass="place_class"
                onChange={this.handleChange.bind(this, 'certName')}
              />
            </View>
            <View className="auth_input">
              <AtInput
                title='快递单号'
                type='text'
                placeholder='请输入快递单号'
                placeholderClass="place_class"
                value={queryObj.certNo}
                onChange={this.handleChange.bind(this, 'certNo')}
              />
            </View>
          </View>
          <AtButton formType='submit' className="btn_submit">提交</AtButton>
        </AtForm >
      </View>
    );
  }
}
export default Index
