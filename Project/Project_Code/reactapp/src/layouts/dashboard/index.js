// created by Sundeep Dayalan at 2024/04/25 21:42.
// Website:  www.sundeepdayalan.in
// Email: contact@sundeepdayalan.in

// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";


import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";


import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import GradientLineChart from "examples/Charts/LineCharts/GradientLineChart";


import typography from "assets/theme/base/typography";

// Dashboard layout components
import BuildByDevelopers from "layouts/dashboard/components/BuildByDevelopers";
import WorkWithTheRockets from "layouts/dashboard/components/WorkWithTheRockets";
import Projects from "layouts/dashboard/components/Projects";
import OrderOverview from "layouts/dashboard/components/OrderOverview";

import React, { useState, useEffect } from 'react';

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import gradientLineChartData from "layouts/dashboard/data/gradientLineChartData";
import { json } from "react-router-dom";

function Dashboard() {
  const { size } = typography;
  const { chart, items } = reportsBarChartData;
  const [dashboardData, setDashBoardData] = useState(null);
  const [socChartData, setSocChartData] = useState(null);
  const [voltageChartData, setVoltageChartData] = useState(null);
  const [socChartStat, setSocChartStat] = useState(null);
  const [voltageChartAvg, setVoltageChartAvg] = useState(null);
  const [connecting, setConnecting] = useState(true); // State to track initial connection
  const [reconnecting, setReconnecting] = useState(false); // State to track reconnection
  const [arduinoConnecting, setArduinoConnecting] = useState(false); // State to track reconnection
  const [lastUpdatedArduino, setLastUpdatedArduino] = useState(null);
  const [lastUpdatedSOC, setLastUpdatedSOC] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const [minTemp, setMinTemp] = useState(0);
  const [maxTemp, setMaxTemp] = useState(0);
  const [temperatureAlert, setTemperatureAlert] =useState(false);
  

  useEffect(() => {
    console.log("Updated socChartData:", JSON.stringify(socChartData));
    console.log("Updated gradientLineChartData:", JSON.stringify(gradientLineChartData));
  }, [socChartData]);


  const formatTimeDifference = (timestamp) => {
    if (!timestamp) {
      // setArduinoConnecting(true); // Set state if timestamp is not available
      return "Unknown";
    }
    const now = new Date();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
  
    if (seconds < 5) {
      return "Just now";
    } else if (seconds < 60) {
      return "Few seconds ago";
    }
  
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  };
  

  // Establish WebSocket connection
  useEffect(() => {
    let ws;

    const connectWebSocket = () => {
      ws = new WebSocket('ws://ec2-204-236-220-172.compute-1.amazonaws.com:8001');
      // const ws = new WebSocket('ws://localhost:8001');
      // const ws = new WebSocket('wss://echo.websocket.org');

      ws.onopen = () => {
        console.log('WebSocket connected');
        const messageObject = { type: "dashboard" };
            ws.send(JSON.stringify(messageObject));

        setConnecting(false); // Update connecting state
        setReconnecting(false); // Reset reconnecting state
        setArduinoConnecting(true);
      };

      ws.onmessage = event => {
        const jsonData = JSON.parse(event.data);

        if (jsonData && jsonData.type == "arduino_data") {
          console.log(`Received ${jsonData.type} from server:`, jsonData.temperature);
          if(jsonData &&  jsonData.temperature && jsonData.temperature>30){
            setTemperatureAlert(true);
          }else{
            setTemperatureAlert(false);
          }
          setDashBoardData(jsonData);
          setArduinoConnecting(false);
          setLastUpdatedArduino(new Date()); // Update timestamp for arduino_data
          
        } else if (jsonData && jsonData.type == "soc_chart_data") {

          // Trigger animation here
          // setAiResponse("The temperature of the battery is keep on increasing from 10C to 80C - "+Math.floor(Math.random() * (10 - 2) + 2));
          setLastUpdatedSOC(new Date());

          if (jsonData.socChartData.labels.length > 0) {
            setSocChartData(jsonData.socChartData);
          }

          if (jsonData.voltageChartData.labels.length > 0) {
            setVoltageChartData(jsonData.voltageChartData);
          }


          console.log(`Received ${jsonData.type} from server:`, JSON.stringify(jsonData));

          if (jsonData.socChartData && jsonData.socChartData.stat) {
            setSocChartStat(jsonData.socChartData.stat);
            delete jsonData.socChartData.stat;
          }

          if (jsonData.voltageChartData && jsonData.voltageChartData.avg) {
            setVoltageChartAvg(jsonData.voltageChartData.avg);
            delete jsonData.voltageChartData.avg;
          }

          if (jsonData.temperatureStat ) {
            setMinTemp(jsonData.temperatureStat.min);
            setMaxTemp(jsonData.temperatureStat.max);
            delete jsonData.temperatureStat;
          }

          delete jsonData.type;



          console.log("data");
          console.log(socChartData);
          console.log(jsonData.voltageChartData);
          console.log(jsonData.socChartData.stat);
        }else if (jsonData && jsonData.type == "ai_insight") {
          console.log("jsonData.answer: ",jsonData.answer.answer);
          let ans = jsonData.answer.answer;

          // Trigger animation here
          setAiResponse(ans);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setConnecting(false); // Reset connecting state
        setReconnecting(true); // Update reconnecting state
        // Attempt to reconnect
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
    <DashboardLayout >
      <div style={{ position: 'absolute', justifyContent: 'center', margin: '10', left: '40%', transform: 'translateX(-500%)', transform: 'translateY(-10%)', width: '100%' }}>
        {connecting && (
          <div style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '8px', display: 'inline-block' }}>
            <p style={{ fontSize: '0.8rem', textAlign: 'center', margin: '0' }}>Connecting...</p>
          </div>
        )}
        {reconnecting && (
          <div style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '8px', display: 'inline-block' }}>
            <p style={{ fontSize: '0.8rem', textAlign: 'center', margin: '0' }}>Reconnecting...</p>
          </div>
        )}
        {arduinoConnecting && (
          <div style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '8px', display: 'inline-block' }}>
            <p style={{ fontSize: '0.8rem', textAlign: 'center', margin: '0' }}>Waiting for BMS information...</p>
          </div>
        )}
      </div>

      <DashboardNavbar />
      <SoftBox py={3}>

        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "SOC" }}
                count={dashboardData ? `${Math.floor(dashboardData.soc)}` : "--"}
                percentage={{ color: "success", text: "%" }}
                icon={{ color: "info", component: "battery_full" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Voltage" }}
                count={dashboardData && dashboardData.voltage ? dashboardData.voltage.toFixed(2) : "--"}
                percentage={{ color: "success", text: "V" }}
                icon={{ color: "info", component: "bolt" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Temperature" }}
                count={dashboardData ? dashboardData.temperature : "--"}
                percentage={{ color: "success", text: "C" }}
                icon={{ color: "info", component: "thermostat" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Current Capacity" }}
                count={dashboardData ? dashboardData.current_capacity : "--"}
                percentage={{ color: "success", text: "mAh" }}
                icon={{
                  color: "info",
                  component: "battery_unknown",
                }}
              />
            </Grid>
          </Grid>
        </SoftBox>


        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={7}>
              <BuildByDevelopers 
              lastUpdated={formatTimeDifference(lastUpdatedArduino)} 
              soc={dashboardData ? dashboardData.soc : null} 
              isCharging={dashboardData ? dashboardData.is_charging : null} 
              minTemp={minTemp}
              maxTemp={maxTemp}
              shouldBlink={temperatureAlert}/>
            </Grid>
            <Grid item xs={12} lg={5}>
              <WorkWithTheRockets aiResponse={aiResponse} />
            </Grid>
          </Grid>
        </SoftBox>
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              {/* <ReportsBarChart
                title="active users"
                description={
                  <>
                    (<strong>+23%</strong>) than last week
                  </>
                }
                chart={chart}
                items={items}
              /> */}
              <GradientLineChart
                title="Voltage Overview"
                description={
                  <SoftBox display="flex" alignItems="center">
                    <SoftBox fontSize={size.lg} color="success" mb={0.3} mr={0.5} lineHeight={0}>
                      
                    </SoftBox>

                    {!socChartData && <SoftTypography variant="button" color="text" fontWeight="regular">
                      Waiting for Voltage information...
                    </SoftTypography>}


                    {voltageChartData && <SoftTypography variant="button" color="text" fontWeight="medium">
                      Average voltage: {voltageChartAvg && voltageChartAvg.toFixed(2)}V  {" "}
                      {socChartData && <SoftTypography variant="button" color="text" fontWeight="regular">
                      </SoftTypography>}
                    </SoftTypography>}
                  </SoftBox>
                }
                height="20.25rem"
                chart={voltageChartData ? voltageChartData : gradientLineChartData}
              />
            </Grid>

            <Grid item xs={12} lg={6}>

              <GradientLineChart
                title="Soc Overview"
                description={
                  <SoftBox display="flex" alignItems="center">
                    <SoftBox fontSize={size.lg} color="success" mb={0.3} mr={0.5} lineHeight={0}>
                      {socChartData && <Icon className="font-bold">
                        {socChartStat && socChartStat > 0 ? "arrow_upward" : "arrow_downward"}
                      </Icon>}
                    </SoftBox>

                    {!socChartData && <SoftTypography variant="button" color="text" fontWeight="regular">
                      Waiting for SOC information...
                    </SoftTypography>}


                    {socChartData && <SoftTypography variant="button" color="text" fontWeight="medium">
                      {socChartStat && Math.floor(socChartStat)}%  {socChartStat > 0 ? "high" : "less"}{" "}
                      {socChartData && <SoftTypography variant="button" color="text" fontWeight="regular">
                        in 30 minutes
                      </SoftTypography>}
                    </SoftTypography>}
                  </SoftBox>
                }
                height="20.25rem"
                chart={socChartData ? socChartData : gradientLineChartData}
              />
            </Grid>
          </Grid>
        </SoftBox>

      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
