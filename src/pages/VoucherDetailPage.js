import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import axios from 'axios';
import {
    Box,
    Button,
    Grid,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(3),
    },
    image: {
        width: '100%',
        height: 400,
        objectFit: 'cover',
    },
    section: {
        margin: theme.spacing(2, 0),
    },
    label: {
        fontWeight: 600,
    },
    value: {
        marginLeft: theme.spacing(1),
    },
}));

const VoucherDetailPage = () => {
    const classes = useStyles();
    const { id } = useParams();
    const [voucher, setVoucher] = useState(null);
    const navigate = useNavigate();
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const currentUser = useSelector((state) => state.user.current);


    useEffect(() => {
        const fetchVoucher = async () => {
            const token = localStorage.getItem('access-token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(`https://hqtbe.site/api/v1/vouchers/voucherId/${id}`, config);
            setVoucher(response.data.data);
        };
        fetchVoucher();
    }, [id]);

    const handleDeleteClick = () => {
        setShowConfirmationDialog(true);
    }

    const handleDelete = async () => {
        const token = localStorage.getItem('access-token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        await axios.delete(`https://hqtbe.site/api/v1/vouchers/voucherId/${id}`, config);
        navigate('/dashboard/voucher');
    }


    if (!voucher) {
        return <Typography variant="h6">Loading...</Typography>;
    }

    return (
        <Box className={classes.root}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <img src={voucher.imageUrl} alt={voucher.name} className={classes.image} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" component="h1" className={classes.section}>
                        {voucher.name}
                    </Typography>
                    <Typography variant="h6" color="textSecondary" className={classes.section}>
                        {voucher.price} Xu
                    </Typography>
                    <Typography variant="body1" className={classes.section}>
                        {voucher.description}
                    </Typography>
                    <Typography variant="body2" className={classes.section}>
                        <span className={classes.label}>Mã Ưu đãi:</span>
                        <span className={classes.value}>{voucher.code}</span>
                    </Typography>
                    <Typography variant="body2" className={classes.section}>
                        <span className={classes.label}>Địa chỉ:</span>
                        <span className={classes.value}>
                            {voucher.location.address}
                        </span>
                    </Typography>
                    <Typography variant="body2" className={classes.section}>
                        <span className={classes.label}>Áp dụng từ:</span>
                        <span className={classes.value}>
                            {voucher?.startDate ? dayjs.tz(voucher.startDate, 'Asia/Ho_Chi_Minh').format('DD/MM/YYYY') : 'Không xác định'}
                        </span>
                    </Typography>
                    <Typography variant="body2" className={classes.section}>
                        <span className={classes.label}>Đến ngày:</span>
                        <span className={classes.value}>
                            {voucher?.endDate ? dayjs.tz(voucher.endDate, 'Asia/Ho_Chi_Minh').format('DD/MM/YYYY') : 'Không xác định'}
                        </span>
                    </Typography>
                    {currentUser.role === 'ADMIN' ?
                        <Button variant="contained" color="secondary" onClick={handleDeleteClick}>
                            Xoá ưu đãi
                        </Button>
                        : null
                    }
                    <Dialog
                        open={showConfirmationDialog}
                        onClose={() => setShowConfirmationDialog(false)}
                    >
                        <DialogTitle>Xoá ưu đãi</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Vui lòng xác nhận: Bạn muốn xoá ưu đãi?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setShowConfirmationDialog(false)} color="primary">
                                Huỷ
                            </Button>
                            <Button onClick={handleDelete} color="primary">
                                Xác nhận
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Grid>
            </Grid>
        </Box>
    )
}

export default VoucherDetailPage;
