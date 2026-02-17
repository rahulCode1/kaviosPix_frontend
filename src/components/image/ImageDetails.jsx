import { Form, Link, useNavigate, useRevalidator } from "react-router";
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
      toastError(
        toastId,
        error.response?.data?.message || "Failed to delete image.",
      );
      console.log(error.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container-lg py-4 py-md-5">
      {/* Back Button */}
      <Link
        className="btn btn-outline-secondary btn-sm mb-4 d-inline-flex align-items-center gap-2"
        style={{ borderRadius: "6px", fontWeight: 500 }}
        to={`/albums/${albumDetails.id}`}
      >
        ← Back to Album
      </Link>

      <div className="row g-4 align-items-start">
        {/* Image Column */}
        <div className="col-12 col-md-6 col-lg-7">
          <div
            className="rounded-3 overflow-hidden shadow"
            style={{ aspectRatio: "4/3", background: "#f0f0f0" }}
          >
            <img
              src={imageDetails.imageUrl}
              className="w-100 h-100"
              style={{ objectFit: "cover", display: "block" }}
              alt={imageDetails.name}
            />
          </div>
        </div>

        {/* Details Column */}
        <div className="col-12 col-md-6 col-lg-5">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-body p-4">
              {/* Title */}
              <h4 className="fw-bold mb-3" style={{ lineHeight: 1.3 }}>
                {imageDetails.name}
              </h4>

              <hr className="text-muted mb-3" />

              {/* Meta Info */}
              <div className="d-flex flex-column gap-2 mb-3">
                <div className="d-flex align-items-start gap-2">
                  <span
                    className="text-muted"
                    style={{ minWidth: 70, fontSize: "0.9rem" }}
                  >
                    Person
                  </span>
                  <span className="fw-medium">
                    {imageDetails?.person || "—"}
                  </span>
                </div>

                <div className="d-flex align-items-start gap-2">
                  <span
                    className="text-muted"
                    style={{ minWidth: 70, fontSize: "0.9rem" }}
                  >
                    Tags
                  </span>
                  <div className="d-flex flex-wrap gap-1">
                    {imageDetails.tags.length !== 0 ? (
                      imageDetails.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="badge bg-secondary bg-opacity-10 text-secondary fw-normal px-2 py-1"
                          style={{ fontSize: "0.8rem", borderRadius: "4px" }}
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span
                        className="text-muted fst-italic"
                        style={{ fontSize: "0.9rem" }}
                      >
                        No tags found
                      </span>
                    )}
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <span
                    className="text-muted"
                    style={{ minWidth: 70, fontSize: "0.9rem" }}
                  >
                    Favorite
                  </span>
                  {imageDetails.isFavorite ? (
                    <span
                      className="badge bg-warning text-dark fw-normal px-2 py-1"
                      style={{ fontSize: "0.8rem" }}
                    >
                      ★ Yes
                    </span>
                  ) : (
                    <span
                      className="text-muted fst-italic"
                      style={{ fontSize: "0.9rem" }}
                    >
                      No
                    </span>
                  )}
                </div>
              </div>

              <hr className="text-muted mb-3" />

              {/* Comments */}
              <div className="mb-3">
                <p className="fw-semibold mb-2" style={{ fontSize: "0.95rem" }}>
                  Comments
                </p>
                {imageDetails.comments.length !== 0 ? (
                  <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                    {imageDetails.comments.map((comment, index) => (
                      <li
                        key={index}
                        className="rounded-2 px-3 py-2 bg-light text-dark"
                        style={{ fontSize: "0.88rem" }}
                      >
                        {comment}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p
                    className="text-muted fst-italic mb-0"
                    style={{ fontSize: "0.9rem" }}
                  >
                    No comments yet.
                  </p>
                )}
              </div>

              {/* Add Comment Form */}
              <Form onSubmit={handleAddComments}>
                <div className="mb-3">
                  <label
                    htmlFor="comment"
                    className="form-label fw-medium"
                    style={{ fontSize: "0.9rem" }}
                  >
                    Add a comment
                  </label>
                  <input
                    type="text"
                    id="comment"
                    name="comment"
                    className="form-control form-control-sm"
                    placeholder="Write something..."
                    style={{ borderRadius: "6px" }}
                  />
                </div>
                <div className="d-flex gap-2">
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="btn btn-primary btn-sm flex-grow-1"
                    style={{ borderRadius: "6px" }}
                  >
                    Add Comment
                  </button>
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleDeleteImage}
                    className="btn btn-outline-danger btn-sm"
                    style={{ borderRadius: "6px" }}
                  >
                    Delete
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ImageDetails;
