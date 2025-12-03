import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import invoiceService from '../../services/invoiceService';

// Initial state
const initialState = {
  invoices: [],
  currentInvoice: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10,
  },
  filters: {
    search: '',
    status: '',
    type: '',
    startDate: null,
    endDate: null,
  },
  stats: {
    total: 0,
    paid: 0,
    pending: 0,
    overdue: 0,
  },
};

// Async thunks
export const fetchInvoices = createAsyncThunk(
  'invoices/fetchInvoices',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await invoiceService.getAll(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchInvoiceById = createAsyncThunk(
  'invoices/fetchInvoiceById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await invoiceService.getById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createInvoice = createAsyncThunk(
  'invoices/createInvoice',
  async (invoiceData, { rejectWithValue }) => {
    try {
      const response = await invoiceService.create(invoiceData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateInvoice = createAsyncThunk(
  'invoices/updateInvoice',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await invoiceService.update(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteInvoice = createAsyncThunk(
  'invoices/deleteInvoice',
  async (id, { rejectWithValue }) => {
    try {
      await invoiceService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const validateInvoice = createAsyncThunk(
  'invoices/validateInvoice',
  async (id, { rejectWithValue }) => {
    try {
      const response = await invoiceService.validate(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchOverdueInvoices = createAsyncThunk(
  'invoices/fetchOverdueInvoices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await invoiceService.getOverdue();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchInvoiceStats = createAsyncThunk(
  'invoices/fetchInvoiceStats',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await invoiceService.getStats(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const downloadInvoicePDF = createAsyncThunk(
  'invoices/downloadInvoicePDF',
  async (id, { rejectWithValue }) => {
    try {
      const blob = await invoiceService.downloadPDF(id);
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `facture-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateInvoiceStatus = createAsyncThunk(
  'invoices/updateInvoiceStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await invoiceService.updateStatus(id, status);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    setCurrentInvoice: (state, action) => {
      state.currentInvoice = action.payload;
    },
    clearCurrentInvoice: (state) => {
      state.currentInvoice = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateInvoiceItem: (state, action) => {
      if (state.currentInvoice) {
        const { index, item } = action.payload;
        state.currentInvoice.items[index] = item;
      }
    },
    addInvoiceItem: (state, action) => {
      if (state.currentInvoice) {
        state.currentInvoice.items.push(action.payload);
      }
    },
    removeInvoiceItem: (state, action) => {
      if (state.currentInvoice) {
        state.currentInvoice.items = state.currentInvoice.items.filter(
          (_, index) => index !== action.payload
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch invoices
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload.data || action.payload;
        state.pagination = {
          currentPage: action.payload.currentPage || 1,
          totalPages: action.payload.totalPages || 1,
          totalItems: action.payload.total || action.payload.data?.length || 0,
          pageSize: action.payload.pageSize || 10,
        };
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch invoice by ID
      .addCase(fetchInvoiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInvoice = action.payload;
      })
      .addCase(fetchInvoiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create invoice
      .addCase(createInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices.unshift(action.payload);
        state.currentInvoice = action.payload;
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update invoice
      .addCase(updateInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.invoices.findIndex((i) => i._id === action.payload._id);
        if (index !== -1) {
          state.invoices[index] = action.payload;
        }
        if (state.currentInvoice?._id === action.payload._id) {
          state.currentInvoice = action.payload;
        }
      })
      .addCase(updateInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete invoice
      .addCase(deleteInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = state.invoices.filter((i) => i._id !== action.payload);
        if (state.currentInvoice?._id === action.payload) {
          state.currentInvoice = null;
        }
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Validate invoice
      .addCase(validateInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateInvoice.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.invoices.findIndex((i) => i._id === action.payload._id);
        if (index !== -1) {
          state.invoices[index] = action.payload;
        }
        if (state.currentInvoice?._id === action.payload._id) {
          state.currentInvoice = action.payload;
        }
      })
      .addCase(validateInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch invoice stats
      .addCase(fetchInvoiceStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })

      // Download PDF
      .addCase(downloadInvoicePDF.pending, (state) => {
        state.loading = true;
      })
      .addCase(downloadInvoicePDF.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadInvoicePDF.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update invoice status
      .addCase(updateInvoiceStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInvoiceStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.invoices.findIndex((i) => i._id === action.payload._id);
        if (index !== -1) {
          state.invoices[index] = action.payload;
        }
        if (state.currentInvoice?._id === action.payload._id) {
          state.currentInvoice = action.payload;
        }
      })
      .addCase(updateInvoiceStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Actions
export const {
  setCurrentInvoice,
  clearCurrentInvoice,
  setFilters,
  clearFilters,
  clearError,
  updateInvoiceItem,
  addInvoiceItem,
  removeInvoiceItem,
} = invoiceSlice.actions;

// Selectors
export const selectInvoices = (state) => state.invoices.invoices;
export const selectCurrentInvoice = (state) => state.invoices.currentInvoice;
export const selectInvoicesLoading = (state) => state.invoices.loading;
export const selectInvoicesError = (state) => state.invoices.error;
export const selectInvoicesPagination = (state) => state.invoices.pagination;
export const selectInvoicesFilters = (state) => state.invoices.filters;
export const selectInvoicesStats = (state) => state.invoices.stats;

export default invoiceSlice.reducer;
