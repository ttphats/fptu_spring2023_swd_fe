import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// components
import StyledSnackbar from '../../../components/snackbar';
import loginApi from '../../../api/loginApi';
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginMessage, setIsLoginMessage] = useState({ message: '' });
  const [severity, setSeverity] = useState('');
  const [open, setOpen] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    console.log(email, password);
    setIsLoginMessage({});
    setOpen(false);
    const userData = {
      email,
      password,
    };
    const fetchLogin = async () => {
      try {
        const response = await loginApi.getLogin(userData);
        console.log(response.data.accessToken);
        localStorage.setItem('token-info', response.data.accessToken);
        setEmail('');
        setPassword('');
        navigate('/dashboard', { replace: true });
      } catch (error) {
        if (error.response.status === 401) {
          setIsLoginMessage({
            message: error?.response?.data?.message,
          });
          setSeverity('error');
          setOpen(true);
        }
        console.log('Fail to fetch Api: ', error.response);
      }
    };
    fetchLogin();
  };

  return (
    <>
      <StyledSnackbar message={isLoginMessage.message} open={open} severity={severity} />
      <Stack spacing={3}>
        <TextField name="email" label="Email" onChange={(e) => setEmail(e.target.value)} />

        <TextField
          name="password"
          label="Mật khẩu"
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
        <Link variant="subtitle2" underline="hover">
          Quên mật khẩu?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Đăng nhập
      </LoadingButton>
    </>
  );
}
