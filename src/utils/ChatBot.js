import { useState } from "react";

function ChatBot() {
  const [hide, setHide] = useState(false);

  return (
    <div className="chatBot">
      <div className="chatBox" onClick={() => setHide(!hide)}>
        {hide ? <i className="ti-close"></i> : <h6>Chat</h6>}
      </div>
      {hide && (
        <div className="chatBoxContainer ">
          <div className="chatQuery">
            <div className="leftChatBox">
              <span>Hi i am fne</span>
            </div>
            <div className="rightChatBox">
              <span>ok</span>
            </div>
          </div>

          <div className="form-group  formChatBox">
            <div className="input-group input-group-rounded">
              <input
                type="text"
                placeholder="Query..."
                name="Search"
                className="form-control"
              />
              <span className="input-group-btn">
                <button
                  className="btn btn-primary btn-group-right"
                  type="submit"
                >
                  <i className="ti-search"></i>
                </button>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBot;
