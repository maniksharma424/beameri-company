import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { errorMessage, successMessage } from "../utils/Toast";
import { BtnSpinner } from "../utils/BtnSpinner";
import { Axios } from "../axios/axios";

function Register() {
  const [pass, setShowPass] = useState(false);

  const [admin, setAdmin] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    userType: "memberManager",
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
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { email, password, confirmPassword, userType } = admin;
    try {
      if (!email) {
        errorMessage("Email is required!");
      } else if (!password) {
        errorMessage("Password is required!");
      } else if (password !== confirmPassword) {
        errorMessage("Password does not matched!");
      } else {
        // do signin
        const resp = await Axios.post("/auth/signup", {
          email,
          password,
          userType,
        });
        console.log(resp);
        if (resp?.status === 201) {
          successMessage("Register successfully");
          if (resp?.data) {
            navigate("/");
          } else {
            errorMessage("Unauthorized");
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
          <div class="container-fluid">
            <div class="row justify-content-center">
              <div class="col-lg-6">
                <div class="login-content">
                  <div class="login-form">
                    <h4>member Manager Register</h4>

                    <form onSubmit={(e) => handleRegister(e)}>
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
                      <div class="form-group">
                        <label>Confirm password</label>

                        <input
                          type="text"
                          class="form-control"
                          placeholder="Confirm password"
                          name="confirmPassword"
                          value={admin.confirmPassword}
                          onChange={(e) => handleChangetext(e)}
                        />
                      </div>
                      <div class="checkbox">
                        <label class="pull-right">
                          Already account ?<Link to="/">Login</Link>
                        </label>
                      </div>
                      <button
                        type="submit"
                        class="btn btn-primary btn-flat m-b-30 m-t-30"
                        disabled={isLoading}
                      >
                        {isLoading ? <BtnSpinner /> : "Register"}
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

export default Register;
