//error 404 page

import React from "react";
import { Link } from "react-router-dom";

function ErrorPage() {
  return (
    <>
      <div
        className="min-h-screen flex flex-col justify-center items-center text-center p-4"
        role="alert"
        aria-live="assertive"
      >
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p id="error-message">
          Oops! Seems like the page you are looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="btn btn-accent mt-4"
          aria-label="Return to home page"
          aria-describedby="error-message"
        >
          Return to Home
        </Link>
      </div>
    </>
  );
}

export default ErrorPage;
