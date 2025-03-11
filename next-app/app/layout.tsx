import type { Metadata } from "next";
import "@styles/globals.css";
import '@mantine/core/styles.css';
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import GameContainer from "@components/GameContainer";
import { theme } from "@styles/theme";

export const metadata: Metadata = {
  title: "Untitled Metro Game",
  description: "By Michael and Friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>

      <body style={{ backgroundColor: theme.white }}>
        <MantineProvider theme={theme}>
          <GameContainer> {children} </GameContainer>
        </MantineProvider>
      </body>
    </html>
  );
}


