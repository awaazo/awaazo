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
    az: {
      blue: "#94AFFF",
      green: "#89DBBD",
      red: "#FF6A5F",
      yellow: "#FFD569",
      offWhite: "#D1D9DE",
      blackish: "#1D1D1D",
      greyish: "#818990",
      darkGrey: "#393939",
      darkerGrey: "#2D2D2D",
    },
  },
  gradients: {
    darkGradient: "linear-gradient(180deg, #2A2A2A 5.06%, #1D1D1D 100%)",
    lightGradient: "linear-gradient(200deg, #FFF 22.27%, #D1D9DE 111.44%)",
    sunset: "linear-gradient(180deg, #FF6B60 21%, #FFD569 100%)",
    greenToYellow: "linear-gradient(180deg, #89DBBD 0%, #FFD569 99.17%)",
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
      variants: {
       
      },
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
        innerBox: {
          p: 1,
          bg: "rgba(0, 0, 0, 0.1)",
          rounded: "xl",
          width: "100%",
          outline: "2px solid rgba(255, 255, 255, 0.05)"
        },
        authBox:{
          p:6, 
          bg:"rgba(255, 255, 255, 0.04)" ,
          outline:"2px solid rgba(255, 255, 255, 0.06)",
          backdropFilter:"blur(10px)" ,
          boxShadow:"0 4px 6px rgba(0, 0, 0, 0.2)" ,
          borderRadius:"3xl" ,
          maxW:"400px" ,
          w:"full" ,
          textAlign:"center",
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
      "@font-face": [
        {
          fontFamily: "'Neue Montreal'",
          fontStyle: 'normal',
          fontWeight: 400,
          src: `url('/fonts/NeueMontreal-Regular.otf') format('opentype')`
        },
        {
          fontFamily: "'Neue Montreal'",
          fontStyle: 'normal',
          fontWeight: 500,
          src: `url('/fonts/NeueMontreal-Medium.otf') format('opentype')`
        },
        {
          fontFamily: "'Neue Montreal'",
          fontStyle: 'normal',
          fontWeight: 700,
          src: `url('/fonts/NeueMontreal-Bold.otf') format('opentype')`
        },
       
      ],

      "*": {
        fontFamily: "'Neue Montreal', sans-serif",
      },

    },
  },
  config,
};

const AppTheme = extendTheme(overrides);

export default AppTheme;
