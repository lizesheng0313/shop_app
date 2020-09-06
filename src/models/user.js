import { apiFindUserByUserId } from '../services/user';

export default {
    namespace: 'user',
    state: {
        user_id: "",
        userInfo: {},
        conponsId:"",
        conponsMoney:""
    },
    reducers: {
        save: (state, { payload }) => {
            state.userInfo = payload.data;
        },
        saveId: (state, { payload }) => {
            state.user_id = payload;
        },
        saveC: (state, { payload }) => {
             state.conponsId = payload.id;
             state.conponsMoney = payload.sub_money
        }
    },
    effects: {
        *apiFindUserByUserId({ payload }, { call, put }) {
            yield put({ type: 'saveId', payload });
            const res = yield call(apiFindUserByUserId, payload);
            yield put({ type: 'save', payload: res });
        },
        *saveConpons({ payload }, { call, put }) {
            console.log(payload,'当前值')
            yield put({ type: 'saveC', payload });
        }
    }
};
