import { apiIndexList } from '../services/home';

export default {
  namespace: 'home',
  state: {
    data: {},
  },
  reducers: {
    save: (state, { payload }) => {
      state.data = payload;
    },
  },
  effects: {
    *actionIndexList({ payload }, { call, put }) {
      const res = yield call(apiIndexList,payload);
      console.log('--home--', res);
      yield put({ type: 'save', payload: res });
    }
  }
};
