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
      email:"",
      certName: "",
      certNo: "",
      returnUrl: "/pages/ucenter/realnameAuth/index",
    }
  }

  config = {
    'navigationBarTitleText': '实名认证'
  }

  componentDidMount() {
    const { userInfo } = this.props;
    if (userInfo.card_num) {
      const { card_num, name,email } = userInfo
      let data = Object.assign({}, this.state.queryObj, { certName: name, certNo: card_num,email })
      this.setState({
        queryObj: data
      })
    }
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
        title: '请输入正确的身份证号'
      })
      return;
    }
    
    if (!/^([a-zA-Z]|[0-9]).+(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(this.state.queryObj.email)) {
      Taro.showToast({
        title: '请输入正确的邮箱'
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
              email:that.state.queryObj.email,
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
              disabled={userInfo.card_num}
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
              disabled={userInfo.card_num}
              placeholder='请输入身份证号码'
              placeholderClass="place_class"
              value={queryObj.certNo}
              onChange={this.handleChange.bind(this, 'certNo')}
            />
          </View>
          <View className="auth_input">
            <AtInput
              name='email'
              border={false}
              editable={false}
              title='邮箱'
              type='text'
              placeholder='请输入邮箱'
              placeholderClass="place_class"
              value={queryObj.email}
            />
          </View>
        </View>
        {
          userInfo.card_num ? "" :
            <View>
              <AtButton formType='submit' className="btn_submit">提交</AtButton>
            </View>
        }
      </AtForm >
    );
  }
}
export default Index
