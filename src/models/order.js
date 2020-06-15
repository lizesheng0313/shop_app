// import { apiIndexList } from '../services/home';

export default {
    namespace: 'order',
    state: {
        addressInfo: {},
    },
    reducers: {
        SAVEADDRESS: (state, { payload }) => {
            state.addressInfo = payload;
        },
    },
    effects: {
        *actionAddress({ payload }, { call, put }) {
            yield put({ type: 'SAVEADDRESS', payload: payload });
        }
    }
};
