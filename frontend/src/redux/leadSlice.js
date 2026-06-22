import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  leads: [],
  lead: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  pages: 1,
};

const leadSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    setLeads: (state, action) => {
      state.leads = action.payload.leads;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.pages = action.payload.pages;
      state.loading = false;
    },
    setLead: (state, action) => {
      state.lead = action.payload;
      state.loading = false;
    },
    addLead: (state, action) => {
      state.leads.unshift(action.payload);
      state.total += 1;
    },
    updateLead: (state, action) => {
      const index = state.leads.findIndex((l) => l._id === action.payload._id);
      if (index !== -1) state.leads[index] = action.payload;
    },
    removeLead: (state, action) => {
      state.leads = state.leads.filter((l) => l._id !== action.payload);
      state.total -= 1;
    },
    setLoading: (state) => { state.loading = true; },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setLeads, setLead, addLead, updateLead, removeLead, setLoading, setError } = leadSlice.actions;
export default leadSlice.reducer;
