import { Paper, Typography, TextField, IconButton, InputAdornment } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { getState, setState } from "./globalState";
import { useEffect, useState } from "react";
import { socket } from './socket';

var num = 0;

function ChatRoom() {

    const [userName, setUserName] = useState("")
    const [data, setData] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [messageError, setMessageError] = useState(false)

    useEffect(() => {
        if (num > 0) return
        num++

        setUserName(getState('username'))

        socket.on('newMessages', (newData) => {
            //če dobiš en message je object, drugače array objectov
            if (typeof newData == 'object') {
                setData([...data, newData])
            } else {
                setData([...data, ...newData])
            }
        })
        socket.emit('getMessages', { range: [0, 20], token: getState('token') })
    })

    const sendMessage = () => {
        if (newMessage == "") {
            setMessageError(true)
            return;
        } else {
            setMessageError(false)
        }
        socket.emit('newMessage', { text: newMessage, token: getState('token') })
    }

    return (
        <Paper elevation={5} sx={{ width: '40vw', height: '60vh', textAlign: 'center', padding: '2vh', borderRadius: '50px' }}>
            <Typography variant='caption' sx={{ fontSize: '3vh' }}>{userName}</Typography>
            <hr style={{ border: '1px solid #ccc' }} />

            <Paper elevation={0} style={{ maxHeight: '40vh', height: '40vh', overflowY: 'auto', padding: '1vh', textAlign: 'left', borderBottom: '1px solid black', borderRadius: '0px' }}>
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