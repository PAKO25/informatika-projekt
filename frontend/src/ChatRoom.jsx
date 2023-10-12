import { Paper, Typography } from "@mui/material";
import { getState, setState } from "./globalState";
import { useEffect, useState } from "react";
import { socket } from './socket';

function ChatRoom() {

    const [userName, setUserName] = useState("")

    useEffect(() => {
        setUserName(getState('username'))
        socket.emit("Hello", "hello")
    })

    return (
        <Paper elevation={5} sx={{ width: '40vw', height: '60vh', textAlign: 'center', padding: '2vh', borderRadius: '50px' }}>
            <Typography variant='caption' sx={{ fontSize: '3vh' }}>{userName}</Typography>
            <hr style={{ border: '1px solid #ccc' }} />

        </Paper>
    )
}

export default ChatRoom;