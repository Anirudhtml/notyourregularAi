import React from "react";

function ChatPreview({ chat }) {

    if(!chat) {
        return <div>no chat yet</div>
    }

  return (
    <div className="ChatBox">
      <div className="ChatBox">
        <div className="ChatWrapper">
              {chat.map((chat, index) => (
                <div key={index} className={`chat ${chat.role}`}>
                  <div className={`textWrapper ${chat.role}text`}>
                  {chat.role === "assistant" ? <img className="ai-img" src="/assets/chat_img.jpg" alt="robot assistant"/> : ""}
                    <li className="user-chat">{chat.content}</li>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}

export default ChatPreview;
