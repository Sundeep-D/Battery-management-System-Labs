// created by Sundeep Dayalan at 2024/04/30 08:28.
// Website:  www.sundeepdayalan.in
// Email: contact@sundeepdayalan.in


import React, { useState } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import '../../../../layouts/tables/table.css';

function MiniHealthCard({ bgColor, title, min, max, percentage, icon, shouldBlink }) {
    const [isBlinking, setIsBlinking] = useState(false);

    // Toggle blinking state based on the prop 'shouldBlink'
    React.useEffect(() => {
        setIsBlinking(shouldBlink);
    }, [shouldBlink]);

    return (
        <Card
            className={`mini-health-card ${isBlinking ? "blink" : ""}`} // Apply CSS class for blinking effect
            style={{
                width: "250px",
                height: "150px",
                boxShadow: "none",
                borderRadius: "10px",
                 border: isBlinking ? "3px solid #E6E6E6" : "0.5px solid #E6E6E6",
                // border: "0.5px solid #E6E6E6",
                marginBottom: "20px",
                borderColor: shouldBlink ? "red" : "#E6E6E6", // Change border color to red if shouldBlink is true
            }}
        >
            <SoftBox bgColor={bgColor} variant="gradient">
                <SoftBox p={2}>
                    <Grid container alignItems="center" >
                        <Grid item xs={12} lg={6}>
                            <SoftBox
                                variant="gradient"
                                bgColor={bgColor === "white" ? icon.color : "white"}
                                color={bgColor === "white" ? "white" : "dark"}
                                width="3rem"
                                height="3rem"
                                borderRadius="50%"
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                shadow="md"
                            >
                                <Icon fontSize="small" color="inherit">
                                    {icon.component}
                                </Icon>
                            </SoftBox>
                            <Grid  >
                                <SoftBox mt={4} ml={0.5} lineHeight={1}>
                                    <SoftTypography
                                        variant="button"
                                        color={bgColor === "white" ? "text" : "white"}
                                        opacity={bgColor === "white" ? 1 : 0.7}
                                        textTransform="capitalize"
                                        fontWeight={title.fontWeight}
                                    >
                                        Min
                                    </SoftTypography>
                                    <SoftTypography
                                        variant="h5"
                                        fontWeight="bold"
                                        color={bgColor === "white" ? "dark" : "white"}
                                    >
                                        {min}{" "}
                                        <SoftTypography variant="button" color={percentage.color} fontWeight="bold">
                                            {percentage.text}
                                        </SoftTypography>
                                    </SoftTypography>
                                </SoftBox>





                            </Grid>
                        </Grid>

                        <Grid item xs={12} lg={6} sx={{ position: "relative", ml: "auto" }}>
                            <SoftTypography
                                variant="button"
                                color={bgColor === "white" ? "text" : "white"}
                                opacity={bgColor === "white" ? 1 : 0.7}
                                textTransform="capitalize"
                                fontWeight={title.fontWeight}
                                fontSize={16}
                            >
                                Temperature
                                <p style={{ color:"#b8bfbf", fontSize: "12px" ,fontWeight: "normal"}}>past 1hr</p> 
                            </SoftTypography>
                            <Grid  >
                                <SoftBox mt={4.5} ml={0.5} lineHeight={1}>
                                    <SoftTypography
                                        variant="button"
                                        color={bgColor === "white" ? "text" : "white"}
                                        opacity={bgColor === "white" ? 1 : 0.7}
                                        textTransform="capitalize"
                                        fontWeight={title.fontWeight}
                                    >
                                        Max
                                    </SoftTypography>
                                    <SoftTypography
                                        variant="h5"
                                        fontWeight="bold"
                                        color={bgColor === "white" ? "dark" : "white"}
                                    >
                                        {max}{" "}
                                        <SoftTypography variant="button" color={percentage.color} fontWeight="bold">
                                            {percentage.text}
                                        </SoftTypography>
                                    </SoftTypography>
                                </SoftBox>





                            </Grid>




                        </Grid>




                    </Grid>
                </SoftBox>
            </SoftBox>
        </Card>

        
    );
}

// Setting default values for the props of MiniStatisticsCard
MiniHealthCard.defaultProps = {
    bgColor: "white",
    title: {
        fontWeight: "medium",
        text: "",
    },
    percentage: {
        color: "success",
        text: "",
    },
};

// Typechecking props for the MiniStatisticsCard
MiniHealthCard.propTypes = {
    bgColor: PropTypes.oneOf([
        "white",
        "primary",
        "secondary",
        "info",
        "success",
        "warning",
        "error",
        "dark",
    ]),
    title: PropTypes.PropTypes.shape({
        fontWeight: PropTypes.oneOf(["light", "regular", "medium", "bold"]),
        text: PropTypes.string,
    }),
    count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    percentage: PropTypes.shape({
        color: PropTypes.oneOf([
            "primary",
            "secondary",
            "info",
            "success",
            "warning",
            "error",
            "dark",
            "white",
        ]),
        text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    icon: PropTypes.shape({
        color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
        component: PropTypes.node.isRequired,
    }).isRequired,
};

export default MiniHealthCard;
