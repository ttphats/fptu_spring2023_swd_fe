import { useState, useRef } from 'react';
import { Stack, TextField, Button } from '@mui/material';

export default function OTP() {
    const boxes = [useRef(null), useRef(null), useRef(null), useRef(null)];
    const [values, setValues] = useState(['', '', '', '']);
    const handleChange = (event, index) => {
        const newValue = event.target.value;
        if (/^\d*$/.test(newValue) && newValue.length <= 1) {
            const newValues = [...values];
            newValues[index] = newValue;
            setValues(newValues);
            if (index < 3 && newValue.length) {
                boxes[index + 1].current.focus();
            }
        }
    };

    const handleSubmit = () => {
        const otp = values.join('');
        console.log('OTP:', otp);
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

            <Button variant="contained" size="large" onClick={handleSubmit}>
                Xác thực
            </Button>
        </Stack>
    );
}
