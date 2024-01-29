import { extendTheme, ThemeConfig } from "@chakra-ui/react";

// this a fix for the default color mode issue
const config: ThemeConfig = {
  useSystemColorMode: false,
  initialColorMode: "dark",
};

const overrides = {
  colors: {
    brand: {
      100: "#564AF7",
      200: "#8077f9",
      300: "#a29bfb",
    },
  },
  components: {
    Button: {
      baseStyle: {},
      variants: {
        gradient: {
          borderRadius: "full",
          fontSize: "md",
          color: "white",
          padding: "20px",
          paddingLeft: "2rem",
          paddingRight: "2rem",
          background: "linear-gradient(45deg, #007BFF, #8077f9, #5E43BA, #7C26A5, #564AF7)",
          backgroundSize: "300% 300%",
          animation: "Gradient 10s infinite linear",
          minWidth: "200px",
        },
      },
    },

    Modal: {
      baseStyle: (props) => ({
        dialog: {
          borderRadius: "3xl",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          padding: "2em",
          mx: "auto",
          my: "auto",
          alignItems: "center",
        },
        header: {
          fontWeight: "light",
          fontSize: "1.5em",
        }
      }),
      
    },
    Textarea: {
      baseStyle: {
        maxHeight: "200px",
      },
    },
    Menu: {
      baseStyle: {
        list: {
          borderRadius: "2xl",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
        item: {
          backgroundColor: "transparent",
          _focus: {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
          _hover: {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
        },
      },
    },
    Slider:  {
      baseStyle: {
        track: {
        },
        thumb: {
        },
        filledTrack: {
          bg: "brand.100", 
        },
      },
    },
    Container : { 
      variants: {
        innerbox: {
          p: 1,
          bg: "rgba(0, 0, 0, 0.1)",
          rounded: "xl",
          width: "100%",
          outline: "2px solid rgba(255, 255, 255, 0.05)"
        }
      }
    }
  },
  styles: {
    global: {
      "@keyframes Gradient": {
        "0%": { backgroundPosition: "100% 0%" },
        "50%": { backgroundPosition: "0% 100%" },
        "100%": { backgroundPosition: "100% 0%" },
      },
      "*": {
        fontFamily: "Inter, sans-serif",
      },
    },
  },
  config,
};

const AppTheme = extendTheme(overrides);

export default AppTheme;
