const Modal = ({ onSave, title, type, children, isDisabled, onclose, btnText }) => {
  return (
    <>
      <div
        className="modal show d-block"
        onClick={onclose}
        style={{
          backgroundColor: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(3px)",
        }}
      >
        <div
          className="modal-dialog modal-dialog-centered modal-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="modal-content border-0 shadow-lg"
            style={{
              borderRadius: "18px",
              overflow: "hidden",
            }}
          >
            {/* HEADER */}
            <div
              className="modal-header border-0"
              style={{
                background: "linear-gradient(135deg, #0d6efd, #4dabf7)",
                color: "white",
                padding: "20px 25px",
              }}
            >
              <div className="d-flex justify-content-between align-items-center w-100">
                <h5 className="fw-bold mb-0">{title}</h5>

                <button
                  onClick={onclose}
                  className="btn btn-sm btn-light rounded-circle"
                  style={{ width: "35px", height: "35px" }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* BODY */}
            <div className="modal-body p-4">
              {children}

              {/* ACTION BUTTONS */}
              <div className="d-flex justify-content-end gap-3 pt-4">
                <button
                  onClick={onclose}
                  className="btn btn-outline-secondary px-4"
                  style={{ borderRadius: "8px" }}
                >
                  Close
                </button>

                <button
                  onClick={onSave}
                  type={type}
                  disabled={isDisabled}
                  className="btn btn-primary px-4 shadow-sm"
                  style={{
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #0d6efd, #4dabf7)",
                    border: "none",
                  }}
                >
                  {btnText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
