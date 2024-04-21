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
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Images
import wavesWhite from "assets/images/shapes/waves-white.svg";
import batteryFull from "assets/images/illustrations/battery.png";
import batteryCharge from "assets/images/illustrations/batteryCharge.png";

  
import React, { useState, useEffect } from 'react';

function BuildByDevelopers({ soc, isCharging }) {




const [socLoaded, setSocLoaded] = useState(false);
// Update the SOC loaded state when the SOC value is received
useEffect(() => {
  if (soc !== null) {
    setSocLoaded(true);
  }
}, [soc]);


  return (
    <Card>
      <SoftBox p={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <SoftBox display="flex" flexDirection="column" height="100%">
              <SoftBox pt={1} mb={0.5}>
                <SoftTypography variant="body2" color="text" fontWeight="medium">
                  Sky BMS
                </SoftTypography>
              </SoftBox>
              <SoftTypography variant="h5" fontWeight="bold" gutterBottom>
                Battery Status
              </SoftTypography>
              <SoftBox mb={6}>
                <SoftTypography variant="body2" color="text">
                  From colors, cards, typography to complex elements, you will find the full
                  documentation.
                </SoftTypography>
              </SoftBox>
              <SoftTypography
                component="a"
                sx={{
                  mt: "auto",
                  mr: "auto",
                  display: "inline-flex",
                  alignItems: "center",
                  fontSize: "0.8rem" ,
                  color: "#b8bfbf"
                }}
              >
                Last updated: Few seconds ago
              </SoftTypography>
            </SoftBox>
          </Grid>
          <Grid item xs={12} lg={5} sx={{ position: "relative", ml: "auto" }}>
            <SoftBox
              height="100%"
              display="grid"
              justifyContent="center"
              alignItems="center"
              borderRadius="lg"
              variant="gradient"
              position="relative" // Ensure proper positioning of nested elements
            >
              {/* Image of waves */}
              <img
                src={wavesWhite}
                alt="waves"
                style={{ position: "absolute", left: 0, width: "100%", height: "100%" }}
              />

              {/* Image of rocket */}
              {/* Image of rocket */}
              <img
                src={isCharging ? batteryCharge : batteryFull}
                alt="rocket"
                style={{ width: "100%", paddingTop: "3%" }}
              />



              {/* Text to display centered on top */}
              {!isCharging && socLoaded && (
                <SoftTypography
                variant="h2"
                  style={{
                    position: "absolute",
                    zIndex: 3,
                    textAlign: "center",
                    width: "100%",
                    paddingTop: "10%",
                    paddingLeft: "2%",
                    animation: "zoomIn 0.5s",
                  }}
                >
                  {soc !== null ? `${Math.floor(soc)}%` : ""}
                </SoftTypography>
              )}

            </SoftBox>

          </Grid>
        </Grid>
      </SoftBox>
    </Card>
  );
}

export default BuildByDevelopers;
