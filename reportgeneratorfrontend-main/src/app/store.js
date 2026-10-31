import { configureStore } from '@reduxjs/toolkit'
import jobReducer from './features/jobSlice'
import medicalslice from './features/medicalslice'
import imageSlice from './features/imageSlice'
import  EditMedicalSlice  from './features/MedicalEditSlice'

export const store = configureStore({
    reducer: {
        job: jobReducer,
        medical: medicalslice,
        image: imageSlice,
        EditMedicalSlice: EditMedicalSlice
    },
})