import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFormik, Form, Formik } from 'formik';
import * as Yup from 'yup';
import CurrencyInput from 'react-currency-input-field';
import {
  Container,
  Typography,
  InputLabel,
  TextField,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import { DialogContentText } from '@mui/material';
import Box from '@mui/material/Box';
import { LoadingButton } from '@mui/lab';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import ButtonBase from '@mui/material/ButtonBase';
// date
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import moment from 'moment-timezone';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import 'firebase/auth';
import { Icon } from '@iconify/react';
import addressApi from '../../api/addressApi';
import tripApi from '../../api/tripApi';
import voucherApi from '../../api/voucherApi';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Bangkok');

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#f7f7f7',
  },
  stepper: {
    '& .Mui-active .MuiStepIcon-root': { color: '#F39137' },
    '& .Mui-completed .MuiStepIcon-root': { color: '#F39137' },
    '& .Mui-disabled .MuiStepIcon-root': { color: '#F39137' },
  },
  formCreate: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trip: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing(4),
    padding: theme.spacing(2),
  },
  title: {
    background: '-webkit-linear-gradient(45deg, #F39137 30%, #FF7B54 90%)',
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
    background: 'linear-gradient(45deg, #F39137 30%, #FF7B54 90%)',
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
  name: '',
  startDate: moment().format('DD/MM/YYYY HH:mm'),
  endDate: null,
  startLocation: {
    name: '',
    addressNum: '',
    ward: '',
    district: '',
    province: '',
    type: [],
    description: '',
    phoneNum: '',
  },
  endLocation: {
    name: '',
    addressNum: '',
    ward: '',
    district: '',
    province: '',
    type: [],
    description: '',
    phoneNum: '',
  },
  description: '',
  deposit: 0,
  maxMember: 0,
  minMember: 0,
  voucherIds: [],
};

// Validate
const DisplayingErrorMessagesSchema = Yup.object().shape({
  name: Yup.string()
    .min(5, 'Nhập ít nhất 5 ký tự')
    .max(30, 'Tối đa 30 ký tự')
    .required('Vui lòng không được để trống tên của chuyến đi!'),
  startDate: Yup.date().required().typeError('Please select a valid date').nullable(),
  endDate: Yup.date().nullable().required(),
  startLocation: Yup.object().shape({
    name: Yup.string()
      .min(5, 'Nhập ít nhất 5 ký tự')
      .max(30, 'Tối đa 30 ký tự')
      .required('Vui lòng không được để trống!'),
    phoneNum: Yup.string().matches(/^\+?\d{10,12}$/, 'Số điện thoại phải từ 10 đến 12 số'),
    addressNum: Yup.string().required('Bắt buộc'),
    province: Yup.string().required('Bắt buộc'),
    district: Yup.string().required('Bắt buộc'),
    ward: Yup.string().required('Bắt buộc'),
    type: Yup.string().required('Bắt buộc'),
  }),
  endLocation: Yup.object().shape({
    name: Yup.string()
      .min(5, 'Nhập ít nhất 5 ký tự')
      .max(30, 'Tối đa 30 ký tự')
      .required('Vui lòng không được để trống!'),
    phoneNum: Yup.string().matches(/^\+?\d{10,12}$/, 'Số điện thoại phải từ 10 đến 12 số'),
    addressNum: Yup.string().required('Bắt buộc'),
    province: Yup.string().required('Bắt buộc'),
    district: Yup.string().required('Bắt buộc'),
    ward: Yup.string().required('Bắt buộc'),
    type: Yup.string().required('Bắt buộc'),
  }),
  description: Yup.string().required('Vui lòng nhập mô tả cho chuyến đi của bạn'),
  deposit: Yup.number().min(1, 'Số tiền đặt cọc cho chuyến đi phải lớn hơn 0'),
  minMember: Yup.number().min(1, 'Phải có ít nhất 1 thành viên'),
  maxMember: Yup.number()
    .required('Bắt buộc')
    .test('is-greater-than-min', 'Số thành viên phải lớn hơn số thành viên nhỏ nhất', function (maxMember) {
      const { minMember } = this.parent;
      return minMember === undefined || maxMember === undefined || maxMember > minMember;
    }),
});

