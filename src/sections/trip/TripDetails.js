import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Grid,
  Typography,
  ButtonBase,
  DialogContentText,
  DialogActions,
  DialogTitle,
  DialogContent,
  Dialog,
  ListItemButton,
  ListItem,
  List,
  Stack,
  Checkbox,
} from '@mui/material';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import { Icon } from '@iconify/react';
//
import SvgColor from '../../components/svg-color';
import Iconify from '../../components/iconify';
import tripApi from '../../api/tripApi';
import voucherApi from '../../api/voucherApi';
import LoadingSpinner from '../../components/loading/LoadingSpinner';

// ----------------------------------------------------------------------

const StyledButton = styled(LoadingButton)(({ theme }) => ({
  background: 'linear-gradient(45deg, #F39137 30%, #FF7B54 90%)',
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
  const [isHost, setIsHost] = useState();
  const [vouchers, setVouchers] = useState([]);
  const [allVoucherDisplay, setAllVoucherDisplay] = useState([]);
  const [vouchersBought, setVouchersBought] = useState([]);
  const [voucherIds, setVouchersId] = useState([]);
  const [vouchersSelected, setVoucherSelected] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openConfirmVoucher, setOpenConfirmVoucher] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [disableVoucher, setDisableVoucher] = useState(true);

  let totalPriceVoucher = 0;

  async function getListVouchers() {
    if (trip.id) {
      const reps = await voucherApi.getVouchersByTripID(trip?.id);

      reps?.data.map((voucher, _index) => {
        if (voucher.tripVoucherStatus === 'IN_CART') {
          setVouchersBought((prev) => [...prev, voucher]);
        }
        if (voucher.tripVoucherStatus === 'WISH') {
          setVouchers((prev) => [...prev, voucher]);
        }
        return _index;
      });
      setLoading(false);
    }
  }

  async function getAllVouchers() {
    try {
      const province = trip?.endLocation.address.split(', ');
      console.log(province[3]);
      const response = await voucherApi.getVoucherByProvince(province[3]);
      if (response) {
        setAllVoucherDisplay(response.data);
        setLoading(false);
      }
    } catch (error) {
      setErrorMsg(error?.response?.data.message);
      setOpenSnackBar(true);
    }
  }

  const handleCheckboxClick = (event, voucher) => {
    const selectedIndex = vouchersSelected.indexOf(voucher);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(vouchersSelected, voucher);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(vouchersSelected.slice(1));
    } else if (selectedIndex === vouchersSelected.length - 1) {
      newSelected = newSelected.concat(vouchersSelected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        vouchersSelected.slice(0, selectedIndex),
        vouchersSelected.slice(selectedIndex + 1)
      );
    }
    setVoucherSelected(newSelected);
  };

  const handleBuyVoucher = async () => {
    try {
      const response = await voucherApi.addVouchersToTrip(trip.id, voucherIds);
      setLoading(false);
      console.log(response);
      if (response) {
        setOpenConfirmVoucher(false);
        setOpenDialog(false);
      }
    } catch (error) {
      console.log(error.response.data.message);
      setErrorMsg(error.response.data.message);
      setOpenSnackBar(true);
    }
  };

  const handleClickOpenDialog = () => {
    setVoucherSelected([]);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleClickOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleClickOpenConfirmVoucher = (vouchersSelected) => {
    vouchersSelected.map((voucher, _index) => {
      setVouchersId((prev) => [...prev, voucher.id]);
      return _index;
    });
    setOpenConfirmVoucher(true);
  };

  const handleCloseConfirmVoucher = () => {
    setOpenConfirmVoucher(false);
  };

  useEffect(() => {
    getListVouchers();
    getAllVouchers();
  }, [trip]);

  useEffect(() => {
    async function handleDisabled() {
      try {
        if (trip.id) {
          const getUser = await tripApi.getTripMembers(trip?.id);
          console.log(getUser.data);
          setMembers(getUser.data);
          getUser.data.map((mem, _index) => {
            if (mem.user.id === currentUser.id) {
              setDisable(true);
            }
            if (mem.user.id === currentUser.id && mem.role === 'HOST') {
              setIsHost(true);
            }
            return _index;
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    handleDisabled();
  }, [trip]);

  useEffect(() => {
    if (vouchersSelected && vouchersSelected.length > 0) {
      setDisableVoucher(false);
    } else {
      setDisableVoucher(true);
    }
  }, [vouchersSelected]);

  const handleJoinTrip = async () => {
    setDisable(true);
    setOpenSnackBar(true);
    try {
      const response = await tripApi.joinTripById(trip?.id);
      setSuccessMsg(response.message);
      setOpenConfirm(false);
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

  if (vouchersSelected) {
    vouchersSelected.map((voucher) => {
      totalPriceVoucher += voucher.price;
      return totalPriceVoucher;
    });
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  console.log('voucher ', vouchers);

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
              <Typography gutterBottom variant="h3" sx={{ color: '#FF7300' }} component="div">
                {!trip?.name ? 'Đã bao lâu rồi chúng ta chưa có dịp đi chơi cùng nhau' : trip.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ngày đăng bài:{' '}
                {trip?.postDate ? dayjs.tz(trip.postDate, 'Asia/Ho_Chi_Minh').format('DD/MM/YYYY') : 'Không xác định'}
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
                    <Typography variant="h5" sx={{ color: '#FF884B' }} gutterBottom>
                      <Icon icon="fluent:text-description-24-filled" />
                      &nbsp;Mô tả
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      {trip?.description ? trip.description : ''}
                    </Typography>
                  </Box>
                  <Box mt={2}>
                    <Typography variant="h5" sx={{ color: '#FF884B' }} gutterBottom>
                      <Icon icon="iconoir:maps-go-straight" vFlip />
                      &nbsp;Thông tin địa điểm xuất phát
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      Tên địa điểm xuất phát: {trip?.startLocation.name ? trip.startLocation.name : ''}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      Mô tả về điểm xuất phát: {trip?.startLocation.description ? trip.startLocation.description : ''}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      Địa điểm xuất phát: &nbsp;{trip?.startLocation.address} ({trip?.startLocation.type})
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      Ngày khởi hành:{' '}
                      {trip?.startDate ? dayjs(trip.startDate).subtract(7, 'hour').format('HH:mm') : '--:--'}{' '}
                      {trip?.startDate
                        ? dayjs.tz(trip.startDate, 'Asia/Ho_Chi_Minh').format('DD/MM/YYYY')
                        : 'Chưa xác định'}
                    </Typography>
                  </Box>
                  <Box mt={2}>
                    <Typography variant="h5" sx={{ color: '#FF884B' }} gutterBottom>
                      <Icon icon="mdi:map-marker" />
                      &nbsp;Thông tin điểm đến
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      Tên địa điểm đến:&nbsp; {trip?.endLocation.name ? trip.endLocation.name : ''}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      Mô tả: {trip?.endLocation.description ? trip.endLocation.description : ''}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      Địa điểm đến: &nbsp;{trip?.endLocation.address} ({trip?.endLocation.type})
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      Ngày kết thúc: {trip?.endDate ? dayjs(trip.endDate).format('DD/MM/YYYY') : 'Chưa xác định'}
                    </Typography>
                  </Box>
                  <Typography variant="h6" component="div">
                    Số tiền cần đặt cọc: {Intl.NumberFormat('en-US').format(trip?.deposit)} Xu{' '}
                    <Icon icon="ri:copper-coin-line" />
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Số thành viên tham gia chuyến đi: Từ {trip?.minMember} Đến {trip?.maxMember} người
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Số thành viên hiện có: &nbsp; {trip?.currentMember}/{trip?.maxMember}
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
                        Số điện thoại: {member?.user.phoneNum ? member.user.phoneNum : 'Chưa xác định'}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        Địa chỉ: {member?.user.address}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item sx={{ marginRight: 2 }}>
                    <Typography variant="subtitle1" component="div">
                      Vai trò: {member?.role}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Paper>
          {/* Trip vouchers */}
          <Typography variant="h6" sx={{ color: '#FF7300' }} gutterBottom>
            <Icon icon="fluent:gift-card-multiple-24-filled" />
            &nbsp;Các mã giảm giá mong muốn cho chuyến đi:
          </Typography>
          <Paper
            sx={{
              p: 2,
              margin: 'auto',
              maxWidth: 700,
              flexGrow: 1,
            }}
          >
            {vouchers?.map((selected) => (
              <Grid key={selected.id} container spacing={2} sx={{ boxShadow: 3, marginBottom: 3, marginTop: 2 }}>
                <Grid item>
                  <ButtonBase sx={{ width: 128, height: 128 }}>
                    <Img alt="complex" src={selected?.imageUrl} />
                  </ButtonBase>
                </Grid>
                <Grid item xs={12} sm container>
                  <Grid item xs container direction="column" spacing={2}>
                    <Grid item xs>
                      <Typography gutterBottom variant="subtitle1" component="div">
                        {selected?.name}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {selected?.description}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {selected?.startDate
                          ? dayjs.tz(selected.startDate, 'Asia/Ho_Chi_Minh').format('DD/MM/YYYY')
                          : ''}{' '}
                        - {selected?.endDate ? dayjs.tz(selected.endDate, 'Asia/Ho_Chi_Minh').format('DD/MM/YYYY') : ''}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography sx={{ cursor: 'pointer' }} variant="body2">
                        Số lượng còn lại: {selected?.quantity}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid item>
                    <Typography variant="subtitle1" component="div">
                      {Intl.NumberFormat('en-US').format(selected?.price)} Xu
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Paper>
          <Typography variant="h6" sx={{ color: '#FF7300' }} gutterBottom>
            <Icon icon="fluent:gift-card-money-24-filled" />
            &nbsp;Các mã giảm giá đã mua:
          </Typography>
          {isHost ? (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton onClick={handleClickOpenDialog}>
                <Icon icon="fluent:gift-card-add-24-filled" color="#FF7B54" width="50" height="50" />
              </LoadingButton>
            </Box>
          ) : (
            <></>
          )}
          <Paper
            sx={{
              p: 2,
              margin: 'auto',
              maxWidth: 700,
              flexGrow: 1,
            }}
          >
            {vouchersBought.length > 0 ? (
              vouchersBought?.map((selected) => (
                <Grid key={selected.id} container spacing={2} sx={{ boxShadow: 3, marginBottom: 3, marginTop: 2 }}>
                  <Grid item>
                    <ButtonBase sx={{ width: 128, height: 128 }}>
                      <Img alt="complex" src={selected?.imageUrl} />
                    </ButtonBase>
                  </Grid>
                  <Grid item xs={12} sm container>
                    <Grid item xs container direction="column" spacing={2}>
                      <Grid item xs>
                        <Typography gutterBottom variant="subtitle1" component="div">
                          {selected?.name}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          {selected?.description}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          {selected?.startDate
                            ? dayjs.tz(selected.startDate, 'Asia/Ho_Chi_Minh').format('DD/MM/YYYY')
                            : ''}{' '}
                          -{' '}
                          {selected?.endDate ? dayjs.tz(selected.endDate, 'Asia/Ho_Chi_Minh').format('DD/MM/YYYY') : ''}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography sx={{ cursor: 'pointer' }} variant="body2">
                          Số lượng còn lại: {selected?.quantity}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid item>
                      <Typography variant="subtitle1" component="div">
                        {Intl.NumberFormat('en-US').format(selected?.price)} Xu
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              ))
            ) : (
              <Typography sx={{ textAlign: 'center' }} variant="body1">
                Chưa có mã giảm giá nào được mua cho chuyến đi này
              </Typography>
            )}
          </Paper>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={{ xs: 2, md: 3 }}
            rows={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item>
              <Button onClick={handleBack} sx={{ color: '#FF884B' }}>
                <Icon icon="ic:baseline-arrow-back-ios-new" />
                Quay lại
              </Button>
            </Grid>
            {disable ? (
              <Grid item>
                <StyledDisabledButton>Tham gia ngay</StyledDisabledButton>
              </Grid>
            ) : (
              <Grid item>
                <StyledButton onClick={handleClickOpenConfirm}>Tham gia ngay</StyledButton>
              </Grid>
            )}
          </Grid>
          <Dialog
            sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}
            open={openConfirm}
            onClose={handleCloseConfirm}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {'Xác nhận thanh toán tiền đặt cọc để tham gia chuyến đi'}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Cần <strong>{trip?.deposit} Xu</strong> để tham gia chuyến đi này
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <LoadingButton onClick={handleCloseConfirm}>Huỷ</LoadingButton>
              <LoadingButton onClick={handleJoinTrip} autoFocus>
                Xác nhận
              </LoadingButton>
            </DialogActions>
          </Dialog>
          <Dialog onClose={handleCloseDialog} open={openDialog}>
            <DialogTitle>Chọn ưu đãi cho chuyến đi của bạn</DialogTitle>
            {allVoucherDisplay.length > 0 ? (
              <>
                <List sx={{ pt: 0 }}>
                  {allVoucherDisplay.map((voucher) => (
                    <ListItem key={voucher.id} disableGutters>
                      {/* onClick={() => handleListItemClick(voucher)} */}
                      <ListItemButton sx={{ boxShadow: 3 }} key={voucher.id}>
                        <Grid container spacing={2}>
                          <Grid item>
                            <Checkbox onChange={(event) => handleCheckboxClick(event, voucher)} />
                          </Grid>
                          <Grid item>
                            <ButtonBase sx={{ width: 128, height: 128 }}>
                              <Img alt="complex" src={voucher.imageUrl} />
                            </ButtonBase>
                          </Grid>
                          <Grid item xs={12} sm container>
                            <Grid item xs container direction="column" spacing={2}>
                              <Grid item xs>
                                <Typography gutterBottom variant="subtitle1" component="div">
                                  {voucher?.name}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                  {voucher?.description}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                  {voucher?.startDate
                                    ? dayjs.tz(voucher.startDate, 'Asia/Ho_Chi_Minh').format('DD/MM/YYYY')
                                    : ''}{' '}
                                  -{' '}
                                  {voucher?.endDate
                                    ? dayjs.tz(voucher.endDate, 'Asia/Ho_Chi_Minh').format('DD/MM/YYYY')
                                    : ''}
                                </Typography>
                                {console.log(voucher.location)}
                                <Typography variant="body2" gutterBottom>
                                  Loại: {voucher?.location.type}
                                </Typography>
                              </Grid>
                              <Grid item>
                                <Typography sx={{ cursor: 'pointer' }} variant="body2">
                                  Số lượng còn lại: {voucher.quantity}
                                </Typography>
                              </Grid>
                            </Grid>
                            <Grid item>
                              <Typography variant="subtitle1" component="div">
                                {Intl.NumberFormat('en-US').format(voucher?.price)} Xu
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
                <DialogActions
                  style={{
                    display: 'flex',
                    height: '10vh',
                    justifyContent: 'space-between',
                    position: 'fixed',
                    bottom: 0,
                    background: '#ffffff',
                    minWidth: '600px',
                  }}
                >
                  Tổng thanh toán ({vouchersSelected.length} Mã giảm giá) :{' '}
                  <Typography sx={{ color: '#FF7300', fontWeight: 700 }}>{totalPriceVoucher} Xu</Typography>
                  <LoadingButton
                    disabled={disableVoucher}
                    sx={{
                      backgroundColor: '#FF7300',
                      '&:hover': {
                        backgroundColor: '#F2C6A5',
                        boxShadow: 'none',
                      },
                    }}
                    onClick={() => handleClickOpenConfirmVoucher(vouchersSelected)}
                    variant="contained"
                  >
                    Mua ngay
                  </LoadingButton>
                </DialogActions>
              </>
            ) : (
              <DialogContent> Hiện chưa có mã giảm giá nào cho điểm đến này</DialogContent>
            )}
          </Dialog>
          <Dialog
            open={openConfirmVoucher}
            onClose={handleCloseConfirmVoucher}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{'Xác nhận thanh toán tiền mã giảm giá'}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Cần <strong style={{ color: '#ff7300' }}>{totalPriceVoucher} Xu</strong> để mua
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <LoadingButton onClick={handleCloseConfirmVoucher}>Huỷ</LoadingButton>
              <LoadingButton sx={{ color: '#FF7300' }} onClick={handleBuyVoucher} autoFocus>
                Xác nhận
              </LoadingButton>
            </DialogActions>
          </Dialog>
        </Paper>
      ) : (
        <></>
      )}
    </>
  );
}
