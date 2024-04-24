

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
function MiniHealthCard({ bgColor, title, count, percentage, icon }) {
    return (
        <Card style={{ 
            width: "150px", 
            height: "150px", 
            boxShadow: "none", 
            borderRadius: "10px", // Adding rounded corners
            border: "0.5px solid #E6E6E6",
            marginBottom: "20px" // Adding bottom padding
        }}>
            <SoftBox bgColor={bgColor} variant="gradient">
                <SoftBox p={2}>
                    <Grid container alignItems="center" >
                        <Grid item>
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
                        </Grid>
                        <Grid item xs={8}>
                            <SoftBox mt={4} ml={0.5} lineHeight={1}>
                                <SoftTypography
                                    variant="button"
                                    color={bgColor === "white" ? "text" : "white"}
                                    opacity={bgColor === "white" ? 1 : 0.7}
                                    textTransform="capitalize"
                                    fontWeight={title.fontWeight}
                                >
                                    {title.text}
                                </SoftTypography>
                                <SoftTypography
                                    variant="h5"
                                    fontWeight="bold"
                                    color={bgColor === "white" ? "dark" : "white"}
                                >
                                    {count}{" "}
                                    <SoftTypography variant="button" color={percentage.color} fontWeight="bold">
                                        {percentage.text}
                                    </SoftTypography>
                                </SoftTypography>
                            </SoftBox>
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