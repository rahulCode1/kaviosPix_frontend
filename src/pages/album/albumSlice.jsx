import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiInstance from "../../utils/axios";
import { loadingToast, toastError, toastSuccess } from "../../utils/toast";

export const addAlbumAsync = createAsyncThunk(
  "album/add",
  async (newAlbum, { rejectWithValue }) => {
    const toastId = loadingToast("Adding album...");
    try {
      const response = await apiInstance.post("/albums", newAlbum);

      toastSuccess(
        toastId,
        response.data?.message || "New album added successfully.",
      );
      return response.data;
    } catch (error) {
      toastError(
        toastId,
        error.response?.data?.message || "Failed to add new album",
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to add new album.",
      );
    }
  },
);

export const fetchAlbumAsync = createAsyncThunk(
  "album/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get("/albums");

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch album.",
      );
    }
  },
);

export const editAlbumDescriptionAsync = createAsyncThunk(
  "album/addDescription",
  async (data, { rejectWithValue }) => {
    const toastId = loadingToast("Adding description...");
    const albumId = data.id;

    try {
      const response = await apiInstance.put(`/albums/${albumId}`, {
        description: data.description,
      });

      toastSuccess(
        toastId,
        response.data?.message || "Description added successfully.",
      );
      return response.data?.album;
    } catch (error) {
      toastError(
        toastId,
        error.response?.data?.message || "Failed to add description",
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to add description.",
      );
    }
  },
);

export const addAlbumAccessPermissionAsync = createAsyncThunk(
  "album/addPermission",
  async (data, { rejectWithValue }) => {
    const toastId = loadingToast("Allowing permissions...");
    const albumId = data.albumId;
    try {
      const response = await apiInstance.put(`/albums/${albumId}/share`, {
        emails: data.emails.map((email) => email.trim()),
      });

      toastSuccess(
        toastId,
        response.data?.message || "Permission allowed successfully.",
      );

      return response.data;
    } catch (error) {
      toastError(
        toastId,
        error.response?.data?.message || "Failed to allow permission",
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to allow permission.",
      );
    }
  },
);

export const deleteAlbumAsync = createAsyncThunk(
  "album/delete",
  async (albumId, { rejectWithValue }) => {
    const toastId = loadingToast("Deleting album...");

    try {
      const response = await apiInstance.delete(`/albums/${albumId}`);

      toastSuccess(
        toastId,
        response.data?.message || "Album deleted successfully.",
      );
      return response.data;
    } catch (error) {
      toastError(
        toastId,
        error.response?.data?.message || "Failed to delete album",
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete album.",
      );
    }
  },
);

const albumSlice = createSlice({
  name: "album",
  initialState: {
    albums: [],
    status: "idle",
    error: null,
  },

  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addAlbumAsync.pending, (state) => {
      state.status = "Loading";
    });

    builder.addCase(addAlbumAsync.fulfilled, (state, action) => {
      state.status = "Success";
      state.albums.push(action.payload.album);
    });

    builder.addCase(addAlbumAsync.rejected, (state, action) => {
      state.status = "Error";
      state.error = action.payload?.message;
    });

    builder.addCase(fetchAlbumAsync.pending, (state) => {
      state.status = "Loading";
    });

    builder.addCase(fetchAlbumAsync.fulfilled, (state, action) => {
      state.status = "Success";

      state.albums = action.payload?.albums;
    });
    builder.addCase(fetchAlbumAsync.rejected, (state, action) => {
      state.status = "Error";
      state.error = action.payload;
    });

    builder.addCase(editAlbumDescriptionAsync.pending, (state) => {
      state.status = "Loading";
    });

    builder.addCase(editAlbumDescriptionAsync.fulfilled, (state, action) => {
      const albumIndex = state.albums.findIndex(
        (album) => album.id === action.payload.id,
      );
      state.status = "Success";
      state.albums[albumIndex].description = action.payload.description;
    });
    builder.addCase(editAlbumDescriptionAsync.rejected, (state, action) => {
      state.status = "Error";
      state.error = action.payload;
    });

    builder.addCase(addAlbumAccessPermissionAsync.pending, (state) => {
      state.status = "Loading";
    });

    builder.addCase(addAlbumAccessPermissionAsync.fulfilled, (state) => {
      state.status = "Success";
    });

    builder.addCase(addAlbumAccessPermissionAsync.rejected, (state, action) => {
      state.status = "Error";
      state.error = action.payload;
    });

    builder.addCase(deleteAlbumAsync.pending, (state) => {
      state.status = "Loading";
    });
    builder.addCase(deleteAlbumAsync.fulfilled, (state, action) => {
      state.status = "Success";
      console.log(action.payload.albumId);
      state.albums = state.albums.filter(
        (album) => album.id !== action.payload.albumId,
      );
    });

    builder.addCase(deleteAlbumAsync.rejected, (state, action) => {
      state.status = "Error";
      state.error = action.payload;
    });
  },
});

export default albumSlice.reducer;
