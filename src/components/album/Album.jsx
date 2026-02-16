import { useEffect, useState } from "react";
import axios from "axios";
import {  Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAlbumAsync,
  editAlbumDescriptionAsync,
} from "../../pages/album/albumSlice";
import Modal from "../model/Model";
import UpdateAlbumForm from "./UpdateAlbumForm";
import usePhotosContext from "../../context/photosContext";

const Album = () => {
  const initialAlbum = {
    albumId: "",
    name: "",
    description: "",
  };

  const { user, setUser } = usePhotosContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [album, setAlbum] = useState(initialAlbum);

  const token = localStorage.getItem("token");
 

  const { albums, status, error } = useSelector((state) => state.album);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const validateUserLogin = async () => {
      if (!token) {
        return navigate("/login");
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/auth/loggedUser`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

      
        setUser(response.data?.user);
        localStorage.setItem("userId", response.data?.user.id);
      } catch (error) {
        console.log(error);
      }
    };

    if (token) {
      validateUserLogin();
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchAlbums = () => {
      dispatch(fetchAlbumAsync());
    };

    fetchAlbums();
  }, [dispatch]);

  const handleModalToggle = (album) => {
    setAlbum(album);
    setIsModalOpen(true);
  };

  const handleOnChangeDescription = (e) => {
    setAlbum((prevStat) => ({ ...prevStat, [e.target.name]: e.target.value }));
  };

  const handleUpdateDescription = async (e) => {
    e.preventDefault();

    try {
      await dispatch(editAlbumDescriptionAsync(album)).unwrap();
      setAlbum(initialAlbum);

      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="container py-4">
      {isModalOpen && (
        <Modal
          title={"Update description"}
          btnText={"Save"}
          isDisabled={status === "Loading"}
          onSave={handleUpdateDescription}
          onclose={() => setIsModalOpen((prevStat) => !prevStat)}
        >
          <UpdateAlbumForm
            album={album}
            handleOnChangeDescription={handleOnChangeDescription}
          />
        </Modal>
      )}

      <div className="container py-5">
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
          <h2 className="fw-bold mb-3 mb-md-0">
            <i className="bi bi-images me-2 text-primary"></i>
            All Albums ({albums.length})
          </h2>

          <Link to="/albums/add" className="btn btn-primary shadow-sm">
            <i className="bi bi-plus-circle me-2"></i>
            Create Album
          </Link>
        </div>
        <div>
          <h2> Welcome {user.name}</h2>
        </div>

        {/* ALBUM GRID */}
        <div className="row g-4 py-4">
          {status === "Loading" ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : albums && albums.length !== 0 ? (
            albums.map((album) => (
              <div className="col-sm-6 col-md-4 col-lg-3" key={album.id}>
                <div
                  className="card border-0 shadow-sm h-100"
                  style={{
                    borderRadius: "15px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div className="card-body">
                    {/* Album Icon */}
                    <div className="mb-3 text-center">
                      <i
                        className="bi bi-folder2-open text-primary"
                        style={{ fontSize: "40px" }}
                      ></i>
                    </div>

                    {/* Album Name */}
                    <h5 className="card-title fw-bold text-center">
                      {album.name}
                    </h5>

                    {/* Description */}
                    <p className="card-text text-muted text-center small">
                      {album?.description || "No description"}
                    </p>
                    {/* Owner */}
                    <p className="card-text text-muted text-center small">
                      Created by: {album?.ownerId?.name}
                    </p>

                    {/* Buttons */}
                    <div className="d-flex justify-content-between mt-3">
                      <button
                        onClick={() => handleModalToggle(album)}
                        className="btn btn-sm btn-outline-primary w-50 me-2"
                      >
                        <i className="bi bi-pencil-square me-1"></i>
                        Edit
                      </button>

                      <Link
                        to={album.id}
                        className="btn btn-sm btn-primary w-50"
                      >
                        <i className="bi bi-eye me-1"></i>
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-5">
              <i
                className="bi bi-folder-x text-muted"
                style={{ fontSize: "50px" }}
              ></i>
              <p className="mt-3 text-muted">No albums found.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Album;
