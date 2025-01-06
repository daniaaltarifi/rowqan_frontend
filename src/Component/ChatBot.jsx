
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
  const lang = location.pathname.split("/")[1] || "en";
  const chalet_title = location.state?.chalet_title || null;

  const [messages, setMessages] = useState([
    { text: "Hello bro", type: "received", timestamp: "2:37 pm" },
    { text: "Whats up", type: "received", timestamp: "2:37 pm" },
    { text: "Mm okay", type: "sent", timestamp: "2:47 pm" },
  ]);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${API_URL}/messages/betweenMessage/${userId}/5`);
        // Check if the response contains data and it's an array
        if (res.data && Array.isArray(res.data)) {
          // Format and add received messages to the state
          const newMessages = res.data.map((messageObj) => ({
            text: messageObj.message,  // Extract message text
            type: messageObj.senderId === userId ? "sent" : "received",  // Determine sent/received type
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }), // Set timestamp
          }));

          setMessages((prevMessages) => [...prevMessages, ...newMessages]);
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
      // Update the messages when a new message is received
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
    });

    // Cleanup socket connection on component unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [userId])
  // Function to send a user message and notify the server
  const sendMessage = async () => {
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value.trim();

    if (message && socket) {
      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Add user message to the chat
      try {
        const res = await axios.post(`${API_URL}/messages/SendMessage`, {
          senderId: userId, // Replace with actual sender ID
          receiverId: 5, // Replace with actual receiver ID
          message,
          lang,
        });
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: message, type: "sent", timestamp },
        ]);
        console.log("first message sent", res.data);
      } catch (error) {
        console.error("Error sending message:", error);
      }
      // Clear the input field
      messageInput.value = "";

      // Emit the message to the server via Socket.IO
      socket.emit("send_message", {
        senderId: userId, // Replace with actual sender ID
        receiverId:5, // Replace with actual receiver ID
        message,
        lang,
      });
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
            <p>{chalet_title}</p>
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
