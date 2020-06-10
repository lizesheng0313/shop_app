import request from '../utils/request';

//获取用户信息
export async function apiFindUserByUserId(user_id) {
  return request("core_api/userapi/findUserByUserId", { user_id });
}

//会员注册
export async function apiRegisterUser(payload) {
  return request("core_api/userapi/register", payload);
}

