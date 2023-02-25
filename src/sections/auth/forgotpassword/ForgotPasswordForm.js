import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // send a request to the server to reset the user's password
        navigate('/otpauthentication', { replace: true });
    };

    return (
        <>
            <Stack spacing={3}>
                <TextField
                    name="email"
                    label="Email address"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />
            </Stack>
            <br/>
            <LoadingButton href="/otpauthentication" fullWidth size="large" type="submit" variant="contained" onClick={handleSubmit}>
                Xác nhận
            </LoadingButton>
        </>
    );
}
