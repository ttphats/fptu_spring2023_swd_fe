import { useEffect, useState } from 'react';
import { Container, Typography, InputLabel, TextField } from '@material-ui/core';
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
  const { vertical, horizontal } = {
    vertical: 'top',
    horizontal: 'right',
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
  }

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
            <LoadingButton variant="outlined" onClick={handleClickOpenDialog}>
              Cập nhật thông tin cá nhân
            </LoadingButton>
            <Button sx={{ '&:hover': { backgroundColor: 'transparent' }, color: '#5D9C59' }}>
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
            <Box component="h3" sx={{ color: 'primary.main' }}>
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
    </>
  );
};

export default UserProfile;
