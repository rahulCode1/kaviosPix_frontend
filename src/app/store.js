import albumSlice from "../pages/album/albumSlice"
import { configureStore } from "@reduxjs/toolkit"
import imageSlice from "../pages/image/imageSlice"

const store = configureStore({
    reducer: {
        album: albumSlice,
        image: imageSlice
    }
})

export default store