// created by Sundeep Dayalan at 2024/04/25 21:42.
// Website:  www.sundeepdayalan.in
// Email: contact@sundeepdayalan.in


import typography from "assets/theme/base/typography";
import colors from "assets/theme/base/colors";


// import pxToRem from "assets/theme/functions/pxToRem";

const { size } = typography;
const { text } = colors;

const dialogContentText = {
  styleOverrides: {
    root: {
      fontSize: size.md,
      color: text.main,
    },
  },
};

export default dialogContentText;
