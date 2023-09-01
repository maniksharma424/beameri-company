import React from "react";
import { PropagateLoader, FadeLoader } from "react-spinners";

function LoaderBox({ loader = true }) {
  return (
    <section className="main-content">
      <div className="row d-flex justify-content-center">
        <PropagateLoader color="blue" loading={loader} />
      </div>
    </section>
  );
}
export function FadeLoaderBox({ loader = false }) {
  return (
    <div className=" main-content">
      <div className="row d-flex justify-content-center loaderBoxFade">
        <FadeLoader color="white" loading={loader} />
      </div>
    </div>
  );
}

export default LoaderBox;
