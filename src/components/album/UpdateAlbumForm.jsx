const UpdateAlbumForm = ({ album, handleOnChangeDescription }) => {
  return (
    <>
      <form>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={album.name}
            required
            disabled
            className="form-control"
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
            onChange={handleOnChangeDescription}
            value={album.description}
            className="form-control"
          />
        </div>
      </form>
    </>
  );
};

export default UpdateAlbumForm;
