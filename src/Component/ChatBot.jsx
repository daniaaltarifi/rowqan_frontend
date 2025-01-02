import  { useState } from 'react';
import '../Css/ChatBot.css';
import logo from '../assets/logo.jpeg';
import send from '../assets/paper-plane.png';
import { useLocation } from 'react-router-dom';
function ChatBot() {
    const location = useLocation();

    const chalet_title = location.state?.chalet_title || null;
    console.log("first", chalet_title);
    const [messages, setMessages] = useState([
    { text: 'Hello bro', type: 'received', timestamp: '2:37 pm' },
    { text: 'Whats up', type: 'received', timestamp: '2:37 pm' },
    { text: 'Mm okay bro', type: 'sent', timestamp: '2:47 pm' }
  ]);

  // Function to send a user message and receive a bot response
  const sendMessage = () => {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();

    if (message) {
      // Get current time in a format
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Add user message to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, type: 'sent', timestamp }
      ]);

      // Clear input field
      messageInput.value = '';

      // Simulate a bot response after a delay (for demonstration purposes)
      setTimeout(() => {
        const botMessage = 'This is an automated response.';
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: botMessage, type: 'received', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);
      }, 1000);
    }
  };

  return (
    <div>
      {/* Right Panel: Chat Window */}
      <div className="chat-window">
        {/* Chat Header */}
        <div className="chat-header">
          <img src={logo} alt="Profile" />
          <div className="header-info">
            <h4>Chalets Owner</h4>
            <p>{chalet_title}</p>
          </div>
          <i className="fas fa-ellipsis-v"></i>
        </div>

        {/* Chat Body */}
        <div className="chat-body" id="chatBody">
          {messages.map((message, index) => (
            <div className={`message ${message.type}`} key={index}>
              <div className="bubble">{message.text}</div>
              <div className="timestamp">{message.timestamp}</div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="chat-input">
          <input type="text" placeholder="Type a message..." id="messageInput" />
          <button onClick={sendMessage}>
            <img src={send} alt="send" width={"20px"} height={"20px"} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
