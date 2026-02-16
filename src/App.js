import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.js"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router"
import RootLayout from "./components/layout/RootLayout"
import LoginPage from './pages/auth/LoginPage';
import AuthSuccess from './components/auth/AuthSuccess';
import AlbumPage from './pages/album/AlbumPage';
import { PhotosProvider } from './context/photosContext';
import AddAlbumPage from './pages/album/AddAlbumPage';
import 'react-toastify/dist/ReactToastify.css';
import AddImagePage from './pages/image/AddImagePage';
import AlbumImagesPage, { loader as albumImagesLoader } from './pages/album/AlbumImagesPage';
import ImageDetailsPage, { loader as imageDetailsLoader } from './pages/image/ImageDetailsPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorPage from './components/Error/Error';


const router = createBrowserRouter([
  {
    path: "/", element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true, element: <Navigate to="login" />
      },
      {
        path: "login",
        element: <LoginPage />
      },
      {
        path: "v1/profile/google",
        element: <AuthSuccess />
      },
      {
        path: "albums",

        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <AlbumPage />
          },
          {
            path: "add", element: <AddAlbumPage />
          },
          {
            path: ":albumId",
            element: <AlbumImagesPage />,
            loader: albumImagesLoader
          }
        ]
      },

      {
        path: "image",
        element: <ProtectedRoute />,
        children: [
          {
            index: true, element: <AddImagePage />
          },
          {
            path: ":imageId",
            element: <ImageDetailsPage />,
            loader: imageDetailsLoader
          }
        ]
      }
    ]
  }
])


function App() {
  return <>
    <PhotosProvider>

      <RouterProvider router={router} />
    </PhotosProvider>
  </>
}

export default App;
