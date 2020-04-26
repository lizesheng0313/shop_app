import request from '../utils/request';
/**
 *  首页数据接口
 */
export async function apiFindList(payload) {
  return request("activityapi/findList", payload);
}
