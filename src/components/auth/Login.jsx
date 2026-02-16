import googleLogo from "../images/google.png";

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/google`;
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
      }}
    >
      <div
        className="card shadow-lg border-0 p-5"
        style={{ width: "400px", borderRadius: "15px" }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold">Welcome Back</h2>
          <p className="text-muted mb-0">Sign in to continue to your account</p>
        </div>

        <button
          className="btn btn-light border d-flex align-items-center justify-content-center shadow-sm"
          style={{
            fontSize: "18px",
            padding: "10px",
            borderRadius: "8px",
          }}
          onClick={handleGoogleLogin}
        >
          <img
            src={googleLogo}
            alt="Google"
            style={{
              width: "24px",
              marginRight: "10px",
            }}
          />
          Sign in with Google
        </button>

        <div className="text-center mt-4">
          <small className="text-muted">Secure login powered by Google</small>
        </div>
      </div>
    </div>
  );
};

export default Login;
