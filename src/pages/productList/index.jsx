import Taro, { PureComponent, connectSocket } from '@tarojs/taro'
import { View, Text, Navigator, Swiper, SwiperItem, Image, ScrollView, Block, Input } from '@tarojs/components'
import { connect } from '@tarojs/redux';
import { AtDrawer } from 'taro-ui'
import { apiSeachList, apiBrandFindList } from '../../services/catalog';

//图片

import './index.less'

@connect(({ home }) => ({
  data: home.data,
}))

class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      show: false,
      txt: "",
      queryObj: {
        txt: "",
        order: "",
        day: "",
        brandId: "",
        type_id: "",
        tag: ""
      },
      list: [],
      likeList: [],
      currentTime: 0,
      currentNew: 0,
      currentBrand: -1,
      quickList: [
        { title: '全新', num: 1 },
        { title: '非全新', num: 2 }
      ],
      timeList: [
        { title: '3天起租', num: 3 },
        { title: '7天起租', num: 7 },
        { title: '30天起租', num: 30 },
        { title: '90天起租', num: 90 },
        { title: '180天起租', num: 180 },
        { title: '365天起租', num: 365 },
      ],
      price: [
        {
          title: "价格",
          desc: true,
          icon: "icon-xiajiantou",
          order: 2
        },
      ],
      tab: [
        {
          title: "综合",
          icon: "",
          order: 1
        },
        {
          title: "价格",
          desc: true,
          icon: "icon-shangjiantou",
          order: 3
        },
        {
          title: "筛选",
          icon: "icon-shaixuan",
        }
      ]
    }
  }

  config = {
    navigationBarTitleText: '产品列表',
  }

  componentDidShow() {
    let data = { ...this.state.queryObj, txt: this.$router.params.txt }
    this.setState({
      queryObj: data
    }, () =>
      this.getData()
    )
    apiBrandFindList().then(res => {
      this.setState({
        likeList: res.data
      })
    })
  }

  getData = () => {
    apiSeachList(this.state.queryObj).then(res => {
      this.setState({
        list: res.data
      })
    })
  }

  onClose() {
    this.setState({
      show: false
    })
  }

  handleToQuick(item, index) {
    this.state.queryObj.tag = item.num;
    this.setState({
      queryObj: this.state.queryObj,
      currentNew: index
    })
  }

  handleToTime(item, index) {
    this.state.queryObj.day = item.num;
    this.setState({
      queryObj: this.state.queryObj,
      currentTime: index
    })
  }

  handleToBrand(item, index) {
    this.state.queryObj.brandId = item.id;
    this.setState({
      queryObj: this.state.queryObj,
      currentBrand: index
    })
  }

  handleToSubmit() {
    this.getData()
    this.setState({
      show: false
    })
  }

  handleToReset() {
    let data = { ...this.state.queryObj, tag: "", brandId: "", day: "" }
    this.setState({
      queryObj: data,
      currentBrand: -1,
      currentNew: 0,
      currentTime: 0
    })
  }


  handleToggleTab(index) {
    this.setState({
      current: index,
    })
    if (index === 0) {
      let data = { ...this.state.queryObj, order: 1 }
      this.setState({
        queryObj: data,
      }, () =>
        this.getData()
      )
    }
    if (index === 1) {
      if (this.state.tab[1].icon === 'icon-xiajiantou') {
        this.state.tab[1].icon = "icon-shangjiantou"
        let data = { ...this.state.queryObj, order: 3 }
        this.setState({
          queryObj: data,
          tab: this.state.tab,
        }, () =>
          this.getData()
        )
      }
      else {
        this.state.tab[1].icon = "icon-xiajiantou"
        let data = { ...this.state.queryObj, order: 2 }
        this.setState({
          queryObj: data,
          tab: this.state.tab
        }, () =>
          this.getData()
        )
      }
    }
    else if (index === 2) {
      this.setState({
        show: true
      })
    }
  }

  render() {
    const { tab, current, likeList, quickList, timeList } = this.state;
    return (
      <View className='container'>
        <View className="header flex-around_center">
          {
            tab.map((item, index) => {
              return <View onClick={this.handleToggleTab.bind(this, index)} className={`item ${current === index ? 'active' : ""}`}>
                {item.title}
                <Text className={`iconfont ${item.icon}`}></Text>
              </View>
            })
          }
        </View>
        <View className="recommended_list">
          {
            list.map(item => {
              return <View className='item' key={item.id}>
                <Navigator url={`/pages/goods/goods?id=${item.id}`}>
                  <Image className='img' src={'http://app.zuyuanzhang01.com/' + item.title_pic}></Image>
                  <View className="tag">
                    {item.tag ? <Text>{item.tag}</Text> : ""}
                    {item.address ? <Text>{item.address}</Text> : ""}
                  </View>
                  <Text className='name'>{item.name}</Text>
                  <View className="flex-space_center">
                    <Text className="price"><Text className="icon">￥</Text>{item.price}元/天<Text className="start">起</Text></Text>
                    <Text className="time">{item.day}天起租</Text>
                  </View>
                </Navigator>
              </View>
            })
          }
        </View>
        <AtDrawer
          show={this.state.show}
          right
          onClose={this.onClose.bind(this)}
          width="300px"
          mask
        >
          <View className="right_drawer">
            <View>
              <View className="title">品牌专栏</View>
              <View className="like_type">
                {
                  likeList.map((item, index) => {
                    return <View onClick={this.handleToBrand.bind(this, item, index)} className={`top ${currentBrand === index ? 'active' : ''}`}>
                      <Image src={'https://app.zuyuanzhang01.com/' + item.title_pic} className="image" />
                    </View>
                  })
                }
              </View>
              <View className="title second_title">快捷筛选</View>
              <View className="like_type">
                {
                  quickList.map((item, index) => {
                    return <View onClick={this.handleToQuick.bind(this, item, index)} className={`top ${currentNew === index ? 'active' : ''}`} >
                      {item.title}
                    </View>
                  })
                }
              </View>
              <View className="title second_title">起租日</View>
              <View className="like_type">
                {
                  timeList.map((item, index) => {
                    return <View onClick={this.handleToTime.bind(this, item, index)} className={`top ${currentTime === index ? 'active' : ''}`} >
                      {item.title}
                    </View>
                  })
                }
              </View>
              <View className="footer_button">
                <View className="reset btn" onClick={this.handleToReset.bind(this)}>重置</View>
                <View className="submit btn" onClick={this.handleToSubmit.bind(this)}>确定</View>
              </View>
            </View>
          </View>
        </AtDrawer>
      </View >
    )
  }
}

export default Index
