import React, { useEffect, useRef, useState } from "react";
import { errorMessage, successMessage } from "../utils/Toast";
import { forgotPassword } from "../axios/singin";
import { useMutation } from "react-query";
import { BtnSpinner } from "../utils/BtnSpinner";
import { useNavigate } from "react-router-dom";

function OtpVerify() {
  const navigate = useNavigate();
  const otpRef = useRef("");
  const [passKey, setPassKey] = useState("");
  const { mutate, data, isLoading, isError, isSuccess, error } = useMutation(
    (data) => {
      return forgotPassword(data);
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const otp = otpRef.current?.value;
      if (!otp) {
        errorMessage("otp must be required!");
      } else {
        //do
        mutate({
          otp: otp,
        });
      }
    } catch (error) {
      errorMessage(error.message);
    }
  };

  if (isError) {
    errorMessage(error.message);
  }

  useEffect(() => {
    if (isSuccess) {
      successMessage("otp verified successfully");
      setPassKey(data?.data?.message);
      navigate("/otp-verify");
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
                  <h4>Forgot Password</h4>

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
                        ref={otpRef}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary btn-flat m-b-15"
                      disabled={isLoading}
                    >
                      {isLoading ? <BtnSpinner /> : "Submit"}
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

export default OtpVerify;
