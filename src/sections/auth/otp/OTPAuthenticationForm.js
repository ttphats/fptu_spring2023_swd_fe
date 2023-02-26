import { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// @mui
import { Stack, TextField, Button } from '@mui/material';

// ----------------------------------------------------------------------

export default function OTPAuthenticationForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state.email;
    const [values, setValues] = useState(['', '', '', '']);
    const boxes = [useRef(null), useRef(null), useRef(null), useRef(null)];

    const handleChange = (e, index) => {
        const newValues = [...values];
        newValues[index] = e.target.value;
        setValues(newValues);

        if (e.target.value === '' && index !== 0) {
            boxes[index - 1].current.focus();
        } else if (index !== 3) {
            boxes[index + 1].current.focus();
        }
    };

    const handleClick = async () => {
        try {
            const otp = values.join('');
            const data = { otp, email };
            const response = await fetch('https://hqtbe.site/api/v1/users/register/otp/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            navigate('/login');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Stack sx={{ mt: 10, mx: 'auto', maxWidth: '480px' }} spacing={3}>
            <Stack direction="row" spacing={2}>
                <TextField
                    inputRef={boxes[0]}
                    value={values[0]}
                    onChange={(e) => handleChange(e, 0)}
                    variant="outlined"
                    size="medium"
                    inputProps={{ maxLength: 1 }}
                />
                <TextField
                    inputRef={boxes[1]}
                    value={values[1]}
                    onChange={(e) => handleChange(e, 1)}
                    variant="outlined"
                    size="medium"
                    inputProps={{ maxLength: 1 }}
                />
                <TextField
                    inputRef={boxes[2]}
                    value={values[2]}
                    onChange={(e) => handleChange(e, 2)}
                    variant="outlined"
                    size="medium"
                    inputProps={{ maxLength: 1 }}
                />
                <TextField
                    inputRef={boxes[3]}
                    value={values[3]}
                    onChange={(e) => handleChange(e, 3)}
                    variant="outlined"
                    size="medium"
                    inputProps={{ maxLength: 1 }}
                />
            </Stack>

            <Button variant="contained" size="large" onClick={handleClick}>
                Xác thực
            </Button>
        </Stack>
    );
}
