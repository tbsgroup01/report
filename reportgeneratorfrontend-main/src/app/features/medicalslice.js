// medicalSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  title: {},
  total: '',
  products: Array(5).fill({ productNo: "", qty: "", productName: "", rate: "" }),
//   remark: '',
  formTotalTabData: {
    discount: '',
    Total: '',
    netAmount: '',
    'amount in words': '',
    remark: '', // Initialize with empty string
  },
};

export const medicalSlice = createSlice({
  name: 'medical',
  initialState,
  reducers: {
    addProduct(state, action) {
      state.products = action.payload;
    },
    setTitle(state, action) {
      state.title = action.payload;
    },
    setformTotalTabData(state, action) {
      state.formTotalTabData = action.payload;
    },
    setTotal(state, action) {
      state.total = action.payload;
    },
    // setRemark(state, action) {
    //   state.remark = action.payload;
    // },
  },
});

// Action creators are generated for each case reducer function
export const { addProduct, setTitle, setformTotalTabData, setTotal } = medicalSlice.actions;

export default medicalSlice.reducer;
