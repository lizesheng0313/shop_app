import Taro, { Component, clearStorage } from '@tarojs/taro';
import { View, Text, Button, Image, Picker } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtInput, AtForm, AtButton } from 'taro-ui'
import './index.less';
import { actoinSendSub } from "../../../services/order"

class Index extends Component {
  state = {
    orderDetails: {},
    name: "请选择快递公司",
    queryObj: {
      order_id:"",
      express_name: "",
      express_code: "",
    },
    selector: [
      {
        name: "京东",
        value: "jd"
      },
      {
        name: "顺风",
        value: "shunfeng"
      },
      {
        name: "德邦",
        value: "debangwuliu"
      }],
    index: 0,
  }

  config = {
    'navigationBarTitleText': '退租单'
  }

  componentDidMount() {
    this.setState({
      orderDetails: JSON.parse(this.$router.params.orderDetails)
    },()=>{
      this.state.queryObj.order_id = this.state.orderDetails.id;
      console.log(this.state.orderDetails)
    })
  }

  handleChangeExpress(e) {
    let name = this.state.selector[e.detail.value].name;
    let value = this.state.selector[e.detail.value].value;
    let data = Object.assign({}, this.state.queryObj, { express_name: value })
    this.setState({
      name,
      queryObj: data
    })
  }

  onSubmit() {
    if (!this.state.queryObj.express_name) {
      Taro.showToast({
        title: '请选择快递公司'
      })
      return;
    }
    if (!this.state.queryObj.express_code) {
      Taro.showToast({
        title: '请输入快递单号'
      })
      return;
    }
    Taro.showLoading({
      title: '提交中'
    })
    actoinSendSub(this.state.queryObj).then(res => {
      Taro.showToast({
        title: '退租中'
      })
      Taro.navigateBack();
    })
  }



  handleChange(e, value) {
    let data = Object.assign({}, this.state.queryObj, { [e]: value })
    this.setState({
      queryObj: data
    })
  }

  render() {
    const { queryObj, orderDetails, selector, name } = this.state
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
            <Image className="image" src={'https://app.zuyuanzhang01.com/' + orderDetails.goodItemPic}></Image>
            <View className="goods_details_right">
              <View className="title">{orderDetails.goodName}</View>
              <View className="sp">规格：{orderDetails.goodItemName}</View>
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
            <View className="auth_input refund_picker">
              <Picker
                range="value"
                range-key="name"
                range={selector}
                onChange={this.handleChangeExpress}
                value={this.state.index}
              >
                <View>
                  <Text className="express_title">快递公司</Text>
                  <Text className="express_value">{name}</Text>
                </View>
              </Picker>
            </View>
            <View className="auth_input">
              <AtInput
                title='快递单号'
                type='text'
                placeholder='请输入快递单号'
                placeholderClass="place_class"
                value={queryObj.certNo}
                onChange={this.handleChange.bind(this, 'express_code')}
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
