import React, { useCallback, useEffect, useRef, useState } from "react";

import { errorMessage } from "../../utils/Toast";
import { useQuery } from "react-query";
import LoaderBox from "../../utils/LoaderBox";
import { BtnSpinner } from "../../utils/BtnSpinner";

import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { getExercise } from "../../axios/exercise";
import { getAllArticles } from "../../axios/article";
import { createChatCompletionFn } from "../chat/chatCompletion";
import { PauseTextToVoice, fetchData } from "../chat/TextToVoice";
import VoiceModel from "../chat/VoiceModel";
import { API } from "../../utils/api";

const reciever = [];
const url = "https://api.openai.com/v1/audio/transcriptions";
let pauseBtn = false;

function VideoChat() {
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
  const [show, setShow] = useState(false);

  // for voice model
  const [imageURL, setImageURL] = useState(
    "https://picallow.com/wp-content/uploads/2023/08/2023-08-22_64e499e459db0_WhatsAppImage2023-08-21at7.47.56PM.jpeg"
  );

  const [videoUrl, setVideoUrl] = useState(
    "https://pbxt.replicate.delivery/k31sQ1oXlD4cHVtYL6DqpfVbu5FshPVUnuzZukCx18zCgSuIA/result_voice.mp4"
  );
  const [VoiceLoading, setVoiceLoading] = useState(false);
  const [predictTime, setPredictTime] = useState("");
  const [status, setStatus] = useState("");
  const [logs, setLogs] = useState([]);
  const [startedAt, setStartedAt] = useState("");
  const [pollingInterval, setPollingInterval] = useState(null);

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

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // handle submit
  const handleSubmit = useCallback(
    async () => {
      setPrompt("");
      setSpinner(true);
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
            textToVoiceApi(data);
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

  // function callAudioPlay() {
  //   const getAud = JSON.parse(localStorage.getItem("audio"));
  //   $("#audio").html(
  //     `<audio controls  autoplay><source src=${getAud}></audio>`
  //   );

  //   console.log($("#audio"));
  // }

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
          textToVoiceApi(data);
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
  if (isError) {
    errorMessage(error?.response?.data?.message || error?.message);
  }
  if (isArticleError) {
    errorMessage(
      articleError?.response?.data?.message || articleError?.message
    );
  }

  // video voice
  const generateVideo = async (audio_url) => {
    try {
      setStatus("Generating");
      setLogs("");
      setStartedAt("");
      setVoiceLoading(true);

      const payload = {
        image_url: imageURL,
        audio_url: audio_url,
      };

      const response = await axios.post(
        "https://vanilla-lush-copper.glitch.me/replicate",
        payload
      );

      const predictionId = response.data.predictionId;
      setPollingInterval(
        setInterval(() => checkPredictionStatus(predictionId), 3000)
      );
    } catch (error) {
      console.error("Error generating video:", error);
      errorMessage("An error occurred while generating the video.");
    } finally {
      setVoiceLoading(false);
    }
  };

  const checkPredictionStatus = async (predictionId) => {
    try {
      const response = await axios.get(
        `https://vanilla-lush-copper.glitch.me/replicate-status/${predictionId}`
      );
      const status = response?.data?.status;
      setStatus(status);

      if (status === "succeeded" || status === "failed") {
        setLogs(response?.data?.logs);
        setStartedAt(response?.data?.started_at);

        if (status === "succeeded") {
          setVideoUrl(response?.data?.output);
          setPredictTime(response?.data?.metrics?.predict_time);
          setLoading(false);
        } else if (status === "failed") {
          errorMessage("Video generation failed.");
        }
      }
    } catch (error) {
      errorMessage(error?.message);
    }
  };

  //   for play.ht voice
  async function textToVoiceApi(text) {
    try {
      let audioId = JSON.parse(localStorage.getItem("audio"));
      // audioId =
      //   audioId === "undefined" || audioId === null
      //     ? "s3://voice-cloning-zero-shot/e2ee110d-86a6-415c-ad55-04f1a2e5af76/sap/manifest.json"
      //     : audioId;
      audioId =
        audioId != null && audioId != "undefined"
          ? JSON.parse(localStorage.getItem("audio"))
          : "2EiwWnXFnvU5JabPnv8n";

      if (audioId) {
        // const response = await axios.post(`${API}/api/playht/clone`, {
        const response = await axios.post(`${API}/elevenlabs/text-to-speak`, {
          voiceId: audioId,
          text: text,
        });

        if (response.status === 200) {
          generateVideo(response.data?.data);
          // generateVideo(response.data?.audioUrl[0]);
        } else {
          errorMessage("audio not found");
        }
      } else {
        errorMessage("missing audio");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    if (status === "succeeded" || status === "failed") {
      clearInterval(pollingInterval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  //   end

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

  // useEffect(() => {
  // navigate(tab, { replace: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [tab]);

  const PlayVideo = useCallback(() => {
    return (
      <video autoPlay preload="auto" style={{ width: "100%", height: "100%" }}>
        <source src={videoUrl} type="video/mp4" />
      </video>
    );
  }, [videoUrl]);

  return (
    <>
      <VoiceModel show={show} handleClose={handleClose} />
      <div className="boxChatr">
        <div className="container-fluid py-2 headerChatBox d-flex justify-content-between align-items-center">
          <div className="chatTitle  ">
            <h5 className="align-self-center my-1">Chat Voice Ai</h5>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-5">
            <div className="row boxChatr1">
              <div className="col-lg-12 border">
                <div
                  className="mt-5 py-1"
                  style={{
                    width: "100%",
                    height: "40%",
                  }}
                >
                  <PlayVideo />

                  <div className="statusVideoProcess border">
                    <div>
                      {VoiceLoading && (
                        <div
                          className="spinner-grow text-light mt-2"
                          role="status"
                        >
                          <span class="visually-hidden">Loading...</span>
                        </div>
                      )}
                    </div>
                    {status && (
                      <div className="mt-4">
                        <h3>Status: {status}</h3>
                        {startedAt && (
                          <p>
                            Started At: {new Date(startedAt).toLocaleString()}
                          </p>
                        )}
                        {predictTime && (
                          <p>
                            Prediction Time:{" "}
                            <p className="text-warning">{predictTime + "s"}</p>
                          </p>
                        )}
                        {error && <p className="text-danger">{error}</p>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-7 chatBoxCon2Box">
            <div className="row mt-5 py-1">
              <div className="col-12">
                <div className="list-group">
                  {reciever?.map((i, index) => {
                    return (
                      <div className="list-group-item mb-4" key={index}>
                        <div className="d-flex w-100 justify-content-between">
                          <span
                            style={{ fontSize: "13px", fontWeight: "bold" }}
                          >
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
            <div className="inputBoxChat col-lg-7 mt-4">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control "
                  placeholder="Type your query here..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
                <div className="input-group-append">
                  {
                    <button
                      className="btn btn-success"
                      onClick={(e) => handleSubmit(e)}
                      disabled={spinner}
                    >
                      {spinner ? <BtnSpinner /> : "Send"}
                    </button>
                  }
                </div>
                {/* */}
                <div className="mx-4 input-group-append">
                  <button
                    type="button"
                    className={`btn  ${
                      isRecording ? "btn-info" : "btn-danger"
                    }`}
                    onTouchStart={handlePressHold}
                    onTouchEnd={handlePressHold}
                    onMouseDown={handlePressHold}
                    onMouseUp={handlePressHold}
                  >
                    {isRecording ? "Recording..." : "Hold to Record"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VideoChat;
