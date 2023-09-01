import React, { useEffect, useRef } from "react";
import { errorMessage, successMessage } from "../utils/Toast";
import { resetPassword } from "../axios/singin";
import { useMutation } from "react-query";
import { BtnSpinner } from "../utils/BtnSpinner";
import { useNavigate } from "react-router-dom";

function NewPassword() {
  const navigate = useNavigate();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const { mutate, data, isLoading, isError, isSuccess, error } = useMutation(
    (data) => {
      return resetPassword(data);
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const email = emailRef.current?.value;
      const password = passwordRef.current?.value;

      if (!email || !password) {
        errorMessage("fields must be required!");
      } else {
        //do
        mutate({
          email: email,
          newPassword: password,
        });
      }
    } catch (error) {
      errorMessage(error.message);
    }
  };

  if (isError) {
    errorMessage(error?.response?.data?.message || error?.message);
  }

  useEffect(() => {
    if (isSuccess) {
      successMessage(data?.data?.message);
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  return (
    <div className="shadow " style={{ height: "100vh" }}>
      <div className="unix-login">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="login-content">
                <div className="login-form">
                  <h4>Change Password</h4>

                  {/*     <div className="my-3">
                    {passKey !== "" && (
                      <>
                        <h6>
                          Your templated password please reset after login :{" "}
                        </h6>
                        {passKey}
                      </>
                    )}
                  </div> */}

                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label>Email address</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        name="email"
                        ref={emailRef}
                      />
                    </div>
                    <div className="form-group">
                      <label>New Password</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="password"
                        name="password"
                        ref={passwordRef}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary btn-flat m-b-15"
                      disabled={isLoading}
                    >
                      {isLoading ? <BtnSpinner /> : "Verify"}
                    </button>
                    <div className="register-link text-center">
                      <p>
                        Back to <a href="/"> Home</a>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewPassword;
