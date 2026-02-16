import { useDispatch, useSelector } from "react-redux";
import { Form } from "react-router";
import { fetchAlbumAsync } from "../../pages/album/albumSlice";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { addImageAsync } from "../../pages/image/imageSlice";

const AddImage = () => {
  const initialValue = {
    albumId: "",
    name: "",
    person: "",
    tags: "",
  };
  const [imageData, setImageData] = useState(initialValue);
  const [imageFile, setImageFile] = useState("");
  const { albums } = useSelector((state) => state.album);
  const { images, status, error } = useSelector((state) => state.image);
  const fileRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAlbumAsync());
  }, []);

  const handleOnSelectFile = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, PNG, and GIF files allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > maxSize) {
      alert("File must be under 5MB.");
      e.target.value = "";
      return;
    }

    setImageFile(file);
  };

  const handleOnChange = (e) => {
    setImageData((prevStat) => ({
      ...prevStat,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddImage = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("No image choose, Please choose image.");
    }

    const formData = {
      albumId: imageData.albumId,
      name: imageData.name,
      person: imageData.person,
      tags: imageData.tags.split(",").map((tag) => tag.trim()),
      imageFile,
    };

    try {
      await dispatch(addImageAsync(formData)).unwrap();

      setImageData(initialValue);
      fileRef.current.value = "";
      setImageFile("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="container py-5 container-fluid">
      <h1 className="py-3">Add new Image </h1>
      <Form onSubmit={handleAddImage}>
        <div>
          <label htmlFor="albumId" className="form-label">
            Select Album:{" "}
          </label>
          <select
            id="albumId"
            name="albumId"
            required
            onChange={handleOnChange}
            value={imageData.albumId}
            className="form-select"
          >
            <option value="" selected disabled>
              Select Album{" "}
            </option>
            {albums &&
              albums.map((album) => (
                <option value={album.id} key={album.id}>
                  {album.name}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label htmlFor="name" className="form-label">
            Name:{" "}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            onChange={handleOnChange}
            value={imageData.name}
            className="form-control"
          />
        </div>
        <div>
          <label htmlFor="person" className="form-label">
            Person name:{" "}
          </label>
          <input
            type="text"
            id="person"
            name="person"
            required
            onChange={handleOnChange}
            value={imageData.person}
            className="form-control"
          />
        </div>

        <div>
          <label htmlFor="tags" className="form-label">
            Tags :{" "}
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            required
            onChange={handleOnChange}
            value={imageData.tags}
            className="form-control"
          />
        </div>

        <div>
          <label htmlFor="image" className="form-label">
            Image :{" "}
          </label>
          <input
            type="file"
            onChange={handleOnSelectFile}
            id="image"
            name="image"
            ref={fileRef}
            required
            accept="image/jpeg,image/png,image/gif"
            className="form-control"
          />
        </div>

        <button
          className="btn btn-primary my-3"
          type="submit"
          disabled={status === "Loading"}
        >
          Add Image
        </button>
      </Form>
    </main>
  );
};

export default AddImage;
