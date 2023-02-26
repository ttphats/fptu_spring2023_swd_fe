import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Logo from '../components/logo';
import Iconify from '../components/iconify';
// sections
import { ForgotPasswordForm } from '../sections/auth/forgotpassword';

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

export default function ForgotPassword() {
    const mdUp = useResponsive('up', 'md');

    return (
        <>
            <Helmet>
                <title> Cóc Phượt </title>
            </Helmet>

            <StyledRoot>
                <Logo
                    sx={{
                        position: 'fixed',
                        top: { xs: 16, sm: 24, md: 40 },
                        left: { xs: 16, sm: 24, md: 40 },
                    }}
                />

                {mdUp && (
                    <StyledSection>
                        <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
                            Lấy lại mật khẩu
                        </Typography>
                        <img src="/assets/illustrations/illustration_login.png" alt="login" />
                    </StyledSection>
                )}

                <Container maxWidth="sm">
                    <StyledContent>
                        <Typography variant="h4" gutterBottom>
                            Quên mật khẩu
                        </Typography>   

                        <Typography variant="body2" sx={{ mb: 5 }}>
                            Bạn sẽ nhận được mã xác thực thông qua Email bên dưới
                        </Typography>

                        <Iconify icon="ic:outline-email" style={{margin: '0 auto', display: "flex"}} width={60} height={60} />

                        <Typography variant="h5" gutterBottom>
                            Nhập email đã liên kết với tài khoản của bạn
                        </Typography>
                        <br/>

                        <ForgotPasswordForm />
                    </StyledContent>
                </Container>
            </StyledRoot>
        </>
    );
}
