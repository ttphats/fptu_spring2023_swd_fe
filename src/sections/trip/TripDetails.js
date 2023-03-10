import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Avatar, Typography, CardContent, ButtonBase } from '@mui/material';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import { Icon } from '@iconify/react';
// utils
import { fDate } from '../../utils/formatTime';
import { fShortenNumber } from '../../utils/formatNumber';
//
import SvgColor from '../../components/svg-color';
import Iconify from '../../components/iconify';
import tripApi from '../../api/tripApi';

// ----------------------------------------------------------------------

const StyledButton = styled(LoadingButton)(({ theme }) => ({
  background: 'linear-gradient(45deg, #6D17CB 30%, #2876F9 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
}));

const StyledDisabledButton = styled(LoadingButton)(({ theme }) => ({
  background: '#D8D9CF',
  border: 0,
  borderRadius: 3,
  color: 'white',
  height: 48,
  padding: '0 30px',
}));

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

// ----------------------------------------------------------------------

export default function TripDetails({ trip }) {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.current);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [disable, setDisable] = useState(false);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    async function handleDisabled() {
      try {
        const getUser = await tripApi.getTripMembers(trip?.id);
        setMembers(getUser.data);
        getUser.data.map((mem, _index) => {
          if (mem.user.id === currentUser.id) {
            setDisable(true);
          }
          return _index;
        });
      } catch (error) {
        console.log(error);
      }
    }
    handleDisabled();
  }, [trip]);

  const handleJoinTrip = async () => {
    setDisable(true);
    setOpenSnackBar(true);
    try {
      const response = await tripApi.joinTripById(trip?.id);
      setSuccessMsg(response.message);
    } catch (error) {
      setErrorMsg(error.response.data.message);
      console.log(error.response.data.message);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackBar(false);
  };

  const handleBack = () => {
    navigate('/');
  };
  return (
    <>
      {successMsg && (
        <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleClose}>
          <Alert variant="filled" onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            {successMsg}
          </Alert>
        </Snackbar>
      )}
      {errorMsg && (
        <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleClose}>
          <Alert variant="filled" severity="error">
            {errorMsg}
          </Alert>
        </Snackbar>
      )}
      {trip ? (
        <Paper
          sx={{
            p: 2,
            margin: 'auto',
            maxWidth: 850,
            flexGrow: 1,
            backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : '#fff'),
          }}
        >
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <Typography gutterBottom variant="h3" component="div">
              {!trip?.name ? '???? bao l??u r???i ch??ng ta ch??a c?? d???p ??i ch??i c??ng nhau' : trip.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ng??y ????ng b??i: {trip?.postDate ? dayjs.tz(trip.postDate, 'Asia/Ho_Chi_Minh').format('DD/MM/YYYY') : 'Kh??ng x??c ?????nh'}
              </Typography>
            </Grid>
            <Grid justifyContent="center" item>
              <Img
                alt="complex"
                src={
                  trip?.imageUrls[0]
                    ? trip.imageUrls[0]
                    : 'https://daihoc.fpt.edu.vn/wp-content/uploads/2021/12/fpt-hinh-1-thumbnail-1618982244543115484692-768x432.png'
                }
                sx={{
                  maxWidth: 800,
                  maxHeight: 400,
                }}
              />
            </Grid>
            <Grid item xs={12} sx={{ marginTop: 5 }} sm container>
              <Grid item xs container direction="column" spacing={4}>
                <Grid item xs>
                  <Box mt={2}>
                    <Typography variant="h5" sx={{ color: '#2F58CD' }} gutterBottom>
                      <Icon icon="iconoir:maps-go-straight" vFlip />
                      Th??ng tin ?????a ??i???m xu???t ph??t
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      T??n ?????a ??i???m xu???t ph??t: {trip?.startLocation.name ? trip.startLocation.name : ''}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      M?? t??? v??? ??i???m xu???t ph??t: {trip?.startLocation.description ? trip.startLocation.description : ''}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      ?????a ??i???m xu???t ph??t: &nbsp;{trip?.startLocation.address} ({trip?.startLocation.type})
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      Ng??y kh???i h??nh: {trip?.startDate ? dayjs(trip.startDate).subtract(7, 'hour').format('HH:mm'): '--:--'} {trip?.startDate ? dayjs.tz(trip.startDate, 'Asia/Ho_Chi_Minh').format('DD/MM/YYYY') : 'Ch??a x??c ?????nh'}
                    </Typography>
                  </Box>
                  <Box mt={2}>
                    <Typography variant="h5" sx={{ color: '#2F58CD' }} gutterBottom>
                      <Icon icon="mdi:map-marker" />
                      Th??ng tin ??i???m ?????n
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      T??n ?????a ??i???m ?????n:&nbsp; {trip?.endLocation.name ? trip.endLocation.name : ''}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      M?? t???: {trip?.endLocation.description ? trip.endLocation.description : ''}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      ?????a ??i???m ?????n: &nbsp;{trip?.endLocation.address} ({trip?.endLocation.type})
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      Ng??y k???t th??c: {trip?.endDate ? dayjs(trip.endDate).format('DD/MM/YYYY')  : 'Ch??a x??c ?????nh'}
                    </Typography>
                  </Box>
                  <Typography variant="h6" component="div">
                    S??? ti???n c???n ?????t c???c: {Intl.NumberFormat('en-US').format(trip?.deposit)} Xu <Icon icon="ri:copper-coin-line" />
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    S??? th??nh vi??n tham gia chuy???n ??i: T??? {trip?.minMember} ?????n {trip?.maxMember} ng?????i
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    S??? th??nh vi??n hi???n c??: &nbsp; {trip?.currentMember}/{trip?.maxMember}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Trip members */}
          <Paper
            sx={{
              p: 2,
              margin: 'auto',
              maxWidth: 700,
              flexGrow: 1,
            }}
          >
            {members.map((member, _index) => (
              <Grid
                key={member.id}
                container
                spacing={2}
                sx={{ marginBottom: 5, backgroundColor: '#E9F8F9', borderRadius: 3 }}
              >
                <Grid item>
                  <ButtonBase sx={{ width: 128, height: 128, margin: 2 }}>
                    <Img alt="avatar" src={member?.user.avatarUrl} />
                  </ButtonBase>
                </Grid>
                <Grid item xs={12} sm container>
                  <Grid item xs container direction="column" spacing={2}>
                    <Grid item xs>
                      <Typography gutterBottom variant="subtitle1" component="div">
                        {member?.user.fullname}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        Email: {member?.user.email}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        S??? ??i???n tho???i: {member?.user.phoneNum ? member.user.phoneNum : 'Ch??a x??c ?????nh'}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        ?????a ch???: {member?.user.address}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item sx={{ marginRight: 2 }}>
                    <Typography variant="subtitle1" component="div">
                      Vai tr??: {member?.role}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Paper>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={{ xs: 2, md: 3 }}
            rows={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item>
              <Button onClick={handleBack}>
                <Icon icon="ic:baseline-arrow-back-ios-new" />
                Quay l???i
              </Button>
            </Grid>
            {disable ? (
              <Grid item>
                <StyledDisabledButton>Tham gia ngay</StyledDisabledButton>
              </Grid>
            ) : (
              <Grid item>
                <StyledButton onClick={handleJoinTrip}>Tham gia ngay</StyledButton>
              </Grid>
            )}
          </Grid>
        </Paper>
      ) : (
        <></>
      )}
    </>
  );
}
