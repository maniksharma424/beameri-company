import React, { useCallback, useEffect, useRef, useState } from "react";
import "./chat.css";

import { errorMessage } from "../../utils/Toast";
import { useQuery } from "react-query";
import LoaderBox from "../../utils/LoaderBox";
import { BtnSpinner } from "../../utils/BtnSpinner";
import {
  createChatCompletionFn,
  createChatCompletionFnArticle,
} from "./chatCompletion";
import { getExercise } from "../../axios/exercise";
import axios from "axios";
import { PauseTextToVoice, fetchData } from "./TextToVoice";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllArticles } from "../../axios/article";
import $ from "jquery";
import VoiceModel from "./VoiceModel";
import { getVoiceActive } from "../../axios/chat-active-file";

const reciever = [];
const url = "https://api.openai.com/v1/audio/transcriptions";
let pauseBtn = false;

function Chat() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [spinner, setSpinner] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [listen, setListen] = useState("");
  const [transcription, setTranscription] = useState("");
  const [recordedAudio, setRecordedAudio] = useState(null);
  const mediaRecorderRef = useRef(null);
  const messagesEndRef = useRef(null);

  // for tabing
  // const [tab, setTab] = useState("?tab=exercise");
  const [pause, setPause] = useState(false);
  const [show, setShow] = useState(false);

  const {
    isLoading,
    isError,
    error,
    data: exercise,
  } = useQuery("exercise", getExercise);
  const {
    isLoading: isArticleLoading,
    isError: isArticleError,
    error: articleError,
    data: article,
  } = useQuery("article", getAllArticles);

  const {
    isLoading: isVoiceLoading,
    isError: isVoiceError,
    error: vocieError,
    isSuccess: isVoiceSuccess,
    data: voiceActiveData,
  } = useQuery("voice", getVoiceActive);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // handle submit
  const handleSubmit = useCallback(
    async () => {
      setPrompt("");
      setSpinner(true);
      setPause(false);
      if (prompt !== "") {
        try {
          reciever.push({ data: prompt, name: "USER" });

          // chat with both - article + exercise
          const data = await createChatCompletionFn(
            prompt,
            exercise?.data?.data,
            article?.data?.data
          );

          if (data) {
            reciever.push({ data: data, name: "ASSISTANT" });
            pauseBtn = true;
            fetchData(data);
          } else {
            errorMessage("data not found!");
          }

          // if (search?.slice(5) === "exercise") {
          //   const data = await createChatCompletionFn(
          //     prompt,
          //     exercise?.data?.data
          //   );
          //   reciever.push({ data: data, name: "ASSISTANT" });

          //   pauseBtn = true;

          //   // textToVoice(data);
          //   fetchData(data);
          //   // microsoftTextToSpeech(data);
          // } else if (search?.slice(5) === "article") {
          //   const data = await createChatCompletionFnArticle(
          //     prompt,
          //     article?.data?.data
          //   );
          //   reciever.push({ data: data, name: "ASSISTANT" });
          //   pauseBtn = true;

          //   fetchData(data);
          // } else {
          //   return;
          // }
        } catch (err) {
          errorMessage(err?.message);
        } finally {
          setSpinner(false);
        }
      } else {
        setSpinner(false);
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [prompt]
  );

  // --------------#### Whisper APi ##############-----
  const handleStartRecording = () => {
    setIsRecording(false);
    setTranscription("");
    const mediaStream = navigator.mediaDevices.getUserMedia({ audio: true });
    mediaStream.then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      const chunks = [];
      mediaRecorder.ondataavailable = async (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: "audio/wav" });
        setRecordedAudio(audioBlob);
        handleUpload(audioBlob);
      };

      setIsRecording(true);
    });
  };

  // Stop recording

  const handleStopRecording = () => {
    if (!isRecording) return;
    setIsRecording(false);
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  // handle transcription
  const handleTranscription = async ({ text }) => {
    setSpinner(true);
    setPause(false);
    pauseBtn = true;
    if (text !== "") {
      reciever.push({ data: text, name: "USER" });

      try {
        // chat with both - article + exercise
        const data = await createChatCompletionFn(
          text,
          exercise?.data?.data,
          article?.data?.data
        );
        if (data) {
          reciever.push({ data: data, name: "ASSISTANT" });
          pauseBtn = true;
          fetchData(data);
        } else {
          errorMessage("data not found!");
        }
        // if (search?.slice(5) === "exercise") {
        //   setTranscription(text);
        //   const data = await createChatCompletionFn(text, exercise?.data?.data);
        //   reciever.push({ data: data, name: "ASSISTANT" });
        //   fetchData(data);
        // } else if (search?.slice(5) === "article") {
        //   const data = await createChatCompletionFnArticle(
        //     text,
        //     article?.data?.data
        //   );
        //   reciever.push({ data: data, name: "ASSISTANT" });
        //   fetchData(data);
        // } else {
        //   return;
        // }
      } catch (err) {
        errorMessage(err?.message);
      } finally {
        setSpinner(false);
      }
    } else {
      setSpinner(false);
    }
  };

  // upload audio blob
  async function handleUpload(audioBlob) {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.wav");
      formData.append("model", "whisper-1");

      const config = {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_WHISPER_API_SECRET}`,
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.post(url, formData, config);
      handleTranscription(data);
    } catch (error) {
      errorMessage(error?.message);
    } finally {
      setLoading(false);
    }
  }
  // onchnage
  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleSubmit(e);
      }
    },
    [handleSubmit]
  );

  // handle press hold
  const handlePressHold = () => {
    if (!isRecording) {
      handleStartRecording();
    } else {
      handleStopRecording();
    }
  };

  // error handling
  if (isError || isVoiceError) {
    errorMessage(
      error?.response?.data?.message ||
        error?.message ||
        vocieError?.response?.data?.message ||
        vocieError?.message
    );
  }
  if (isArticleError) {
    errorMessage(
      articleError?.response?.data?.message || articleError?.message
    );
  }

  // message scroll down

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  useEffect(() => {
    if (voiceActiveData?.status === 200) {
      const activeData = voiceActiveData.data?.data?.filter(
        (item) => item?.status === "active" && item
      );
      localStorage.setItem("audio", JSON.stringify(activeData[0]?.voice_id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVoiceSuccess]);
  // useEffect(() => {
  // navigate(tab, { replace: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [tab]);

  return (
    <>
      {/**<VoiceModel show={show} handleClose={handleClose} /> */}
      <div className="boxChatr">
        <div className="container-fluid py-2 headerChatBox d-flex justify-content-between align-items-center">
          <div className="chatTitle">
            <h5>Branch Chat</h5>
          </div>
          {/*<div className="chatTab">
            <button
              className={`btn ${
                search?.slice(5) === "exercise"
                  ? "btn-outline-black"
                  : "btn-outline"
              } btn-sm`}
              onClick={() => setTab("?tab=exercise")}
            >
              Exercise
            </button>
            <button
              className={`btn ${
                search?.slice(5) === "article"
                  ? "btn-outline-black"
                  : "btn-outline"
              } mx-2 btn-sm`}
              onClick={() => setTab("?tab=article")}
            >
              Article
            </button>

           
          </div> */}
          {/*
          <div>
            <a
              className="text-primary"
              href={
                localStorage.getItem("myAudioMp3") &&
                JSON.parse(localStorage.getItem("myAudioMp3"))
              }
              target="_blank"
              rel="noreferrer"
            >
              {localStorage.getItem("myAudioMp3") &&
                JSON.parse(localStorage.getItem("myAudioMp3"))}
            </a>
          </div> */}

          {/** <button
            className="btn btn-success mx-2 btn-sm"
            onClick={() => handleShow()}
          >
            Add voice to clone
          </button> */}
        </div>
        <div className="row chatBoxCon1 mt-5 py-2">
          <div className="col-12">
            <div className="list-group">
              {reciever?.map((i, index) => {
                return (
                  <div className="list-group-item mb-4" key={index}>
                    <div className="d-flex w-100 justify-content-between">
                      <span style={{ fontSize: "13px", fontWeight: "bold" }}>
                        {i?.name}
                      </span>
                    </div>
                    <div
                      style={{ wordWrap: "break-word" }}
                      ref={messagesEndRef}
                      dangerouslySetInnerHTML={{ __html: i?.data }}
                    ></div>
                    <span id="audio"></span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {isLoading && isArticleLoading && <LoaderBox />}
        <LoaderBox loader={isVoiceLoading} />
        <div className="inputBoxChat col-lg-12 mt-4">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Type your query here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e)}
            />
            <div className="input-group-append">
              {
                <button
                  className="btn btn-primary"
                  onClick={(e) => handleSubmit(e)}
                  disabled={spinner}
                >
                  {spinner ? <BtnSpinner /> : "Send"}
                </button>
              }
            </div>
            <div className="input-group-append ml-2">
              {pauseBtn && (
                <button className="btn btn-sm btn-success" onClick={() => {}}>
                  {pause ? (
                    <i
                      className="pauseBtn ti-control-play"
                      onClick={() => {
                        setPause(false);
                        PauseTextToVoice(false);
                      }}
                    ></i>
                  ) : (
                    <i
                      className="pauseBtn ti-control-pause"
                      onClick={() => {
                        setPause(true);
                        PauseTextToVoice(true);
                      }}
                    ></i>
                  )}
                </button>
              )}
            </div>
            <div className="mx-2 input-group-append">
              <button
                type="button"
                className={`btn  ${isRecording ? "btn-primary" : "btn-info"}`}
                onTouchStart={handlePressHold}
                onTouchEnd={handlePressHold}
                onMouseDown={handlePressHold}
                onMouseUp={handlePressHold}
              >
                {isRecording ? "Recording..." : "Hold to Record"}
              </button>
              <div className="d-inline mx-2">
                {loading && (
                  <div
                    class="spinner-border  spinner-border-sm text-black"
                    role="status"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <p id="status" class="lead mt-3">
          {listen}
        </p>
      </div>
    </>
  );
}

export default Chat;
