
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import socketIOClient from "socket.io-client"; // Import socket.io-client
import "../Css/ChatBot.css";
import logo from "../assets/logo.jpeg";
import send from "../assets/paper-plane.png";
import axios from "axios";
import { API_URL } from "../App";
import { useUser } from "./UserContext";

function ChatBot() {
  const location = useLocation();
  const {userId}=useUser()
  const {chalet_id}=useParams()
  const lang = location.pathname.split("/")[1] || "en";
const [receiverId,setReceiverId]=useState(null)
  const [messages, setMessages] = useState([
    // { text: "Hello bro", type: "received", timestamp: "2:37 pm" },
    // { text: "Whats up", type: "received", timestamp: "2:37 pm" },
    // { text: "Mm okay", type: "sent", timestamp: "2:47 pm" },
  ]);

  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const fetchReceiverId = async () => {
      let receiverId = localStorage.getItem("receiverId");
      if (!receiverId) {
        receiverId = await getReciverId();
        if (receiverId) {
          localStorage.setItem("receiverId", receiverId);
        } else {
          console.error("No valid receiver ID found.");
        }
      }
      setReceiverId(receiverId);
    };
  
    fetchReceiverId();
  }, []);
  
  useEffect(() => {
    const fetchMessages = async () => {
      if (!receiverId) return; // Wait for receiverId to be set
  
      try {
        const res = await axios.get(`${API_URL}/messages/getMessagesBySenderIdRecieverId/${userId}/${receiverId}/${chalet_id}`);
        if (res.data && Array.isArray(res.data)) {
          const newMessages = res.data.map((messageObj) => {
            // Format the timestamp for each message
            const formattedTime = new Intl.DateTimeFormat("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(messageObj.updatedAt));
  
            return {
              text: messageObj.message,
              type: messageObj.status === "sent" ? "sent" : "received",
              timestamp: formattedTime,  // Add the formatted time here
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
  
    // Initialize Socket.IO client
    const socketInstance = socketIOClient(API_URL);
    setSocket(socketInstance);
  
    // Listen for incoming messages from the server
    socketInstance.on("receive_message", (messageData) => {
      // Only add received messages to state
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
  
    // Cleanup socket connection on component unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [receiverId, userId]); // Dependency array updated to include receiverId
   const getReciverId = async () => {
    try {
      const res = await axios.get(`${API_URL}/userstypes/getAdmins/${lang}`);
      const receiverIds = res.data;
      if (receiverIds.length > 0) {
        const randomReceiver = receiverIds[Math.floor(Math.random() * receiverIds.length)];
        const randomReceiverId = randomReceiver.id;
        return randomReceiverId;
      }
      return null;
    } catch (error) {
      console.error("Error fetching receiver IDs:", error);
      return null;
    }
  };
  // Function to send a user message and notify the server
  const sendMessage = async () => {
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value.trim();
  
    if (message && socket) {
      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
  
      // Add user message to the chat (sent message)
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, type: "sent", timestamp },
      ]);
  
      try {
          await axios.post(`${API_URL}/messages/SendMessage`, {
          senderId: userId,
          message,
          status:"sent",
          lang,
          chaletId:chalet_id,
          receiverId: receiverId
        });
      } catch (error) {
        console.error("Error sending message:", error);
      }
      
      // Clear the input field after sending
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
