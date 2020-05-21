import request from '../utils/request';

//获取一级二级分类
export async function apiCatalogList(payload) {
  return request("core_api/shoppingtypeapi/findList", payload);
}

//按专题分类获取商品
export async function apiFindActiveList(payload) {
  return request("core_api/shopapi/findActiveList", payload);
}

//按商品分类获取商品
export async function apiFindTypeList(payload) {
  return request("core_api/shopapi/findTypeList", payload);
}

//获取该店铺的商品分类
export async function apiGetType(payload) {
  return request("core_api/dianpuapi/getType", payload);
}

//获取该店铺商品
export async function apiGetShop(payload) {
  return request("core_api/dianpuapi/getShop", payload);
}

//商品搜索
export async function apiSeachList(payload) {
  return request("core_api/shopapi/seachList", payload);
}

