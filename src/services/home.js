import request from '../utils/request';
/**
 *  首页数据接口
 */
export async function apiFindList(payload) {
  return request("core_api/activityapi/findList", payload);
}

export async function apiuserOauthToken(payload) {
  return request("ext_api/api/userOauthToken", payload);
}

export async function apiIndexList(payload) {
  return request("core_api/shopapi/indexList", payload);
}



