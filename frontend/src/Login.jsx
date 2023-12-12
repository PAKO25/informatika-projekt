import { Paper, Typography, TextField, Button, FormControlLabel, Checkbox } from "@mui/material";
import { useState } from "react";
import ErrorIcon from '@mui/icons-material/Error';
import { getState, setState } from "./globalState";


const nameRegex = /^[a-zA-Z0-9_]+$/
const passwordRegex = /^(?!.*[&$@])(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,}$/

function Login({ setLoggedIn }) {

    const [passwordField, setPasswordField] = useState(false)
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [nameError, setNameError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [registerChecked, setRegisterChecked] = useState(false)

    const checkInputValidity = () => {

        let valid = true

        if (nameRegex.test(name)) {
            setNameError(false)
        } else {
            setNameError(true);
            valid = false;
        }
        if (passwordField) {
            if (passwordRegex.test(password)) {
                setPasswordError(false)
            } else {
                setPasswordError(true)
                valid = false;
            }
        }
        return valid;
    }


    const prijava = () => {
        const valid = checkInputValidity()
        if (!valid) return;

        if (passwordField) {
            //registracija ali prijava z imenom + geslom
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ime: name, geslo: password, register: registerChecked })
            };
            fetch('/zgeslom', options).then(response => {
                if (response.ok) return response.json();
                alert("An error occurred.");
            }).then(data => {
                if (data.error) {
                    alert(data.errorMsg)
                    return;
                }
                setState("username", name)
                setState("token", data.token)
                setLoggedIn(true)
            });
        } else {
            //začasna registracija samo z imenom
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ime: name })
            };
            fetch('/temp', options).then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    alert("An error occurred.");
                }
            }).then(data => {
                console.log(data);
                if (data.error) {
                    alert(data.errorMsg)
                    return;
                }
                setState("username", data.username)
                setState("token", data.token)
                setLoggedIn(true)
            });
        }
    }


    return (
        <Paper elevation={0} sx={{ width: '30vw', height: '50vh', textAlign: 'center', padding: '10vh', border: '0.5px solid #ccc', borderRadius: '10px' }}>
            <Typography variant='caption' sx={{ fontSize: '4vh' }}>Prijava</Typography><br />
            <Typography variant='caption' sx={{ fontSize: '2vh' }}>Izberite ime ali se registrirajte</Typography>

            <TextField variant="outlined" label="Ime" sx={{ marginTop: '5vh', width: '80%' }} FormHelperTextProps={{ component: 'div' }}
                value={name} onChange={(e) => { setName(e.target.value) }} error={nameError}
                helperText={nameError ? (
                    <div style={{ alignItems: 'center', display: 'flex', left: '-1vw', position: 'relative' }}>
                        <ErrorIcon /><p style={{ marginLeft: '0.5vw' }}>Samo črke, številke in podčrtaj.</p>
                    </div>
                ) : ("")} />

            {passwordField ? (
                <>
                    <TextField variant="outlined" label="Geslo" sx={{ marginTop: '2vh', width: '80%' }} FormHelperTextProps={{ component: 'div' }}
                        value={password} onChange={(e) => { setPassword(e.target.value) }} error={passwordError}
                        helperText={passwordError ? (
                            <div style={{ alignItems: 'center', display: 'flex', left: '-1vw', position: 'relative' }}>
                                <ErrorIcon /><p style={{ marginLeft: '0.5vw' }}>Vsaj 8 znakov s po eno črko, številko in posebenim znakom, razen $, @ in &.</p>
                            </div>
                        ) : ("")} />
                    <br />
                    <FormControlLabel control={<Checkbox checked={registerChecked} onChange={() => { setRegisterChecked(!registerChecked) }} />}
                        label="Register" sx={{ float: 'left', marginLeft: '10%' }} />
                </>
            ) : (
                <>
                    <br /><br />
                    <Typography variant='caption' sx={{ fontSize: '1.7vh', color: '#666666' }}>Če želite rezervirano ime se registrirajte z geslom.</Typography>
                </>
            )}


            <div style={{ marginTop: passwordField ? (nameError && passwordError ? '8vh' : '10vh') : '15vh' }}>
                {passwordField ? (
                    <Button variant="text" onClick={() => { setPasswordField(false) }} sx={{ float: 'left', marginLeft: '10%', marginTop: '2vh' }}>Nazaj</Button>
                ) : (
                    <Button variant="text" onClick={() => { setPasswordField(true) }} sx={{ float: 'left', marginLeft: '10%', marginTop: '2vh' }}>Geslo</Button>
                )}
                <Button variant="contained" sx={{ float: 'right', marginRight: '10%', marginTop: '2vh' }} onClick={prijava}>Prijava</Button>
            </div>
        </Paper>
    )
}

export default Login;