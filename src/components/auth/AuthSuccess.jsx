import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/albums");
    } else {
      navigate("/login");
    }
  }, [searchParams, navigate]);

  return <></>;
};

export default AuthSuccess;
