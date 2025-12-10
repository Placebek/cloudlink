import API from './api'

export const getDevices = async token => {
	const response = await API.get('/api/v1/devices/all', {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
	return response.data
}

export const getDeviceById = async (deviceId, token) => {
	const response = await API.get(`/api/v1/devices/${deviceId}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
	return response.data
}


export const updatePrintSettingsServer = async (deviceId, settings, token) => {
    const response = await API.put(
        `/api/v1/devices/${deviceId}/print-settings/`,
        settings,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )
    return response.data
}

export const deleteDevicesServer = async (deviceIds, token) => {
    const response = await API.delete('/api/v1/devices/delete', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: deviceIds, // <-- правильно передаём тело
    })
    return response.data
}

export const getManyDevicesByIds = async (deviceIds, token) => {
    const response = await API.post('/api/v1/devices/batch', 
        { ids: deviceIds }, 
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};
