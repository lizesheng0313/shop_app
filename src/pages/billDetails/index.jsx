import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, Navigator, Radio } from '@tarojs/components';
import * as ApiOrder from '../../../services/order';
import './index.less';

class Index extends Component {
  s

  config = {
    navigationBarTitleText: '订单详情'
  }

  state = {
    list: [
      {
        nepr: '4/12',
        total: "￥197.80",
        time: "2020年05月01日",
        type: "待还款",
        checked: false
      },
      {
        nepr: '4/12',
        total: "￥197.80",
        time: "2020年05月01日",
        type: "待还款",
        checked: false
      },
      {
        nepr: '4/12',
        total: "￥197.80",
        time: "2020年05月01日",
        type: "待还款",
        checked: false
      },
      {
        nepr: '4/12',
        total: "￥197.80",
        time: "2020年05月01日",
        type: "待还款",
        checked: false
      }, {
        nepr: '4/12',
        total: "￥197.80",
        time: "2020年05月01日",
        type: "待还款",
        checked: false
      }, {
        nepr: '4/12',
        total: "￥197.80",
        time: "2020年05月01日",
        type: "待还款",
        checked: false
      }
    ]
  }

  componentDidMount() {

  }

  handleCooy() {
    my.setClipboard({
      text: "23423423",
      success(res) {
        console.log("成功", res)
      }, fail(err) {
        console.log('失败', err)
      }
    })
    my.getClipboard({
      success: ({ text }) => {
        console.log(text)
        Taro.showToast({
          title: text
        })
      },
      fail(err) {
        console.log(err)
      }
    })
  }

  render() {
    const { list } = this.state
    return (
      <View className='order-details'>
        <View className="goods_details">
          <View className="flex-start_center ">
            <Image className="image"></Image>
            <View className="goods_details_right">
              <View className="title">【全新国行】ThinkPad X1c 极速版14英寸</View>
              <View className="sp">规格：15/28G/256G/黑色</View>
              <View className="total">总租金: ￥23720.50</View>
            </View>
          </View>
          <View className="flex-around_center total_info">
            <View className="flex_dir_center">
              <View>8422.20</View>
              <View className="c9">应还金额(元)</View>
            </View>
            <View className="flex_dir_center">
              <View>8422.20</View>
              <View className="c9">未还金额(元)</View>
            </View>
            <View className="flex_dir_center">
              <View>8422.20</View>
              <View className="c9">已还金额(元)</View>
            </View>
          </View>
        </View>
        <View className="tips">可提前归还本金</View>
        {
          list.map((item) => {
            return <View className="coupons">
              <View className="nper">{item.nepr}期</View>
              <View className="flex-space_center">
                <View className="total">{item.total}</View>
                <Radio checked={item.checked} color="#F71279"></Radio>
              </View>
              <View className="flex-space_center time_border">
                <View>还款时间：{item.time}</View>
                <View>{item.type}</View>
              </View>
            </View>
          })
        }
        <View className="btn_submit">支付</View>
      </View>
    );
  }
}
export default Index;
