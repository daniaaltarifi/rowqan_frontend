import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import socketIOClient from "socket.io-client";
import "../Css/ChatBot.css";
import logo from "../assets/logo.jpeg";
import send from "../assets/paper-plane.png";
import axios from "axios";
import { API_URL } from "../App";
import { useUser } from "./UserContext";

function ChatBot() {
  const location = useLocation();
  const {userId} = useUser();
  const {chalet_id} = useParams();
  const lang = location.pathname.split("/")[1] || "en";

  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${API_URL}/messages/getMessagesBySenderIdRecieverId/${userId}/4/${chalet_id}`);
        if (res.data && Array.isArray(res.data)) {
          const newMessages = res.data.map((messageObj) => {
            const formattedTime = new Intl.DateTimeFormat("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(messageObj.updatedAt));

            return {
              text: messageObj.message,
              type: messageObj.status === "sent" ? "sent" : "received",
              timestamp: formattedTime,
            };
          });
          setMessages(newMessages);
        } else {
          console.error("Unexpected data format", res.data);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    
    fetchMessages();

    const socketInstance = socketIOClient(API_URL);
    setSocket(socketInstance);

    socketInstance.on("receive_message", (messageData) => {
      if (messageData.senderId !== userId) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: messageData.message,
            type: "received",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [userId, chalet_id]); 

  const sendMessage = async () => {
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value.trim();

    if (message && socket) {
      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, type: "sent", timestamp },
      ]);

      try {
        await axios.post(`${API_URL}/messages/SendMessage`, {
          senderId: userId,
          message,
          status: "sent",
          lang,
          chaletId: chalet_id,
          receiverId: "4"
        });
      } catch (error) {
        console.error("Error sending message:", error);
      }
      
      messageInput.value = "";
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div>
      <div className="chat-window">
        <div className="chat-header">
          <img src={logo} alt="Profile" />
          <div className="header-info">
            <h4>Chalets Owner</h4>
          </div>
          <i className="fas fa-ellipsis-v"></i>
        </div>

        <div className="chat-body" id="chatBody">
          {messages.map((message, index) => (
            <div className={`message ${message.type}`} key={index}>
              <div className="bubble">{message.text}</div>
              <div className="timestamp">{message.timestamp}</div>
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Type a message..."
            id="messageInput"
            onKeyDown={handleKeyPress}
          />
          <button onClick={sendMessage}>
            <img src={send} alt="send" width={"20px"} height={"20px"} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;