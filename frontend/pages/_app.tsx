import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { Box, ChakraProvider, Flex } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react'
import { PlayerProvider } from '../utilities/PlayerContext'
import PlayerBar from '../components/shared/PlayerBar'
import Sidebar from '../components/shared/Sidebar'
import Navbar from '../components/shared/Navbar'
import AppTheme from '../styles/AppTheme'
import ColorModeFix from '../styles/ColorModeFix'
import { PanelProvider } from '../utilities/PanelContext'
import Panel from '../components/shared/Panel'
import { DefaultSession } from 'next-auth';
import AuthHelper from '../helpers/AuthHelper';
import i18n from '../utilities/i18n';


interface SessionExt extends DefaultSession {
  token: {
    email: string;
    sub: string;
    id_token: string;
    name: string;
    picture: string;
  };
}




function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUserSet, setIsUserSet] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (router.locale !== i18n.language) {
      i18n.changeLanguage(router.locale);
    }
  }, [router.locale]);

  useEffect(() => {
    // Custom User logged in
    if (!isUserSet) {
      AuthHelper.authMeRequest().then((response) => {
        if (response.status === 200) {
          setIsLoggedIn(true);
          setIsUserSet(true);
          setShowPlayerBar(true);
          setShowNavbar(true);
          setShowSidebar(true);
        } else {
          setShowPlayerBar(false);
          setShowNavbar(false);
          setShowSidebar(false);
        }
      });
    }

    // Google User logged in
    if (session !== null && session !== undefined && !isLoggedIn) {
      // Get the session info
      const currentSession = session as SessionExt;
      const googleSSORequest = {
        email: currentSession.token.email,
        sub: currentSession.token.sub,
        token: currentSession.token.id_token,
        avatar: currentSession.token.picture,
        name: currentSession.token.name,
      };

      AuthHelper.loginGoogleSSO(googleSSORequest).then((response) => {
        if (response.status === 200) {
          if (!isUserSet) {
            AuthHelper.authMeRequest().then((response) => {
              if (response.status === 200) {
                setIsLoggedIn(true);
                setIsUserSet(true);
              }
            });
          }
        }
      });
    }
  }, [session, isLoggedIn]);
  ColorModeFix()
 
  const [showPlayerBar, setShowPlayerBar] = useState(true)
  const [showNavbar, setShowNavbar] = useState(true)
  const [showSidebar, setShowSidebar] = useState(true)
  const [showPanel, setShowPanel] = useState(true)

  useEffect(() => {
    const path = router.pathname
    const hidePlayerBarOnPaths = ['/auth/', '/profile/ProfileSetup', '/CreatorHub/', '/Admin', '/Greeting']
    const hideNavbarOnPaths = ['/auth/', '/Admin', '/Greeting']
    const hideSidebarOnPaths = ['/auth/', '/profile/ProfileSetup', '/Admin', '/Greeting']
    const hidePanelOnPaths = ['/auth/', '/profile/ProfileSetup', '/CreatorHub/', '/Admin']

    const shouldHidePlayerBar = hidePlayerBarOnPaths.some((p) => path.startsWith(p))
    const shouldHideNavbar = hideNavbarOnPaths.some((p) => path.startsWith(p))
    const shouldHideSidebar = hideSidebarOnPaths.some((p) => path.startsWith(p))
    const shouldHidePanel = hidePanelOnPaths.some((p) => path.startsWith(p))

    setShowPlayerBar(!shouldHidePlayerBar)
    setShowNavbar(!shouldHideNavbar)
    setShowSidebar(!shouldHideSidebar)
    setShowPanel(!shouldHidePanel)
  }, [router.pathname])

  return (
    <ChakraProvider theme={AppTheme}>
      <meta name="referrer" content="no-referrer" />
      <Box position="fixed" top="0" left="0" width="100%" height="100vh" backgroundSize="cover" zIndex="-1" minHeight="100vh" bgColor={'az.blackish'} />
      <SessionProvider session={session}>
        <PlayerProvider>
          <PanelProvider>
            <Flex>
              {showSidebar && <Sidebar />}
              <Box zIndex={'1'}>{showPanel && <Panel />}</Box>
              <Box flex="1">
                {showNavbar && <Navbar />}
                <Component {...pageProps} />
                <Box h="100px" zIndex={'2'} />
                {showPlayerBar && <PlayerBar />}
              </Box>
            </Flex>
          </PanelProvider>
        </PlayerProvider>
      </SessionProvider>
    </ChakraProvider>
  )

}

export default MyApp
