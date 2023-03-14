import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: theme.spacing(3),
    },
    card: {
        maxWidth: 500,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    description: {
        margin: theme.spacing(2),
    },
}));

const VoucherDetailPage = () => {
    const classes = useStyles();
    const { id } = useParams();
    const [voucher, setVoucher] = useState(null);

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
        console.log(voucher);
    }, [id]);

    if (!voucher) {
        return <Typography variant="h6">Loading...</Typography>;
    }

    return (
        <Box className={classes.root}>
            <Card className={classes.card}>
                <CardMedia className={classes.media} image={voucher.imageUrl} title={voucher.nameVoucher} />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {voucher.nameVoucher}
                    </Typography>
                    <Typography variant="h6" color="textSecondary" component="p">
                        {voucher.priceVoucher} Xu
                    </Typography>
                    <Typography variant="body1" className={classes.description}>
                        {voucher.description}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        Mã Ưu đãi: {voucher.code}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        Địa chỉ: {voucher.location.name}, {voucher.location.addressNum}, {voucher.location.ward},{' '}
                        {voucher.location.district}, {voucher.location.province}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        Áp dụng từ: {new Date(voucher.start_date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        Đến ngày: {new Date(voucher.end_date).toLocaleDateString()}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" color="primary">
                        Đổi ưu đãi
                    </Button>
                </CardActions>
            </Card>
        </Box>
    );
};

export default VoucherDetailPage;
