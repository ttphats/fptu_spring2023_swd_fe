import { useEffect, useState } from 'react';
import { Container, Typography, InputLabel, TextField } from '@material-ui/core';
import { useNavigate, useLocation } from 'react-router-dom';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { LoadingButton } from '@mui/lab';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Stack } from '@mui/system';
import { Button, Grid } from '@mui/material';
import { Icon } from '@iconify/react';
// date
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import 'firebase/auth';
import addressApi from '../../api/addressApi';
import UploadImage from './UploadImage';
import userProfileApi from '../../api/userProfileApi';
import tripApi from '../../api/tripApi';
import UserTripCard from '../trip/UserTripCard';
import vnpayApi from '../../api/vnpayApi';
import LoadingSpinner from '../../components/loading/LoadingSpinner';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#f7f7f7',
  },
  profile: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(4),
  },
  avatar: {
    width: theme.spacing(16),
    height: theme.spacing(16),
    marginBottom: theme.spacing(2),
  },
}));

const UserProfile = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.current);
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');
  const [birthday, setBirthday] = useState(dayjs(currentUser.birthday));
  const [phone, setPhone] = useState('');
  const [addressNum, setAddressNum] = useState(currentUser?.address?.split(', ')[0] || '');
  const [provinceDisplay, setProvinceDisplay] = useState([0]);
  const [province, setProvince] = useState(currentUser?.address?.split(', ')[3] || '');
  const [districtDisplay, setDistricDisplay] = useState([0]);
  const [district, setDistrict] = useState(currentUser?.address?.split(', ')[2] || '');
  const [wardDisplay, setWardDisplay] = useState([0]);
  const [ward, setWard] = useState(currentUser?.address?.split(', ')[1] || '');
  const [open, setOpen] = useState(false);
  const [trips, setTrips] = useState([]);
  const [vndAmount, setVndAmount] = useState();
  const [pointAmount, setPointAmount] = useState('');
  const [openPayment, setOpenPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [openPaymentStatus, setOpenPaymentStatus] = useState(false);

  const { vertical, horizontal } = {
    vertical: 'top',
    horizontal: 'right',
  };
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const statusPaymentAfterRedirect = searchParams?.get('vnp_ResponseCode');

  useEffect(() => {
    if (statusPaymentAfterRedirect === '00') {
      // Payment was successful
      // const orderNumber = searchParams.get('vnp_TxnRef');
      // const paymentAmount = searchParams.get('vnp_Amount');
      // const paymentDate = searchParams.get('vnp_PayDate');
      setPaymentStatus(true);
      setOpenPaymentStatus(true);
    }
  }, [statusPaymentAfterRedirect]);

  const handleVndAmountChange = (event) => {
    const vndToPointsRatio = 1000;
    const convertedVnd = Math.floor(event.target.value * vndToPointsRatio);
    setPointAmount(event.target.value);
    setVndAmount(convertedVnd);
  };

  const handlePayment = async () => {
    const response = await vnpayApi.depositMoneyToAccount(vndAmount, 'http://localhost:3263/user-profile');
    console.log(response);
    if (response) {
      window.location.href = response.data;
      setLoading(false);
    }
  };

  const [openDialog, setOpenDialog] = useState(false);

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await userProfileApi.updateUserProfile({
        fullname,
        birthday,
        addressNum,
        province,
        district,
        ward,
      });
      if (response) {
        setOpen(true);
        setOpenDialog(false);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchAddress = async () => {
    try {
      const provinces = await addressApi.getProvince();
      setProvinceDisplay(provinces.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleProvinceChange = async (event) => {
    console.log('province name: ', event.target.value);
    setWard('');
    setDistrict('');
    setDistricDisplay([]);
    setWardDisplay([]);

    provinceDisplay.forEach(async (province) => {
      if (event.target.value === province.name) {
        const response = await addressApi.getDistrict(province.code);
        console.log('district: ', response.data);
        setDistricDisplay(response.data);
      }
    });

    setProvince(event.target.value);
  };

  const handleDistrictChange = async (event) => {
    districtDisplay.forEach(async (district) => {
      if (event.target.value === district.name) {
        const response = await addressApi.getWard(district.code);
        setWardDisplay(response.data);
      }
    });
    setDistrict(event.target.value);
  };

  useEffect(() => {
    if (currentUser) {
      setFullname(currentUser.fullname || '');
      setEmail(currentUser.email || '');
      setProvince(currentUser?.address?.split(', ')[3] || '');
      setDistrict(currentUser?.address?.split(', ')[2] || '');
      setWard(currentUser?.address?.split(', ')[1] || '');
      setAddressNum(currentUser?.address?.split(', ')[0] || '');
      fetchAddress();
      fetchTripsUserJoined();
    }
  }, [currentUser]);

  async function fetchTripsUserJoined() {
    const response = await tripApi.getAllTripsUserJoined(currentUser.id);
    setTrips(response.data);
    setLoading(false);
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenPayment(false);
    setOpen(false);
  };

  const handleClosePaymentStatus = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setPaymentStatus(false);
    setOpenPaymentStatus(false);
    navigate('/user-profile');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <title> Cóc Phượt </title>
      </Helmet>
      <Snackbar open={open} anchorOrigin={{ vertical, horizontal }} autoHideDuration={2000} onClose={handleClose}>
        <Alert variant="outlined" onClose={handleClose} sx={{ width: '100%' }} severity="success">
          <strong>Cập nhật thông tin thành công</strong>
        </Alert>
      </Snackbar>
      <Container maxWidth="xl" className={classes.root}>
        <Paper className={classes.profile}>
          <UploadImage alt="Profile Picture" src={currentUser.avatarUrl} className={classes.avatar} />
          <Typography variant="h4" component="h1">
            {fullname}
          </Typography>
          <Typography variant="body1" component="p">
            {email}
          </Typography>
          <Stack direction="row">
            <LoadingButton
              sx={{
                color: '#FF7300',
                borderColor: '#FF7300',
                '&:hover': {
                  backgroundColor: '#F2C6A5',
                  boxShadow: 'none',
                },
              }}
              variant="outlined"
              onClick={handleClickOpenDialog}
            >
              Cập nhật thông tin cá nhân
            </LoadingButton>
            <Button
              onClick={() => setOpenPayment(true)}
              sx={{ '&:hover': { backgroundColor: 'transparent' }, color: '#3A98B9', fontSize: '16px' }}
            >
              Số dư: {Intl.NumberFormat('en-US').format(currentUser?.balance)} &nbsp;{' '}
              <Icon icon="material-symbols:add-circle-outline" />
            </Button>
          </Stack>
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Cập nhật thông tin cá nhân</DialogTitle>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Họ và tên"
                  value={fullname}
                  onChange={(event) => setFullname(event.target.value)}
                  margin="normal"
                  required
                  fullWidth
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker label="Ngày sinh" value={birthday} onChange={(newValue) => setBirthday(newValue)} />
                </LocalizationProvider>
                <TextField
                  label="Số điện thoai"
                  value={currentUser.phoneNum}
                  onChange={(event) => setPhone(event.target.value)}
                  margin="normal"
                  disabled
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel required id="province-label">
                    Tỉnh/ Thành phố
                  </InputLabel>
                  <Select labelId="province-label" displayEmpty value={province} onChange={handleProvinceChange}>
                    {provinceDisplay.map((province, index) => {
                      return (
                        <MenuItem key={province.code} value={province.name}>
                          <div style={{ paddingLeft: 10 }}>{province.name}</div>
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel required id="district-label">
                    Quận/ Huyện
                  </InputLabel>
                  <Select labelId="district-label" value={district} displayEmpty onChange={handleDistrictChange}>
                    <MenuItem value={district}>
                      <div style={{ paddingLeft: 10 }}>{district}</div>
                    </MenuItem>
                    {districtDisplay.length > 0 &&
                      districtDisplay.map((district, index) => {
                        return (
                          <MenuItem key={district.code} value={district.name}>
                            <div style={{ paddingLeft: 10 }}>{district.name}</div>
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel required id="ward-label">
                    Phường/ Xã
                  </InputLabel>
                  <Select labelId="ward-label" value={ward} onChange={(event) => setWard(event.target.value)}>
                    <MenuItem value={ward}>
                      <div style={{ paddingLeft: 10 }}>{ward}</div>
                    </MenuItem>
                    {wardDisplay.length > 0 &&
                      wardDisplay.map((ward, _index) => {
                        return (
                          <MenuItem key={ward.code} value={ward.name}>
                            <div style={{ paddingLeft: 10 }}>{ward.name}</div>
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
                <TextField
                  label="Số nhà"
                  defaultValue={addressNum}
                  value={addressNum}
                  onChange={(event) => setAddressNum(event.target.value)}
                  margin="normal"
                  required
                  fullWidth
                >
                  <div style={{ paddingLeft: 10 }}>{addressNum}</div>
                </TextField>
                <LoadingButton fullWidth size="small" type="submit" variant="contained">
                  Cập nhật thông tin
                </LoadingButton>
              </form>
            </DialogContent>
          </Dialog>
          <Stack sx={{ marginTop: 3 }}>
            <Box component="h3" sx={{ color: '#FF7300' }}>
              <Icon icon="icon-park-outline:round-trip" />
              &nbsp; Chuyến đi đã tham gia gần đây:
            </Box>
            <Grid container spacing={3}>
              {trips.map((post, index) => (
                <UserTripCard key={post.id} post={post} index={index} />
              ))}
            </Grid>
          </Stack>
        </Paper>
      </Container>
      <Dialog open={openPayment} onClose={handleClose}>
        <DialogTitle sx={{ color: '#FF7300' }}>
          <Typography variant="h4" gutterBottom>
            Nạp xu vào tài khoản{' '}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="h6" display="block" gutterBottom>
              Nhập số xu muốn nạp:
            </Typography>
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Số lượng xu"
            type="number"
            fullWidth
            value={pointAmount}
            onChange={handleVndAmountChange}
          />
          <DialogContentText>
            Số tiền cần thanh toán: {vndAmount ? <Box sx={{ color: '#FF7300' }}>{Intl.NumberFormat('en-US').format(vndAmount)} VNĐ{' '}</Box> : ''} 
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: '#FFBF9B' }}>
            Huỷ
          </Button>
          <Button onClick={handlePayment} disabled={!pointAmount} sx={{ color: '#FF884B' }}>
            Xác nhận thanh toán
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openPaymentStatus}
        onClose={handleClosePaymentStatus}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Box sx={{ marginLeft: '90px', marginRight: '90px' }}>
              <Icon icon="mdi:success-circle-outline" color="#63e963" width="168" height="168" />
            </Box>
            <Typography variant="h4" gutterBottom>
              Thanh toán thành công
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: ' center' }}>
          <LoadingButton
            sx={{
              backgroundColor: '#FF7300',
              '&:hover': {
                backgroundColor: '#F2C6A5',
                boxShadow: 'none',
              },
            }}
            variant="contained"
            onClick={handleClosePaymentStatus}
            autoFocus
          >
            Xác nhận
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserProfile;
