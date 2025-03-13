import {
	colorsTuple,
	createTheme,
	DEFAULT_THEME,
	mergeMantineTheme,
  } from '@mantine/core';

const themeOverride = createTheme({
  primaryShade: 7,
  primaryColor: "actionColor",
  white: "#F6F2E6",
  colors: {
	paper: colorsTuple("#F6F2E6"),
    secondaryColor: [
      "#ffedf5",
      "#f5dbe5",
      "#e4b6c8",
      "#d58eaa",
      "#c76d90",
      "#bf577f",
      "#bc4c77",
      "#a63d66",
      "#95345a",
      "#84294e"
    ],
    actionColor:  [
      "#ffedeb",
      "#fadbd8",
      "#eab6b2",
      "#db8f89",
      "#cf6e65",
      "#c8594f",
      "#c64d43",
      "#af3e35",
      "#9d352d",
      "#8a2a24"
    ]
  }

});

export const theme = mergeMantineTheme(DEFAULT_THEME, themeOverride);
