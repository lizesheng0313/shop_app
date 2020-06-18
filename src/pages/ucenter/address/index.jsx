import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View, Text, Button } from '@tarojs/components';
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"
import { actionListAddress, actionDelAddress } from "../../../services/user"
import edit from "../../../assets/images/address/edit.png"
import del from "../../../assets/images/address/del.png"
import nothing from "../../../assets/images/nothing1.jpg"

import './index.less';

@connect(({ user }) => ({
  user_id: user.user_id
}))

class Index extends Component {

  config = {
    navigationBarTitleText: '收货地址'
  }

  state = {
    isOrder: "",
    isOpened: false,
    addressList: [],
    total: 0,
    currentId: ""
  }

  componentWillMount() {
    this.setState({
      isOrder: this.$router.params.order
    })
  }

  componentDidShow() {
    this.fetchAddressList();
  }

  fetchAddressList() {
    Taro.showLoading({
      title: "加载中"
    })
    const { user_id } = this.props
    actionListAddress({ user_id }).then(res => {
      Taro.hideLoading();
      this.setState({
        addressList: res.data
      })
    })
  }

  handleToDelete(item) {
    this.state.currentId = item.id;
    this.setState({
      isOpened: true
    })
  }

  handleToCancle() {
    this.setState({
      isOpened: false
    })
  }
  handleToSubmit() {
    Taro.showLoading({
      title: "删除中"
    })
    actionDelAddress({
      id: this.state.currentId
    }).then(res => {
      this.fetchAddressList();
      this.setState({
        isOpened: false
      })
    })
  }

  // componentDidShow() {
  // my.getAddress({
  //   success: (res) => {
  //     my.alert({
  //       title: JSON.stringify(res)
  //     });
  //   }
  // });
  // }

  handleSelectAddress(item) {
    const { dispatch } = this.props;
    if (this.state.isOrder === 'yes') {
      dispatch({ type: 'order/actionAddress', payload: item })
      Taro.navigateBack()
    }
  }

  handleToEditAdress(item) {
    Taro.navigateTo({
      url: "/pages/ucenter/addressAdd/index?info=" + JSON.stringify(item)
    });
  }

  addressAddOrUpdate() {
    Taro.navigateTo({
      url: "/pages/ucenter/addressAdd/index"
    });
  }

  render() {
    const { addressList, isOpened } = this.state;
    return (
      <View className='container'>
        {
          addressList.length > 0 ? addressList.map(item => {
            return <View className='address_list' onClick={this.handleSelectAddress.bind(this, item)}>
              <View className="address_box">
                <View className='flex-space_center'>
                  <View className='name'>{item.name}</View>
                  <View className='mobile'>{item.phone}</View>
                </View>
                <View className='c'>
                  <View className='address'>{item.region}{item.address}</View>
                </View>
              </View>
              <View className="flex-space_center">
                <View className="default">
                  {item.is_default === true ? "默认地址" : ''}
                </View>
                <View class="address_footer flex-start_center">
                  <View className="edit flex-start_center" onClick={this.handleToEditAdress.bind(this, item)}>
                    <Image src={edit} class="icon"></Image>
                    <Text class="text">编辑</Text>
                  </View>
                  <View className="flex-start_center" onClick={this.handleToDelete.bind(this, item)}>
                    <Image src={del} class="icon"></Image>
                    <Text class="text">删除</Text>
                  </View>
                </View>
              </View>
            </View>
          })
            : <View className="nothing">
              <Image src={nothing} className="img"></Image>
              <Text className="tips">暂无地址</Text>
            </View>
        }
        <View className='btn_submit' onClick={this.addressAddOrUpdate} >新建地址</View>
        <AtModal isOpened={isOpened}>
          <AtModalHeader>确定提示</AtModalHeader>
          <AtModalContent>
            确定删除这个地址吗？
          </AtModalContent>
          <AtModalAction> <Button onClick={this.handleToCancle.bind(this)}>取消</Button> <Button onClick={this.handleToSubmit}>确定</Button> </AtModalAction>
        </AtModal>
      </View>
    );
  }
}
export default Index;
