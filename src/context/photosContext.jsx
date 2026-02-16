import { createContext, useContext, useState } from "react";

const PhotosContext = createContext();

const usePhotosContext = () => useContext(PhotosContext);
export default usePhotosContext;

export const PhotosProvider = ({ children }) => {
  const initialValue = {
    userId: "",
    email: "",
    name: "",
  };

  const [user, setUser] = useState(initialValue);
  const [searchText, setSearchText] = useState("");

  const handleLogout = (navigate) => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUser(initialValue);
    navigate("/login");
  };

  return (
    <PhotosContext.Provider
      value={{
        user,
        setUser,
        searchText,
        setSearchText,
        handleLogout,
      }}
    >
      {children}
    </PhotosContext.Provider>
  );
};
