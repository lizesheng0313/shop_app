import Taro, { Component, closeBLEConnection } from '@tarojs/taro';
import { View, Text, Navigator, ScrollView, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { apiCatalogList, apiFindTypeList } from '../../services/catalog';

import './index.less';

// @connect(({ catalog, goods }) => ({
//   ...catalog,
//   goodsCount: goods.goodsCount,
// }))
class Index extends Component {

  config = {
    navigationBarTitleText: '分类',
  }

  state = {
    currentFirst: 0,
    currentActve: 0,
    categoryList: [],
    secondList: [],
    currentSecondId: ""
  }

  componentDidShow() {
    this.setState({
      currentFirst: 0,
      currentActve: 0,
      currentSecondId: ""
    })
    this.fetchCategoryList();
  }

  handleSetSecond(item, index) {
    this.setState({
      currentActve: index
    })
    this.fetchGoodsList(item.id)
  }

  //一级分类 
  fetchCategoryList = () => {
    Taro.showLoading({
      title: '加载中'
    })
    apiCatalogList().then(res => {
      this.setState({
        categoryList: res.data
      })
      if (this.$router.params.id) {
        res.data.forEach((item, index) => {
          if (item.id == this.$router.params.id) {
            this.setState({
              currentFirst: index
            })
          }
        })
      }
      let id = this.$router.params.id || res.data[0].id
      console.log(id)
      this.fetchSecondCategory(id)
    })
  }

  //二级分类 
  fetchSecondCategory(id) {
    this.setState({
      currentActve: 0
    })
    apiCatalogList({
      pId: id
    }).then(res => {
      if (res.data.length > 0) {
        this.fetchGoodsList(res.data[0].id)
      }
      else {
        this.setState({
          list: []
        })
      }
      Taro.hideLoading();
      this.setState({
        secondList: res.data
      })
    })
  }

  //获取商品
  fetchGoodsList(typeId) {
    Taro.showLoading({
      title: '加载中'
    })
    apiFindTypeList({
      typeId
    }).then(res => {
      Taro.hideLoading();
      this.setState({
        list: res.data
      })
    })
  }
  //切换一级分类
  switchCate = (id, index) => {
    if (this.state.currentFirst === index) {
      return false;
    }
    this.setState({
      currentFirst: index
    })
    this.fetchSecondCategory(id)
  }

  render() {
    const { categoryList, currentFirst, secondList, list } = this.state;
    return (
      <View className='container'>
        <View className='catalog'>
          <View className='nav'>
            {
              categoryList.map((item, index) => {
                return <View
                  className={`item ${currentFirst === index ? 'active' : ''}`}
                  key='id'
                  onClick={() => this.switchCate(item.id, index)}
                >
                  {item.name}
                </View>
              })
            }
          </View>
          <ScrollView scrollY className="cate">
            <View className='hd'>
              {
                secondList.map((item, index) => {
                  return <View onClick={this.handleSetSecond.bind(this, item, index)} className={`second_type ${this.state.currentActve === index ? 'active' : ''}`}>{item.name}</View>
                })
              }
            </View>
            <View className='bd' style={{ marginTop: Math.floor(secondList.length / 3) * 30 + 'px' }}>
              <View className="bd_c">
                {
                  list.map((item, index) => {
                    return <Navigator url={`/pages/goods/goods?id=${item.id}`} key={item.id} className="item" >
                      <Text className="num">{item.tag}</Text>
                      <Image className='icon' src={'http://app.zuyuanzhang01.com/' + item.title_pic}></Image>
                      <Text className='txt'>{item.name}</Text>
                      <Text class="money">￥{item.price}元/天<Text className="symbol">起</Text></Text>
                    </Navigator>
                  })
                }
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

export default Index;
