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
    *actionIndexList(_, { call, put }) {
      const res = yield call(apiIndexList);
      console.log('--home--', res);
      yield put({ type: 'save', payload: res });
    }
  }
};
