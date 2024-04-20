/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import GradientLineChart from "examples/Charts/LineCharts/GradientLineChart";

// Soft UI Dashboard React base styles
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

function Dashboard() {
  const { size } = typography;
  const { chart, items } = reportsBarChartData;
  const [data, setData] = useState(null);
  const [connecting, setConnecting] = useState(true); // State to track initial connection
  const [reconnecting, setReconnecting] = useState(false); // State to track reconnection


   // Establish WebSocket connection
   useEffect(() => {
    let ws;

    const connectWebSocket = () => {
      ws = new WebSocket('ws://ec2-204-236-220-172.compute-1.amazonaws.com:8001');
      // const ws = new WebSocket('ws://localhost:8001');
      // const ws = new WebSocket('wss://echo.websocket.org');

      ws.onopen = () => {
        console.log('WebSocket connected');
        setConnecting(false); // Update connecting state
        setReconnecting(false); // Reset reconnecting state
      };

      ws.onmessage = event => {
        const jsonData = JSON.parse(event.data);
        console.log('Received JSON data from server:', jsonData);
        setData(jsonData); // Update state with received data
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
    <DashboardLayout>
   <div style={{ position: 'absolute', justifyContent: 'center',margin: '10', left: '40%', transform: 'translateX(-500%)',  transform: 'translateY(-10%)', width: '100%' }}>
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
</div>

      <DashboardNavbar />
      <SoftBox py={3}>
        
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Current SOC" }}
                count={data ? data.soc : "--"}
                percentage={{ color: "success", text: "+13213" }}
                icon={{ color: "info", component: "paid" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Current Voltage" }}
                count={data ? data.voltage : "--"}
                percentage={{ color: "success", text: "5685686" }}
                icon={{ color: "info", component: "public" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Current Temperataure" }}
                count={data ? data.temperature : "--"}
                // percentage={{ color: "error", text: "-2%" }}
                icon={{ color: "info", component: "emoji_events" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Current Capacity" }}
                count={data ? data.current_capacity : "--"}
                // percentage={{ color: "success", text: "+5%" }}
                icon={{
                  color: "info",
                  component: "shopping_cart",
                }}
              />
            </Grid>
          </Grid>
        </SoftBox>
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={7}>
              <BuildByDevelopers />
            </Grid>
            <Grid item xs={12} lg={5}>
              <WorkWithTheRockets />
            </Grid>
          </Grid>
        </SoftBox>
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={5}>
              <ReportsBarChart
                title="active users"
                description={
                  <>
                    (<strong>+23%</strong>) than last week
                  </>
                }
                chart={chart}
                items={items}
              />
            </Grid>
            <Grid item xs={12} lg={7}>
              <GradientLineChart
                title="Sales Overview"
                description={
                  <SoftBox display="flex" alignItems="center">
                    <SoftBox fontSize={size.lg} color="success" mb={0.3} mr={0.5} lineHeight={0}>
                      <Icon className="font-bold">arrow_upward</Icon>
                    </SoftBox>
                    <SoftTypography variant="button" color="text" fontWeight="medium">
                      4% more{" "}
                      <SoftTypography variant="button" color="text" fontWeight="regular">
                        in 2021
                      </SoftTypography>
                    </SoftTypography>
                  </SoftBox>
                }
                height="20.25rem"
                chart={gradientLineChartData}
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
