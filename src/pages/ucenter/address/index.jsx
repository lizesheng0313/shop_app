import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"

import edit from "../../../assets/images/address/edit.png"
import del from "../../../assets/images/address/del.png"
import nothing from "../../../assets/images/nothing.jpg"

import './index.less';

class Index extends Component {

  config = {
    navigationBarTitleText: '收货地址'
  }

  state = {
    isOpened:false,
    addressList: [
      {
        default:true,
        fullname: "张三",
        mobilePhone: "18210572133",
        address: "浙江省杭州市西湖区西溪路556号"
      }
    ],
    total: 0
  }

  componentWillMount() { }


  componentDidShow() {
    // my.getAddress({
    //   success: (res) => {
    //     my.alert({
    //       title: JSON.stringify(res)
    //     });
    //   }
    // });
  }

  render() {
    const { addressList,isOpened} = this.state;
    return (
      <View className='container'>
        {
          addressList.length > 0 ? addressList.map(item => {
            return <View className='address_list'>
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
                  <View className="flex-start_center">
                    <Image src={del} class="icon"></Image>
                    <Text class="text">删除</Text>
                  </View>
                </View>
              </View>
            </View>
          })
            :  <View className="nothing">
                <Text className="tips">暂无地址</Text>
              </View>
        }
        <View className='btn_submit' onClick={this.addressAddOrUpdate} >新建地址</View>
        <AtModal isOpened>
          <AtModalHeader>确定提示</AtModalHeader>
          <AtModalContent>
              确定删除这个地址吗？
          </AtModalContent>
          <AtModalAction> <Button>取消</Button> <Button>确定</Button> </AtModalAction>
        </AtModal>
      </View>
    );
  }
}
export default Index;
