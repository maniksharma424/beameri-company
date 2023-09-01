import React, { useEffect } from "react";
import WrapperContent from "../../WrapperContent";
import { Link } from "react-router-dom";
import Button from "../../Helper/Button";
import { deleteMember, getMember } from "../../axios/member";
import { errorMessage, successMessage } from "../../utils/Toast";
import { useQueryClient, useMutation, useQuery } from "react-query";
import LoaderBox from "../../utils/LoaderBox";
import Avatar from "react-avatar";
import { formatDate } from "../../utils/formateDate";

function Member() {
  const queryClient = useQueryClient();
  const { isLoading, isSuccess, isError, error, data } = useQuery(
    "member",
    getMember
  );

  const mutation = useMutation((id) => deleteMember(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("member");
    },
  });

  if (isError) {
    errorMessage(error?.message);
  }
  if (mutation.isError) {
    errorMessage(
      mutation.error?.response?.data?.message || mutation.error?.message
    );
  }

  useEffect(() => {
    if (mutation.isSuccess) {
      successMessage("member deleted successfully");
    }
  }, [mutation.isSuccess]);

  return (
    <WrapperContent title="Member">
      <section id="main-content">
        <div className="row">
          <div className="col-lg-12">
            <div className="createmember d-flex justify-content-end">
              <Link to="/member/createMember">
                <Button>
                  <i className="ti-plus"></i>&nbsp; Create member
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <LoaderBox loader={isLoading} />
        <LoaderBox loader={mutation.isLoading} />

        {isSuccess && (
          <div className="row">
            {data?.data?.data?.map((item) => {
              return (
                <div className="col-lg-4" key={item?._id}>
                  <div className="card">
                    <Link to={`/member/view/${item?._id}`}>
                      <div className="stat-widget-one">
                        <div className="stat-icon dib">
                          <Avatar
                            name={item?.firstName + " " + item?.lastName}
                            size="50"
                            round={true}
                          />
                        </div>
                        <div className="stat-content dib">
                          {item?.firstName + " " + item?.lastName}{" "}
                          <span className="text-success">
                            ({item?.memberType})
                          </span>
                          <div className="mt-2">
                            <h6 className="d-inline">Joining Date : </h6>
                            <span className="text-success">
                              {formatDate(item?.joiningDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>

                    <div className="editmember d-flex justify-content-end ">
                      <Link to={`/member/edit/${item?._id}`}>
                        <Button size={"btn-sm"} className="mx-2">
                          <i className="ti-marker-alt"></i>
                        </Button>
                      </Link>
                      <Button
                        size={"btn-sm"}
                        color="danger"
                        onClick={() => mutation.mutate(item?._id)}
                      >
                        <i className="ti-cut"></i>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </WrapperContent>
  );
}

export default Member;
