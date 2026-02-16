import { Outlet } from "react-router";
import Header from "./Header";
import { ToastContainer } from "react-toastify";

const RootLayout = () => {
  return (
    <>
      <Header />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <Outlet />
    </>
  );
};

export default RootLayout;
