import { extendTheme, ThemeConfig } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'

// this a fix for the default color mode issue
const config: ThemeConfig = {
  useSystemColorMode: false,
  initialColorMode: 'dark',
}

const overrides = {
  colors: {
    brand: {
      100: '#564AF7',
      200: '#8077f9',
      300: '#a29bfb',
    },
    az: {
      blue: '#94AFFF',
      green: '#89DBBD',
      red: '#FA6257',
      lightRed:'#FA7F57',
      yellow: '#FFD569',
      offWhite: '#D1D9DE',
      blackish: '#18191B',
      greyish: '#818990',
      darkGrey: '#393939',
      darkerGrey: '#2D2D2D',
      darkestGrey: '#252525',
      darkGradient: 'linear-gradient(180deg, #2A2A2A 5.06%, #1D1D1D 100%)',
      lightGradient: 'linear-gradient(200deg, #FFF 22.27%, #D1D9DE 111.44%)',
      sunset: 'linear-gradient(180deg, #FF6B60 21%, #FFD569 100%)',
      greenToYellow: 'linear-gradient(180deg, #89DBBD 0%, #FFD569 99.17%)',
    },
  },
  gradients: {
    darkGradient: 'linear-gradient(180deg, #2A2A2A 5.06%, #1D1D1D 100%)',
    lightGradient: 'linear-gradient(200deg, #FFF 22.27%, #D1D9DE 111.44%)',
    sunset: 'linear-gradient(180deg, #FF6B60 21%, #FFD569 100%)',
    greenToYellow: 'linear-gradient(180deg, #89DBBD 0%, #FFD569 99.17%)',
  },

  components: {
    Button: {
      baseStyle: {},
      variants: {
        gradient: {
          borderRadius: 'full',
          fontSize: 'md',
          color: 'white',
          padding: '20px',
          paddingLeft: '2rem',
          paddingRight: '2rem',
          background: 'linear-gradient(45deg, #FA6257, #FFD569)',
          backgroundSize: '300% 300%',
          animation: 'Gradient 10s infinite linear',
          minWidth: '200px',
        },
        play: {
          borderRadius: 'full',
          fontSize: 'md',
          color: 'white',
          padding: '20px',
          paddingLeft: '2rem',
          paddingRight: '2rem',
          backgroundSize: '300% 300%',
          _hover: {
            background: '#FA7F57',
          },
        },
        minimal: {
          bg: 'transparent',
          _hover: {
            bg: 'transparent',
            color: '#818990',
          },
        },
        minimalColor: {
          bg: 'transparent',
          _hover: {
            bg: 'transparent',
            color: 'az.red',
          },
        },
     
        large: {
          display: 'flex',
          height: '50px',
          padding: '15px 35px 15px 36px',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '15px',
          background: 'var(--Just-White, #FFF)',
          fontWeight: '700',
          fontSize: '15px',
          color:'#1D1D1D',
          _hover: {
            background: 'az.red', 
            color: 'white', 
          },
        },
        normal: {
          display: 'flex',
          height: '37px',
          padding: '12px 20px 12px 20px',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '15px',
          background: 'var(--Just-White, #FFF)',
          fontWeight: '700',
          fontSize: '15px',
          color:'az.red',
          _hover: {
            background: 'az.lightRed', 
            color: 'white', 
          },
        },
        mini: {
          display: 'flex',
          height: '28px',
          padding: '10px 20px 10px 20px',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '10px',
          background: 'az.darkGrey',
          fontWeight: '700',
          fontSize: '12px',
          color:'white',
          _hover: {
            background: 'az.lightRed', 
            color: 'white', 
          },
        },
        
      },
    },

    Tooltip: {
      baseStyle: {
        bgColor: 'transparent',
        shadow: 'none',
        color: 'az.white',
        fontSize: 'xs',
      },
    },

    Input: {
      sizes: {
        md: {
          field: {
            h: '40px',
            px: 4,
            fontSize: '14px',
          },
        },
      },
      variants: {
        outline: {
          field: {
            borderWidth: '1px',
            borderRadius: '15px',
            color: '#ffffff',
            bg: '#393939',
            borderColor: 'transparent',
            _hover: {
              borderColor: '#FA6257', 
            },
            _focus: {
              borderColor: '#89DBBD',
              color: '#ffffff',
              boxShadow: '0 0 0 1px #89DBBD',
            },
            _placeholder: {
              color: '#818990',
            },
          },
        },
      },
      defaultProps: {
        size: 'md',
        variant: 'outline',
      },
    },

    Textarea: {
      variants: {
        outline: {
        maxHeight: '200px',
        borderRadius: '15px', 
        padding: '16px', 
        backgroundColor: 'az.darkestGrey', 
        color: 'white', 
        border: '2px solid', 
        borderColor: 'transparent', 
        _hover: {
          borderColor: '#FA6257', 
        },
        _focus: {
          borderColor: '#89DBBD',
          color: '#ffffff',
          boxShadow: '0 0 0 1px #89DBBD',
        },
        _placeholder: {
          color: '#818990',
        },
      },
    },
      defaultProps: {
        variant: 'outline',
      },
    },


    Tabs: {
      variants: {
        withIconOnSelected: (props) => ({
          tab: {
            fontSize: '16px',
            position: 'relative',
            transition: 'all 0.2s ease-in-out',
            color: '#818990',
            fontWeight: 'medium',
            _selected: {
              color: 'white',
              fontWeight: 'bold',
            },
            _before: {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              height: '1em',
              width: '1em',
              transition: 'opacity 0.3s ease-in-out',
              opacity: 0,
            },
            ':focus': {
              boxShadow: 'none',
            },
          },
        }),
      },
    },

    Modal: {
      baseStyle: (props) => ({
        dialog: {
          borderRadius: '3xl',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          padding: '2em',
          mx: 'auto',
          my: 'auto',
          alignItems: 'center',
        },
        header: {
          fontWeight: 'light',
          fontSize: '1.5em',
        },
      }),
      variants: {},
    },

  

    Menu: {
      baseStyle: {
        list: {
          borderRadius: '15px',
          backgroundColor: '#252525',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
        item: {
          fontSize:"14px",
          backgroundColor: 'transparent',
          _focus: {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
          _hover: {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },

    Slider: {
      baseStyle: {
        track: {},
        thumb: {},
        filledTrack: {
          bg: 'az.red',
        },
      },
    },

    Container: {
      variants: {
        innerBox: {
          p: 1,
          bg: 'rgba(0, 0, 0, 0.1)',
          rounded: 'xl',
          width: '100%',
          outline: '2px solid rgba(255, 255, 255, 0.05)',
        },
        authBox: {
          p: 6,
          backdropFilter: 'blur(10px)',
          borderRadius: '15px',
          maxW: '400px',
          w: 'full',
          textAlign: 'center',
        },
      },
    },
  },

  styles: {
    global: {
      '@keyframes Gradient': {
        '0%': { backgroundPosition: '100% 0%' },
        '50%': { backgroundPosition: '0% 100%' },
        '100%': { backgroundPosition: '100% 0%' },
      },

      '@keyframes pop': {
        from: { transform: 'scale(0)', opacity: '0.5' },
        '50%': { transform: 'scale(1.3)' },
        to: { transform: 'scale(1)', opacity: '1' },
      },

      '@font-face': [
        {
          fontFamily: "'Neue Montreal'",
          fontStyle: 'normal',
          fontWeight: 400,
          src: `url('/fonts/NeueMontreal-Regular.otf') format('opentype')`,
        },
        {
          fontFamily: "'Neue Montreal'",
          fontStyle: 'normal',
          fontWeight: 500,
          src: `url('/fonts/NeueMontreal-Medium.otf') format('opentype')`,
        },
        {
          fontFamily: "'Neue Montreal'",
          fontStyle: 'normal',
          fontWeight: 700,
          src: `url('/fonts/NeueMontreal-Bold.otf') format('opentype')`,
        },
      ],

      '*': {
        fontFamily: "'Neue Montreal', sans-serif",
      },
      '@keyframes appear': {
        '0%': { opacity: 0 },
        '100%': { opacity: 1 },
      },
      '.text-appear': {
        animation: 'appear 0.5s ease forwards',
        marginRight: '4px',
      },
      '.transcript-text': {
        whiteSpace: 'pre-wrap',
      },
    },
  },

  fontSizes: {
    xl: '24px',
    lg: '20px',
    md: '16px',
    sm: '14px',
    xs: '12px',
  },

  fontWeights: {
    normal: 400,
    medium: 500,
    bold: 700,
  },

  config,
}

const AppTheme = extendTheme(overrides)

export default AppTheme
