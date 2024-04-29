// created by Sundeep Dayalan at 2024/04/25 21:42.
// Website:  www.sundeepdayalan.in
// Email: contact@sundeepdayalan.in

/* eslint-disable react/prop-types */
/**
  This file is used for controlling the dark and light state of the TimelineList and TimelineItem.
*/

import { createContext, useContext } from "react";

// The Timeline main context
const Timeline = createContext();

// Timeline context provider
function TimelineProvider({ children, value }) {
  return <Timeline.Provider value={value}>{children}</Timeline.Provider>;
}

// Timeline custom hook for using context
function useTimeline() {
  return useContext(Timeline);
}

export { TimelineProvider, useTimeline };
/* eslint-enable react/prop-types */
