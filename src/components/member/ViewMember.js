import React from "react";
import WrapperContent from "../../WrapperContent";
import { useParams } from "react-router-dom";
import { getMemberSingle } from "../../axios/member";
import { useQuery } from "react-query";
import LoaderBox from "../../utils/LoaderBox";
import { formatDate } from "../../utils/formateDate";
import { apiError } from "../../utils/apiError";

function Viewmember() {
  const { id } = useParams();

  const { data, isLoading, error, isError, isSuccess } = useQuery(
    ["member", id],
    () => getMemberSingle(id)
  );

  if (isError) {
    apiError(error);
  }

  return (
    <WrapperContent title="View member">
      <div className="main-content">
        <div className="main">
          <LoaderBox loader={isLoading} />

          {isSuccess && (
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-body">
                      <div className="user-profile">
                        <div className="row">
                          <div className="col-lg-4">
                            <div className="user-photo m-b-30">
                              <img
                                className="img-fluid"
                                src="/images/user-profile.jpg"
                                alt=""
                              />
                            </div>
                          </div>
                          <div className="col-lg-8">
                            <div className="user-profile-name">
                              {data?.data?.data?.firstName +
                                " " +
                                data?.data?.data?.lastName}
                            </div>

                            <div className="custom-tab user-profile-tab">
                              <ul className="nav nav-tabs" role="tablist">
                                <li role="presentation" className="active">
                                  <a href="#1">About</a>
                                </li>
                              </ul>
                              <div className="tab-content">
                                <div
                                  role="tabpanel"
                                  className="tab-pane active"
                                  id="1"
                                >
                                  <div className="contact-information">
                                    <h4>Member information</h4>
                                    <div className="phone-content">
                                      <span className="contact-title">
                                        Phone:
                                      </span>
                                      <span className="phone-number">
                                        +91 {data?.data?.data?.contact}
                                      </span>
                                    </div>
                                    <div className="address-content">
                                      <span className="contact-title">
                                        Joining Date:
                                      </span>
                                      <span className="mail-address">
                                        {formatDate(
                                          data?.data?.data?.joiningDate
                                        )}
                                      </span>
                                    </div>
                                    <div className="email-content">
                                      <span className="contact-title">
                                        Email:
                                      </span>
                                      <span className="contact-email">
                                        {data?.data?.data?.email}
                                      </span>
                                    </div>
                                    <div className="website-content">
                                      <span className="contact-title">
                                        Member Type:
                                      </span>
                                      <span className="contact-website">
                                        {data?.data?.data?.memberType}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </WrapperContent>
  );
}

export default Viewmember;
