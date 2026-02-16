const Loading = () => {
  return (
    <div className="position-fixed top-0 start-0 w-100 vh-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50">
      <div
        className="spinner-border text-light"
        style={{ width: "4rem", height: "4rem" }}
        role="status"
      ></div>
    </div>
  );
};

export default Loading;
