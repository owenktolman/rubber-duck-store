import {createSlice} from '@reduxjs/toolkit'

export const duckSlice = createSlice({
    name: 'ducks',
    initialState: {
        ducks: undefined,
        constants: undefined,
    },
    reducers: {
        setDucks: (state, action) => {
            if (action.payload) {
                state.ducks = action.payload.data
            }
        },
        setConstants: (state, action) => {
            if (action.payload) {
                state.constants = action.payload.data
            }
        },
    }
})

export const { setDucks, setConstants } = duckSlice.actions

export default duckSlice.reducer
