import React, { useState } from "react";
import WrapperContent from "../../WrapperContent";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { errorMessage } from "../../utils/Toast";
import LoaderBox from "../../utils/LoaderBox";
import { getExerciseSingle } from "../../axios/exercise";
import VideoModel from "../model/VideoModel";

function ViewExercise() {
  const { id } = useParams();

  const [open, setOpen] = useState(false);

  // open
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { data, isLoading, error, isError, isSuccess } = useQuery(
    ["member", id],
    () => getExerciseSingle(id)
  );

  if (isError) {
    errorMessage(error?.response?.data?.message || error?.message);
  }

  return (
    <WrapperContent title="View Excerise">
      <VideoModel
        open={open}
        handleClose={handleClose}
        video={data?.data?.data?.videoUrl}
      />
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
                          <div className="col-lg-3">
                            <div className="user-photo m-b-30" style={{width:"50%"}}>
                              <img
                                className="img-fluid  border "
                                src={data?.data?.data?.imageUrl}
                                alt="exercise-img"
                              />
                            </div>
                          </div>
                          <div className="col-lg-9">
                            <div className="user-profile-name d-flex justify-content-between align-items-center">
                              {data?.data?.data?.name}

                              <button
                                className="btn btn-sm"
                                onClick={() => handleOpen()}
                              >
                                Play video
                              </button>
                            </div>

                            <div
                              className="user-job-title my-2"
                              style={{ color: "black" }}
                            >
                              <span>{data?.data?.data?.description}</span>
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

export default ViewExercise;
