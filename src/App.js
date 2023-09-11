import React, { useCallback, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import SideHeader from "./components/SideHeader";
import { Route, Routes, useNavigate } from "react-router-dom";
import Footer from "./components/Footer";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import Indexmember from "./components/member";
import { Protected } from "./axios/Protected";
import { isAutheticated } from "./utils/auth";
import ChangePaasword from "./components/ChangePaasword";
import ChatBot from "./utils/ChatBot";
import IndexExercise from "./components/exercise";
import OtpVerify from "./components/VerifyOtp";
import NewPassword from "./components/NewPassword";
import Chat from "./components/chat/Chat";
import VideoChat from "./components/videoChatModelAi/VideoChat";
import Conversation from "./components/conversation/Conversation";

function App() {
  const navigate = useNavigate();
  const { token } = isAutheticated();
  const HeaderLayout = useCallback(() => {
    if (token && window.location.pathname === "/") {
      navigate("/exercise");
    } else if (!token && window.location.pathname === "/") {
      navigate("/");
    } else if (token && window.location.pathname === "/forgotPassword") {
      navigate("/exercise");
    } else {
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Header
  const RenderHeader = () => {
    if (
      token &&
      window.location.pathname !== "/chat" &&
      window.location.pathname !== "/branch-chat"
    ) {
      return (
        <React.Fragment>
          <Header />
          <SideHeader />
        </React.Fragment>
      );
    } else {
      return;
    }
  };
  // Footer
  const RenderFooter = () => {
    if (
      token &&
      window.location.pathname !== "/chat" &&
      window.location.pathname !== "/branch-chat"
    ) {
      return <React.Fragment>{/**d="main-content" */}</React.Fragment>;
    } else {
      return;
    }
  };

  useEffect(() => {
    HeaderLayout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/*{token && (
        <>
          <Header />
          <SideHeader />
        </>
      )} */}
      <RenderHeader />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<OtpVerify />} />
        <Route path="/new-password" element={<NewPassword />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/branch-chat" element={<VideoChat />} />
        <Route path="/conversations" element={<Conversation />} />

        <Route exact path="/" element={<Protected />}>
          <Route path="changePassword" element={<ChangePaasword />} />
        </Route>

        <Route element={<Protected />}>
          <Route path="/member/*" element={<Indexmember />} />
        </Route>

        <Route element={<Protected />}>
          <Route path="/exercise/*" element={<IndexExercise />} />
        </Route>
      </Routes>
      <RenderFooter />
      {/*{token && <Footer />} */}
    </>
  );
}

export default App;
