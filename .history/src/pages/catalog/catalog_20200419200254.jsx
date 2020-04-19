import Taro, { Component, closeBLEConnection } from '@tarojs/taro';
import { View, Text, Navigator, ScrollView, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';

import './index.less';

@connect(({ catalog, goods }) => ({
  ...catalog,
  goodsCount: goods.goodsCount,
}))
class Index extends Component {

  config = {
    navigationBarTitleText: '分类',
  }

  state = {
    currentActve: 0,
    secondList: [
      {
        title: "苹果"
      },
      {
        title: "华为"
      },
      {
        title: "OPPO"
      },
      {
        title: "三星"
      }
    ]
  }

  componentDidMount() {
    this.getData();
  }

  handleSetSecond(item, index) {
    this.setState({
      currentActve: index
    })
  }


  getData = (cbk) => {
    const { dispatch } = this.props;
    dispatch({ type: 'catalog/getCatalogList' }).then(() => {
      cbk && cbk()
    })
    dispatch({ type: 'goods/getGoodsCount' })
  }

  switchCate = (data) => {
    const { currentCategory, dispatch } = this.props;
    if (currentCategory.id == data.id) {
      return false;
    }
    dispatch({ type: 'catalog/getCurrentCategory', payload: data.id })

    // this.getCurrentCategory(event.currentTarget.dataset.id);
  }

  render() {
    const { categoryList, currentCategory, currentSubCategory } = this.props;
    return (
      <View className='container'>
        <View className='catalog'>
          <View className='nav'>
            {
              Array.isArray(categoryList) && categoryList.map(item => {
                return <View
                  className={`item ${currentCategory.id == item.id ? 'active' : ''}`}
                  key='id'
                  onClick={() => this.switchCate(item)}
                >
                  {item.name}
                </View>
              })
            }
          </View>
          <ScrollView scrollY className="cate">
            <View className='hd'>
              {
                this.state.secondList.map((item, index) => {
                  return <View onClick={this.handleSetSecond.bind(this, item, index)} className={`second_type ${this.state.currentActve === index ? 'active' : ''}`}>{item.title}</View>
                })
              }
            </View>
            <View className='bd' style={{marginTop:this.state.secondList.length % 3 * 26 + 'px'}}>
              {
                Array.isArray(currentSubCategory) && currentSubCategory.map((item, index) => {
                  return <Navigator url={`/pages/category/category?id=${item.id}`} className={`item ${(index + 1) % 3 == 0 ? 'last' : ''}`} key={item.id}>
                    <Image className='icon' src={item.picUrl}></Image>
                    <Text className='txt'>{item.name}</Text>
                  </Navigator>
                })
              }
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

export default Index;
