import { useState, useEffect } from 'react';
import { Instagram, Facebook, MessageCircle, MessageSquare, Send } from 'lucide-react';
import axios from 'axios';
import socketIOClient from 'socket.io-client';

import { useUser } from "../Component/UserContext"; 
import { API_URL } from '../App';

const SocialMediaButtons = () => {
  const [showButtons, setShowButtons] = useState(true);
  const { userId } = useUser(); 
  const [isVisible, setIsVisible] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [language, setLanguage] = useState('en'); 
  const [messages, setMessages] = useState([]);
  const [messagesLoaded, setMessagesLoaded] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false); 
  const [unreadMessages, setUnreadMessages] = useState(0); 
  const [lastReadTime, setLastReadTime] = useState(Date.now()); 
  
  
  useEffect(() => {
    const path = window.location.pathname;
    const lang = path.split('/')[1] || 'en';
    setLanguage(lang === 'ar' ? 'ar' : 'en');
  }, []);
  



  const [buttonsAnimation, setButtonsAnimation] = useState({
    chat: { visible: true, order: 0 },
    facebook: { visible: true, order: 1 },
    instagram: { visible: true, order: 2 },
    whatsapp: { visible: true, order: 3 }
  });
  
  const toggleButtons = () => {
    if (showButtons) {
      
      setTimeout(() => setButtonsAnimation(prev => ({...prev, whatsapp: {...prev.whatsapp, visible: false}})), 0);
      setTimeout(() => setButtonsAnimation(prev => ({...prev, instagram: {...prev.instagram, visible: false}})), 100);
      setTimeout(() => setButtonsAnimation(prev => ({...prev, facebook: {...prev.facebook, visible: false}})), 200);
      setTimeout(() => setButtonsAnimation(prev => ({...prev, chat: {...prev.chat, visible: false}})), 300);
      
      
      setTimeout(() => setShowButtons(false), 400);
    } else {
      
      setShowButtons(true);
      
      
      setTimeout(() => {
        setButtonsAnimation(prev => ({...prev, chat: {...prev.chat, visible: true}}));
        setTimeout(() => setButtonsAnimation(prev => ({...prev, facebook: {...prev.facebook, visible: true}})), 100);
        setTimeout(() => setButtonsAnimation(prev => ({...prev, instagram: {...prev.instagram, visible: true}})), 200);
        setTimeout(() => setButtonsAnimation(prev => ({...prev, whatsapp: {...prev.whatsapp, visible: true}})), 300);
      }, 50);
    }
  };

  const getButtonAnimationStyle = (buttonType) => {
    const baseTransition = "transform 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease";
    const isVisible = buttonsAnimation[buttonType]?.visible;
    
    return {
      transition: baseTransition,
      transform: isVisible ? "scale(1) translateY(0)" : "scale(0) translateY(20px)",
      opacity: isVisible ? 1 : 0,
      position: "relative",
      zIndex: 1
    };
  };
  
  
  const isLoggedIn = !!userId;
  
  const mainColor = "#F2C79D"; 
  const secondaryColor = "#6DA6BA";
  
  const chaletId = null; 
  const receiverId = "4";

  const senderId = userId
 
  useEffect(() => {
    if (showLoginPrompt) {
      const timer = setTimeout(() => {
        setShowLoginPrompt(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [showLoginPrompt]);

 
  useEffect(() => {
    console.log("User authentication status:", {
      userId,
      isLoggedIn
    });
  }, [userId, isLoggedIn]);

 
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


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
        const res = await axios.get(`${API_URL}/messages/betweenMessage/${senderId}/4`);
        
        if (res.data && Array.isArray(res.data)) {
          const newMessages = res.data.map((messageObj) => {
            const formattedTime = new Intl.DateTimeFormat(language === 'en' ? "en-US" : "ar-SA", {
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(messageObj.updatedAt));

            
            const messageType = messageObj.senderId.toString() === "3" ? "sent" : "received";

            return {
              text: messageObj.message,
              type: messageType,
              timestamp: formattedTime,
              time: new Date(messageObj.updatedAt).getTime()
            };
          });
          
          setMessages(newMessages);
          
          
          const unread = newMessages.filter(msg => 
            msg.type === "received" && msg.time > lastReadTime
          ).length;
          
          setUnreadMessages(unread);
          setMessagesLoaded(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
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
          time: Date.now()
        }
      ]);
      setMessagesLoaded(true);
    };
    
    
    if (!messagesLoaded) {
      fetchMessages();
    }
  }, [API_URL, language, messagesLoaded, lastReadTime]);
  
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (userId) {
          
          const res = await axios.get(`${API_URL}/messages/betweenMessage/${userId}/${receiverId}`);
          
          if (res.data && Array.isArray(res.data)) {
            const newMessages = res.data.map((messageObj) => {
              const formattedTime = new Intl.DateTimeFormat(language === 'en' ? "en-US" : "ar-SA", {
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(messageObj.updatedAt));

            
              const messageType = messageObj.senderId.toString() === userId.toString() ? "sent" : "received";

              return {
                text: messageObj.message,
                type: messageType,
                timestamp: formattedTime,
                time: new Date(messageObj.updatedAt).getTime()
              };
            });
            
            setMessages(newMessages);
            
           
            const unread = newMessages.filter(msg => 
              msg.type === "received" && msg.time > lastReadTime
            ).length;
            
            setUnreadMessages(unread);
            setMessagesLoaded(true);
          }
        } else {
          setDefaultWelcomeMessage();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
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
          time: Date.now()
        }
      ]);
      setMessagesLoaded(true);
    };
    
    if (!messagesLoaded && isLoggedIn) {
      fetchMessages();
    } else if (!messagesLoaded) {
      setDefaultWelcomeMessage();
    }
  }, [API_URL, userId, receiverId, language, messagesLoaded, lastReadTime, isLoggedIn]);

 

