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
    countDown: "点击获取",
    queryObj: {
      certName: "",
      certNo: "",
      returnUrl: "/pages/ucenter/realnameAuth/index",
    }
  }

  config = {
    'navigationBarTitleText': '实名认证'
  }

  onSubmit() {
    let that = this;
    const { dispatch, user_id } = this.props
    if (!this.state.queryObj.certName) {
      Taro.showToast({
        title: '请输入姓名'
      })
      return;
    }
    if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.state.queryObj.certNo)) {
      Taro.showToast({
        title: '请输入身份证号'
      })
      return;
    }
    Taro.showLoading({
      title: '提交中'
    })
    actionrealPersonCreate(this.state.queryObj).then(res => {
      Taro.hideLoading()
      my.startAPVerify({
        url: res.data.certifyUrl,
        certifyId: res.data.certifyId,
        success: async function (res) {
          if (res.resultStatus === "9000") {
            await actionUserUpdate({
              user_id,
              card_num: that.state.queryObj.certNo,
              name: that.state.queryObj.certName,
            })
            await dispatch({ type: 'user/apiFindUserByUserId', payload: user_id }).then(res => {
              Taro.navigateBack()
            })
          }
        },
        fail: function (err) {
          Taro.showToast({
            title: '系统错误，请重新认证'
          })
          console.log('fail', err)
        }
      })
    })
  }



  handleChange(e, value) {
    let data = Object.assign({}, this.state.queryObj, { [e]: value })
    this.setState({
      queryObj: data
    })
  }



  // handleGetCode() {
  //   if (this.state.countDown !== "点击获取") {
  //     return
  //   }
  //   this.setState({
  //     countDown: 60
  //   })
  //   let countDown = 60;
  //   let timer = ""
  //   if (!timer) {
  //     timer = setInterval(() => {
  //       if (countDown > 1 && countDown <= 60) {
  //         countDown--;
  //         this.setState({
  //           countDown
  //         })
  //       } else {
  //         this.setState({
  //           count: "点击获取"
  //         })
  //         clearInterval(timer)
  //         timer = null
  //       }
  //     }, 1000)
  //   }
  // }

  render() {
    const { userInfo } = this.props
    const { queryObj } = this.state
    return (
      < AtForm
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
              value={queryObj.certName}
              placeholderClass="place_class"
              onChange={this.handleChange.bind(this, 'certName')}
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
              value={queryObj.certNo}
              onChange={this.handleChange.bind(this, 'certNo')}
            />
          </View>
          {/* <View className="auth_input">
            <AtInput
              name='phone'
              border={false}
              editable={false}
              title='手机号'
              type='phone'
              placeholder='请输入手机号'
              placeholderClass="place_class"
              value={userInfo.bind_phone}
            />
          </View> */}
        </View>
        <AtButton formType='submit' className="btn_submit">提交</AtButton>
        <View className="tips">认证即表示阅读并同意<Text className="t">《用户注册协议》</Text></View>
      </AtForm >
    );
  }
}
export default Index
