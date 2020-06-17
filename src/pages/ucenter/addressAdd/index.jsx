import Taro, { Component, clearStorage } from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtInput, AtForm, AtButton, AtToast, AtTextarea, AtSwitch } from 'taro-ui'
import './index.less';
import { actionSaveAddress } from "../../../services/user"
import name from "../../../assets/images/mine/name.png"
import TaroRegionPicker from '../../../components/taro-region-picker'

@connect(({ user }) => ({
  user_id: user.user_id
}))

class Index extends Component {
  state = {
    queryObj: {
      user_id: "",
      name: "",
      phone: "",
      address: "",
      region: "",
      is_default: false,
    },
    address: ""
  }

  config = {
    'navigationBarTitleText': '新建地址'
  }

  componentDidMount() {

  }

  onSubmit() {
    const { user_id } = this.props;
    this.state.queryObj.user_id = user_id
    if (!this.state.queryObj.name) {
      Taro.showToast({
        title: "请输入姓名"
      })
      return
    }
    if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(this.state.queryObj.phone)) {
      Taro.showToast({
        title: "请输入正确的手机号"
      })
      return
    }
    if (!this.state.queryObj.region) {
      Taro.showToast({
        title: "请选择区域"
      })
      return
    }
    if (!this.state.queryObj.address) {
      Taro.showToast({
        title: "请输入详细地址"
      })
      return
    }
    Taro.showLoading({
      title: "保存中"
    })
    actionSaveAddress(this.state.queryObj).then(res => {
      Taro.hideLoading()
      Taro.navigateBack();
    })
  }

  onGetRegion(region) {
    // 参数region为选择的省市区
    this.state.queryObj.region = region
  }

  handleChange(e, value) {
    let data = Object.assign({}, this.state.queryObj, { [e]: value })
    this.setState({
      queryObj: data
    })
  }

  handleAddress(e) {
    let data = Object.assign({}, this.state.queryObj, { address: e.detail.value })
    this.setState({
      queryObj: data
    })
  }
  handleChangeSwitch(e) {
    let data = Object.assign({}, this.state.queryObj, { is_default: e })
    this.setState({
      queryObj: data
    })
  }



  render() {
    const { queryObj, address } = this.state;
    return (
      <View>
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
                value={queryObj.name}
                placeholderClass="place_class"
                onChange={this.handleChange.bind(this, 'name')}
              />
              <Image src={name} className="name" />
            </View>
            <View className="auth_input">
              <AtInput
                name='phone'
                border={false}
                title='手机号'
                type='phone'
                placeholderClass="place_class"
                value={queryObj.phone}
                onChange={this.handleChange.bind(this, "phone")}
              />
            </View>
            <View className="auth_input">
              <TaroRegionPicker onGetRegion={this.onGetRegion.bind(this)} />
            </View>
            <View className="auth_input address_details">
              <Text class="tit">详细地址</Text>
              <AtTextarea
                count={false}
                value={address}
                onChange={this.handleAddress.bind(this)}
                maxLength={200}
              />
            </View>
            <View className="auth_input">
              <AtSwitch title='设为默认地址' color='#F71279' checked={queryObj.is_default} onChange={this.handleChangeSwitch.bind(this)} />
            </View>
          </View>
          <AtButton formType='submit' className="btn_submit">新增地址</AtButton>
        </AtForm >
      </View>
    );
  }
}
export default Index
