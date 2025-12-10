import { configureStore } from '@reduxjs/toolkit'
import devicesReducer from './reducers/devicesReducers'

const store = configureStore({
	reducer: {
		devicesList: devicesReducer,
	},
})

export default store
