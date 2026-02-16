import Header from "../layout/Header";
import { Link, useRouteError } from "react-router";

const ErrorPage = () => {
  const error = useRouteError();

  let title = "An error occurred!";
  let message = `Couldn't find this page. `;

  if (error.init?.status === 422) {
    title = "Unauthorized Access";
    message =
      error?.data?.message ||
      "Yourn't allow to see the resources until owner allow you to see that.";
  }

  if (error.init?.status === 500) {
    title = "Internal Server Error";
    message =
      error?.data?.message || "Something went wrong, Please try again later.";
  }
  if (error.init?.status === 404) {
    title = "Resource not found";
    message =
      error?.data?.message || "Something went wrong, Couldn't find resoucres.";
  }

  return (
    <>
      <Header />
      <main className="container d-flex justify-content-center py-5">
        <div>
          <h1>{title}</h1>
          <p>
            {message} Go to <Link to="/albums">Albums</Link>;
          </p>
        </div>
      </main>
    </>
  );
};

export default ErrorPage;
