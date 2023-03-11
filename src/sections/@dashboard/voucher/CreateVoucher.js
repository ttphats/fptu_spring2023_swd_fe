import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Helmet } from 'react-helmet-async';
import { Container, Typography, InputLabel } from '@material-ui/core';
import { Button, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { LoadingButton } from '@mui/lab';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f7f7f7',
    },
    formCreate: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    voucher: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing(4),
        padding: theme.spacing(2),
    },
    title: {
        background: '-webkit-linear-gradient(45deg, #6D17CB 30%, #2876F9 90%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 700,
        color: '#2876F9',
        border: 0,
        borderRadius: 3,
        margin: 40,
    },
    infoLocation: {
        marginLeft: 5,
    },
    button: {
        background: 'linear-gradient(45deg, #6D17CB 30%, #2876F9 90%)',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        height: 48,
        padding: '0 30px',
    },
    customInput: {
        borderRadius: 15,
        border: 1,
        padding: 4,
        background: 'white',
        height: 22,
    },
}));

const initialValues = {
    nameVoucher: '',
    priceVoucher: '',
    quantity: '',
    description: '',
    code: '',
    startDate: '',
    endDate: '',
    location: {
        name: '',
        addressNum: '',
        ward: '',
        district: '',
        province: '',
        type: '',
        description: '',
        phoneNum: ''
    }
};

const validationSchema = Yup.object().shape({
    nameVoucher: Yup.string().required('Required'),
    priceVoucher: Yup.number().required('Required'),
    quantity: Yup.number().required('Required'),
    description: Yup.string().required('Required'),
    code: Yup.string().required('Required'),
    startDate: Yup.date().required('Required'),
    endDate: Yup.date().required('Required'),
    location: Yup.object().shape({
        name: Yup.string().required('Required'),
        addressNum: Yup.string().required('Required'),
        ward: Yup.string().required('Required'),
        district: Yup.string().required('Required'),
        province: Yup.string().required('Required'),
        type: Yup.string().required('Required'),
        description: Yup.string().required('Required'),
        phoneNum: Yup.string().required('Required')
    })
});

const CreateVoucher = () => {
    const navigate = useNavigate();
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState(null);
    const { vertical, horizontal } = {
        vertical: 'top',
        horizontal: 'center',
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: values => {
            fetch('https://hqtbe.site/api/v1/vouchers/createVoucher', {
                method: 'POST',
                body: JSON.stringify(values),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Tạo ưu đãi mới thành công!', data);
                    navigate('/dashboard/voucher');
                })
                .catch(error => {
                    console.error('Đã có lỗi xảy ra:', error);
                });
        }
    });

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <>
            <Helmet>
                <title> Cóc Phượt </title>
            </Helmet>
            <Snackbar open={open} anchorOrigin={{ vertical, horizontal }} autoHideDuration={2000} onClose={handleClose}>
                <Alert variant="outlined" onClose={handleClose} sx={{ width: '100%' }} severity="success">
                    <strong>Tạo ưu đãi thành công</strong>
                </Alert>
            </Snackbar>
            {msg && (
                <Snackbar open={open} anchorOrigin={{ vertical, horizontal }} autoHideDuration={2000} onClose={handleClose}>
                    <Alert variant="outlined" onClose={handleClose} sx={{ width: '100%' }} severity="error">
                        <strong>{msg}</strong>
                    </Alert>
                </Snackbar>
            )}
            <Container maxWidth="xl" className={classes.root}>
                <Paper className={classes.voucher}>
                    <Typography variant="h3" component="h1" className={classes.title}>
                        Tạo ưu đãi mới
                    </Typography>
                    <Box sx={{ minWidth: 800 }}>
                        <form onSubmit={formik.handleSubmit}>
                            {/* Name of voucher */}
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Name of voucher"
                                name="nameVoucher"
                                value={formik.values.nameVoucher}
                                onChange={formik.handleChange}
                                error={formik.touched.nameVoucher && Boolean(formik.errors.nameVoucher)}
                                helperText={formik.touched.nameVoucher && formik.errors.nameVoucher}
                            />
                            {/* Price of voucher */}
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Price of voucher"
                                name="priceVoucher"
                                value={formik.values.priceVoucher}
                                onChange={formik.handleChange}
                                error={formik.touched.priceVoucher && Boolean(formik.errors.priceVoucher)}
                                helperText={formik.touched.priceVoucher && formik.errors.priceVoucher}
                            />
                            {/* Quantity */}
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Quantity"
                                name="quantity"
                                value={formik.values.quantity}
                                onChange={formik.handleChange}
                                error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                                helperText={formik.touched.quantity && formik.errors.quantity}
                            />
                            {/* Description */}
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Description"
                                name="description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                error={formik.touched.description && Boolean(formik.errors.description)}
                                helperText={formik.touched.description && formik.errors.description}
                            />
                            {/* Code */}
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Code"
                                name="code"
                                value={formik.values.code}
                                onChange={formik.handleChange}
                                error={formik.touched.code && Boolean(formik.errors.code)}
                                helperText={formik.touched.code && formik.errors.code}
                            />
                            {/* Start date */}
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Start date"
                                name="startDate"
                                type="date"
                                value={formik.values.startDate}
                                onChange={formik.handleChange}
                                error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                                helperText={formik.touched.startDate && formik.errors.startDate}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            {/* End date */}
                            <TextField
                                fullWidth
                                margin="normal"
                                label="End date"
                                name="endDate"
                                type="date"
                                value={formik.values.endDate}
                                onChange={formik.handleChange}
                                error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                                helperText={formik.touched.endDate && formik.errors.endDate}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            {/* Location */}

                        </form>
                    </Box>
                    <LoadingButton
                        className={classes.button}
                        sx={{ marginTop: '30px' }}
                        fullWidth
                        size="small"
                        type="submit"
                        variant="contained"
                        onClick={formik.handleSubmit}
                    >
                        Tạo ưu đãi
                    </LoadingButton>
                </Paper>
            </Container>
        </>
    )
}

export default CreateVoucher;
