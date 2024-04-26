
// @mui material components
import Card from "@mui/material/Card";
import React, { useState, useRef, useEffect } from 'react';

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";
import './table.css';

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";

import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { AddUserButton, ArrowButton, AttachmentButton, Avatar, AvatarGroup, Button, Buttons, ChatContainer, Conversation, ConversationHeader, ConversationList, EllipsisButton, Enums, ExpansionPanel, InfoButton, InputToolbox, Loader, MainContainer, Message, MessageGroup, MessageInput, MessageList, MessageSeparator, Overlay, Search, SendButton, Sidebar, StarButton, Status, StatusList, TypingIndicator, VideoCallButton, VoiceCallButton } from '@chatscope/chat-ui-kit-react';


function Tables() {
  const [connecting, setConnecting] = useState(true); // State to track initial connection
  const [reconnecting, setReconnecting] = useState(false); // State to track reconnection
  const [arduinoConnecting, setArduinoConnecting] = useState(false); // State to track reconnection
  const [lastUpdatedArduino, setLastUpdatedArduino] = useState(null);
  const [isAiTyping, setIsAiTyping] = useState(false);

  const [message, setMessage] = useState(''); // State to track the message typed by the user
  const [showAlert, setShowAlert] = useState(false); // State to control the visibility of the alert
  const [webSocket, setWebSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  // Function to handle sending the message
  const handleSendMessage = (innerHtml, textContent, innerText, nodes) => {
    if (webSocket) {
      setIsAiTyping(true);
      const UiMessageObject = {
        direction: 'outgoing',
        message: textContent,
        position: 'single',
        sender: 'Oliver',
        sentTime: new Date().toLocaleTimeString()
      };
      setMessages([...messages, UiMessageObject]); // Update messages state
       
      const messageObject = { type: "ai_query",query: textContent };
      webSocket.send(JSON.stringify(messageObject));
    }

  };

  useEffect(() => {
    let ws;

    const connectWebSocket = () => {
      ws = new WebSocket('ws://ec2-204-236-220-172.compute-1.amazonaws.com:8001');



      ws.onopen = () => {
        console.log('WebSocket connected in Chat screen');
        setWebSocket(ws);
        // wsRef.send(JSON.stringify(messageObject));
        // alert('connected')
        setConnecting(false); // Update connecting state
        setReconnecting(false); // Reset reconnecting state
        setArduinoConnecting(true);
      };

      ws.onmessage = event => {
        if (event.data instanceof Blob) {

        } else {
          const jsonData = JSON.parse(event.data);

          if (jsonData && jsonData.type === "ai_response") {
            
            setArduinoConnecting(false);
            setLastUpdatedArduino(new Date()); // Update timestamp for arduino_data
            alert(jsonData.answer);
            setIsAiTyping(false);

            if(jsonData.isSuccess === true){
              const messageObject = {
                direction: 'incoming',
                message: jsonData.answer,
                position: 'single',
                sender: 'SkyBMS AI',
                sentTime: new Date().toLocaleTimeString()
              };
              // Update messages state by concatenating the new message to the existing array
              setMessages(prevMessages => [...prevMessages, messageObject]);
            }else{
              const messageObject = {
                direction: 'incoming',
                message: "SkyBMS AI is offline. Please try again later",
                position: 'single',
                sender: 'SkyBMS AI',
                sentTime: new Date().toLocaleTimeString()
              };
              // Update messages state by concatenating the new message to the existing array
              setMessages(prevMessages => [...prevMessages, messageObject]);
            }
            
          }
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setConnecting(false); // Reset connecting state
        setReconnecting(true); // Update reconnecting state
        // Attempt to reconnect
        setWebSocket(null);
        setTimeout(connectWebSocket, 3000); // Try reconnecting after 3 seconds
      };

      ws.onerror = error => {
        console.error('WebSocket error:', error);
        setConnecting(false); // Reset connecting state
        setReconnecting(true); // Update reconnecting state
        // Attempt to reconnect
        setTimeout(connectWebSocket, 3000); // Try reconnecting after 3 seconds
      };
    };

    // Start WebSocket connection
    connectWebSocket();

    return () => {
      // Clean up WebSocket connection on component unmount
      if (ws) {
        ws.close();
      }
    };
  }, []); // Empty dependency array ensures effect runs only once on mount


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div style={{ position: "relative", marginBottom:"20px" }}>
        {reconnecting ? (
          // Show loading animation while connecting
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div
              style={{
                border: '2px solid rgba(0, 0, 0, 0.2)',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                animation: 'ripple 1s infinite'
              }}
            ></div>
            <div style={{ fontSize: '20px', textAlign: 'center' }}>Establishing connection with SkyBMS AI...</div>
          </div>


        ) : !reconnecting && (< MainContainer style={{
          height: '80vh'
        }}  >
          <ChatContainer

          >
            <ConversationHeader>
              <Avatar
                name="Emily"
                src="https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg"
              />
              <ConversationHeader.Content
                info="Active now"
                userName="SkyBMS AI (Beta)"
              />
              <ConversationHeader.Actions>
                {/* <VoiceCallButton />
                <VideoCallButton />
                <InfoButton /> */}
              </ConversationHeader.Actions>
            </ConversationHeader>
            <MessageList typingIndicator={isAiTyping ? <TypingIndicator content="SkyBMS AI is preparing answers" /> : null}>
            {messages.map((message, index) => (
            <Message
            style={{ fontSize: '20px'}}
              key={index}
              model={{
                direction: message.direction,
                message: message.message,
                position: message.position,
                sender: message.sender,
                sentTime: message.sentTime
              }}
            >
              {message.direction === 'incoming' && (
                <Avatar
                  name={message.sender}
                  src="https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg"
                />
              )}
            </Message>
          ))}

            </MessageList>
            <MessageInput placeholder="Ask something with SkyBMS..."
              // onChange={handleMessageChange}
              onSend={handleSendMessage}
            />
          </ChatContainer>
        </MainContainer>)}
      </div>
      <Footer  />
    </DashboardLayout>
  );
}

export default Tables;
