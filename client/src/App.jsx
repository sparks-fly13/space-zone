import { CSSReset, ColorModeProvider, theme, ThemeProvider } from "@chakra-ui/react"
import Signup from "./Pages/Signup"
import Login from "./Pages/Login"
import UserHome from "./Pages/UserHome"
import UserPage from "./Pages/UserPage"
import { Route } from "react-router-dom"
import ThemeToggler from "./Components/ThemeToggler"
import axios from "axios"
import UserProvider from "./Context/UserContext"

axios.defaults.baseURL = 'http://127.0.0.1:3000';
axios.defaults.withCredentials = true;

function App() {
  return(
    <UserProvider>
    <ThemeProvider theme={theme}>
      <ColorModeProvider>
        <CSSReset />
          <ThemeToggler />
            <Route path="/signup" component={Signup} exact/>
            <Route path="/login" component={Login} exact />
            <Route path="/" component={UserHome} exact />
            <Route path="/profile" component={UserPage} exact />
      </ColorModeProvider>
    </ThemeProvider>
    </UserProvider>
  );
}

export default App
