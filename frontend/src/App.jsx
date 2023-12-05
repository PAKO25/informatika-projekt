import { useState, useEffect } from "react";
import Login from "./Login";
import ChatRoom from "./ChatRoom";
import { Container } from '@mui/material'
import { setState, getState } from "./globalState";

var fisrtRun = 0

function App() {

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    //get new access token
    if (fisrtRun > 0) return;
    fisrtRun++
    fetch('/exchangeToken', { method: 'POST' }).then(response => {
      if (response.ok) return response.json();
      alert("An error occurred.");
    }).then(data => {
      console.log("refreshing token", data);
      if (data.error) {
        console.log(data.errorMsg)
        return;
      }
      setState("username", data.username)
      setState("token", data.token)
      setLoggedIn(true)
    });
    return () => {
      // Cleanup code here.
    };
  }, []);

  return (
    <Container maxWidth={false}
      sx={{ backgroundColor: 'background.paper', height: '100vh', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
      {loggedIn ? (
        <ChatRoom />
      ) : (
        <Login setLoggedIn={setLoggedIn} />
      )}
    </Container>
  );
}

export default App;