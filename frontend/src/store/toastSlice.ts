import { createSlice } from '@reduxjs/toolkit';

type Toast = { id: string; message: string; type?: 'success' | 'error' | 'info' };
type ToastState = { items: Toast[] };

const initialState: ToastState = { items: [] };

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToast(state, action: { payload: Omit<Toast, 'id'> & { id?: string } }) {
      const id = action.payload.id || Math.random().toString(36).slice(2);
      state.items.push({ id, message: action.payload.message, type: action.payload.type });
    },
    removeToast(state, action: { payload: string }) {
      state.items = state.items.filter(t => t.id !== action.payload);
    },
    clearToasts(state) {
      state.items = [];
    },
  },
});

export const { addToast, removeToast, clearToasts } = toastSlice.actions;
export default toastSlice.reducer;
