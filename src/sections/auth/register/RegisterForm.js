import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function RegisterForm() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const handleClick = async () => {
        const data = {
            email,
            userName,
            phone,
            password,
            confirmPassword,
        };

        try {
            const response = await fetch('https://hqtbe.site/api/v1/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                const responseData = await response.json();
                console.log(responseData);
                navigate('/otpauthentication', { state: { email } }); // pass email value as a prop
            }
        } catch (error) {
            console.error(error);
            alert('Vui lòng nhập đúng các thông tin. Kiểm tra nếu địa chỉ email đã được sử dụng trước đó hoặc vui lòng quay lại sau.');
        }
    };

    const isUsernameValid = () => {
        return userName.trim() !== '';
    };

    const isPhoneValid = () => {
        // Use a regular expression to validate the phone number
        const phoneRegex = /^\d{10}$/;
        return phone.trim() !== '' && phoneRegex.test(phone.trim());
    };

    const isEmailValid = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return email.trim() !== '' && emailRegex.test(email.trim());
    };

    const isPasswordValid = () => {
        return password.trim() !== '' && password.length >= 6;
    };

    const isConfirmPasswordValid = () => {
        return confirmPassword.trim() !== '' && confirmPassword === password;
    };


    return (
        <>
            <Stack spacing={3}>
                <TextField name="fullname" label="Tên đầy đủ" />
                <TextField
                    name="username"
                    label="Tên người dùng*"
                    value={userName}
                    onChange={(event) => setUserName(event.target.value)}
                    error={!isUsernameValid() && userName !== ''}
                    helperText={!isUsernameValid() && userName !== '' ? 'Vui lòng nhập tên đăng nhập.' : ''} />
                <TextField
                    name="phone"
                    label="Số điện thoại*"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    error={!isPhoneValid() && phone !== ''}
                    helperText={!isPhoneValid() && phone !== '' ? 'Vui lòng nhập số điện thoại hợp lệ.' : ''} />
                <TextField
                    name="email"
                    label="Email*"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    error={!isEmailValid() && email !== ''}
                    helperText={!isEmailValid() && email !== '' ? 'Vui lòng nhập địa chỉ email hợp lệ.' : ''} />

                <TextField
                    name="password"
                    label="Mật khẩu*"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    error={!isPasswordValid() && password !== ''}
                    helperText={!isPasswordValid() && password !== '' ? 'Mật khẩu phải có ít nhất 6 ký tự.' : ''}
                />

                <TextField
                    name="confirmPassword"
                    label="Nhập lại mật khẩu*"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                    <Iconify icon={showConfirmPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    error={!isConfirmPasswordValid() && confirmPassword !== ''}
                    helperText={!isConfirmPasswordValid() && confirmPassword !== '' ? 'Mật khẩu xác nhận phải khớp với mật khẩu.' : ''}
                />
            </Stack>
            <br />
            <LoadingButton
                fullWidth size="large"
                type="submit"
                variant="contained"
                onClick={handleClick}
                disabled={!isUsernameValid() || !isEmailValid() || !isPasswordValid() || !isConfirmPasswordValid() || !isPhoneValid() }
            >
                Register
            </LoadingButton>
        </>
    );
}
