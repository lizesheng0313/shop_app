import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { AtTextarea, AtInput } from 'taro-ui'
import './index.less';

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
  } s

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
        <View className="btn_submit">提交</View>
      </View>
    );
  }
}
export default Index;
