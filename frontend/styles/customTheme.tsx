import { extendTheme, StyleFunctionProps } from "@chakra-ui/react";

const overrides = extendTheme({
  styles: {
    global: (props: StyleFunctionProps) => ({
      "*": {
        fontFamily: '"Avenir Next"',
      },
    }),
  },
});

const AppTheme = extendTheme(overrides);

export default AppTheme;
