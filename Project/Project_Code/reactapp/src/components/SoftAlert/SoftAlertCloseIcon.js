// created by Sundeep Dayalan at 2024/04/25 21:42.
// Website:  www.sundeepdayalan.in
// Email: contact@sundeepdayalan.in

// @mui material components
import { styled } from "@mui/material/styles";

export default styled("span")(({ theme }) => {
  const { palette, typography, functions, transitions } = theme;

  const { white } = palette;
  const { size, fontWeightMedium } = typography;
  const { pxToRem } = functions;

  return {
    color: white.main,
    fontSize: size.xl,
    padding: `${pxToRem(9)} ${pxToRem(6)} ${pxToRem(8)}`,
    marginLeft: pxToRem(40),
    fontWeight: fontWeightMedium,
    opacity: 0.5,
    cursor: "pointer",
    lineHeight: 0,
    transition: transitions.create("opacity", {
      easing: transitions.easing.easeInOut,
      duration: transitions.duration.shorter,
    }),

    "&:hover": {
      opacity: 1,
    },
  };
});
