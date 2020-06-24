import request from '../utils/request';

//获取用户信息
export async function apiFindUserByUserId(user_id) {
  return request("core_api/userapi/findUserByUserId", { user_id });
}

//会员注册
export async function apiRegisterUser(payload) {
  return request("core_api/userapi/register", payload);
}

//更新会员信息
export async function actionUserUpdate(payload) {
  return request("core_api/userapi/update", payload);
}

//获取手机号
export async function actionGetPhoneNumber(payload) {
  return request("ext_api/api/getPhoneNumber", payload);
}

//反馈
export async function actionComplaint(payload) {
  return request("core_api/userapi/complaint", payload);
}

//认证
export async function actionrealPersonCreate(payload) {
  return request("ext_api/api/realPersonCreate", payload);
}

//地址列表
export async function actionListAddress(payload) {
  return request("core_api/userapi/listAddress", payload);
}

//保存收件地址
export async function actionSaveAddress(payload) {
  return request("core_api/userapi/saveAddress", payload);
}

//删除地址
export async function actionDelAddress(payload) {
  return request("core_api/userapi/delAddress", payload);
}

//上传
export async function actionUploadFile(payload) {
  return request("core_api/userapi/uploadFile", payload);
}

