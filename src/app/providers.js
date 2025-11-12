"use client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  fonts: {
    // Inter (commented out):
    // heading: "'Inter', sans-serif",
    // body: "'Inter', sans-serif",
    
    // Lexend (active):
    heading: "'Lexend', sans-serif",
    body: "'Lexend', sans-serif",
  },
  semanticTokens: {
    colors: {
      "bg.body": {
        default: "#0B1226",
      },
      "bg.surface": {
        default: "#111C44",
      },
      "bg.surfaceAlt": {
        default: "#1A2755",
      },
      "bg.sidebar": {
        default: "#0A132E",
      },
      "bg.overlay": {
        default: "rgba(10, 17, 38, 0.85)",
      },
      "border.subtle": {
        default: "rgba(255, 255, 255, 0.08)",
      },
      "border.muted": {
        default: "rgba(255, 255, 255, 0.12)",
      },
      "text.primary": {
        default: "#E4ECFF",
      },
      "text.muted": {
        default: "#97A3D7",
      },
      "text.soft": {
        default: "#7D88B6",
      },
      "accent.default": {
        default: "#5B7CFF",
      },
      "accent.emphasis": {
        default: "#738FFF",
      },
      "accent.subtle": {
        default: "rgba(91, 124, 255, 0.18)",
      },
      "success.default": {
        default: "#4ADE80",
      },
      "danger.default": {
        default: "#F87171",
      },
      "warning.default": {
        default: "#FACC15",
      },
      "info.default": {
        default: "#38BDF8",
      },
    },
  },
  styles: {
    global: {
      "html, body": {
        bg: "bg.body",
        color: "text.primary",
        minHeight: "100%",
      },
      body: {
        backgroundColor: "bg.body",
      },
      "*::selection": {
        background: "accent.subtle",
        color: "text.primary",
      },
    },
  },
  components: {
    Card: {
      baseStyle: {
        container: {
          bg: "bg.surfaceAlt",
          borderRadius: "xl",
          borderWidth: "1px",
          borderColor: "border.subtle",
          boxShadow: "none",
        },
      },
    },
    Button: {
      baseStyle: {
        borderRadius: "md",
        fontWeight: "600",
      },
      variants: {
        solid: {
          bg: "accent.default",
          color: "white",
          _hover: { bg: "accent.emphasis" },
        },
        outline: {
          borderColor: "accent.default",
          color: "accent.default",
          _hover: {
            bg: "accent.subtle",
          },
        },
        ghost: {
          color: "text.muted",
          _hover: {
            color: "accent.default",
            bg: "transparent",
          },
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          bg: "bg.surface",
          borderColor: "border.subtle",
          color: "text.primary",
          _placeholder: { color: "text.muted" },
          _hover: { borderColor: "accent.default" },
          _focus: {
            borderColor: "accent.default",
            boxShadow: "0 0 0 1px var(--chakra-colors-accent-default)",
          },
        },
      },
    },
    Select: {
      baseStyle: {
        field: {
          bg: "bg.surface",
          borderColor: "border.subtle",
          color: "text.primary",
          _focus: {
            borderColor: "accent.default",
            boxShadow: "0 0 0 1px var(--chakra-colors-accent-default)",
          },
        },
        icon: {
          color: "text.primary",
        },
      },
    },
    Textarea: {
      baseStyle: {
        bg: "bg.surface",
        borderColor: "border.subtle",
        color: "text.primary",
        _placeholder: { color: "text.muted" },
        _focus: {
          borderColor: "accent.default",
          boxShadow: "0 0 0 1px var(--chakra-colors-accent-default)",
        },
      },
    },
    NumberInput: {
      baseStyle: {
        field: {
          bg: "bg.surface",
          borderColor: "border.subtle",
          color: "text.primary",
          _placeholder: { color: "text.muted" },
          _focus: {
            borderColor: "accent.default",
            boxShadow: "0 0 0 1px var(--chakra-colors-accent-default)",
          },
        },
        stepperGroup: {
          borderLeft: "1px solid",
          borderColor: "border.subtle",
        },
        stepper: {
          color: "text.primary",
          borderColor: "border.subtle",
          _active: {
            color: "accent.default",
            bg: "accent.subtle",
          },
          _hover: {
            color: "accent.default",
            bg: "accent.subtle",
          },
        },
      },
    },
    Menu: {
      baseStyle: {
        list: {
          bg: "bg.surface",
          border: "1px solid",
          borderColor: "border.subtle",
          color: "text.primary",
        },
        item: {
          bg: "transparent",
          color: "text.primary",
          _focus: {
            bg: "accent.subtle",
            color: "text.primary",
          },
          _hover: {
            bg: "accent.subtle",
            color: "text.primary",
          },
        },
        divider: {
          borderColor: "border.subtle",
        },
      },
    },
    Modal: {
      baseStyle: {
        dialog: {
          bg: "bg.surfaceAlt",
        },
      },
    },
    Progress: {
      baseStyle: {
        track: {
          bg: "border.subtle",
        },
        filledTrack: {
          bg: "accent.default",
        },
      },
    },
    Table: {
      baseStyle: {
        tr: {
          borderColor: "border.subtle",
        },
        th: {
          color: "text.soft",
          borderColor: "border.subtle",
        },
        td: {
          borderColor: "border.subtle",
          color: "text.primary",
        },
      },
    },
  },
});

export function Providers({ children }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
