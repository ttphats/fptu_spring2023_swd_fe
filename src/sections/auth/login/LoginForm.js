import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import StyledSnackbar from '../../../components/snackbar';
import Iconify from '../../../components/iconify';
import { userLogin } from './authSlice';
import { getMe } from '../../../redux/Slice/userSlice';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginMessage, setIsLoginMessage] = useState({ message: '' });
  const [severity, setSeverity] = useState('');
  const [open, setOpen] = useState(false);
  const currentUser = useSelector((state) => state.user.current);


  const handleLogin = (e) => {
    e.preventDefault();
    console.log(email, password);
    setIsLoginMessage({});
    setOpen(false);

    const fetchLogin = async () => {
      try {
        await dispatch(userLogin({ email, password }));
        const user = await unwrapResult(await dispatch(getMe()));
        console.log('current user: ', user.role)
        if(user.role === "ADMIN"){
          navigate('/dashboard');
        }
        if(user.role === "USER"){
          navigate('/home');
        }
        setEmail('');
        setPassword('');
      } catch (error) {
        console.log(error);
        setIsLoginMessage({
          message: "Đã xảy ra lỗi vui lòng kiểm tra lại thông tin đăng nhập",
        });
        setSeverity('error');
        setOpen(true);
      }
    };
    fetchLogin();
  };

  return (
    <>
      <StyledSnackbar message={isLoginMessage.message} open={open} severity={severity} />
      <form>
        <Stack spacing={3}>
          <TextField name="email" label="Email" required onChange={(e) => setEmail(e.target.value)} />

          <TextField
            name="password"
            label="Mật khẩu"
            required
            type={showPassword ? 'text' : 'password'}
            onChange={(e) => setPassword(e.target.value)}
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

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <Stack direction="row" alignItems="center">
            <Checkbox name="remember" label="Remember me" />
            <Typography>Ghi nhớ đăng nhập</Typography>
          </Stack>
          <Link href="/forgotpassword" variant="subtitle2" underline="hover">
            Quên mật khẩu?
          </Link>
        </Stack>

        <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleLogin}>
          Đăng nhập
        </LoadingButton>
      </form>
    </>
  );
}
