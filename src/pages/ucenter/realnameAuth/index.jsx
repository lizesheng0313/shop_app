import Taro, { Component, clearStorage } from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtInput, AtForm, AtButton, AtToast } from 'taro-ui'
import './index.less';
import name from "../../../assets/images/mine/name.png"
import reset from "../../../assets/images/mine/reset.png"


// @connect(({ home, goods }) => ({
//   data: home.data
// }))

class Index extends Component {
  state = {
    countDown: "点击获取",
    queryObj: {
      name: "",
      idcard: "",
      phone: "",
      card: "",
      code: ""
    }
  }

  config = {
    'navigationBarTitleText': '实名认证'
  }

  componentDidMount() {

  }

  onSubmit() {
    console.log(this.state.queryObj)
  }

  handleChange(e, value) {
    let data = Object.assign({}, this.state.queryObj, { [e]: value })
    this.setState({
      queryObj: data
    })
  }

  handleGetCode() {

    if (this.state.countDown !== "点击获取") {
      return
    }
    this.setState({
      countDown: 60
    })
    let countDown = 60;
    let timer = ""
    if (!timer) {
      timer = setInterval(() => {
        if (countDown > 1 && countDown <= 60) {
          countDown--;
          this.setState({
            countDown
          })
        } else {
          this.setState({
            count: "点击获取"
          })
          clearInterval(timer)
          timer = null
        }
      }, 1000)
    }
  }

  render() {
    return (
      <AtForm
        className='realname-auth container'
        onSubmit={this.onSubmit.bind(this)}
      >
        <View className="auth_box">
          <View className="auth_input">
            <AtInput
              title='姓名'
              type='text'
              className="name"
              placeholder='请输入姓名'
              value={this.state.queryObj.name}
              placeholderClass="place_class"
              onChange={this.handleChange.bind(this, 'name')}
            />
            <Image src={name} className="name" />
          </View>
          <View className="auth_input">
            <AtInput
              name='idcard'
              title='身份证号'
              type='idcard'
              placeholder='请输入身份证号码'
              placeholderClass="place_class"
              value={this.state.queryObj.idcard}
              onChange={this.handleChange.bind(this, 'idcard')}
            />
          </View>
          <View className="auth_input">
            <AtInput
              name='phone'
              border={false}
              title='手机号'
              type='phone'
              placeholder='请输入手机号'
              placeholderClass="place_class"
              value={this.state.queryObj.phone}
              onChange={this.handleChange.bind(this, "phone")}
            />
          </View>
          <View className="auth_input">
            <AtInput
              name='card'
              title='图形验证码'
              type='text'
              placeholder='请输入图形验证码'
              placeholderClass="place_class"
              value={this.state.queryObj.card}
              onChange={this.handleChange.bind(this, 'card')}
            />
            <Image src={reset} className="reset" />
          </View>
          <View className="auth_input">
            <AtInput
              name='code'
              title='短信验证码'
              type='number'
              placeholder='请输入短信验证码'
              placeholderClass="place_class"
              value={this.state.queryObj.code}
              onChange={this.handleChange.bind(this, "code")}
            >
              <Text className="get_code" onClick={this.handleGetCode}>{this.state.countDown}</Text>
            </AtInput>
          </View>
        </View>
        <AtButton formType='submit' className="btn_submit">提交</AtButton>
        <View className="tips">认证即表示阅读并同意<Text className="t">《用户注册协议》</Text></View>
      </AtForm >
    );
  }
}
export default Index