const createSocketConnection = (userId, receiverId, onMessageReceived) => {

  let connectionAttempts = 0;
  let socketInstance = null;
  let reconnectTimer = null;
  let isConnecting = false;
  
  
  const stopReconnecting = () => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  };
  

  const connect = () => {
    if (isConnecting || (socketInstance && socketInstance.connected)) return;
    
    stopReconnecting();
    isConnecting = true;
    
    
    connectionAttempts++;
    
    
    console.log(`Attempting socket connection (${connectionAttempts}/5)...`);
    
    try {
      
      const socketOptions = {
        reconnection: false, 
        timeout: 8000,
        transports: ['websocket'],
        forceNew: true,
        query: {
          userId: userId,
          clientId: `user_${userId}_${Date.now()}` 
        }
      };
      
     
      if (socketInstance) {
        try {
          socketInstance.disconnect();
          socketInstance.close();
        } catch (e) {
          console.log('Error while cleaning up previous socket:', e);
        }
      }
      
     
      socketInstance = socketIOClient(API_URL, socketOptions);
      
     
      socketInstance.on('connect', () => {
        console.log('Socket connected successfully!');
        isConnecting = false;
        connectionAttempts = 0; 
        
        
        socketInstance.emit('register_user', { userId: userId });
      });
      
     
      socketInstance.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        handleConnectionFailure();
      });
      
      
      socketInstance.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        isConnecting = false;
        
      
        if (reason === 'io server disconnect' || reason === 'transport close') {
          handleConnectionFailure();
        }
      });
      
     
      socketInstance.on("receive_message", (messageData) => {
        if (messageData.senderId === receiverId && messageData.receiverId === userId) {
          onMessageReceived(messageData);
        }
      });
      
    } catch (error) {
      console.error("Socket initialization error:", error);
      handleConnectionFailure();
    }
  };
  
  
  const handleConnectionFailure = () => {
    isConnecting = false;
    
   
    if (connectionAttempts >= 5) {
      console.log('Maximum connection attempts reached. Switching to polling mode.');
      enablePollingMode();
      return;
    }
    
   
    const delay = Math.min(30000, 2000 * Math.pow(2, connectionAttempts - 1));
    console.log(`Will try to reconnect in ${delay/1000} seconds...`);
    
    
    stopReconnecting();
    reconnectTimer = setTimeout(connect, delay);
  };
  
 
  const enablePollingMode = () => {
    console.log('Polling mode activated');
    
    stopReconnecting();
    
  
    if (socketInstance) {
      try {
        socketInstance.disconnect();
        socketInstance.close();
      } catch (e) {
        console.log('Error while cleaning up socket in polling mode:', e);
      }
      socketInstance = null;
    }
    
   
    startMessagePolling();
  };
  
  
  let pollingInterval = null;
  const startMessagePolling = () => {
    
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
    
    
    window.usingPollingMode = true;
    
   
    pollingInterval = setInterval(async () => {
      try {
        
        const lastMessageTime = window.lastMessageTime || 0;
        
     
        const response = await axios.get(
          `${API_URL}/messages/getNewMessages/${userId}/${receiverId}/${lastMessageTime}`,
          { timeout: 5000 }
        );
        
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
         
          response.data.forEach(messageData => {
            onMessageReceived(messageData);
            
            const messageTime = new Date(messageData.createdAt).getTime();
            if (messageTime > (window.lastMessageTime || 0)) {
              window.lastMessageTime = messageTime;
            }
          });
        }
      } catch (error) {
        console.error('Error in polling messages:', error);
      }
    }, 10000); 
  };
  

  const cleanup = () => {
    stopReconnecting();
    
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
    
    if (socketInstance) {
      try {
        socketInstance.disconnect();
        socketInstance.close();
      } catch (e) {
        console.log('Error during socket cleanup:', e);
      }
      socketInstance = null;
    }
    
    connectionAttempts = 0;
    isConnecting = false;
  };
  

  connect();
  
 
  return {
    reconnect: connect,
    disconnect: cleanup,
    isConnected: () => socketInstance && socketInstance.connected
  };
};


