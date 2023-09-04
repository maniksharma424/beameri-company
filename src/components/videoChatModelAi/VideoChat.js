import React, { useCallback, useEffect, useRef, useState } from "react";

import { errorMessage, successMessage } from "../../utils/Toast";
import { useQuery } from "react-query";
import LoaderBox, { FadeLoaderBox } from "../../utils/LoaderBox";

import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { getExercise } from "../../axios/exercise";
import { getAllArticles } from "../../axios/article";
import { createChatCompletionFn } from "../chat/chatCompletion";
import { API } from "../../utils/api";
import { getAvatarActive, getVoiceActive } from "../../axios/chat-active-file";

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

  const {
    isLoading: isVoiceLoading,
    isError: isVoiceError,
    error: vocieError,
    isSuccess: isVoiceSuccess,
    data: voiceActiveData,
  } = useQuery("voice", getVoiceActive);

  const avtarData = useQuery("avatar", getAvatarActive);

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
          setLoading(true);
          pauseBtn = true;
          textToVoiceApi(data);
        } else {
          errorMessage("Transcription failed!");
        }
      } catch (err) {
        errorMessage(err?.message);
        setLoading(false);
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
      setLoading(false);
    } finally {
      // setLoading(false);
    }
  }

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
      setLoading(true);
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
      setLoading(false);
    } finally {
      setVoiceLoading(false);
    }
  };

  const checkPredictionStatus = async (predictionId) => {
    try {
      setLoading(true);
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
        } else if (status === "failed") {
          errorMessage("Video generation failed.");
          setLoading(false);
        }
      }
    } catch (error) {
      errorMessage(error?.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  //   for play.ht voice
  async function textToVoiceApi(text) {
    try {
      setLoading(true);
      let audioId = JSON.parse(localStorage.getItem("audio"));
      // audioId =
      //   audioId === "undefined" || audioId === null
      //     ? "s3://voice-cloning-zero-shot/e2ee110d-86a6-415c-ad55-04f1a2e5af76/sap/manifest.json"
      //     : audioId;
      audioId =
        audioId != null && audioId != "undefined"
          ? JSON.parse(localStorage.getItem("audio"))
          : "2EiwWnXFnvU5JabPnv8n";

      // const response = await axios.post(`${API}/api/playht/clone`, {

      if (audioId) {
        const response = await axios.post(`${API}/elevenlabs/text-to-speak`, {
          // const response = await axios.post(`${API}/api/playht/clone`, {
          voiceId: audioId,
          text: text,
        });

        if (response.status === 200) {
          console.log("api data ::  ", response.data);
          generateVideo(response.data?.data);
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
  if (avtarData.isError) {
    errorMessage(avtarData?.response?.data?.message || avtarData?.message);
  }

  useEffect(() => {
    if (status === "succeeded" || status === "failed") {
      clearInterval(pollingInterval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  //   end

  useEffect(() => {
    if (voiceActiveData?.status === 200) {
      const activeData = voiceActiveData.data?.data?.filter(
        (item) => item?.status === "active" && item
      );

      localStorage.setItem("audio", JSON.stringify(activeData[0]?.voice_id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVoiceSuccess]);

  useEffect(() => {
    if (avtarData?.data?.status === 200) {
      const avtar = avtarData?.data?.data?.data?.filter(
        (item) => item?.status === "active" && item
      );
      setImageURL(avtar[0]?.imageUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avtarData.isSuccess]);

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

  const PlayVideo = useCallback(() => {
    return (
      <video
        autoPlay
        preload="auto"
        style={{
          minWidth: "350px",
          width: "100%",
          height: "100%",
          minHeight: "500px",
          background: "black",
        }}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    );
  }, [videoUrl]);

  return (
    <>
      <div className="bg-dark py-1">
        <div className="btnBottom">
          <button
            type="button"
            className={`btn  btn-sm rounded  ${
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

        <div className="mt-2">
          <div
            style={{
              margin: "0 auto",
              width: "30%",
              minWidth: "350px",
              height: "100vh",
              minHeight: "500px",
              overflow: "hidden",
            }}
          >
            <PlayVideo />
          </div>

          <FadeLoaderBox loader={loading} />

          {isLoading && isArticleLoading && <LoaderBox />}
          <LoaderBox loader={isVoiceLoading} />
          <LoaderBox loader={avtarData.isLoading} />
        </div>
      </div>
    </>
  );
}

export default VideoChat;
