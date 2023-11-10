import { extendTheme } from "@chakra-ui/react";

const overrides = {
  styles: {
    global: {
      "*": {
        fontFamily: "Open Sans, sans-serif",
      },
    },
  },
};

const AppTheme = extendTheme(overrides);

export default AppTheme;
