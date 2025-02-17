import {configureStore} from '@reduxjs/toolkit'
import duckReducer from '../reducers/reducer.jsx'

const store = configureStore({
    reducer: {
        ducks: duckReducer,
    }
})

export default store
