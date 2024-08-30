import React from "react";
import Delete from "../Components/DeleteIcon";
import "./Sidebar.css";
import { Link, useNavigate } from "react-router-dom";

function Sidebar({ user, fetchChat, handleDelete }) {
  const navigate = useNavigate();

  if (!user || !user.user || !user.user.chatHistory) {
    return <div>{""}</div>;
  }

  return (
    <div className={`Sidebar`}>
      <h4>Saved Chats</h4>
      {user.user.savedChats.map((chat) => (
        <div key={chat._id} className="SidebarItems">
          <Link
            to={`user/chat/${chat._id}`}
            onClick={(e) => {
              fetchChat(chat._id);
            }}
          >
            <div className="subContent">
              <div>
                <p id="chatTitle">{chat.title}</p>
              </div>
              <span
                onClick={(e) => {
                  e.preventDefault(); // Prevent Link navigation when deleting
                  e.stopPropagation(); // Stop click from bubbling to the Link
                  handleDelete(chat._id);
                  navigate("/");
                }}
              >
                <Delete />
              </span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
