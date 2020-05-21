import request from '../utils/request';


//获取商品详情
export async function getGoodsDetails(payload) {
  return request("core_api/shopapi/getShop",payload);
}

//随机商品
export async function apiRandShop(payload) {
  return request("core_api/shopapi/randShop", payload);
}

//获取店铺分类
export async function apiGetShop(payload) {
  return request("core_api/dianpuapi/getShop", payload);
}
