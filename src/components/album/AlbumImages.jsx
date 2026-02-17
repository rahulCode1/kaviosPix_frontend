import { useDispatch, useSelector } from "react-redux";
import {
  deleteAlbumAsync,
  addAlbumAccessPermissionAsync,
} from "../../pages/album/albumSlice";
import {
  useNavigate,
  useRevalidator,
  Link,
  useSearchParams,
  useLocation,
} from "react-router";
import Model from "../model/Model";
import { useState } from "react";
import axiosInstance from "../../utils/axios";
import favoriteImg from "../images/favorite.png";
import unFavoriteImg from "../images/unfavorite.png";
import {
  loadingToast,
  toastSuccess,
  toastError,
  toastAlert,
} from "../../utils/toast";
import usePhotosContext from "../../context/photosContext";

const AlbumImages = ({ albumImages, album, users }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [emails, setEmails] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [fevtImages, setFevtImgs] = useState([]);
  const { searchText } = usePhotosContext();
  const revalidator = useRevalidator();
  let filteredImages =
    searchParams.get("fetch") === "favorite" ? fevtImages : albumImages;

  filteredImages =
    searchText.length !== 0
      ? filteredImages.filter((image) =>
          image.tags.some((tag) =>
            tag.toLowerCase().includes(searchText.toLowerCase()),
          ),
        )
      : filteredImages;

  const { status } = useSelector((state) => state.album);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDeleteAlbum = async (albumId) => {
    try {
      await dispatch(deleteAlbumAsync(albumId)).unwrap();
      navigate("/albums");
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnChangeEmails = (e) => {
    setEmails(e.target.value);
  };

  const handleAlbumSharing = async (e) => {
    e.preventDefault();

    const data = { emails: emails.split(","), albumId: album.id };

    try {
      await dispatch(addAlbumAccessPermissionAsync(data)).unwrap();

      setModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMarkOrUnmarkFavorite = async (imageId, isFavorite) => {
    const toastId = loadingToast(
      `${isFavorite ? "Removing to Favorite..." : "Marking Favorite as Favorite..."}`,
    );

    try {
      setIsLoading(true);
      const response = await axiosInstance.put(
        `/albums/${album.id}/images/${imageId}/favorite`,
      );

      if (response.data?.success) {
        revalidator.revalidate();

        if (searchParams.get("fetch") === "favorite") {
          setFevtImgs((prevImg) => prevImg.filter((img) => img.id !== imageId));
        }

        toastSuccess(
          toastId,
          response.data?.message ||
            `${isFavorite ? "Removed from favorite" : "Marked as favorite."}`,
        );
      }
    } catch (error) {
      console.log(error);
      toastError(
        toastId,
        error.response?.data?.message || "Something went wrong.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onUpdateSearchParams = (key, value) => {
    const params = new URLSearchParams(searchParams);

    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    return setSearchParams(params);
  };

  const fetchFevtImgs = async () => {
    onUpdateSearchParams("fetch", "favorite");
    const toastId = loadingToast("Fetching favorite images...");
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/albums/${album.id}/images/favorites`,
      );
      const images = response.data?.images;
      // console.log(response.data);
      setFevtImgs(images || []);
      toastSuccess(
        toastId,
        response.data?.message || "Showing Favorite images",
      );
    } catch (error) {
      console.log(error);
      toastError(
        toastId,
        error.response?.data?.message || "Failed to fetch favorite images.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const location = useLocation();

  const handleCopy = async () => {
    const url = window.location.origin + location.pathname;

    try {
      await navigator.clipboard.writeText(url);
      toastAlert("Link copied successfully!");
    } catch (error) {
      toastAlert("Failed to copy");
    }
  };

  return (
    <main className="md-container py-4">
      {isModalOpen && (
        <Model
          onclose={() => setModalOpen((prevStat) => !prevStat)}
          onSave={handleAlbumSharing}
          btnText={"Allow Permession"}
          title={"Add User Permission"}
          isDisabled={status === "Loading"}
        >
          <form>
            <div>
              <label htmlFor="emails" className="form-label">
                Add Emails:
              </label>

              <select
                className="form-select"
                onChange={handleOnChangeEmails}
                name="emails"
                id="emails"
              >
                <option value="" disabled selected>
                  Select User
                </option>
                {users.map((user) => (
                  <option value={user.email}>{user.email}</option>
                ))}
              </select>
            </div>
          </form>
        </Model>
      )}

      {/* HEADER SECTION */}
      <div className="d-flex  align-items-center justify-content-between mb-4">
        {/* LEFT SIDE */}
        <div className="">
          <Link to="/albums" className="btn btn-light border shadow-sm me-3">
            ← Back
          </Link>
        </div>

        {/* RIGHT SIDE (UNCHANGED ACTIONS BUTTON) */}
        <div className="dropdown text-end">
          <button
            className="btn btn-light border-0"
            type="button"
            data-bs-toggle="dropdown"
          >
            Actions ⋮
          </button>

          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <button
                className="dropdown-item"
                onClick={() => onUpdateSearchParams("fetch", null)}
              >
                All Imgs
              </button>
            </li>
            <li>
              <button
                disabled={isLoading}
                className="dropdown-item"
                onClick={fetchFevtImgs}
              >
                All Favorite Imgs
              </button>
            </li>
            <li>
              <button
                onClick={() => setModalOpen(!isModalOpen)}
                disabled={status === "Loading"}
                className="dropdown-item"
              >
                Add User Permission
              </button>
            </li>
            <li>
              <button
                onClick={() => handleDeleteAlbum(album.id)}
                className="dropdown-item"
                disabled={status === "Loading"}
              >
                Delete album
              </button>
            </li>
            <li>
              <button onClick={handleCopy} className="dropdown-item">
                Copy Album Url
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <h2 className="fw-bold mb-0">
          {album.name}({filteredImages && filteredImages.length}) images
        </h2>
      </div>

      <div
        className="py-4"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr)",
          gap: "5px",
          alignItems: "center",
        }}
      >
        {filteredImages && filteredImages.length !== 0 ? (
          filteredImages.map((image) => (
            <div key={image.id} style={{ position: "relative" }}>
              <Link
                to={`/image/${image.id}?albumId=${album.id}`}
                state={{ from: `/albums/${album.id}` }}
              >
                <img
                  src={image.imageUrl}
                  className=" img-fluid rounded shadow"
                  style={{
                    objectFit: "cover",

                    width: "100%",
                    height: "300px",
                  }}
                  alt={image.name}
                />
              </Link>

              <p
                style={{
                  position: "absolute",
                  left: "10px",
                  bottom: "0",
                }}
                className="text-light"
              >
                {image.name}
              </p>

              <button
                className=" btn "
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  background: "rgba(255,255,255,0.8)",
                  padding: "6px",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
                onClick={() =>
                  handleMarkOrUnmarkFavorite(image.id, image.isFavorite)
                }
                disabled={isLoading}
              >
                {image.isFavorite ? (
                  <img
                    src={unFavoriteImg}
                    style={{ width: "25px" }}
                    alt="Add to favorite"
                  />
                ) : (
                  <img
                    src={favoriteImg}
                    style={{ width: "25px" }}
                    alt="Remove from favorite"
                  />
                )}
              </button>
            </div>
          ))
        ) : (
          <p>No image found on that album.</p>
        )}
      </div>
    </main>
  );
};

export default AlbumImages;
