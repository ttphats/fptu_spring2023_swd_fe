import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Helmet } from 'react-helmet-async';
import { Container, Typography, InputLabel } from '@material-ui/core';
import { Button, TextField } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Paper from '@material-ui/core/Paper';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { makeStyles } from '@material-ui/core/styles';
import { LoadingButton } from '@mui/lab';
import CurrencyInput from 'react-currency-input-field';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import addressApi from '../../../api/addressApi';
import 'firebase/auth';
import tripApi from '../../../api/tripApi';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Bangkok');

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
  priceVoucher: null,
  quantity: null,
  description: '',
  code: null,
  start_date: null,
  end_date: null,
  location: {
    name: null,
    addressNum: null,
    ward: null,
    district: null,
    province: null,
    type: null,
    description: null,
    phoneNum: null,
  },
};

const validationSchema = Yup.object().shape({
  nameVoucher: Yup.string().required('Vui lòng nhập tên của phiếu giảm giá'),
  priceVoucher: Yup.number().typeError('Vui lòng nhập số').positive('Số tiền phải lớn hơn 0').required('Bắt buộc'),
  quantity: Yup.number()
    .typeError('Vui lòng nhập số')
    .positive('Số tiền phải lớn hơn 0')
    .min(1, 'Số lượng phải lớn hơn 0')
    .required('Bắt buộc'),
  description: Yup.string().required('Vui lòng nhập mô tả cho phiếu giảm giá'),
  code: Yup.string().required('Bắt buộc'),
  start_date: Yup.date()
    .required()
    .typeError("Please select a valid date")
    .nullable(),
  end_date: Yup.date()
    .required()
    .typeError("Please select a valid date")
    .nullable().min(Yup.ref('start_date'), 'Ngày kết thúc phải sau ngày bắt đầu'),
  location: Yup.object().shape({
    name: Yup.string().required('Bắt buộc'),
    addressNum: Yup.string().required('Bắt buộc'),
    ward: Yup.string().required('Bắt buộc'),
    district: Yup.string().required('Bắt buộc'),
    province: Yup.string().required('Bắt buộc'),
    type: Yup.string().required('Bắt buộc'),
    description: Yup.string().required('Bắt buộc'),
    phoneNum: Yup.string()
      .matches(/^\+?\d{10,12}$/, 'Số điện thoại phải từ 10 đến 12 số')
      .required('Vui lòng điền số điện thoại'),
  }),
});

