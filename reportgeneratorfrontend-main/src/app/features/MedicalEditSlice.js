// medicalSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  Edittitle: {},
  Editproducts: [],
  id:"",
//   remark: '',
  EditformTotalTabData: {
    discount: '',
    Total: '',
    netAmount: '',
    'amount in words': '',
    remark: '', // Initialize with empty string
  },
};

export const EditMedicalSlice = createSlice({
  name: 'EditMedical',
  initialState,
  reducers: {
    EditProducts(state, action) {
      state.Editproducts = action.payload;
    },
    EditTitle(state, action) {
      state.Edittitle = action.payload;
    },
    setId(state, action) {
      state.id = action.payload;
    },
    EditFormTotalTabData(state, action) {
      state.EditformTotalTabData = action.payload;
    },
   
  },
});

// Action creators are generated for each case reducer function
export const { EditProducts, EditTitle, EditFormTotalTabData,setId } = EditMedicalSlice.actions;

export default EditMedicalSlice.reducer;
