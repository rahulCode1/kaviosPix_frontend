import {
  Form,
  Link,
  useLocation,
  useNavigate,
  useRevalidator,
} from "react-router";
import axiosInstance from "../../utils/axios";
import {
  loadingToast,
  toastSuccess,
  toastError,
  toastAlert,
} from "../../utils/toast";
import { useState } from "react";

const ImageDetails = ({ imageDetails, albumDetails }) => {
  const revalidor = useRevalidator();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddComments = async (e) => {
    e.preventDefault();
    const toastId = loadingToast("Adding comment...");
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(
        `/albums/images/${imageDetails.id}/comments`,
        data,
      );

      if (response.data?.success) {
        revalidor.revalidate();
        e.target.reset();
        toastSuccess(
          toastId,
          response.data?.message || "Comment added successfully.",
        );
        // console.log(response.data);
      }
    } catch (error) {
      toastError(
        toastId,
        error.response?.data?.message || "Failed to add comment.",
      );
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = async () => {
    const albumId = albumDetails.id;
    const imageId = imageDetails.id;
    const toastId = loadingToast("Deleting image...");

    if (!albumId || !imageId) {
      return toastAlert("Album id || Image id not found");
    }


    try {
      setIsLoading(true);
      const response = await axiosInstance.delete(
        `/albums/${albumId}/images/${imageId}/delete`,
      );
      console.log(response);
      toastSuccess(
        toastId,
        response.data?.message || "Image deleted successfully.",
      );

      if (response.data?.success) {
        navigate(`/albums/${albumId}`);
      }
    } catch (error) {
      toastError(toastId, error.response?.data?.message || "Failed to delete image.");
      console.log(error.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container py-4">
      <Link
        className="btn btn-light border shadow-sm"
        style={{ borderRadius: "8px" }}
        to={`/albums/${albumDetails.id}`}
      >
        ← Back to Album
      </Link>
      <div>
        <img
          src={imageDetails.imageUrl}
          className="img img-fluid rounded shadow my-3"
          style={{ objectFit: "cover" }}
        />

        <div className="py-3  px-4 shadow rounded">
          <p className="fw-bold">{imageDetails.name}</p>
          <p>
            <strong>Person: </strong>
            {imageDetails?.person}
          </p>
          <p>
            <strong>Tags: </strong>
            {imageDetails.tags.length !== 0 ? (
              imageDetails.tags.join(", ")
            ) : (
              <p>NO tags found</p>
            )}
          </p>

          <p>
            <strong>Favorite: </strong> {imageDetails.isFavorite ? "Yes" : "No"}
          </p>

          <ul>
            {imageDetails.comments.length !== 0 ? (
              imageDetails.comments.map((comment, index) => (
                <li key={index}>{comment}</li>
              ))
            ) : (
              <p>No Comments found.</p>
            )}
          </ul>

          <div>
            <Form onSubmit={handleAddComments}>
              <div>
                <label htmlFor="comment" className="form-label">
                  Write Comments:
                </label>
                <input
                  type="text"
                  id="comment"
                  name="comment"
                  className="form-control"
                />
              </div>
              <div className="py-3 d-flex justify-content-between">
                <button
                  disabled={isLoading}
                  type="submit"
                  className="btn btn-primary"
                >
                  Add Comment
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleDeleteImage}
                  className="btn btn-danger"
                >
                  Delete image
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ImageDetails;
