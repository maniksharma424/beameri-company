import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { errorMessage, successMessage } from "../utils/Toast";
import { BtnSpinner } from "../utils/BtnSpinner";
import { Axios } from "../axios/axios";
import LoaderBox from "../utils/LoaderBox";

function Login() {
  const [pass, setShowPass] = useState(false);
  const [loader, setLoader] = useState(false);

  const [admin, setAdmin] = useState({
    email: "",
    password: "",
    userType: "branchManager",
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // onchange
  const handleChangetext = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setAdmin({ ...admin, [name]: value });
  };

  // handle submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { email, password } = admin;
    try {
      if (!email) {
        errorMessage("Email is required!");
      } else if (!password) {
        errorMessage("Password is required!");
      } else {
        // do signin
        const resp = await Axios.post("/auth/signin", admin);

        if (resp?.status === 201) {
          successMessage("Sign in successfully");
          if (resp?.data) {
            localStorage.setItem(
              "BranchManagerAuth",
              JSON.stringify({ token: resp?.data?.token, data: resp?.data })
            );
            setTimeout(() => {
              navigate("/exercise");
              window.location.reload();
              setLoader(false);
            }, 100);
          } else {
            return;
          }
        } else {
          errorMessage(resp?.data?.message);
        }
      }
    } catch (error) {
      errorMessage(error?.response?.data?.message || error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="shadow" style={{ height: "100vh" }}>
        <div class="unix-login">
          <LoaderBox loader={loader} />
          <div class="container-fluid">
            <div class="row justify-content-center">
              <div class="col-lg-6">
                <div class="login-content">
                  <div class="login-form">
                    <h4>Branch Manager Login</h4>
                    <form onSubmit={(e) => handleLogin(e)}>
                      <div class="form-group">
                        <label>Email address</label>
                        <input
                          type="email"
                          class="form-control"
                          placeholder="Email"
                          name="email"
                          value={admin.email}
                          onChange={(e) => handleChangetext(e)}
                        />
                      </div>
                      <div class="form-group">
                        <div class="d-flex justify-content-between">
                          <label>Password</label>
                          <label
                            className="text-primary"
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowPass(!pass)}
                          >
                            Show password
                          </label>
                        </div>
                        <input
                          type={pass ? "text" : "password"}
                          class="form-control"
                          placeholder="Password"
                          name="password"
                          value={admin.password}
                          onChange={(e) => handleChangetext(e)}
                        />
                      </div>
                      <div class="checkbox">
                        <label>
                          <input type="checkbox" /> Remember Me
                        </label>
                        <label class="pull-right">
                          <Link to="/forgotPassword">Forgotten Password?</Link>
                        </label>
                      </div>
                      <button
                        type="submit"
                        class="btn btn-primary btn-flat m-b-30 m-t-30"
                        disabled={isLoading}
                      >
                        {isLoading ? <BtnSpinner /> : "Sign in"}
                      </button>
                    </form>
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

export default Login;
