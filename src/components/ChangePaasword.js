import React, { useState } from "react";
import WrapperContent from "../WrapperContent";
import { errorMessage, successMessage } from "../utils/Toast";
import { BtnSpinner } from "../utils/BtnSpinner";
import { updatePassword } from "../axios/singin";
import { useMutation } from "react-query";

function ChangePaasword() {
  const [reset, setReset] = useState({
    oldPassword: "",
    newPassword: "",
  });
  //   const [isLoading, setIsLoading] = useState(false);

  const { mutate, isLoading, isError, isSuccess, error } = useMutation(
    (data) => {
      return updatePassword(data);
    }
  );

  // onchange
  const handleChangetext = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setReset({ ...reset, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { newPassword } = reset;

    try {
      //   if (!oldPassword) {
      //     errorMessage("old password must be required!");
      //   }
      if (!newPassword) {
        errorMessage("new password must be required!");
      } else {
        //do
        mutate({
          newPassword: newPassword,
        });
      }
    } catch (error) {
      errorMessage(error.message);
    }
  };

  if (isSuccess) {
    successMessage("Reset password successfully");
  }
  if (isError) {
    errorMessage(error.message);
  }

  return (
    <WrapperContent title="Change password">
      <section id="main-content">
        <div className="row">
          <div className="col-lg-12">
            <div>
              <div className="unix-login">
                <div className="container-fluid">
                  <div className="row justify-content-center">
                    <div className="col-lg-6">
                      <div className="login-content">
                        <div className="login-form">
                          <h4>Change Password</h4>
                          <form onSubmit={handleSubmit}>
                            {/*   <div className="form-group">
                              <label>Old password</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="1234"
                                name="oldPassword"
                                value={reset.oldPassword}
                                onChange={handleChangetext}
                              />
                            </div> */}
                            <div className="form-group">
                              <label>New Password</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="12341"
                                name="newPassword"
                                value={reset.newPassword}
                                onChange={handleChangetext}
                              />
                            </div>
                            <button
                              type="submit"
                              className="btn btn-primary btn-flat m-b-15"
                              disabled={isLoading}
                            >
                              {isLoading ? <BtnSpinner /> : "Submit"}
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </WrapperContent>
  );
}

export default ChangePaasword;
