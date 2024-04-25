import React, { useState, useEffect, useRef } from 'react';
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import ivancik from "assets/images/ai_loading.gif";

function WorkWithTheRockets({ aiResponse }) {
  const [text, setText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [triggerAnimation, setTriggerAnimation] = useState(false); // State to trigger animation
  const [showCursor, setShowCursor] = useState(true); // State to toggle cursor visibility
  const [showThinkingMessage, setShowThinkingMessage] = useState(false); // State to show thinking message
  const prevAiResponse = useRef(aiResponse);
  const originalText = aiResponse;
  const [showMessage, setShowMessage] = useState(true); // State to toggle message visibility

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setShowMessage((prev) => !prev);
    }, 1000); // Blinking speed, adjust as needed
    return () => clearInterval(messageInterval);
  }, []);

  useEffect(() => {
    let timer;
    let isTimerCompleted = false;
  
    if (triggerAnimation) {
      timer = setTimeout(() => {
        setText(originalText.substring(0, currentIndex));
        setCurrentIndex(currentIndex + 1);
        if (currentIndex + 1 === originalText.length) {
          isTimerCompleted = true;
        }
      }, 5); // Adjust the speed of typewriter effect by changing the timeout value
    }
  
    return () => {
      clearTimeout(timer);
      if (isTimerCompleted) {
        setShowThinkingMessage(true);
      }
    };
  }, [currentIndex, originalText, triggerAnimation]);

  useEffect(() => {
    if (aiResponse !== prevAiResponse.current) {
      setCurrentIndex(0); // Reset currentIndex
      setTriggerAnimation(true); // Trigger animation
      setShowThinkingMessage(false); // Hide thinking message when new response is received
      prevAiResponse.current = aiResponse;
    } else {
      setTriggerAnimation(false);
    }
  }, [aiResponse]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500); // Blinking speed, adjust as needed
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (!triggerAnimation) {
      setShowThinkingMessage(true);
    }
  }, [triggerAnimation]);

  return (
    <Card sx={{ height: "100%" }}>
      <SoftBox position="relative" height="100%" p={2}>
        <SoftBox
          display="flex"
          flexDirection="column"
          height="100%"
          py={2}
          px={2}
          borderRadius="lg"
          sx={{
            backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
              `${linearGradient(
                rgba(gradients.dark.main, 0.1),
                rgba(gradients.dark.state, 0.1)
              )}, url(${ivancik})`,
            backgroundSize: "cover",
          }}
        >
          <SoftBox mb={3} pt={1}>
            <SoftTypography variant="h4" color="white" fontWeight="bold">
              SkyBMS AI (Beta)
            </SoftTypography>
          </SoftBox>
          <SoftBox mb={2}>
            <SoftTypography variant="h4" color="white" fontWeight="light" style={{ color: "#b8bfbf" }}>
              {text}
              {showCursor && <span style={{ marginLeft: '2px' }}>|</span>}
            </SoftTypography>
          </SoftBox>

          {/* Move the "AI is thinking..." message inside the SoftBox component */}
          {showThinkingMessage && (
            <SoftBox
              mb={2}
              ml={2}
              position="absolute"
              bottom={10}
              left={10}
              zIndex={1}
              p={0.8}
              borderRadius={4}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.09)',
                transition: 'opacity 1.5s ease', // Apply fade transition
                opacity: showMessage ? 1 : 0, // Show or hide based on showMessage state
              }}
            >
              <div style={{ color: 'white', fontSize: '16px' }}>Looking for insights...</div>
            </SoftBox>
          )}
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

export default WorkWithTheRockets;
