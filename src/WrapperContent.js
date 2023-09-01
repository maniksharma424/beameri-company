import React from "react";
import { Link } from "react-router-dom";

function WrapperContent({ title, children }) {
  return (
    <>
      <div className="content-wrap mt-5">
        <div className="main">
          <div className="container-fluid">
            <div className="row">
              <div className=" p-l-0 title-margin-left">
                <div className="page-header">
                  <div className="page-title">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Link to="/exercise">Dashboard</Link>
                      </li>
                      <li className="breadcrumb-item active">{title}</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            {children}
            {/*content */}
          </div>
        </div>
      </div>
    </>
  );
}

export default WrapperContent;
