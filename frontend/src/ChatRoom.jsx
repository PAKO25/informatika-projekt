import { Paper, Typography, TextField, IconButton, InputAdornment } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { getState, setState } from "./globalState";
import { useEffect, useState, useRef } from "react";
import { socket } from './socket';

var num = 0;

function ChatRoom({ setLoggedIn }) {

    const [userName, setUserName] = useState("")
    const [data, setData] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [messageError, setMessageError] = useState(false)
    const [noMoreMessages, setNoMoreMessages] = useState(false)
    const [lastMessageGot, setLastMessageGot] = useState(0)
    const paperRef = useRef();

    useEffect(() => {
        if (num > 0) return
        num++

        setUserName(getState('username'))

        socket.on('newMessages', (newData) => {
            if (newData.some(obj => obj.id == 1)) setNoMoreMessages(true)
            setData(prevData => [...prevData, ...newData].sort((a, b) => a.id - b.id));
        })
        socket.on('invalidToken', () => {
            setState("token", "")
            setLoggedIn(false)
        })
        socket.emit('getMessages', { range: [0, 20], token: getState('token') })
        setLastMessageGot(20)
    }, [])

    const sendMessage = () => {
        if (newMessage == "") {
            setMessageError(true)
            return;
        } else {
            setMessageError(false)
        }
        socket.emit('sendMessage', { text: newMessage, token: getState('token') })
    }

    const getNewMessages = () => {
        //preveri da ne dobi istega messiga 2x
        const range = [lastMessageGot, lastMessageGot + 20]
        if (noMoreMessages) return;
        socket.emit('getMessages', { range: range, token: getState('token') })
        setLastMessageGot(prevLastMessageGot => prevLastMessageGot + 20)
    }

    const handleScroll = () => {
        console.log("handlescroll")
        const { current } = paperRef;
        if (!current) return;
        const isAtTop = current.scrollTop === 0;
        if (isAtTop) getNewMessages();
    };

    return (
        <Paper elevation={5} sx={{ width: '40vw', height: '60vh', textAlign: 'center', padding: '2vh', borderRadius: '50px' }}>
            <Typography variant='caption' sx={{ fontSize: '3vh' }}>{userName}</Typography>
            <hr style={{ border: '1px solid #ccc' }} />

            <Paper elevation={0} ref={paperRef} onScroll={handleScroll} style={{ maxHeight: '40vh', height: '40vh', overflowY: 'auto', padding: '1vh', textAlign: 'left', borderBottom: '1px solid black', borderRadius: '0px' }}>
                {data.map((message, index) => (
                    <Typography key={index} variant="body1">
                        {message.text}
                    </Typography>
                ))}
            </Paper>

            <TextField variant="outlined" label="Sporočilo" sx={{ marginTop: '3vh', width: '80%' }}
                value={newMessage} onChange={(e) => { setNewMessage(e.target.value) }} error={messageError}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton edge="end" type="submit" onClick={sendMessage}>
                                <SendIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }} />
        </Paper>
    )
}

export default ChatRoom;