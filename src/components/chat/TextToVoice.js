import axios from "axios";
import { errorMessage } from "../../utils/Toast";
import { API } from "../../utils/api";

const aud = new Audio();
const synth = window.speechSynthesis;

export const fetchData = async (text) => {
  try {
    console.log("text", text);
    const storageId = localStorage.getItem("audio");
    console.log("storageId", storageId);
    let audioId =
      storageId != null && storageId != "undefined"
        ? JSON.parse(localStorage.getItem("audio"))
        : "2EiwWnXFnvU5JabPnv8n";

    if (true) {
      const body = {
        text: text,
        voiceId: audioId,
      };
      const response = await axios.post(
        `${API}/elevenlabs/text-to-speak`,
        body
      );

      if (response.status === 200) {
        localStorage.setItem("myAudioMp3", JSON.stringify(response.data?.data));
        aud.src = response.data?.data;
        aud.play();
      } else {
        errorMessage("audio not found");
      }
    } else {
      errorMessage("first clone your voice");
    }
  } catch (error) {
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
    console.error("Error:", error);
  }
};

// api - 1

export const textToVoice = async (text) => {
  const url = "https://play.ht/api/v1/convert/";
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      AUTHORIZATION: "Bearer 1d7714790c714eba80524c84712e94bf",
      "X-USER-ID": "oqVKPMxGKde9IVCbaCfVXKGzftI2",
    },
    body: JSON.stringify({
      speed: 1,
      preset: "balanced",
      voice:
        "s3://voice-cloning-zero-shot/dbe17067-30eb-4d92-bbe3-8bb62ff06e78/ashif/manifest.json",
      content: [text],
    }),
  };

  try {
    const response = await fetch(url, options);

    if (response.status === 201) {
      const json = await response.json();
      const id = json?.transcriptionId;
      const url = "https://play.ht/api/v1/articleStatus/?transcriptionId=" + id;
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          AUTHORIZATION: "Bearer 1d7714790c714eba80524c84712e94bf",
          "X-USER-ID": "oqVKPMxGKde9IVCbaCfVXKGzftI2",
        },
      };

      const resp = await fetch(url, options);
      const data = await resp.json();
      console.log("data", data);
      // aud.src = data?.audioUrl[0];
      // aud.play();
    }
  } catch (err) {
    console.error("error:", err);
  }
};

// api - 2
export const microsoftTextToSpeech = async (text) => {
  const options = {
    method: "GET",
    url: "https://microsoft-edge-text-to-speech.p.rapidapi.com/TTS/EdgeTTS",
    params: {
      text: text,
      voice_name: "en-US-AriaNeural",
    },

    headers: {
      "X-RapidAPI-Key": "2feae67a2emsh92d0de018ae315ep15fecajsn4b297966b8de",
      "X-RapidAPI-Host": "microsoft-edge-text-to-speech.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);

    if (response.status === 200) {
      aud.src = response.data.downloadUrl;
      aud.play();
      return;
    } else {
      textToVoice(text);
      const utterance = new SpeechSynthesisUtterance(text);
      synth.speak(utterance);
    }
  } catch (error) {
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
    console.log(error.message);
  }
};

// default of browser support

export const TextToVoiceSynthesis = (text) => {
  console.log(text);
  const utterance = new SpeechSynthesisUtterance(text);
  synth.speak(utterance);
};

export const PauseTextToVoice = (check) => {
  synth.cancel();
  aud.pause();
};
