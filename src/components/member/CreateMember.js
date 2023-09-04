import React, { useState } from "react";
import WrapperContent from "../../WrapperContent";
import { useNavigate } from "react-router-dom";
import Button from "../../Helper/Button";
import { useMutation } from "react-query";
import { errorMessage, successMessage } from "../../utils/Toast";
import { createMember } from "../../axios/member";
import { BtnSpinner } from "../../utils/BtnSpinner";
import { apiError } from "../../utils/apiError";

function Createmember() {
  const navigate = useNavigate();

  const [member, setMember] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    joiningDate: "",
    memberType: "",
    email: "",
  });

  const { mutate, isLoading, isError, isSuccess, error } = useMutation(
    (data) => {
      return createMember(data);
    }
  );

  // handle member
  const handleMember = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setMember({ ...member, [name]: value });
  };

  // handle member type
  const handleMemberType = (e) => {
    const value = e.target.value;
    setMember({ ...member, memberType: value });
  };

  // handle submit
  const handleSubmitmember = async () => {
    const { email, contact, firstName, lastName, joiningDate, memberType } =
      member;
    try {
      if (
        !email ||
        !firstName ||
        !lastName ||
        !joiningDate ||
        !memberType ||
        !contact
      ) {
        errorMessage("All fields required!");
      } else {
        // do
        mutate({
          email,
          firstName,
          lastName,
          memberType,
          joiningDate,
          contact,
        });
      }
    } catch (error) {
      apiError(error);
    }
  };

  if (isError) {
    errorMessage(error?.response?.data?.message || error?.message);
  }
  if (isSuccess) {
    successMessage("member added successfully");
    navigate("/member");
  }

  return (
    <WrapperContent title="Create member">
      <section id="main-content">
        <div className="row">
          <div className="col-lg-12">
            <div className="createmember d-flex justify-content-between">
              <Button color="success" onClick={() => navigate("/member")}>
                <i className="ti-arrow-left"></i>
              </Button>
              <Button onClick={() => handleSubmitmember()} disabled={isLoading}>
                {isLoading ? <BtnSpinner /> : "Create member"}
              </Button>
            </div>
          </div>
        </div>

        <div class="basic-form">
          <div>
            <div className="row">
              <div className="col-lg-6">
                <div className="form-group">
                  <label className="m-b-15 ">First Name</label>
                  <input
                    type="text"
                    className="form-control input-default "
                    name="firstName"
                    value={member.firstName}
                    onChange={(e) => handleMember(e)}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div class="form-group">
                  <label class="m-b-15 ">Last Name</label>
                  <input
                    type="text"
                    className="form-control input-default "
                    name="lastName"
                    value={member.lastName}
                    onChange={(e) => handleMember(e)}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div class="form-group">
                  <label class="m-b-15 ">Email</label>
                  <input
                    type="email"
                    className="form-control input-default "
                    name="email"
                    value={member.email}
                    onChange={(e) => handleMember(e)}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div class="form-group">
                  <label class="m-b-15 ">Mobile Number</label>
                  <input
                    type="text"
                    className="form-control input-default "
                    name="contact"
                    value={member.contact}
                    onChange={(e) => handleMember(e)}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div class="form-group">
                  <label class="m-b-15 ">Joining Date</label>
                  <input
                    type="date"
                    className="form-control input-default "
                    name="joiningDate"
                    value={member.joiningDate}
                    onChange={(e) => handleMember(e)}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group">
                  <label className="m-b-15">Membership Type</label>
                  <div>
                    <select
                      className="form-control"
                      onChange={(e) => handleMemberType(e)}
                    >
                      <option disabled selected>
                        Select
                      </option>
                      <option value="Monthly">Monthly</option>
                      <option value="Quaterly">Quaterly</option>
                      <option value="HalfYearly">Half Yearly</option>
                      <option value="Yearly">Yearly</option>
                    </select>
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

export default Createmember;
