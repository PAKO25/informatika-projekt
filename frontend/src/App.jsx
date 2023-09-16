import { useState } from "react";
import Login from "./Login";
import ChatRoom from "./ChatRoom";
import { Container } from '@mui/material'

function App() {

  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <Container maxWidth={false}
      sx={{ backgroundColor: 'background.paper', height: '100vh', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
      {loggedIn ? (
        <ChatRoom />
      ) : (
        <Login />
      )}
    </Container>
  );
}

export default App;