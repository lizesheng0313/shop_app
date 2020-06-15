import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtTextarea, AtInput } from 'taro-ui'
import { actionComplaint } from "../../../services/user"
import './index.less';

@connect(({ user }) => ({
  user_id: user.user_id
}))

class Index extends Component {

  config = {
    navigationBarTitleText: '申诉反馈'
  }

  state = {

    value: "",
    phone: ""
  }

  componentDidMount() {

  }

  handleChangePhone(e) {
    this.setState({
      phone: e
    })
  }

  handleChange(e) {
    this.setState({
      value: e.detail.value
    })
  }

  handleToSubmit() {
    const { user_id } = this.props;
    if(!/^[1][3,4,5,7,8][0-9]{9}$/.test(this.state.phone)){
      Taro.showToast({
        title:"请输入正确的手机号"
      })
      return 
    }
    actionComplaint({
      user_id,
      phone: this.state.phone,
      content: this.state.value
    }).then(res => {
      Taro.showToast({
        title: "反馈成功",
        icon: "success"
      })
    })
  }

  render() {
    return (
      <View className='container feedback'>
        <View className="tips">请绑定持卡本人的银行卡</View>
        {
          <AtTextarea
            value={this.state.value}
            onChange={this.handleChange.bind(this)}
            maxLength={140}
            placeholder='客官请详细反馈问题~'
          />
        }

        <View className="contact_phone">
          {
            <AtInput
              name='value'
              title='联系电话'
              type='text'
              placeholder='请输入您的手机号'
              value={this.state.phone}
              onChange={this.handleChangePhone.bind(this)}
            />
          }
        </View>
        <View className="btn_submit" onClick={this.handleToSubmit.bind(this)}>提交</View>
      </View>
    );
  }
}
export default Index;
