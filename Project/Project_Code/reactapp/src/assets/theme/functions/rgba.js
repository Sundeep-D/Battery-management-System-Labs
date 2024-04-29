// created by Sundeep Dayalan at 2024/04/25 21:42.
// Website:  www.sundeepdayalan.in
// Email: contact@sundeepdayalan.in

/**
  The rgba() function helps you to create a rgba color code, it uses the hexToRgb() function
  to convert the hex code into rgb for using it inside the rgba color format.
 */


import hexToRgb from "assets/theme/functions/hexToRgb";

function rgba(color, opacity) {
  return `rgba(${hexToRgb(color)}, ${opacity})`;
}

export default rgba;
