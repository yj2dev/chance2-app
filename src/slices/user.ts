import {createSlice} from '@reduxjs/toolkit';

// 타입스크립트가 타입 추론이 어려울 때 인터페이스로 따로 만들어준다. (EX. 객체, 배열은 내부가 어떤 타입인지 추론이 어렵다)

const initialState = {
  name: '',
  email: '',
  accessToken: '',
  money: 0,
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.accessToken = action.payload.accessToken;
    },
    setName(state, action) {
      state.name = action.payload;
    },
    setMoney(state, action) {
      state.money = action.payload;
    },
  },
  extraReducers: builder => {},
});

export default userSlice;
