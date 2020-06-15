import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View, Text, Button } from '@tarojs/components';
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"

import edit from "../../../assets/images/address/edit.png"
import del from "../../../assets/images/address/del.png"
import nothing from "../../../assets/images/nothing1.jpg"

import './index.less';

@connect(({ order }) => ({
 
}))

class Index extends Component {

  config = {
    navigationBarTitleText: '收货地址'
  }

  state = {
    isOrder: "",
    isOpened: false,
    addressList: [
      {
        id: 123,
        default: true,
        fullname: "张三",
        mobilePhone: "18210572133",
        address: "浙江省杭州市西湖区西溪路556号"
      }
    ],
    total: 0
  }

  componentWillMount() {
    this.setState({
      isOrder: this.$router.params.order
    })
  }

  handleToDelete() {
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
    this.setState({
      isOpened: true
    })
  }

  componentDidShow() {
    // my.getAddress({
    //   success: (res) => {
    //     my.alert({
    //       title: JSON.stringify(res)
    //     });
    //   }
    // });
  }

  handleSelectAddress(item) {
    const { dispatch } = this.props;
    if (this.state.isOrder === 'yes') {
      dispatch({ type: 'order/actionAddress', payload: item })
    }
    Taro.navigateBack()
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
                  <View className='name'>{item.fullname}</View>
                  <View className='mobile'>{item.mobilePhone}</View>
                </View>
                <View className='c'>
                  <View className='address'>{item.address}</View>
                </View>
              </View>
              <View className="flex-space_center">
                <View className="default">
                  {item.default ? "默认地址" : ''}
                </View>
                <View class="address_footer flex-start_center">
                  <View className="edit flex-start_center">
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
