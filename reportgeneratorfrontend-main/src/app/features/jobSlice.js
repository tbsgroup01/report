import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    job: "telecom",
    user: [],
    recordNumber: ""

}

export const jobSlice = createSlice({
    name: 'job',
    initialState,
    reducers: {
        selectJob(state, action) {
            // console.log(action.payload)
            state.job = (action.payload)
            // console.log(state.job)
        },
        setUserDetails(state, action) {
            state.user.unshift(action.payload)
            // console.log("user details :", state.user[0])
        },
        Logout(state, action) {
            state.user = []
            // console.log("user details :", state.user[0])
        },
        updateRecordNumber(state, action) {
            state.recordNumber = action.payload
        }

    },
})

// Action creators are generated for each case reducer function
export const { selectJob, setUserDetails, Logout, updateRecordNumber } = jobSlice.actions

export default jobSlice.reducer