const CreateTrip = () => {
  const classes = useStyles();
  const currentUser = useSelector((state) => state.user.current);
  const [activeStep, setActiveStep] = useState(0);
  const [fileUpload, setFileUpLoad] = useState();

  // Address for display
  const [startProvinceDisplay, setStartProvinceDisplay] = useState([0]);
  const [startDistrictDisplay, setStartDistrictDisplay] = useState([0]);
  const [startWardDisplay, setStartWardDisplay] = useState([0]);

  const [endProvinceDisplay, setEndProvinceDisplay] = useState([0]);
  const [endDistrictDisplay, setEndDistrictDisplay] = useState([0]);
  const [endWardDisplay, setEndWardDisplay] = useState([0]);
  const [startLocationTypeDisplay, setStartLocationTypeDisplay] = useState([0]);
  const [endLocationTypeDisplay, setEndLocationTypeDisplay] = useState([0]);

  // Start location
  const [startProivince, setStartProvince] = useState();
  const [startDistrict, setStartDistrict] = useState();
  const [startWard, setStartWard] = useState();

  // End location
  const [endProivince, setEndProvince] = useState();
  const [endDistrict, setEndDistrict] = useState();
  const [endWard, setEndWard] = useState();
  const [vouchers, setVouchers] = useState([]);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState(null);
  const { vertical, horizontal } = {
    vertical: 'top',
    horizontal: 'center',
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedValue, setSelectedValue] = useState([]);
  const [selectedVoucherId, setSelectedVoucherId] = useState([]);
  const [isShowed, setIsShowed] = useState(false);
  const location = useLocation();
  const data = location.state;

  useEffect(() => {
    if (data) {
      setSelectedValue([...selectedValue, data]);
      setSelectedVoucherId([...selectedVoucherId, data.id]);
      setIsShowed(true);
    }
  }, [data]);

  const handleClickOpenDialog = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formik.values.startDate !== null && formik.values.endDate !== null) {
        const adjustedDate = dayjs.tz(formik.values?.startDate, 'Asia/Ho_Chi_Minh').add(7, 'hour').toISOString();
        if (adjustedDate) {
          formik.setFieldValue('startDate', adjustedDate);
        }
        const reps = await voucherApi.validateVoucher({ voucherIDs: selectedVoucherId });
        const createTripVouchers = reps.data;

        const form = {
          name: formik.values.name,
          startDate: adjustedDate,
          endDate: formik.values.endDate,
          startLocation: {
            name: formik.values.startLocation.name,
            addressNum: formik.values.startLocation.addressNum,
            ward: formik.values.startLocation.ward,
            district: formik.values.startLocation.district,
            province: formik.values.startLocation.province,
            type: formik.values.startLocation.type,
            description: formik.values.startLocation.description,
            phoneNum: formik.values.startLocation.phoneNum,
          },
          endLocation: {
            name: formik.values.endLocation.name,
            addressNum: formik.values.endLocation.addressNum,
            ward: formik.values.endLocation.ward,
            district: formik.values.endLocation.district,
            province: formik.values.endLocation.province,
            type: formik.values.endLocation.type,
            description: formik.values.endLocation.description,
            phoneNum: formik.values.endLocation.phoneNum,
          },
          description: formik.values.description,
          deposit: formik.values.deposit,
          maxMember: formik.values.maxMember,
          minMember: formik.values.minMember,
          voucherIds: createTripVouchers,
        };
        const json = JSON.stringify(form);
        const blob = new Blob([json], {
          type: 'application/json',
        });

        const formData = new FormData();
        if (fileUpload) {
          console.log(fileUpload);
          formData.append('images', fileUpload);
        } else {
          formData.append('images', null);
        }
        formData.append('createTripRequestForm', blob);
        const response = await tripApi.createTrip(formData);
        if (response) {
          setOpenConfirm(false);
          setOpen(true);
          navigate('/user-profile');
        }
      } else {
        setMsg('Vui lòng không để trống thông tin');
        setOpen(true);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.data.message) {
        setMsg(error.response?.data.message);
      } else {
        setMsg('Thông tin chuyến đi chưa hợp lệ. Vui lòng kiểm tra lại');
      }
      setMsg('Đã có lỗi xảy ra vui lòng kiểm tra lại thông tin đã nhập');
      setOpen(true);
      console.log(error);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: DisplayingErrorMessagesSchema,
    validateOnMount: true,
    validateOnBlur: true,
  });

  // Upload file image
  const onFileInputChange = (e) => {
    const file = e.target?.files?.[0];
    if (file) {
      setFileUpLoad(file);
    }
  };
  const fetchAddress = async () => {
    try {
      const provinces = await addressApi.getProvince();
      const types = await addressApi.getLocationType();
      setStartLocationTypeDisplay(types.data);
      setEndLocationTypeDisplay(types.data);
      setStartProvinceDisplay(provinces.data);
      setEndProvinceDisplay(provinces.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleStartProvinceChange = async (event, value) => {
    setStartWard('');
    setStartDistrict('');
    setStartDistrictDisplay([]);
    setStartWardDisplay([]);
    formik.setFieldValue('startLocation.province', event.target.value);

    startProvinceDisplay.forEach(async (province) => {
      if (event.target.value === province.name) {
        const response = await addressApi.getDistrict(province.code);
        setStartDistrictDisplay(response.data);
      }
    });

    setStartProvince(event.target.value);
  };

  const handleStartDistrictChange = async (event) => {
    formik.setFieldValue('startLocation.district', event.target.value);

    startDistrictDisplay.forEach(async (district) => {
      if (event.target.value === district.name) {
        const response = await addressApi.getWard(district.code);
        setStartWardDisplay(response.data);
      }
    });
    setStartDistrict(event.target.value);
  };

  // Step handle

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleEndProvinceChange = async (event) => {
    setEndWard('');
    setEndDistrict('');
    setEndDistrictDisplay([]);
    setEndWardDisplay([]);
    formik.setFieldValue('endLocation.province', event.target.value);

    endProvinceDisplay.forEach(async (province) => {
      if (event.target.value === province.name) {
        const response = await addressApi.getDistrict(province.code);
        setEndDistrictDisplay(response.data);
      }
    });
    setEndProvince(event.target.value);
  };

  const handleEndDistrictChange = async (event) => {
    formik.setFieldValue('endLocation.district', event.target.value);

    endDistrictDisplay.forEach(async (district) => {
      if (event.target.value === district.name) {
        const response = await addressApi.getWard(district.code);
        setEndWardDisplay(response.data);
      }
    });
    setEndDistrict(event.target.value);
  };
  useEffect(() => {
    if (currentUser) {
      fetchAddress();
    }
  }, [currentUser]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  // Fetch voucher
  async function getVoucherByProvince() {
    const province = formik.values.endLocation.province;
    const provinceNoDau = province
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
    const newProvice = provinceNoDau.toLowerCase().replaceAll(' ', '_');
    const response = await voucherApi.getVoucherByProvince(newProvice);
    setVouchers(response.data);
    console.log(response.data);
  }

  useEffect(() => {
    console.log(formik.values.endLocation.province);
    if (formik.values.endLocation.province) {
      getVoucherByProvince();
    }
  }, [formik.values.endLocation.province]);

  const handleListItemClick = (value) => {
    setOpenDialog(false);
    setIsShowed(true);
    setSelectedValue([...selectedValue, value]);
    setSelectedVoucherId([...selectedVoucherId, value.id]);
    console.log(value.id);
  };

  console.log(formik.values.startLocation);
  return (
    <>
      <Helmet>
        <title> Cóc Phượt </title>
      </Helmet>
      <Snackbar open={open} anchorOrigin={{ vertical, horizontal }} autoHideDuration={2000} onClose={handleClose}>
        <Alert variant="outlined" onClose={handleClose} sx={{ width: '100%' }} severity="success">
          <strong>Tạo chuyến đi thành công</strong>
        </Alert>
      </Snackbar>
      {msg && (
        <Snackbar open={open} anchorOrigin={{ vertical, horizontal }} autoHideDuration={2000} onClose={handleClose}>
          <Alert variant="outlined" onClose={handleClose} sx={{ width: '100%' }} severity="error">
            <strong>{msg}</strong>
          </Alert>
        </Snackbar>
      )}
      <Formik
        initialValues={initialValues}
        validationSchema={DisplayingErrorMessagesSchema}
        onSubmit={(values) => console.log('submit', values)}
      >
        <Container maxWidth="xl" className={classes.root}>
          <Form autoComplete="off">
            <Paper className={classes.trip}>
              <Typography variant="h3" component="h1" className={classes.title}>
                Tạo chuyến đi mới
              </Typography>
              <Box sx={{ minWidth: 800 }}>
                <Stepper
                  className={classes.stepper}
                  activeStep={activeStep}
                  orientation="vertical"
                  sx={{ color: '#FF884B' }}
                >
                  {/* Step 1 */}
                  <Step>
                    <StepLabel>Nhập tên cho chuyến đi của bạn</StepLabel>
                    <StepContent>
                      <TextField
                        id="name"
                        name="name"
                        label="Tên chuyến đi"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                      />
                      <Box sx={{ mb: 2 }}>
                        <div>
                          <LoadingButton
                            disabled={formik.errors.name}
                            className={classes.button}
                            variant="contained"
                            onClick={handleNext}
                            sx={{ mt: 1, mr: 1, marginTop: '30px' }}
                          >
                            Tiếp tục
                          </LoadingButton>
                        </div>
                      </Box>
                    </StepContent>
                  </Step>
                  {/* Step 2 */}
                  <Step>
                    <StepLabel>Chọn thời gian cho chuyến đi của bạn</StepLabel>
                    <StepContent>
                      <Stack
                        direction="row"
                        sx={{ marginBottom: 2 }}
                        justifyContent="flext-start"
                        alignItems="center"
                        spacing={2}
                      >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DateTimePicker
                            className={classes.customInput}
                            label="Ngày bắt đầu chuyến đi"
                            value={formik.values.startDate}
                            disablePast
                            onBlur={formik.handleBlur}
                            error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                            helperText={formik.touched.startDate && formik.errors.startDate}
                            touched={formik.touched.startDate}
                            name="startDate"
                            format="DD/MM/YYYY HH:mm"
                            onChange={(value) => {
                              formik.setFieldValue('endDate', null);
                              formik.setFieldValue('startDate', value);
                            }}
                          />
                          <DatePicker
                            disablePast
                            label="Ngày kết thúc chuyến đi"
                            className={classes.customInput}
                            value={formik.values.endDate}
                            onBlur={formik.handleBlur}
                            error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                            helperText={formik.touched.endDate && formik.errors.endDate}
                            name="endDate"
                            touched={formik.touched.endDate}
                            format="DD/MM/YYYY"
                            onChange={(value) => {
                              if (dayjs(value) >= formik.values.startDate) {
                                formik.setFieldValue('endDate', dayjs(value));
                              } else {
                                formik.setFieldValue('endDate', null);
                                setMsg('Ngày kết thúc chuyến đi phải bằng hoặc sau ngày xuất phát');
                                setOpen(true);
                              }
                            }}
                            renderInput={(params) => <TextField size="small" {...params} sx={{ width: '100%' }} />}
                          />
                        </LocalizationProvider>
                      </Stack>
                      <Box sx={{ mb: 2 }}>
                        <div>
                          <LoadingButton
                            disabled={formik.errors.startDate || formik.errors.endDate}
                            className={classes.button}
                            variant="contained"
                            onClick={handleNext}
                            sx={{ mt: 1, mr: 1, marginTop: '30px' }}
                          >
                            Tiếp tục
                          </LoadingButton>
                          <LoadingButton
                            onClick={handleBack}
                            sx={{ mt: 1, mr: 1, marginTop: '30px', color: '#FF884B' }}
                          >
                            Quay lại
                          </LoadingButton>
                        </div>
                      </Box>
                    </StepContent>
                  </Step>
                  {/* Step 3 */}
                  <Step>
                    <StepLabel>Thông tin điểm xuất phát</StepLabel>
                    <StepContent>
                      <Stack>
                        <TextField
                          label="Tên địa điểm bắt đầu:"
                          margin="normal"
                          name="startLocation.name"
                          value={formik.values.startLocation.name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.errors.startLocation?.name && formik.touched.startLocation?.name}
                          helperText={formik.errors.startLocation?.name}
                          fullWidth
                          required
                          InputLabelProps={{
                            shrink: true,
                          }}
                          className={classes.infoLocation}
                        />
                        <TextField
                          label="Số điện thoai"
                          name="startLocation.phoneNum"
                          value={formik.values.startLocation.phoneNum}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.errors.startLocation?.phoneNum && formik.touched.startLocation?.phoneNum}
                          helperText={formik.errors.startLocation?.phoneNum}
                          margin="normal"
                          fullWidth
                          InputLabelProps={{
                            shrink: true,
                          }}
                          className={classes.infoLocation}
                        />
                        <Stack direction="row" spacing={1} justifyContent="flex-start" alignItems="center">
                          <TextField
                            label="Số nhà"
                            name="startLocation.addressNum"
                            value={formik.values.startLocation.addressNum}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.errors.startLocation?.addressNum && formik.touched.startLocation?.addressNum}
                            helperText={formik.errors.startLocation?.addressNum}
                            required
                            className={classes.infoLocation}
                            fullWidth
                            sx={{ marginRight: '30px' }}
                          />
                          <FormControl fullWidth margin="normal" className={classes.infoLocation}>
                            <InputLabel required id="province-label">
                              Tỉnh/ Thành phố
                            </InputLabel>
                            <Select
                              labelId="province-label"
                              displayEmpty
                              name="startLocation.province"
                              value={formik.values.startLocation.province}
                              onChange={handleStartProvinceChange}
                              onBlur={formik.handleBlur}
                              error={formik.errors.startLocation?.province && formik.touched.startLocation?.province}
                              helperText={formik.errors.startLocation?.province}
                            >
                              {startProvinceDisplay.map((province, index) => {
                                return (
                                  <MenuItem key={province.code} value={province.name}>
                                    <div style={{ paddingLeft: 10 }}>{province.name}</div>
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                          <FormControl fullWidth margin="normal" className={classes.infoLocation}>
                            <InputLabel required id="district-label">
                              Quận/ Huyện
                            </InputLabel>
                            <Select
                              labelId="district-label"
                              name="startLocation.district"
                              value={formik.values.startLocation.district}
                              displayEmpty
                              onChange={handleStartDistrictChange}
                              onBlur={formik.handleBlur}
                              error={formik.errors.startLocation?.district && formik.touched.startLocation?.district}
                              helperText={formik.errors.startLocation?.district}
                            >
                              {startDistrictDisplay.length > 0 &&
                                startDistrictDisplay.map((district, index) => {
                                  return (
                                    <MenuItem key={district.code} value={district.name}>
                                      <div style={{ paddingLeft: 10 }}>{district.name}</div>
                                    </MenuItem>
                                  );
                                })}
                            </Select>
                          </FormControl>
                          <FormControl fullWidth margin="normal" className={classes.infoLocation}>
                            <InputLabel required id="ward-label">
                              Phường/ Xã
                            </InputLabel>
                            <Select
                              labelId="ward-label"
                              name="startLocation.ward"
                              value={formik.values.startLocation.ward}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={formik.errors.startLocation?.ward && formik.touched.startLocation?.ward}
                              helperText={formik.errors.startLocation?.ward}
                            >
                              {startWardDisplay.length > 0 &&
                                startWardDisplay.map((ward, _index) => {
                                  return (
                                    <MenuItem key={ward.code} value={ward.name}>
                                      <div style={{ paddingLeft: 10 }}>{ward.name}</div>
                                    </MenuItem>
                                  );
                                })}
                            </Select>
                          </FormControl>
                        </Stack>
                        <FormControl fullWidth margin="normal" className={classes.infoLocation}>
                          <InputLabel required id="ward-label">
                            Loại địa điểm
                          </InputLabel>
                          <Select
                            name="startLocation.type"
                            value={formik.values.startLocation.type}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.errors.startLocation?.type && formik.touched.startLocation?.type}
                            helperText={formik.errors.startLocation?.type}
                          >
                            {startLocationTypeDisplay.length > 0 &&
                              startLocationTypeDisplay.map((type, _index) => {
                                return (
                                  <MenuItem key={type.key} value={type.key}>
                                    <div style={{ paddingLeft: 10 }}>{type.value}</div>
                                  </MenuItem>
                                );
                              })}
                          </Select>
                        </FormControl>
                        <TextField
                          label="Mô tả điểm xuất phát"
                          margin="normal"
                          name="startLocation.description"
                          value={formik.values.startLocation.description}
                          onChange={formik.handleChange}
                          fullWidth
                          className={classes.infoLocation}
                        />
                      </Stack>
                      <Box sx={{ mb: 2 }}>
                        <div>
                          <LoadingButton
                            disabled={
                              formik.errors.startLocation?.name ||
                              formik.errors.startLocation?.phoneNum ||
                              formik.errors.startLocation?.addressNum ||
                              formik.errors.startLocation?.province ||
                              formik.errors.startLocation?.district ||
                              formik.errors.startLocation?.ward ||
                              formik.errors.startLocation?.type
                            }
                            className={classes.button}
                            variant="contained"
                            onClick={handleNext}
                            sx={{ mt: 1, mr: 1, marginTop: '30px' }}
                          >
                            Tiếp tục
                          </LoadingButton>
                          <LoadingButton
                            onClick={handleBack}
                            sx={{ mt: 1, mr: 1, marginTop: '30px', color: '#FF884B' }}
                          >
                            Quay lại
                          </LoadingButton>
                        </div>
                      </Box>
                    </StepContent>
                  </Step>
                  {/* Step 4 */}
                  <Step>
                    <StepLabel>Thông tin điểm đến</StepLabel>
                    <StepContent>
                      <Stack>
                        <TextField
                          label="Tên điểm đến:"
                          margin="normal"
                          name="endLocation.name"
                          value={formik.values.endLocation.name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.errors.endLocation?.name && formik.touched.endLocation?.name}
                          helperText={formik.errors.endLocation?.name}
                          fullWidth
                          required
                          InputLabelProps={{
                            shrink: true,
                          }}
                          className={classes.infoLocation}
                        />
                        <TextField
                          label="Số điện thoai"
                          name="endLocation.phoneNum"
                          value={formik.values.endLocation.phoneNum}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.errors.endLocation?.phoneNum && formik.touched.endLocation?.phoneNum}
                          helperText={formik.errors.endLocation?.phoneNum}
                          margin="normal"
                          fullWidth
                          InputLabelProps={{
                            shrink: true,
                          }}
                          className={classes.infoLocation}
                        />
                        <Stack direction="row" spacing={1} justifyContent="flex-start" alignItems="center">
                          <TextField
                            label="Số nhà"
                            name="endLocation.addressNum"
                            value={formik.values.endLocation.addressNum}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.errors.endLocation?.addressNum && formik.touched.endLocation?.addressNum}
                            helperText={formik.errors.endLocation?.addressNum}
                            required
                            className={classes.infoLocation}
                            fullWidth
                            sx={{ marginRight: '30px' }}
                          />
                          <FormControl fullWidth margin="normal" className={classes.infoLocation}>
                            <InputLabel required id="province-label">
                              Tỉnh/ Thành phố
                            </InputLabel>
                            <Select
                              labelId="province-label"
                              displayEmpty
                              name="endLocation.province"
                              value={formik.values.endLocation.province}
                              onChange={handleEndProvinceChange}
                              onBlur={formik.handleBlur}
                              error={formik.errors.endLocation?.province && formik.touched.endLocation?.province}
                              helperText={formik.errors.endLocation?.province}
                            >
                              {endProvinceDisplay.map((province, index) => {
                                return (
                                  <MenuItem key={province.code} value={province.name}>
                                    <div style={{ paddingLeft: 10 }}>{province.name}</div>
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                          <FormControl fullWidth margin="normal" className={classes.infoLocation}>
                            <InputLabel required id="district-label">
                              Quận/ Huyện
                            </InputLabel>
                            <Select
                              labelId="district-label"
                              name="endLocation.district"
                              value={formik.values.endLocation.district}
                              displayEmpty
                              onChange={handleEndDistrictChange}
                              onBlur={formik.handleBlur}
                              error={formik.errors.endLocation?.district && formik.touched.endLocation?.district}
                              helperText={formik.errors.endLocation?.district}
                            >
                              {endDistrictDisplay.length > 0 &&
                                endDistrictDisplay.map((district, index) => {
                                  return (
                                    <MenuItem key={district.code} value={district.name}>
                                      <div style={{ paddingLeft: 10 }}>{district.name}</div>
                                    </MenuItem>
                                  );
                                })}
                            </Select>
                          </FormControl>
                          <FormControl fullWidth margin="normal" className={classes.infoLocation}>
                            <InputLabel required id="ward-label">
                              Phường/ Xã
                            </InputLabel>
                            <Select
                              labelId="ward-label"
                              name="endLocation.ward"
                              value={formik.values.endLocation.ward}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={formik.errors.endLocation?.ward && formik.touched.endLocation?.ward}
                              helperText={formik.errors.endLocation?.ward}
                            >
                              {endWardDisplay.length > 0 &&
                                endWardDisplay.map((ward, _index) => {
                                  return (
                                    <MenuItem key={ward.code} value={ward.name}>
                                      <div style={{ paddingLeft: 10 }}>{ward.name}</div>
                                    </MenuItem>
                                  );
                                })}
                            </Select>
                          </FormControl>
                        </Stack>
                        <FormControl fullWidth margin="normal" className={classes.infoLocation}>
                          <InputLabel required id="ward-label">
                            Loại địa điểm
                          </InputLabel>
                          <Select
                            name="endLocation.type"
                            value={formik.values.endLocation.type}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.errors.endLocation?.type && formik.touched.endLocation?.type}
                            helperText={formik.errors.endLocation?.type}
                          >
                            {endLocationTypeDisplay.length > 0 &&
                              endLocationTypeDisplay.map((type, _index) => {
                                return (
                                  <MenuItem key={type.key} value={type.key}>
                                    <div style={{ paddingLeft: 10 }}>{type.value}</div>
                                  </MenuItem>
                                );
                              })}
                          </Select>
                        </FormControl>
                        <TextField
                          label="Mô tả điểm đến"
                          margin="normal"
                          name="endLocation.description"
                          value={formik.values.endLocation.description}
                          onChange={formik.handleChange}
                          fullWidth
                          className={classes.infoLocation}
                        />
                      </Stack>
                      <Box sx={{ mb: 2 }}>
                        <div>
                          <LoadingButton
                            disabled={
                              formik.errors.endLocation?.name ||
                              formik.errors.endLocation?.phoneNum ||
                              formik.errors.endLocation?.addressNum ||
                              formik.errors.endLocation?.province ||
                              formik.errors.endLocation?.district ||
                              formik.errors.endLocation?.ward ||
                              formik.errors.endLocation?.type
                            }
                            className={classes.button}
                            variant="contained"
                            onClick={handleNext}
                            sx={{ mt: 1, mr: 1, marginTop: '30px' }}
                          >
                            Tiếp tục
                          </LoadingButton>
                          <LoadingButton
                            onClick={handleBack}
                            sx={{ mt: 1, mr: 1, marginTop: '30px', color: '#FF884B' }}
                          >
                            Quay lại
                          </LoadingButton>
                        </div>
                      </Box>
                    </StepContent>
                  </Step>
                  {/* Step 5 */}
                  <Step>
                    <StepLabel>Mô tả chi tiết cho chuyến đi của bạn</StepLabel>
                    <StepContent>
                      <>
                        <TextField
                          name="description"
                          value={formik.values.description}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.errors.description && formik.touched.description}
                          helperText={formik.errors.description}
                          label="Mô tả về chuyến đi của bạn"
                          margin="normal"
                          required
                          fullWidth
                        />
                        <Stack
                          direction="row"
                          spacing={4}
                          alignItems="center"
                          sx={{ marginTop: '20px', marginBottom: '20px' }}
                        >
                          <InputLabel htmlFor="standard-adornment-amount">Tiền đặt cọc</InputLabel>
                          <CurrencyInput
                            customInput={TextField}
                            name="deposit"
                            variant="outlined"
                            value={formik.values.deposit}
                            onValueChange={(value, name) => formik.setFieldValue(name, value)}
                            onBlur={formik.handleBlur}
                            error={formik.errors.deposit && formik.touched.deposit}
                            helperText={formik.errors.deposit}
                            InputProps={{
                              endAdornment: <span style={{ paddingLeft: '10px' }}>Xu</span>,
                            }}
                          />
                        </Stack>
                        <Stack
                          direction="row"
                          spacing={5}
                          alignItems="center"
                          sx={{ marginTop: '20px', marginBottom: '20px' }}
                        >
                          <InputLabel>Số người tham gia</InputLabel>
                          <OutlinedInput
                            name="minMember"
                            defaultValue={2}
                            value={formik.values.minMember}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.errors.minMember && formik.touched.minMember}
                            helperText={formik.errors.minMember}
                            required
                            id="standard-adornment-amount"
                            startAdornment={<InputAdornment position="start">Từ</InputAdornment>}
                          />
                          <OutlinedInput
                            name="maxMember"
                            value={formik.values.maxMember}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.errors.maxMember && formik.touched.maxMember}
                            helperText={formik.errors.maxMember}
                            required
                            id="standard-adornment-amount"
                            startAdornment={<InputAdornment position="start">Đến</InputAdornment>}
                          />
                        </Stack>
                      </>
                      <Box sx={{ mb: 2 }}>
                        <div>
                          <LoadingButton
                            disabled={
                              formik.errors.description ||
                              formik.errors.deposit ||
                              formik.errors.minMember ||
                              formik.errors.maxMember
                            }
                            className={classes.button}
                            variant="contained"
                            onClick={handleNext}
                            sx={{ mt: 1, mr: 1, marginTop: '30px' }}
                          >
                            Tiếp tục
                          </LoadingButton>
                          <LoadingButton
                            onClick={handleBack}
                            sx={{ mt: 1, mr: 1, marginTop: '30px', color: '#FF884B' }}
                          >
                            Quay lại
                          </LoadingButton>
                        </div>
                      </Box>
                    </StepContent>
                  </Step>
                  {/* Step 6 */}
                  <Step>
                    <StepLabel> Thêm hình ảnh mô tả cho chuyến đi của bạn</StepLabel>
                    <StepContent>
                      <>
                        <IconButton color="primary" aria-label="upload picture" component="label">
                          <input hidden onChange={onFileInputChange} accept="image/*" type="file" />
                          <PhotoCamera />
                        </IconButton>
                        {fileUpload && (
                          <div>
                            <img src={URL.createObjectURL(fileUpload)} alt="Thumb" height="400" />
                          </div>
                        )}
                      </>
                      <Box sx={{ mb: 2 }}>
                        <div>
                          <LoadingButton
                            className={classes.button}
                            variant="contained"
                            onClick={handleNext}
                            sx={{ mt: 1, mr: 1, marginTop: '30px' }}
                          >
                            Tiếp tục
                          </LoadingButton>
                          <LoadingButton
                            onClick={handleBack}
                            sx={{ mt: 1, mr: 1, marginTop: '30px', color: '#FF884B' }}
                          >
                            Quay lại
                          </LoadingButton>
                        </div>
                      </Box>
                    </StepContent>
                  </Step>
                  {/* Step 7 */}
                  <Step>
                    <StepLabel optional={<Typography variant="caption">Bước cuối</Typography>}>
                      Chọn mã giảm giá cho chuyến đi của bạn
                    </StepLabel>
                    <StepContent>
                      <>
                        <LoadingButton onClick={handleClickOpenDialog}>
                          <Icon icon="fluent:gift-card-add-24-filled" color="#f88" width="50" height="50" />
                        </LoadingButton>
                        <Dialog onClose={handleCloseDialog} open={openDialog}>
                          <DialogTitle>Chọn giảm giá mong muốn cho chuyến đi của bạn</DialogTitle>
                          <List sx={{ pt: 0 }}>
                            {vouchers.map((voucher) => (
                              <ListItem key={voucher.id} disableGutters>
                                <ListItemButton
                                  sx={{ boxShadow: 3 }}
                                  onClick={() => handleListItemClick(voucher)}
                                  key={voucher.id}
                                >
                                  <Grid container spacing={2}>
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
                        </Dialog>
                        {isShowed &&
                          selectedValue?.map((selected) => (
                            <Grid
                              key={selected.value}
                              container
                              spacing={2}
                              sx={{ boxShadow: 3, marginBottom: 3, marginTop: 2 }}
                            >
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
                                      {selected?.endDate
                                        ? dayjs.tz(selected.endDate, 'Asia/Ho_Chi_Minh').format('DD/MM/YYYY')
                                        : ''}
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
                      </>
                      <Box sx={{ mb: 2 }}>
                        <div>
                          <LoadingButton
                            className={classes.button}
                            variant="contained"
                            onClick={handleNext}
                            sx={{ mt: 1, mr: 1, marginTop: '30px' }}
                          >
                            Tiếp tục
                          </LoadingButton>
                          <LoadingButton
                            onClick={handleBack}
                            sx={{ mt: 1, mr: 1, marginTop: '30px', color: '#FF884B' }}
                          >
                            Quay lại
                          </LoadingButton>
                        </div>
                      </Box>
                    </StepContent>
                  </Step>
                </Stepper>
                {activeStep === 7 && (
                  <Paper square elevation={0} sx={{ p: 3 }}>
                    <Typography>Điền thông tin hoàn thành, bạn có thể nhấn xác nhận để tạo chuyến đi</Typography>
                    <LoadingButton className={classes.button} onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                      Xem lại thông tin đã điền
                    </LoadingButton>
                  </Paper>
                )}
              </Box>
              <Dialog
                open={openConfirm}
                onClose={handleCloseConfirm}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">{'Xác nhận thanh toán tiền đặt cọc để tạo chuyến đi'}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Cần <strong>{formik.values.deposit} Xu</strong> để tạo chuyến đi này
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <LoadingButton onClick={handleCloseConfirm}>Huỷ</LoadingButton>
                  <LoadingButton onClick={handleSubmit} autoFocus>
                    Xác nhận
                  </LoadingButton>
                </DialogActions>
              </Dialog>
              <LoadingButton
                className={classes.button}
                sx={{ marginTop: '30px' }}
                disabled={!formik.isValid}
                fullWidth
                size="small"
                type="submit"
                variant="contained"
                onClick={handleClickOpenConfirm}
              >
                Tạo chuyến đi
              </LoadingButton>
            </Paper>
          </Form>
        </Container>
      </Formik>
    </>
  );
};

export default CreateTrip;