const CreateVoucher = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.current);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState(null);
  const { vertical, horizontal } = {
    vertical: 'top',
    horizontal: 'center',
  };

  const [Proivince, setProvince] = useState();
  const [District, setDistrict] = useState();
  const [Ward, setWard] = useState();

  const [ProvinceDisplay, setProvinceDisplay] = useState([0]);
  const [DistrictDisplay, setDistrictDisplay] = useState([0]);
  const [WardDisplay, setWardDisplay] = useState([0]);
  const [LocationTypeDisplay, setLocationTypeDisplay] = useState([0]);
  const [fileUpload, setFileUpLoad] = useState();
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const values = formik.values;
    const formData = new FormData();

    console.log('date', values.start_date)

    if ((values.start_date !== null && values.end_date !== null) || !formik.isValid) {
      const payload = {
        nameVoucher: values.nameVoucher,
        priceVoucher: values.priceVoucher,
        quantity: values.quantity,
        description: values.description,
        code: values.code,
        start_date: values.start_date,
        end_date: values.end_date,
        location: {
          name: values.location.name,
          addressNum: values.location.addressNum,
          ward: values.location.ward,
          district: values.location.district,
          province: values.location.province,
          type: values.location.type,
          description: values.location.description,
          phoneNum: values.location.phoneNum,
        },
      };

      console.log(payload);

      const json = JSON.stringify(payload);
      const blob = new Blob([json], {
        type: 'application/json',
      });
      formData.append('createVoucherRequestForm', blob);
      if (fileUpload) {
        formData.append('image', fileUpload);
      } else {
        formData.append('image', null);
      }

      try {
        const response = await tripApi.createVoucher(formData);
        console.log('Tạo ưu đãi mới thành công!', response.data);
        navigate('/dashboard/voucher');
      } catch (error) {
        console.error('Đã có lỗi xảy ra:', error);
      }
    } else {
      setMsg('Vui lòng không để trống thông tin!');
      setOpen(true);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

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
      setLocationTypeDisplay(types.data);
      setProvinceDisplay(provinces.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleProvinceChange = async (event, value) => {
    setWard('');
    setDistrict('');
    setDistrictDisplay([]);
    setWardDisplay([]);
    formik.setFieldValue('location.province', event.target.value);

    ProvinceDisplay.forEach(async (province) => {
      if (event.target.value === province.name) {
        const response = await addressApi.getDistrict(province.code);
        setDistrictDisplay(response.data);
      }
    });

    setProvince(event.target.value);
  };

  const handleDistrictChange = async (event) => {
    formik.setFieldValue('location.district', event.target.value);

    DistrictDisplay.forEach(async (district) => {
      if (event.target.value === district.name) {
        const response = await addressApi.getWard(district.code);
        setWardDisplay(response.data);
      }
    });
    setDistrict(event.target.value);
  };

  useEffect(() => {
    if (currentUser) {
      fetchAddress();
    }
  }, [currentUser]);

  console.log(formik.values.nameVoucher);
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
      <Formik initialValues={initialValues} validationSchema={validationSchema}>
        <Container maxWidth="xl" className={classes.root}>
          <Paper className={classes.voucher}>
            <Typography variant="h3" component="h1" className={classes.title}>
              Tạo ưu đãi mới
            </Typography>
            <Box sx={{ minWidth: 800 }}>
              <form onSubmit={handleSubmit}>
                {/* Name of voucher */}
                <TextField
                  fullWidth
                  margin="normal"
                  label="Tên ưu đãi"
                  name="nameVoucher"
                  value={formik.values.nameVoucher}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.nameVoucher && Boolean(formik.errors.nameVoucher)}
                  helperText={formik.touched.nameVoucher && formik.errors.nameVoucher}
                />
                {/* Price of voucher */}
                <Stack direction="row" spacing={4} alignItems="center" sx={{ marginTop: '20px', marginBottom: '20px' }}>
                  <InputLabel htmlFor="standard-adornment-amount">Giá tiền</InputLabel>
                  <CurrencyInput
                    customInput={TextField}
                    name="priceVoucher"
                    variant="outlined"
                    decimalsLimit={2}
                    value={formik.values.priceVoucher}
                    onBlur={formik.handleBlur}
                    error={formik.touched.priceVoucher && Boolean(formik.errors.priceVoucher)}
                    helperText={formik.touched.priceVoucher && formik.errors.priceVoucher}
                    onValueChange={(value, name) => formik.setFieldValue(name, value)}
                    InputProps={{
                      startAdornment: <span style={{ paddingRight: '10px' }}>Xu</span>,
                    }}
                  />
                </Stack>
                {/* Quantity */}
                <TextField
                  fullWidth
                  margin="normal"
                  label="Số lượng phát hành*"
                  name="quantity"
                  type="number"
                  value={formik.values.quantity}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                  helperText={formik.touched.quantity && formik.errors.quantity}
                />
                {/* Description */}
                <TextField
                  fullWidth
                  margin="normal"
                  label="Thêm mô tả*"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
                {/* Code */}
                <TextField
                  fullWidth
                  margin="normal"
                  label="Mã ưu đãi*"
                  name="code"
                  value={formik.values.code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.code && Boolean(formik.errors.code)}
                  helperText={formik.touched.code && formik.errors.code}
                />
                {/* Timeline */}
                <Stack
                  direction="row"
                  sx={{ marginBottom: 6 }}
                  justifyContent="flext-start"
                  alignItems="center"
                  spacing={3}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      className={classes.customInput}
                      label="Ngày bắt đầu áp dụng"
                      value={formik.values.start_date}
                      onBlur={formik.handleBlur}
                      error={formik.errors.start_date}
                      helperText={formik.touched.start_date && Boolean(formik.errors.start_date)}
                      touched={formik.touched.start_date}
                      name="start_date"
                      disablePast
                      format="DD/MM/YYYY"
                      onChange={(value) => {
                        formik.setFieldValue('end_date', null);
                        formik.setFieldValue('start_date', dayjs(value));
                      }}
                    />
                    <DatePicker
                      disablePast
                      label="Ngày hết hạn"
                      className={classes.customInput}
                      value={formik.values.end_date}
                      onBlur={formik.handleBlur}
                      error={formik.touched.end_date && Boolean(formik.errors.end_date)}
                      helperText={formik.touched.end_date && formik.errors.end_date}
                      touched={formik.touched.end_date}
                      name="end_date"
                      format="DD/MM/YYYY"
                      onChange={(value) => {
                        if (dayjs(value) >= formik.values.start_date) {
                          formik.setFieldValue('end_date', dayjs(value));
                        } else {
                          formik.setFieldValue('end_date', null);
                          setMsg('Ngày hết hạn phải bằng hoặc sau ngày phát hành');
                          setOpen(true);
                        }
                      }}
                      renderInput={(params) => <TextField size="small" {...params} sx={{ width: '100%' }} />}
                    />
                  </LocalizationProvider>
                </Stack>
                {/* Location */}
                <TextField
                  label="Tên địa điểm diễn ra ưu đãi:"
                  margin="normal"
                  name="location.name"
                  value={formik.values.location.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.location?.name && formik.touched.location?.name}
                  helperText={formik.errors.location?.name}
                  fullWidth
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                  className={classes.infoLocation}
                />
                <TextField
                  label="Số điện thoai"
                  name="location.phoneNum"
                  value={formik.values.location.phoneNum}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.location?.phoneNum && formik.touched.location?.phoneNum}
                  helperText={formik.errors.location?.phoneNum}
                  margin="normal"
                  fullWidth
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                  className={classes.infoLocation}
                />
                <Stack direction="row" spacing={1} justifyContent="flex-start" alignItems="center">
                  <TextField
                    label="Số nhà"
                    name="location.addressNum"
                    value={formik.values.location.addressNum}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.errors.location?.addressNum && formik.touched.location?.addressNum}
                    helperText={formik.errors.location?.addressNum}
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
                      name="location.province"
                      value={formik.values.location.province}
                      onBlur={formik.handleBlur}
                      error={formik.errors.location?.province && formik.touched.location?.province}
                      helperText={formik.errors.location?.province}
                      onChange={handleProvinceChange}
                    >
                      {ProvinceDisplay.map((province, index) => {
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
                      name="location.district"
                      value={formik.values.location.district}
                      onBlur={formik.handleBlur}
                      error={formik.errors.location?.district && formik.touched.location?.district}
                      helperText={formik.errors.location?.district}
                      displayEmpty
                      onChange={handleDistrictChange}
                    >
                      {DistrictDisplay.length > 0 &&
                        DistrictDisplay.map((district, index) => {
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
                      name="location.ward"
                      value={formik.values.location.ward}
                      onBlur={formik.handleBlur}
                      error={formik.errors.location?.ward && formik.touched.location?.ward}
                      helperText={formik.errors.location?.ward}
                      onChange={formik.handleChange}
                    >
                      {WardDisplay.length > 0 &&
                        WardDisplay.map((ward, _index) => {
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
                    name="location.type"
                    value={formik.values.location.type}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.errors.location?.type && formik.touched.location?.type}
                    helperText={formik.errors.location?.type}
                  >
                    {LocationTypeDisplay.length > 0 &&
                      LocationTypeDisplay.map((type, _index) => {
                        return (
                          <MenuItem key={type.key} value={type.key}>
                            <div style={{ paddingLeft: 10 }}>{type.value}</div>
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
                <TextField
                  label="Thêm mô tả cho địa điểm"
                  margin="normal"
                  name="location.description"
                  value={formik.values.location.description}
                  onBlur={formik.handleBlur}
                  error={formik.errors.location?.description && formik.touched.location?.description}
                  helperText={formik.errors.location?.description}
                  onChange={formik.handleChange}
                  fullWidth
                  className={classes.infoLocation}
                />
                {/* Image */}
                <IconButton color="primary" aria-label="upload picture" component="label">
                  <input hidden onChange={onFileInputChange} accept="image/*" type="file" />
                  <PhotoCamera />
                </IconButton>
                {fileUpload && (
                  <div>
                    <img src={URL.createObjectURL(fileUpload)} alt="Thumb" height="400" />
                  </div>
                )}
              </form>
            </Box>
            <LoadingButton
              className={classes.button}
              sx={{ marginTop: '30px' }}
              disabled={!formik.isValid}
              fullWidth
              size="small"
              type="submit"
              variant="contained"
              onClick={handleSubmit}
            >
              Tạo ưu đãi
            </LoadingButton>
          </Paper>
        </Container>
      </Formik>
    </>
  );
};

export default CreateVoucher;
