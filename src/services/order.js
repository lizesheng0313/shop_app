
import request from '../utils/request';

//获取第一期商品
export async function actionGetOneBill(payload) {
  return request("core_api/orderapi/getOneBill", payload);
}
//提交订单
export async function actionSubOrder(payload) {
  return request("core_api/orderapi/subOrder", payload);
}
//订单列表
export async function actionOrderlist(payload) {
  return request("core_api/orderapi/list", payload);
}
//订单详细信息
export async function actionOrderDetails(payload) {
  return request("core_api/orderapi/orderDetails", payload);
}
//冻结资金
export async function actionFundAuthOrderAppFreeze(payload) {
  return request("ext_api/api/fundAuthOrderAppFreeze", payload);
}
//冻结资金转支付
export async function actionTradePay(payload) {
  return request("ext_api/api/tradePay", payload);
}
//资金授权查询 
export async function actionFundAuthOperationDetailQuery(payload) {
  return request("ext_api/api/fundAuthOperationDetailQuery", payload);
}
//取消订单
export async function actionCancelOrder(payload) {
  return request("core_api/orderapi/cancelOrder", payload);
}
//更新订单
export async function actionUpdateOrder(payload) {
  return request("core_api/orderapi/updateOrder", payload);
}
//快递查询
export async function actionSeachAddress(payload) {
  return request("core_api/orderapi/seach_express", payload);
}
//确认收货
export async function actionReceiptSub(payload) {
  return request("core_api/orderapi/receipt_sub", payload);
}
//退还
export async function actoinSendSub(payload) {
  return request("core_api/orderapi/send_sub", payload);
}




