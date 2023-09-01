import React, { useEffect, useRef } from "react";
import { errorMessage, successMessage } from "../utils/Toast";
import { verifyOTP } from "../axios/singin";
import { useMutation } from "react-query";
import { BtnSpinner } from "../utils/BtnSpinner";
import { useNavigate } from "react-router-dom";

function OtpVerify() {
  const navigate = useNavigate();
  const otpRef = useRef("");
  const emailRef = useRef("");
  const { mutate, isLoading, isError, isSuccess, error } = useMutation(
    (data) => {
      return verifyOTP(data);
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const otp = otpRef.current?.value;
      const email = emailRef.current?.value;
      if (!otp || !email) {
        errorMessage("fields must be required!");
      } else {
        //do
        mutate({
          email: email,
          otp: otp,
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
      successMessage("otp verified successfully");
      navigate("/new-password");
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
                  <h4>Verify OTP</h4>

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
                      <label>OTP</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="OTP"
                        name="otp"
                        ref={otpRef}
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

export default OtpVerify;
