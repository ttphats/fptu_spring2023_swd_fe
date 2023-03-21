import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  Paper,
  Container,
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';


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
  button: {
    background: 'linear-gradient(45deg, #6D17CB 30%, #2876F9 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
  },
}));

const primary = "#2196f3";
const secondary = "#f44336";

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === 'light'
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

function myFunction() {
  const copyText = document.getElementById("copyText");

  copyText.select();
  copyText.setSelectionRange(0, 99999);

  document.execCommand("copy");

  alert(`Đã sao chép Mã ưu đãi: ${copyText.value}`);
}

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
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('access-token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios.delete(`https://hqtbe.site/api/v1/vouchers/voucherId/${id}`, config);
    navigate('/dashboard/voucher');
  };

  if (!voucher) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <Container className={classes.root} sx={{ margin: "0 auto" }}>
      <div role="presentation" >
        <Breadcrumbs aria-label="breadcrumb">
          <StyledBreadcrumb
            component="a"
            href="/home"
            label="Trang chủ"
            icon={<HomeIcon fontSize="small" />}
          />
          <StyledBreadcrumb component="a" href="/dashboard/voucher" label="Các ưu đãi" />
          <StyledBreadcrumb component="a" href="#" label="Chi tiết ưu đãi" />
        </Breadcrumbs>
      </div>

      <Typography variant="h4" component="h1" className={classes.section}>
        {voucher.name}
      </Typography>
      <Typography variant="body2" className={classes.section}>
        <span className={classes.value}>{voucher.quantity} Ưu đãi đang chờ bạn </span>
        <LocationOnIcon fontSize="small" sx={{ display: 'inline-flex', marginBottom: '-2px', marginLeft: '16px', marginRight: '-8px' }} />
        <span className={classes.value}>{voucher.location.address} </span>
      </Typography>
      <Paper elevation={12} >
        <img src={voucher.imageUrl} alt={voucher.name} className={classes.image} />
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={6} md={8} spacing={2}>
          <Box sx={{ p: 2, borderRadius: '24px', backgroundColor: '#fcf6f2', marginTop: '36px', display: 'flex', flexDirection: 'column' }}>
            <Grid container spacing={2}>
              <Grid item xs={6} md={2} sx={{ margin: '0 auto', display: 'flex', verticalAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
                <ThumbUpIcon fontSize="large" sx={{ color: "#ffb74d" }} />
              </Grid>
              <Grid item xs={6} md={10}>
                <Typography variant="body1" className={classes.section}>
                  {voucher.description}
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Grid container alignItems="center" className={classes.section} spacing={2} >
            <Grid item xs={6} md={4}>
              <TextField
                id="copyText"
                value={voucher.code}
                type="text"
                variant="outlined"
                sx={{ marginRight: "16px" }}
              />
            </Grid>
            <Grid item xs={6} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
              <Button variant="outlined" onClick={myFunction} >
                Sao chép Mã Ưu đãi
              </Button>
            </Grid>
          </Grid>

          <Typography variant="body2" className={classes.section} >
            <span className={classes.value}> *Chọn "Tạo chuyến đi ngay" để bắt đầu lên kế hoạch cho chuyến đi của bạn và sử dụng Ưu đãi. Ưu đãi khả dụng từ ngày &nbsp;
              <span className={classes.label} >
                {voucher?.startDate
                  ? dayjs.tz(voucher.startDate, 'Asia/Ho_Chi_Minh').format('DD/MM/YYYY')
                  : 'Không xác định'}
              </span>
              &nbsp; đến hết ngày &nbsp;
              <span className={classes.label} >
                {voucher?.endDate ? dayjs.tz(voucher.endDate, 'Asia/Ho_Chi_Minh').format('DD/MM/YYYY') : 'Không xác định'}
              </span>
              .
            </span>
          </Typography>

          
        </Grid>
        <Grid item xs={6} md={4}>
          <Box sx={{ p: 2, border: '1px solid #C5C5C5', borderRadius: '24px', marginTop: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', textAlign: 'center' }}>
            <Typography variant="h4" color="textPrimary" className={classes.section}>
              {voucher.price} Xu
            </Typography>
            {currentUser.role === 'ADMIN' ? (
              <Button variant="contained" color="secondary" onClick={handleDeleteClick}>
                Xoá ưu đãi
              </Button>
            ) : null}
            {currentUser.role === 'USER' ? (
              <Link to={`/trip`} state={voucher} style={{ textDecoration: 'none' }} variant="body2">
                <Button variant="contained" className={classes.button}>
                  Tạo chuyến đi ngay
                </Button>
              </Link>
            ) : null}
          </Box>
        </Grid>
      </Grid>

      <Dialog open={showConfirmationDialog} onClose={() => setShowConfirmationDialog(false)}>
        <DialogTitle>Xoá ưu đãi</DialogTitle>
        <DialogContent>
          <DialogContentText>Vui lòng xác nhận: Bạn muốn xoá ưu đãi?</DialogContentText>
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
    </Container>
  );
};

export default VoucherDetailPage;
