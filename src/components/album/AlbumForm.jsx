import { useDispatch, useSelector } from "react-redux";
import { Form, useNavigate } from "react-router";
import { addAlbumAsync } from "../../pages/album/albumSlice";

const AlbumForm = () => {
  const {  status } = useSelector((state) => state.album);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleAddAlbum = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const album = Object.fromEntries(formData);

    try {
      await dispatch(addAlbumAsync(album)).unwrap();

      navigate("/albums");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="container py-5">

      <h1>Create new Album </h1>
      <Form onSubmit={handleAddAlbum}>
        <div>
          <label htmlFor="name" className="form-label">
            Album Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            // required
          />
        </div>
        <div>
          <label htmlFor="description" className="form-label">
            Description:{" "}
          </label>
          <textarea
            type="text"
            id="description"
            name="description"
            rows={3}
            className="form-control"
          />
        </div>

        <button
          disabled={status === "Loading"}
          className="btn mt-3 btn-primary"
          type="submit"
        >
          {status === "Loading" ? "Adding new album..." : "Add Album"}
        </button>
      </Form>
    </main>
  );
};

export default AlbumForm;
