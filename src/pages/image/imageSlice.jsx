import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axios";
import { loadingToast, toastError, toastSuccess } from "../../utils/toast";

export const addImageAsync = createAsyncThunk(
  "image/add",
  async (entries, { rejectWithValue }) => {
    const toastId = loadingToast("Adding image...");
    try {
      const formData = new FormData();
      formData.append("albumId", entries.albumId);
      formData.append("name", entries.name);
      formData.append("person", entries.person);
      formData.append("tags", entries.tags)
      formData.append("image", entries.imageFile);

      const response = await axiosInstance.post(
        `/albums/${entries.albumId}/images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // console.log(response)

      toastSuccess(
        toastId,
        response.data?.message || "Image added successfully",
      );
      return response.data;
    } catch (error) {

      console.log(error)

      toastError(
        toastId,
        error.response?.data?.message || "Failed to add new image.",
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to add new image.",
      );
    }
  },
);

export const markOrUnmarkFavoriteAsync = createAsyncThunk(
  "image/isFavorite",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/albums/${data.albumId}/images/${data.imageId}/favorite`,
        data,
      );

      console.log(response);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

const imageSlice = createSlice({
  name: "image",
  initialState: {
    images: [],
    status: "Idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addImageAsync.pending, (state) => {
      state.status = "Loading";
    });

    builder.addCase(addImageAsync.fulfilled, (state, action) => {
      state.status = "Success";
      state.images.push(action.payload.image);
    });

    builder.addCase(addImageAsync.rejected, (state, action) => {
      state.status = "Error";
      state.error = action.payload?.message;
    });
  },
});

export default imageSlice.reducer;
