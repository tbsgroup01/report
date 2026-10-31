import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    image: "",
    imageName: ""
}

export const imageSlice = createSlice({
    name: 'image',
    initialState,
    reducers: {
        imageUrl(state, action) {
            // console.log(action.payload)
            state.image = action.payload
            // console.log(state.job)
        },
        addImageName(state, action) {
            // console.log(action.payload)
            state.imageName = action.payload
            // console.log(state.job)
        },


    },
})

// Action creators are generated for each case reducer function
export const { imageUrl, addImageName } = imageSlice.actions

export default imageSlice.reducer