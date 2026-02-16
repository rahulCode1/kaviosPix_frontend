import { NavLink, useNavigate } from "react-router";
import usePhotosContext from "../../context/photosContext";

const Header = () => {
  const { handleLogout } = usePhotosContext();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/albums">
            kaviosPix
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {token && userId && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/albums">
                    Albums
                  </NavLink>
                </li>
              )}
              {token && userId && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/albums/add">
                    Add Album
                  </NavLink>
                </li>
              )}
              {token && userId && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/image">
                    Add Image
                  </NavLink>
                </li>
              )}
              {!token && !userId && (
                <li className="nav-item">
                  <NavLink
                    className="nav-link active"
                    aria-current="page"
                    to="/login"
                  >
                    Login
                  </NavLink>
                </li>
              )}
              {token && userId && (
                <li className="nav-item">
                  <button
                    onClick={() => handleLogout(navigate)}
                    className="nav-link active"
                  >
                    Logout
                  </button>
                </li>
              )}
            </ul>
           
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
