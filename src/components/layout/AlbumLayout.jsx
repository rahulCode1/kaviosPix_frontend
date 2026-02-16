import { Outlet } from "react-router";
import usePhotosContext from "../../context/photosContext";
const AlbumLayout = () => {

      const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const { setSearchText } = usePhotosContext()


  return (
    <div className="container py-3">
      
      {token && userId && (
        <form className="d-flex" role="search">
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search via tags"
            aria-label="Search"
            onChange={(e)=>setSearchText(e.target.value)}
          />
        
        </form>
      )}
      <Outlet />
    </div>
  );
};

export default AlbumLayout;
