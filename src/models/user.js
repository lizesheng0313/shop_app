import { apiFindUserByUserId } from '../services/user';

export default {
    namespace: 'user',
    state: {
        user_id: "",
        userInfo: {},
    },
    reducers: {
        save: (state, { payload }) => {
            state.userInfo = payload.data;
        },
        saveId: (state, { payload }) => {
            state.user_id = payload;
        }
    },
    effects: {
        *apiFindUserByUserId({ payload }, { call, put }) {
            yield put({ type: 'saveId', payload });
            const res = yield call(apiFindUserByUserId, payload);
            yield put({ type: 'save', payload: res });
        }
    }
};
