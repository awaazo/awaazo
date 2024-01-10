
import { useEffect } from 'react';

const ColorModeFix = () => {
  useEffect(() => {
    // Set the theme to 'dark' by default
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.style.setProperty('color-scheme', 'dark');
    
  }, []);

  useEffect(() => {
    localStorage.removeItem("chakra-ui-color-mode");
  }, []);

};



export default ColorModeFix;
