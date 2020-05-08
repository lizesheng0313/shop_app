import Taro, { Component, clearStorage } from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtInput, AtForm, AtButton, AtToast, AtTextarea, AtSwitch } from 'taro-ui'
import './index.less';
import name from "../../../assets/images/mine/name.png"
import TaroRegionPicker from '../../../components/taro-region-picker'

// @connect(({ home, goods }) => ({
//   data: home.data
// }))

class Index extends Component {
  state = {
    queryObj: {
      name: "",
      phone: "",
      address: "",
      swtichValue: false,
    }
  }

  config = {
    'navigationBarTitleText': '新建地址'
  }

  componentDidMount() {

  }

  onSubmit() {
    console.log(this.state.queryObj)
    Taro.navigateBack();
  }

  onGetRegion(region) {
    // 参数region为选择的省市区
    // console.log(region);
  }

  handleChange(e, value) {
    let data = Object.assign({}, this.state.queryObj, { [e]: value })
    this.setState({
      queryObj: data
    })
  }



  render() {
    const { queryObj } = this.state;
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
                value={queryObj.code}
                onChange={this.handleChange.bind(this)}
                maxLength={200}
              />
            </View>
            <View className="auth_input">
              <AtSwitch title='设为默认地址' color='#F71279' checked={queryObj.swtichValue} />
            </View>
          </View>
          <AtButton formType='submit' className="btn_submit">新增地址</AtButton>
        </AtForm >
      </View>
    );
  }
}
export default Index
