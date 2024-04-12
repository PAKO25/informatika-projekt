import { Paper, Typography, TextField, IconButton, InputAdornment, CircularProgress } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import LogoutIcon from '@mui/icons-material/Logout';
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
    const [showLoadingCircle, setShowLoadingCircle] = useState(true)
    const [preventAutoScrollDownOnce, setPreventAutoScrollDownOnce] = useState(false)
    const [lastPacketSize, setLastPacketSize] = useState(0)
    const paperRef = useRef();

    useEffect(() => {
        if (num > 0) return
        num++

        setUserName(getState('username'))

        socket.on('newMessages', (newData) => {
            if (newData.some(obj => obj.id == 1)) setNoMoreMessages(true)
            setData(prevData => [...prevData, ...newData].sort((a, b) => a.id - b.id));
            setLastPacketSize(newData.length)
        })
        socket.on('invalidToken', () => {
            setState("token", "")
            setLoggedIn(false)
        })
        socket.emit('getMessages', { range: [0, 20], token: getState('token') })
        setLastMessageGot(20)
    }, [])

    useEffect(() => {
        if (preventAutoScrollDownOnce) {
            //scrolla nazaj dol, ker ko se doda data ko scrollas gor te avtomatsko vrze gor
            setPreventAutoScrollDownOnce(false)
            const elementHeight = paperRef.current.scrollHeight / data.length;
            const scrollAmount = lastPacketSize * elementHeight - 23;
            paperRef.current.scrollTo({ top: paperRef.current.scrollTop + scrollAmount, behavior: 'instant' });
        } else {
            //scrolla dol ko je new message
            paperRef.current.scrollTo({ top: paperRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [data])

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
        if (noMoreMessages) return;
        const range = [lastMessageGot + 1, lastMessageGot + 20]
        socket.emit('getMessages', { range: range, token: getState('token') })
        setLastMessageGot(prevLastMessageGot => prevLastMessageGot + 20)
        setPreventAutoScrollDownOnce(true)
    }

    const handleScroll = () => {
        const isAtTop = paperRef.current.scrollTop === 0;
        if (isAtTop) getNewMessages();
        if (noMoreMessages) setShowLoadingCircle(false)
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    }

    return (
        <Paper elevation={5} sx={{ width: '70vw', height: '70vh', textAlign: 'center', padding: '2vh', borderRadius: '20px' }}>
            <Typography variant='caption' sx={{ fontSize: '3vh' }}>{userName}</Typography>
            <IconButton sx={{float: 'right'}} onClick={() => {
                setState("token", "")
                setLoggedIn(false)
                fetch('/logout', { method: 'POST' }).then(response => {
                    location.reload()
                    console.log("Loggedout: ",response.ok)
                })
            }}><LogoutIcon /></IconButton>
            <hr style={{ border: '1px solid #ccc' }} />

            <Paper elevation={0} ref={paperRef} onScroll={handleScroll} style={{ maxHeight: '50vh', height: '50vh', overflowY: 'auto', padding: '1vh', textAlign: 'left', borderBottom: '1px solid black', borderRadius: '0px' }}>
                {showLoadingCircle ? <div style={{ textAlign: 'center' }}>
                    <CircularProgress size={20} />
                </div> : null}
                {data.map((message, index) => (
                    <div key={index}>
                        <Typography sx={{ display: "inline" }}>[{message.username}]: </Typography>
                        <Typography variant="body1" sx={{ display: "inline" }}>
                            {message.text}
                        </Typography>
                    </div>
                ))}
            </Paper>
            <div style={{height: '12vh', width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center'}}>
                <TextField variant="outlined" label="Sporočilo" sx={{ width: '80%' }} onKeyDown={handleKeyDown}
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
            </div>
        </Paper>
    )
}

export default ChatRoom;