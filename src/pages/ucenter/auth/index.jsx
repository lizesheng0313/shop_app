import Taro, { Component, clearStorage } from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtButton } from 'taro-ui'
import './index.less';
import a1 from "../../../assets/images/mine/a1.png"
import a2 from "../../../assets/images/mine/a2.png"
import a3 from "../../../assets/images/mine/a3.png"
import a4 from "../../../assets/images/mine/a4.png"
import a5 from "../../../assets/images/mine/a5.png"
import a6 from "../../../assets/images/mine/a6.png"
import waring from "../../../assets/images/mine/waring.png"
// @connect(({ home, goods }) => ({
//   data: home.data
// }))


class Index extends Component {
  state = {
      front: "",
      behind: ""
  }

  config = {
    'navigationBarTitleText': '身份验证'
  }

  componentDidMount() {

  }

  handleUpload(e) {
    let that = this;
    Taro.chooseImage({
      sourceType:['album', 'camera'],
      count:1,
      success(res){
        that.setState({
          [e]:res.tempFilePaths[0]
        })
        
      }
    })
    //  Taro.uploadFile({
    //    url:"",
    //    success(res) {
    //      console.log(res);
    //    },
    //    fail(err){
    //      console.log(err);
    //      Taro.showToast({
    //        title:err.errorMessage
    //      })
    //    }
    //  })
  }

  render() {
    return (
      <View className="auth">
        <View className="tips">请上传<Text className="text">**公主</Text>本人身份证</View>
        <View className="flex-space_center upload-box">
          <View className="flex_dir_center img_box" onClick={this.handleUpload.bind(this,'front')}>
            {
              this.state.front ? <Image src={this.state.front} className="select_img"></Image>
              :<Image src={a1} className="select_img"></Image>
            }
            <Text className="t">上传身份证人像面</Text>
          </View>
          <View className="flex_dir_center img_box" onClick={this.handleUpload.bind(this,'behind')}>
           {
              this.state.front ? <Image src={this.state.behind} className="select_img"></Image>:
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
           <Image src={a3} className="icon"/>
           <Image src={a4} className="icon"/>
           <Image src={a5} className="icon"/>
           <Image src={a6} className="icon"/>
        </View>
        <AtButton formType='submit' className="btn_submit">提交</AtButton>
      </View>
    );
  }
}
export default Index