useEffect(() => {
  let socketController = null;
  
  if (isLoggedIn) {

    const handleMessageReceived = (messageData) => {
      const newMessage = {
        text: messageData.message,
        type: "received",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        time: Date.now()
      };
      
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      
      if (!isChatOpen) {
        setUnreadMessages(prev => prev + 1);
      }
    };
    

    socketController = createSocketConnection(userId, receiverId, handleMessageReceived);
    

    window.lastMessageTime = Date.now();
  }
  

  return () => {
    if (socketController) {
      socketController.disconnect();
    }
  };
}, [API_URL, userId, receiverId, isLoggedIn, isChatOpen]);


const sendMessage = async () => {
  const messageInput = document.getElementById("messageInput");
  if (!messageInput || !isLoggedIn) return;
  
  const message = messageInput.value.trim();

  if (message) {
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    
    const currentTime = Date.now();
    

    const newMessage = {
      text: message,
      type: "sent",
      timestamp,
      time: currentTime
    };
    
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    messageInput.value = "";
    

    const localMessageId = `msg_${currentTime}`;

    const pendingMessage = {
      id: localMessageId,
      message,
      senderId: userId,
      receiverId,
      chaletId,
      status: "pending",
      timestamp: currentTime
    };
    

    const pendingMessages = JSON.parse(localStorage.getItem('pendingMessages') || '[]');
    pendingMessages.push(pendingMessage);
    localStorage.setItem('pendingMessages', JSON.stringify(pendingMessages));
    
    try {

      const response = await axios.post(`${API_URL}/messages/SendMessage`, {
        senderId: userId,
        message,
        status: "sent",
        lang: language,
        chaletId: chaletId,
        receiverId: receiverId,
        localMessageId 
      }, {
        timeout: 8000
      });
      
  
      const updatedPendingMessages = JSON.parse(localStorage.getItem('pendingMessages') || '[]')
        .filter(msg => msg.id !== localMessageId);
      localStorage.setItem('pendingMessages', JSON.stringify(updatedPendingMessages));
      

      window.lastMessageTime = Date.now();
      
      console.log('Message sent successfully:', response.data);
      
    } catch (error) {
      console.error("Error sending message:", error);
      

      const updatedPendingMessages = JSON.parse(localStorage.getItem('pendingMessages') || '[]');
      const messageIndex = updatedPendingMessages.findIndex(msg => msg.id === localMessageId);
      
      if (messageIndex !== -1) {
        updatedPendingMessages[messageIndex].status = "failed";
        localStorage.setItem('pendingMessages', JSON.stringify(updatedPendingMessages));
      }
      
    }
  }
};


