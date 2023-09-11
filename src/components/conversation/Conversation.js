import React from "react";
import WrapperContent from "../../WrapperContent";
import { useQuery } from "react-query";
import { getConversation } from "../../axios/conversation";
import { apiError } from "../../utils/apiError";
import LoaderBox from "../../utils/LoaderBox";
import moment from "moment";

function Conversation() {
  const { isLoading, isError, error, data, isSuccess } = useQuery(
    "conversation",
    getConversation
  );

  if (isError) {
    apiError(error?.message);
  }

  console.log(data?.data?.data);
  return (
    <>
      <WrapperContent title="Conversation">
        <section id="main-content">
          <LoaderBox loader={isLoading} />
          <div className="conversationBox">
            {isSuccess && (
              <div className="conversationCardContainer">
                {data?.data?.data?.map((con, index) => {
                  const yourDate = moment(con.updatedAt);

                  // Format the date and time
                  const formattedDate = yourDate.format("D MMM YYYY, h:mm a");
                  return (
                    <div class="card rounded-sm mb-2" key={index}>
                      <div className="cardDate d-flex align-items-center">
                        <div class="col-lg-11 card-body">
                          <div className="cardheader">
                            <p
                              style={{
                                fontSize: "4",
                                color: "blue",
                                fontWeight: "600",
                              }}
                            >
                              USER -{" "}
                              <span style={{ color: "gray" }}>
                                ID: {con?._id}
                              </span>
                              <span
                                style={{ color: "gray", marginLeft: "2em" }}
                              >
                                <span style={{ color: "red" }}>SOURCE: </span>
                                {con?.source}
                              </span>
                            </p>
                            <p
                              class="card-text"
                              style={{ fontSize: "14px", marginTop: "-1em" }}
                            >
                              {con?.qa?.question}
                            </p>
                          </div>
                          <div className="divider">
                            <hr
                              style={{ display: "block", lineHeight: "10px" }}
                            />
                          </div>
                          <div className="cardheader">
                            <p
                              style={{
                                fontSize: "13px",
                                color: "green",
                                fontWeight: "600",
                              }}
                            >
                              AVATAR
                            </p>
                            <p
                              class="card-text "
                              style={{ fontSize: "14px", marginTop: "-1em" }}
                            >
                              {con?.qa?.answer}
                            </p>
                          </div>
                        </div>
                        <div
                          className="date col-lg-1"
                          style={{
                            fontWeight: "bold",
                            color: "black",
                            fontSize: "12px",
                          }}
                        >
                          {formattedDate}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </WrapperContent>
    </>
  );
}

export default Conversation;
