import { apiIndexList } from '../services/index';

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
    *apiIndexList(_, { call, put }) {
      const res = yield call(apiIndexList);
      console.log('--home--', res);
      yield put({ type: 'save', payload: res });
    }
  }
};
