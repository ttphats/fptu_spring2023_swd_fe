import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Stack, TextField, InputAdornment, IconButton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../../components/iconify';

export default function CreateNewPasswordForm() {
    const location = useLocation();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const email = location.state.email;
            const otp = location.state.otp;

            const response = await fetch('https://hqtbe.site/api/v1/users/password/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp, password, confirmPassword }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            navigate('/login', { replace: true });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const isPasswordValid = () => {
        return password.trim() !== '';
    };

    const isConfirmPasswordValid = () => {
        return confirmPassword === password;
    };

    return (
        <>
            <Stack spacing={3}>
                <TextField
                    name="password"
                    label="Mật khẩu"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    error={!isPasswordValid()}
                    helperText={!isPasswordValid() ? 'Vui lòng nhập mật khẩu mới.' : ''}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    name="confirmPassword"
                    label="Xác nhận mật khẩu"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    error={!isConfirmPasswordValid()}
                    helperText={!isConfirmPasswordValid() ? 'Mật khẩu không trùng khớp. Vui lòng nhập lại.' : ''}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Stack>
            <br />
            <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={loading}
                onClick={handleSubmit}
                disabled={!isPasswordValid() || !isConfirmPasswordValid()}
            >
                Xác nhận
            </LoadingButton>
        </>
    );
}
