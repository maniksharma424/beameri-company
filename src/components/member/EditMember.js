import React, { useEffect, useState } from "react";
import WrapperContent from "../../WrapperContent";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../Helper/Button";
import { useMutation, useQuery } from "react-query";
import { errorMessage, successMessage } from "../../utils/Toast";
import { BtnSpinner } from "../../utils/BtnSpinner";
import { editMember, getMemberSingle } from "../../axios/member";
import { timeDate } from "../../utils/formateDate";
import { apiError } from "../../utils/apiError";

function Editmember() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [member, setmember] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    joiningDate: "",
    memberType: "",
    email: "",
  });

  // fetch member based on id
  const { data, isLoading, error, isError, isSuccess } = useQuery(
    ["member", id],
    () => getMemberSingle(id)
  );

  const mutation = useMutation((data) => {
    return editMember(data);
  });

  // handle member
  const handleMember = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setmember({ ...member, [name]: value });
  };

  // handle member type
  const handleMemberType = (e) => {
    const value = e.target.value;
    setmember({ ...member, memberType: value });
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
        errorMessage("All fields are required!");
      } else {
        // do signin
        mutation.mutate(member);
      }
    } catch (error) {
      apiError(error);
    }
  };

  if (isError) {
    apiError(error);
  }

  if (mutation.isSuccess) {
    successMessage("Edit member successfully");
  }
  if (mutation.isError) {
    errorMessage(
      mutation.error?.response?.data?.message || mutation.error?.message
    );
  }

  useEffect(() => {
    // use query
    if (isSuccess) {
      const {
        _id,
        email,
        contact,
        firstName,
        lastName,
        joiningDate,
        memberType,
      } = data?.data?.data;
      setmember({
        email,
        contact,
        firstName,
        lastName,
        joiningDate: timeDate(joiningDate),
        memberType,
        id: _id,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  return (
    <WrapperContent title="Create member">
      <section id="main-content">
        <div className="row">
          <div className="col-lg-12">
            <div className="createmember d-flex justify-content-between">
              <Button color="success" onClick={() => navigate("/member")}>
                <i className="ti-arrow-left"></i>
              </Button>
              <Button
                onClick={() => handleSubmitmember()}
                disabled={mutation.isLoading}
              >
                {mutation.isLoading ? <BtnSpinner /> : "Update member"}
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
                      value={member.memberType}
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

export default Editmember;
