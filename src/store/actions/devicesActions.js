import { createAsyncThunk } from '@reduxjs/toolkit'
import { getDevices, getDeviceById, updatePrintSettingsServer, deleteDevicesServer, getManyDevicesByIds } from '../services/devicesServices'

export const devicesList = createAsyncThunk(
	'devices/fetchDevices',
	async (_, { rejectWithValue, getState }) => {
		try {
			const token = localStorage.getItem('authToken')
			const data = await getDevices(token)
			return data
		} catch (error) {
			if (error.response?.status === 401) {
				return rejectWithValue('Unauthorized: Пожалуйста, войдите снова')
			}
			return rejectWithValue(
				error.response?.data || 'Ошибка загрузки документов'
			)
		}
	}
)

export const fetchDeviceById = createAsyncThunk(
	'devices/fetchDeviceById',
	async (deviceId, { rejectWithValue }) => {
		try {
			const token = localStorage.getItem('authToken')
			const data = await getDeviceById(deviceId, token)
			return data
		} catch (error) {
			if (error.response?.status === 401) {
				return rejectWithValue('Unauthorized: Пожалуйста, войдите снова')
			}
			return rejectWithValue(
				error.response?.data || 'Ошибка загрузки документа'
			)
		}
	}
)


export const updatePrintSettings = createAsyncThunk(
    'devices/updatePrintSettings',
    async ({ deviceId, settings },
    { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('authToken')
            const data = await updatePrintSettingsServer(deviceId, settings, token)
            return data
        } catch (error) {
            if (error.response?.status === 401) {
                return rejectWithValue('Unauthorized: Пожалуйста, войдите снова')
            }
            return rejectWithValue(
                error.response?.data || 'Ошибка обновления настроек печати'
            )
        }
    }   
)


export const deleteDevices = createAsyncThunk(
    'devices/deleteDevices',
    async (deviceIds, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('authToken')
            
            const data = await deleteDevicesServer(deviceIds, token)
            return data
        } catch (error) {
            if (error.response?.status === 401) {
                return rejectWithValue('Unauthorized: Пожалуйста, войдите снова')
            }
            return rejectWithValue(
                error.response?.data || 'Ошибка удаления документов'
            )
        }
    }
)


export const fetchDevicesByIds = createAsyncThunk(
    'devices/fetchDevicesByIds',
    async (deviceIds, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('authToken');
            const data = await getManyDevicesByIds(deviceIds, token);
            return data;
        } catch (error) {
            if (error.response?.status === 401) {
                return rejectWithValue('Unauthorized: Пожалуйста, войдите снова');
            }
            return rejectWithValue(error.response?.data || 'Ошибка загрузки документов');
        }
    }
);
