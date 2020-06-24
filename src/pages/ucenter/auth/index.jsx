import Taro, { Component, clearStorage } from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtButton } from 'taro-ui'
import { actionUserUpdate } from "../../../services/user"
import './index.less';
import a1 from "../../../assets/images/mine/a1.png"
import a2 from "../../../assets/images/mine/a2.png"
import a3 from "../../../assets/images/mine/a3.png"
import a4 from "../../../assets/images/mine/a4.png"
import a5 from "../../../assets/images/mine/a5.png"
import a6 from "../../../assets/images/mine/a6.png"
import waring from "../../../assets/images/mine/waring.png"

@connect(({ user }) => ({
  userInfo: user.userInfo,
  user_id: user.user_id
}))


class Index extends Component {
  state = {
    front: "",
    behind: ""
  }

  config = {
    'navigationBarTitleText': '身份验证'
  }

  componentDidMount() {
    const { userInfo } = this.props
    if (userInfo.card_img1) {
      this.setState({
        front: 'http://app.zuyuanzhang01.com/' + userInfo.card_img1
      })
    }
    if (userInfo.card_img2) {
      this.setState({
        behind: 'http://app.zuyuanzhang01.com/' + userInfo.card_img2
      })
    }
  }

  handleUpload(e) {
    const { userInfo, user_id,dispatch } = this.props
    if (e === "front" && userInfo.card_img1) return
    if (e === "behind" && userInfo.card_img2) return
    let that = this;
    my.chooseImage({
      sourceType: ['album', 'camera'],
      count: 1,
      success(res) {
        let path = res.tempFilePaths[0]
        that.setState({
          [e]: res.tempFilePaths[0]
        })
        Taro.showLoading({
          title: '上传中'
        })
        my.uploadFile({
          url: "https://app.zuyuanzhang01.com/core_api/userapi/uploadFile",
          fileType: 'image',
          fileName: 'file',
          filePath: path,
          async success(res) {
            let data = JSON.parse(res.data)
            console.log(data)
            if (e === 'front') {
              await actionUserUpdate({
                card_img1: data.data,
                user_id
              })
              await dispatch({ type: 'user/apiFindUserByUserId', payload: user_id }).then(res => {
                Taro.hideLoading()
              })
            }
            else {
              actionUserUpdate({
                card_img2: data.data,
                user_id
              })
              await dispatch({ type: 'user/apiFindUserByUserId', payload: user_id }).then(res => {
                Taro.hideLoading()
              })
            }
          },
          fail(err) {
            console.log(err)
          }
        })
      }
    })
  }

  render() {
    const { userInfo } = this.props
    return (
      <View className="auth">
        <View className="tips">请上传<Text className="text">**公主</Text>本人身份证</View>
        <View className="flex-space_center upload-box">
          <View className="flex_dir_center img_box" onClick={this.handleUpload.bind(this, 'front')}>
            {
              this.state.front ? <Image src={this.state.front} className="select_img"></Image>
                : <Image src={a1} className="select_img"></Image>
            }
            <Text className="t">上传身份证人像面</Text>
          </View>
          <View className="flex_dir_center img_box" onClick={this.handleUpload.bind(this, 'behind')}>
            {
              this.state.behind ? <Image src={this.state.behind} className="select_img"></Image> :
                <Image src={a2} className="select_img"></Image>
            }
            <Text className="t">上传身份证国徽面</Text>
          </View>
        </View>
        <View className="flex-space_center upload_rules">
          <Text>请拍摄身份证原件：</Text>
          <Text className="t flex-start_center">
            <Image src={waring} className="icon"></Image>上传证件照片要求
          </Text>
        </View>
        <View className="flex-space_center rules_image">
          <Image src={a3} className="icon" />
          <Image src={a4} className="icon" />
          <Image src={a5} className="icon" />
          <Image src={a6} className="icon" />
        </View>
        {/* <AtButton formType='submit' className="btn_submit">提交</AtButton> */}
      </View>
    );
  }
}
export default Index
