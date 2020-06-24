import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'

export default class Customer extends Component {
    state = {

    }

    componentWillMount() {

    }

    makePhoneCall(number) {
        my.makePhoneCall({ number });
    }

    handleToClose() {
        this.props.handleCloseCumster()
    }

    render() {
        return (
            <View className="customer">
                <View className="box">
                    <View className='at-icon at-icon-close' onClick={this.handleToClose.bind(this)}></View>
                    <View className="title">联系客服</View>
                    <View className="time">(9:00-18:00)</View>
                    <View className='customer_flex'>
                        <View>在线客服：</View>
                        <contact-button className="user_other_item btn" session-from='weapp' size='27' >
                        </contact-button>
                    </View>
                    <View className='customer_flex'>
                        <View>
                            <View>商家客服：</View>
                            <View className="phone">16642602726</View>
                        </View>
                        <View className="btn" onClick={this.makePhoneCall.bind(this, '16642602726')}>拨打</View>
                    </View>
                    <View className="customer_flex">
                        <View>
                            <View>平台客服：</View>
                            <View className="phone">16642602726</View>
                        </View>
                        <View className="btn" onClick={this.makePhoneCall.bind(this, '16642602726')}>拨打</View>
                    </View>
                </View>
            </View>

        )
    }
}
