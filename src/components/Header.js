import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../Helper/Button";
import QrModel from "./model/QrModel";
function Header() {
  const [open, setOpen] = useState(false);

  // open
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <QrModel open={open} handleClose={handleClose} />
      <div className="header fixed-top ">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 pb-3">
              <div className="d-flex justify-content-between align-items-center">
                <div className="leftSide">
                  <div className="hamburger sidebar-toggle">
                    <span className="line"></span>
                    <span className="line"></span>
                    <span className="line"></span>
                  </div>
                </div>

                <div className="rightSide d-flex  align-items-center">
                  <div className="dropdown">
                    <button
                      className="btn btn-sm dropdown-toggle"
                      type="button"
                      data-toggle="dropdown"
                    >
                      <i className="ti-user"></i>
                      <span className="caret"></span>
                    </button>
                    <ul
                      className="dropdown-menu"
                      style={{
                        height: "15vh",
                        lineHeight: "1.6em",
                      }}
                    >
                      <li>
                        <Link to="#">Profile</Link>
                      </li>
                      <li>
                        <Link to="/changePassword">Change password</Link>
                      </li>
                      <li className="divider"></li>
                    </ul>
                  </div>
                  <div className="qrCode ml-3">
                    <Button
                      color={"primary"}
                      className="mt-2 border btn-sm"
                      onClick={() => handleOpen()}
                    >
                      QR CODE
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
