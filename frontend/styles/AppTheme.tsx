import { extendTheme } from "@chakra-ui/react";

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
        },
        // Other variants can be added here
      },
    },
    Modal: {
      baseStyle: (props) => ({
        dialog: {
          borderRadius: "3xl",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        },
       
      }),
    },
    Textarea: {
      baseStyle: {
        maxHeight: "200px", 
      },
    },
  
  },
  styles: {
    global: {
      "@keyframes Gradient": {
        "0%": { backgroundPosition: "100% 0%" },
        "50%": { backgroundPosition: "0% 100%" },
        "100%": { backgroundPosition: "100% 0%" },
      },
      "html, body": {
        fontFamily: "Roboto Condensed, sans-serif",
      },
      "*": {
        fontFamily: "Roboto Condensed, sans-serif",
      },
    },
  },
};

const AppTheme = extendTheme(overrides);

export default AppTheme;
