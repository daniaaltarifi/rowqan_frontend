import { useState, useEffect } from 'react';
import { Instagram, Facebook, MessageCircle, MessageSquare, Send } from 'lucide-react';
import axios from 'axios';
import socketIOClient from 'socket.io-client';
import PropTypes from 'prop-types'; 


const SocialMediaButtons = ({ userIdProp }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [language, setLanguage] = useState('en'); 
  const [messages, setMessages] = useState([]);
  const [, setSocket] = useState(null);
  const [messagesLoaded, setMessagesLoaded] = useState(false);
  
  const mainColor = "#F2C79D"; 
  const secondaryColor = "#6DA6BA";
  
  
  const userId = userIdProp ? "2" : null;
  
  const API_URL = "http://localhost:5000"; 
  
  const chaletId = null; 
  
  
  const receiverId = "4";

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

 
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        
        if (userId) {
          const res = await axios.get(`${API_URL}/messages/getMessagesBySenderIdRecieverId/${userId}/${receiverId}/${chaletId || ''}`);
          if (res.data && Array.isArray(res.data)) {
            const newMessages = res.data.map((messageObj) => {
              const formattedTime = new Intl.DateTimeFormat(language === 'en' ? "en-US" : "ar-SA", {
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
            setMessagesLoaded(true);
          }
        } else {
         
          setDefaultWelcomeMessage();
        }
      } catch (error) {
        console.error("Error fetching data", error);
        setDefaultWelcomeMessage();
      }
    };
    
    const setDefaultWelcomeMessage = () => {
      setMessages([
        {
          text: language === 'en' ? 'Hello! How can I help you today?' : 'مرحباً بك! كيف يمكنني مساعدتك اليوم؟',
          type: 'received',
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }
      ]);
      setMessagesLoaded(true);
    };
    
    if (!messagesLoaded) {
      fetchMessages();
    }
  }, [API_URL, userId, chaletId, receiverId, language, messagesLoaded]);

  
  useEffect(() => {
    if (isChatOpen) {
      try {
        const socketInstance = socketIOClient(API_URL);
        setSocket(socketInstance);

        socketInstance.on("receive_message", (messageData) => {
          
          if (messageData.senderId === receiverId && (!userId || messageData.senderId !== userId)) {
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
      } catch (error) {
        console.error("Socket connection error:", error);
      }
    }
  }, [isChatOpen, API_URL, userId, receiverId]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const sendMessage = async () => {
    const messageInput = document.getElementById("messageInput");
    if (!messageInput) return;
    
    const message = messageInput.value.trim();
  
    if (message) {
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
          lang: language,             
          chaletId: chaletId,         
          receiverId: receiverId      
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

  const buttonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: mainColor,
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    color: "#333",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
    margin: "8px 0",
    border: "2px solid #fff",
  };

  const liveChatButtonStyle = {
    ...buttonStyle,
    backgroundColor: secondaryColor,
  };

  const containerStyle = {
    position: "fixed",
    right: "24px",
    bottom: "24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    zIndex: 1000,
    transform: isVisible ? "translateY(0)" : "translateY(100px)",
    opacity: isVisible ? 1 : 0,
    transition: "all 0.5s ease"
  };

  const chatBoxStyle = {
    position: "fixed",
    right: "88px",
    bottom: "24px",
    width: "320px",
    height: "450px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.15)",
    display: isChatOpen ? "flex" : "none",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: 999,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const chatHeaderStyle = {
    display: "flex",
    padding: "10px 15px",
    backgroundColor: secondaryColor,
    color: "#fff",
    borderBottom: "1px solid #ddd",
    alignItems: "center",
    fontWeight: "bold",
    direction: language === 'ar' ? 'rtl' : 'ltr',
  };

  const headerInfoStyle = {
    marginLeft: language === 'ar' ? "0" : "15px",
    marginRight: language === 'ar' ? "15px" : "0",
    flex: 1,
  };

  const chatBodyStyle = {
    flex: 1,
    padding: "15px",
    overflowY: "auto",
    backgroundColor: "#f5f5f5",
    direction: language === 'ar' ? 'rtl' : 'ltr',
  };

  const chatInputStyle = {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #ddd",
    backgroundColor: "#fff",
    direction: language === 'ar' ? 'rtl' : 'ltr',
  };

  const messageInputStyle = {
    flex: "1",
    border: "1px solid #ddd",
    borderRadius: "18px",
    padding: "8px 12px",
    outline: "none",
    fontFamily: language === 'ar' ? 'Arial, sans-serif' : 'inherit',
    direction: language === 'ar' ? 'rtl' : 'ltr',
  };

  const sendButtonStyle = {
    backgroundColor: secondaryColor,
    border: "none",
    borderRadius: "50%",
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    marginLeft: language === 'ar' ? "0" : "10px",
    marginRight: language === 'ar' ? "10px" : "0",
  };

 

  return (
    <>
      <div style={chatBoxStyle}>
        <div style={chatHeaderStyle}>
          <div style={headerInfoStyle}>
            <h4 style={{ margin: 0 }}>
              {language === 'en' ? 'Chalets Owner' : 'مالك الشاليه'}
            </h4>
          </div>
          <button
            onClick={toggleLanguage}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            {language === 'en' ? 'عربي' : 'EN'}
          </button>
          <button
            onClick={toggleChat}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            ×
          </button>
        </div>

        <div style={chatBodyStyle}>
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: message.type === "sent" 
                  ? (language === 'ar' ? "flex-start" : "flex-end") 
                  : (language === 'ar' ? "flex-end" : "flex-start"),
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  backgroundColor: message.type === "sent" ? "#e1ffc7" : "#fff",
                  borderRadius: "18px",
                  padding: "8px 12px",
                  maxWidth: "70%",
                  boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                  wordBreak: "break-word",
                }}
              >
                {message.text}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#999",
                  marginTop: "4px",
                  alignSelf: message.type === "sent" 
                    ? (language === 'ar' ? "flex-start" : "flex-end") 
                    : (language === 'ar' ? "flex-end" : "flex-start"),
                }}
              >
                {message.timestamp}
              </div>
            </div>
          ))}
        </div>

        <div style={chatInputStyle}>
          <input
            type="text"
            placeholder={language === 'en' ? "Type a message..." : "اكتب رسالة..."}
            id="messageInput"
            style={messageInputStyle}
            onKeyDown={handleKeyPress}
          />
          <button 
            style={sendButtonStyle} 
            onClick={sendMessage}
            aria-label={language === 'en' ? "Send" : "إرسال"}
          >
            <Send size={20} color="white" />
          </button>
        </div>
      </div>

      <div style={containerStyle}>
        <button 
          onClick={toggleChat}
          style={liveChatButtonStyle}
          aria-label={language === 'en' ? "Live Chat" : "المحادثة المباشرة"}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
          }}
        >
          <MessageSquare size={24} />
        </button>
        
        <a 
          href="https://www.facebook.com/people/Rowqanjo/61559952154129/?mibextid=wwXIfr&rdid=oOUwDhk6qNJ7B6u7&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1DtYhSXtFC%2F%3Fmibextid%3DwwXIfr" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={buttonStyle}
          aria-label="Facebook"
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
          }}
        >
          <Facebook size={24} />
        </a>

        <a 
          href="https://www.instagram.com/rowqan.jo?igsh=MW5sbXMxODFkbXlvdA%3D%3D&utm_source=qr" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={buttonStyle}
          aria-label="Instagram"
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
          }}
        >
          <Instagram size={24} />
        </a>

        <a 
          href="https://wa.me/962791532972" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={buttonStyle}
          aria-label="WhatsApp"
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
          }}
        >
          <MessageCircle size={24} />
        </a>

        <button
          onClick={scrollToTop}
          style={buttonStyle}
          aria-label={language === 'en' ? "Back to top" : "العودة إلى الأعلى"}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </button>
      </div>
    </>
  );
};


SocialMediaButtons.propTypes = {
  userIdProp: PropTypes.bool
};


SocialMediaButtons.defaultProps = {
  userIdProp: false 
};

export default SocialMediaButtons;