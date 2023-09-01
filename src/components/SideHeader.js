import React from "react";
import { Link, NavLink } from "react-router-dom";
import { signout } from "../utils/auth";
import { name } from "../utils/branchData/branchData";

function SideHeader() {
  return (
    <>
      <div className="sidebar sidebar-hide-to-small sidebar-shrink sidebar-gestures1">
        <div className="nano">
          <div className="nano-content">
            <ul>
              <div className="logo">
                <Link
                  to="/member"
                  className="logo-with-text d-flex justify-content-between align-items-center mx-3"
                >
                  <img src="/images/logo.png" alt="" width={40} />{" "}
                  <span>{name || "Branch"}</span>
                </Link>
              </div>
              {/* 
                <li className="label">Main</li>
              <li>
                <NavLink to="/" className="sidebar-sub-toggle">
                  <i className="ti-home"></i> Dashboard{" "}
                </NavLink>
              </li>
              */}

              <li className="label">Apps</li>
              <li>
                <NavLink to="/exercise" className="sidebar-sub-toggle">
                  <i className="ti-layout-grid2-alt"></i> Exercise{" "}
                </NavLink>
              </li>
              <li>
                <NavLink to="/member" className="sidebar-sub-toggle">
                  <i className="ti-bar-chart-alt"></i> Member{" "}
                </NavLink>
              </li>
              <li>
                <NavLink to="/chat" className="sidebar-sub-toggle">
                  <i className="ti-support"></i> Chat{" "}
                </NavLink>
              </li>
              <li>
                <NavLink to="/branch-chat" className="sidebar-sub-toggle">
                  <i className="ti-user"></i> Branch Chat{" "}
                </NavLink>
              </li>

              {/*<li>
                <NavLink to="app-event-calender.html">
                  <i className="ti-calendar"></i> Calender{" "}
                </NavLink>
              </li>
              <li>
                <NavLink to="app-email.html">
                  <i className="ti-email"></i> Email
                </NavLink>
              </li>
              <li>
                <NavLink to="app-profile.html">
                  <i className="ti-user"></i> Profile
                </NavLink>
              </li>
              <li>
                <NavLink to="app-widget-card.html">
                  <i className="ti-layout-grid2-alt"></i> Widget
                </NavLink>
              </li> */}
              {/* <li className="label">Extra</li>
              <li>
                <NavLink to="/invoice" className="sidebar-sub-toggle">
                  <i className="ti-files"></i> Invoice{" "}
                  <span className="sidebar-collapse-icon ti-angle-down"></span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/page" className="sidebar-sub-toggle">
                  <i className="ti-target"></i> Pages{" "}
                  <span className="sidebar-collapse-icon ti-angle-down"></span>
                </NavLink>
              </li>
              <li>
                <NavLink to="../documentation/index.html">
                  <i className="ti-file"></i> Documentation
                </NavLink>
              </li> */}

              <li
                style={{
                  position: "absolute",
                  bottom: 0,
                  width: "100%",
                }}
              >
                <a href="#" onClick={() => signout()}>
                  <i className="ti-close"></i> Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default SideHeader;