const retrySendingPendingMessages = async () => {
  const pendingMessages = JSON.parse(localStorage.getItem('pendingMessages') || '[]');
  const failedMessages = pendingMessages.filter(msg => msg.status === "failed" || msg.status === "pending");
  
  if (failedMessages.length === 0) return;
  
  for (const message of failedMessages) {
    try {
      await axios.post(`${API_URL}/messages/SendMessage`, {
        senderId: message.senderId,
        message: message.message,
        status: "sent",
        lang: language,
        chaletId: message.chaletId,
        receiverId: message.receiverId,
        localMessageId: message.id
      }, {
        timeout: 8000
      });
      

      const updatedMessages = JSON.parse(localStorage.getItem('pendingMessages') || '[]')
        .filter(msg => msg.id !== message.id);
      localStorage.setItem('pendingMessages', JSON.stringify(updatedMessages));
      
    } catch (error) {
      console.error(`Failed to resend message ${message.id}:`, error);
    }
  }
};


useEffect(() => {
  const handleOnline = () => {
    console.log('Internet connection restored');
    retrySendingPendingMessages();
  };
  
  window.addEventListener('online', handleOnline);
  
  return () => {
    window.removeEventListener('online', handleOnline);
  };
}, []);
 
  const toggleChat = () => {
    console.log("Toggle chat clicked, isLoggedIn:", isLoggedIn);
    
    if (isLoggedIn) {
     
      if (!isChatOpen) {
        setUnreadMessages(0);
        setLastReadTime(Date.now());
      }
      
      setIsChatOpen(!isChatOpen);
    } else {
      
      setShowLoginPrompt(true);
    }
  };
  
 
  const goToLogin = () => {
    window.location.href = `/${language}/login`;
  };
  
  const toggleLanguage = () => {
    
    const newLanguage = language === 'en' ? 'ar' : 'en';
    setLanguage(newLanguage);
    
   
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/');
    
    if (pathParts[1] === 'en' || pathParts[1] === 'ar') {
      pathParts[1] = newLanguage;
      const newPath = pathParts.join('/');
      window.history.pushState({}, '', newPath);
    }
  };

  // const sendMessage = async () => {
  //   const messageInput = document.getElementById("messageInput");
  //   if (!messageInput || !isLoggedIn) return;
    
  //   const message = messageInput.value.trim();
  
  //   if (message) {
  //     const timestamp = new Date().toLocaleTimeString([], {
  //       hour: "2-digit",
  //       minute: "2-digit",
  //     });
  
  //     const newMessage = {
  //       text: message,
  //       type: "sent",
  //       timestamp,
  //       time: Date.now()
  //     };
      
  //     setMessages((prevMessages) => [...prevMessages, newMessage]);
  
  //     try {
  //       await axios.post(`${API_URL}/messages/SendMessage`, {
  //         senderId: userId,           
  //         message,                    
  //         status: "sent",             
  //         lang: language,             
  //         chaletId: chaletId,         
  //         receiverId: receiverId      
  //       });
  //     } catch (error) {
  //       console.error("Error sending message:", error);
  //     }
      
  //     messageInput.value = "";
  //   }
  // };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };


  const isMobile = windowWidth <= 768;
  const buttonSize = isMobile ? "40px" : "48px";
  const iconSize = isMobile ? 20 : 24;
  const buttonMargin = isMobile ? "5px 0" : "8px 0";
  const chatBoxWidth = windowWidth < 400 ? (windowWidth - 40) + "px" : (windowWidth < 768 ? "280px" : "320px");
  const chatBoxHeight = isMobile ? "70vh" : "450px";
  const bottomPosition = isMobile ? "16px" : "24px";
  const rightPosition = isMobile ? "16px" : "24px";

 
  const buttonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: mainColor,
    width: buttonSize,
    height: buttonSize,
    borderRadius: "50%",
    color: "#333",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
    margin: buttonMargin,
    border: "2px solid #fff",
    cursor: "pointer",
    position: "relative"
  };

  const liveChatButtonStyle = {
    ...buttonStyle,
    backgroundColor: secondaryColor,
  };

  const notificationBadgeStyle = {
    position: "absolute",
    top: "-5px",
    right: "-5px",
    backgroundColor: "#FF3B30",
    color: "white",
    minWidth: "18px",
    height: "18px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "bold",
    padding: "0 4px",
    border: "2px solid #fff",
    boxSizing: "border-box"
  };


  const containerStyle = {
    position: "fixed",
    right: rightPosition,
    bottom: bottomPosition,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    zIndex: 998, 
    transform: isVisible ? "translateY(0)" : "translateY(100px)",
    opacity: isVisible ? 1 : 0,
    transition: "all 0.5s ease"
  };

  const chatBoxStyle = {
    position: "fixed",
    right: rightPosition,
    bottom: isMobile ? "80px" : "100px", 
    width: chatBoxWidth,
    height: chatBoxHeight,
    maxHeight: isMobile ? "60vh" : "450px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.15)",
    display: isChatOpen ? "flex" : "none",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: 999,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  
  const loginPromptStyle = {
    position: "fixed",
    right: rightPosition,
    bottom: isMobile ? "85px" : "105px",
    padding: "15px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.15)",
    display: showLoginPrompt ? "flex" : "none",
    flexDirection: "column",
    maxWidth: "250px",
    zIndex: 999,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    direction: language === 'ar' ? 'rtl' : 'ltr',
  };

  const loginPromptButtonStyle = {
    backgroundColor: secondaryColor,
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "8px 15px",
    marginTop: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    alignSelf: "center"
  };

  
  const mobileChatBoxStyle = {
    ...chatBoxStyle,
    ...(windowWidth < 400 ? {
      left: "5%",
      right: "5%",
      width: "90%",
      height: "60vh",
      bottom: "90px" 
    } : {})
  };

  const chatHeaderStyle = {
    display: "flex",
    padding: isMobile ? "8px 12px" : "10px 15px",
    backgroundColor: secondaryColor,
    color: "#fff",
    borderBottom: "1px solid #ddd",
    alignItems: "center",
    fontWeight: "bold",
    direction: language === 'ar' ? 'rtl' : 'ltr',
  };

  const headerInfoStyle = {
    marginLeft: language === 'ar' ? "0" : (isMobile ? "10px" : "15px"),
    marginRight: language === 'ar' ? (isMobile ? "10px" : "15px") : "0",
    flex: 1,
  };

  const chatBodyStyle = {
    flex: 1,
    padding: isMobile ? "10px" : "15px",
    overflowY: "auto",
    backgroundColor: "#f5f5f5",
    direction: language === 'ar' ? 'rtl' : 'ltr',
  };

  const chatInputStyle = {
    display: "flex",
    padding: isMobile ? "8px" : "10px",
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
    fontSize: isMobile ? "14px" : "16px",
  };

  const sendButtonStyle = {
    backgroundColor: secondaryColor,
    border: "none",
    borderRadius: "50%",
    width: isMobile ? "32px" : "36px",
    height: isMobile ? "32px" : "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    marginLeft: language === 'ar' ? "0" : "10px",
    marginRight: language === 'ar' ? "10px" : "0",
  };

  return (
    <>
     
      {isLoggedIn && isChatOpen && (
        <div style={isMobile && windowWidth < 400 ? mobileChatBoxStyle : chatBoxStyle}>
          <div style={chatHeaderStyle}>
            <div style={headerInfoStyle}>
              <h4 style={{ margin: 0, fontSize: isMobile ? "14px" : "16px" }}>
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
                fontSize: isMobile ? "12px" : "14px",
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
                fontSize: isMobile ? "16px" : "18px",
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
        alignItems: message.type === "sent" ? "flex-end" : "flex-start",
        marginBottom: "10px",
      }}
    >
      <div
        style={{
          backgroundColor: message.type === "sent" ? "#e1ffc7" : "#fff",
          borderRadius: "18px",
          padding: isMobile ? "6px 10px" : "8px 12px",
          maxWidth: "70%",
          boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
          wordBreak: "break-word",
          fontSize: isMobile ? "14px" : "16px",
        }}
      >
        {message.text}
      </div>
      <div
        style={{
          fontSize: isMobile ? "10px" : "12px",
          color: "#999",
          marginTop: "4px",
          alignSelf: message.type === "sent" ? "flex-end" : "flex-start",
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
              <Send size={isMobile ? 16 : 20} color="white" />
            </button>
          </div>
        </div>
      )}

      
      <div style={loginPromptStyle}>
        <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
          {language === 'en' 
            ? 'Please login to start chatting' 
            : 'يرجى تسجيل الدخول لبدء المحادثة'}
        </div>
        <div style={{ fontSize: "14px", marginBottom: "10px" }}>
          {language === 'en' 
            ? 'You need to be logged in to use the chat feature' 
            : 'يجب أن تكون مسجل دخول لاستخدام ميزة الدردشة'}
        </div>
        <button 
          style={loginPromptButtonStyle}
          onClick={goToLogin}
        >
          {language === 'en' ? 'Login' : 'تسجيل الدخول'}
        </button>
      </div>
      <div style={containerStyle}>
      {showButtons && (
        <>
          <button 
            onClick={toggleChat}
            style={{
              ...liveChatButtonStyle,
              ...getButtonAnimationStyle('chat')
            }}
            aria-label={language === 'en' ? "Live Chat" : "المحادثة المباشرة"}
            onMouseOver={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = "scale(1) translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
              }
            }}
            onMouseOut={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = "scale(1) translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
              }
            }}
          >
            <MessageSquare size={iconSize} />
            
            {unreadMessages > 0 && (
              <div style={notificationBadgeStyle}>
                {unreadMessages}
              </div>
            )}
          </button>
          
          <a 
            href="https://www.facebook.com/people/Rowqanjo/61559952154129/?mibextid=wwXIfr&rdid=oOUwDhk6qNJ7B6u7&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1DtYhSXtFC%2F%3Fmibextid%3DwwXIfr" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{
              ...buttonStyle,
              ...getButtonAnimationStyle('facebook')
            }}
            aria-label="Facebook"
            onMouseOver={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = "scale(1) translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
              }
            }}
            onMouseOut={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = "scale(1) translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
              }
            }}
          >
            <Facebook size={iconSize} />
          </a>

          <a 
            href="https://www.instagram.com/rowqan.jo?igsh=MW5sbXMxODFkbXlvdA%3D%3D&utm_source=qr" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{
              ...buttonStyle,
              ...getButtonAnimationStyle('instagram')
            }}
            aria-label="Instagram"
            onMouseOver={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = "scale(1) translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
              }
            }}
            onMouseOut={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = "scale(1) translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
              }
            }}
          >
            <Instagram size={iconSize} />
          </a>

          <a 
            href="https://wa.me/962791532972" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{
              ...buttonStyle,
              ...getButtonAnimationStyle('whatsapp')
            }}
            aria-label="WhatsApp"
            onMouseOver={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = "scale(1) translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
              }
            }}
            onMouseOut={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = "scale(1) translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
              }
            }}
          >
            <MessageCircle size={iconSize} />
          </a>
        </>
      )}
      
      <button
        onClick={toggleButtons}
        style={{
          ...buttonStyle,
          transition: "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
          backgroundColor: showButtons ? secondaryColor : mainColor,
          zIndex: 2
        }}
        aria-label={language === 'en' ? "Toggle buttons" : "إظهار/إخفاء الأزرار"}
        onMouseOver={(e) => {
          if (!isMobile) {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
          }
        }}
        onMouseOut={(e) => {
          if (!isMobile) {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{transition: "transform 0.3s ease"}}
        >
          {showButtons ? (
            // Down arrow when buttons are shown
            <path d="M6 9l6 6 6-6" />
          ) : (
            
            <path d="M18 15l-6-6-6 6" />
          )}
        </svg>
      </button>
    </div>
    </>
  );
};

export default SocialMediaButtons;