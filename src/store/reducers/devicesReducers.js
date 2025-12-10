import { createSlice } from '@reduxjs/toolkit';
import { devicesList, fetchDeviceById, fetchDevicesByIds } from '../actions/devicesActions';

const initialState = {
  deviceData: [], // Список всех документов
  devicesDatas: [],
  currentDevice: null, // Текущий выбранный документ
  loading: false,
  error: null,
};

const isConvertibleDoc = (fileName) =>
  [".docx", ".doc", ".pptx", ".ppt", ".xlsx", ".xls", ".xxls"].some((ext) =>
    fileName?.toLowerCase().endsWith(ext)
  );

const devicesSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    setCurrentDevice: (state, action) => {
      const doc = action.payload;
      if (doc && doc.id) {
        state.currentDevice = {
          ...doc,
          file_path: isConvertibleDoc(doc.file_name)
            ? `https://nurtest.space/api/api/v1/devices/convert/${doc.id}`
            : doc.file_path, // Оставляем оригинальный file_path для PDF
        };
      } else {
        state.currentDevice = null;
      }
    },
  },
  extraReducers: builder => {
    builder
      // Обработка devicesList
      .addCase(devicesList.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(devicesList.fulfilled, (state, action) => {
        state.loading = false;
        state.devicesDatas = action.payload.length ? action.payload : [];
      })
      .addCase(devicesList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Обработка fetchDeviceById
      .addCase(fetchDeviceById.pending, state => {
        state.loading = true;
        state.error = null;
        state.currentDevice = null; // Сбрасываем currentDevice перед загрузкой
      })
      .addCase(fetchDeviceById.fulfilled, (state, action) => {
        state.loading = false;
        const doc = action.payload;
        state.currentDevice = {
          ...doc,
          file_path: isConvertibleDoc(doc.file_name)
            ? `https://nurtest.space/api/api/v1/devices/convert/${doc.id}`
            : doc.file_path, // Оставляем оригинальный file_path для PDF
        };
        if (!state.deviceData.some(d => d.id === doc.id)) {
          state.deviceData.push({
            ...doc,
            file_path: isConvertibleDoc(doc.file_name)
              ? `https://nurtest.space/api/api/v1/devices/convert/${doc.id}`
              : doc.file_path,
          });
        }
      })
      .addCase(fetchDeviceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Обработка fetchDevicesByIds
      .addCase(fetchDevicesByIds.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDevicesByIds.fulfilled, (state, action) => {
        state.loading = false;
        const newDocs = action.payload.filter(
          newDoc => !state.deviceData.some(doc => doc.id === newDoc.id)
        ).map(doc => ({
          ...doc,
          file_path: isConvertibleDoc(doc.file_name)
            ? `https://nurtest.space/api/api/v1/devices/convert/${doc.id}`
            : doc.file_path,
        }));
        state.deviceData = [...state.deviceData, ...newDocs];
        if (!state.currentDevice && newDocs.length > 0) {
          state.currentDevice = newDocs[0];
        }
      })
      .addCase(fetchDevicesByIds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentDevice } = devicesSlice.actions;
export default devicesSlice.reducer;