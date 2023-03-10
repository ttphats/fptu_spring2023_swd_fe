import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Logo from '../components/logo';
import Iconify from '../components/iconify';
// sections
import { OTPForgotPasswordForm } from '../sections/auth/otp2';

// ----------------------------------------------------------------------


// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
}));

const StyledSection = styled('div')(({ theme }) => ({
    width: '100%',
    maxWidth: 480,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    boxShadow: theme.customShadows.card,
    backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    flexDirection: 'column',
    padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function OTPForgotPasswordPage() {
    const mdUp = useResponsive('up', 'md');

    return (
        <>
            <Container maxWidth="sm">
                <StyledContent>
                    <Typography variant="h4" gutterBottom>
                        Xác thực OTP
                    </Typography>

                    <Typography variant="body2" sx={{ mb: 5 }}>
                        Xác thực OTP để tăng tính bảo mật cho tài khoản
                    </Typography>

                    <Iconify icon="ic:outline-email" style={{ margin: '0 auto', display: "flex" }} width={60} height={60} />

                    <Typography variant="h5" gutterBottom>
                        Kiểm tra email của bạn
                    </Typography>
                    <br />

                    <OTPForgotPasswordForm />
                </StyledContent>
            </Container>

        </>
    );
}
