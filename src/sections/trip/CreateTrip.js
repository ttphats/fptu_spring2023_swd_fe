import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik, Form, Formik } from 'formik';
import * as Yup from 'yup';
import CurrencyInput from 'react-currency-input-field';
import { Container, Typography, InputLabel, TextField } from '@material-ui/core';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
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
// date
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import moment from 'moment-timezone';
import { getTimezoneOffset } from 'date-fns-tz';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import 'firebase/auth';
import addressApi from '../../api/addressApi';
import tripApi from '../../api/tripApi';

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
  trip: {
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

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState(null);
  const { vertical, horizontal } = {
    vertical: 'top',
    horizontal: 'center',
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      startDate: moment().format("DD/MM/YYYY HH:mm"),
      endDate: null,
      startLocation: {
        name: '',
        addressNum: '',
        ward: '',
        district: '',
        province: '',
        type: '',
        description: '',
        phoneNum: '',
      },
      endLocation: {
        name: '',
        addressNum: '',
        ward: '',
        district: '',
        province: '',
        type: '',
        description: '',
        phoneNum: '',
      },
      description: '',
      deposit: 0,
      maxMember: 0,
      minMember: 0,
      voucherIds: [],
    },
  });
  // Validate
  const DisplayingErrorMessagesSchema = Yup.object().shape({
    startDate: Yup.date().nullable().typeError('Start date is required').required('Start Date is required'),

    endDate: Yup.date()
      .nullable()
      .when('startDate', (startDate, yup) => startDate && yup.min(startDate, 'End date cannot be before start time'))
      .required('End Date is required')
      .typeError('Enter a value End date'),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const adjustedDate = dayjs.tz(formik.values.startDate, 'Asia/Ho_Chi_Minh').add(7, 'hour').toISOString();
    formik.setFieldValue('startDate', adjustedDate);
    console.log('startdate adjust', adjustedDate);
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
      voucherIds: formik.values.voucherIds,
    };
    try {
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
        setOpen(true);
      }

      navigate('/home/blog');
    } catch (error) {
      if (error.response.message) {
        setMsg(error.response.message);
      } else {
        setMsg('Th??ng tin chuy???n ??i ch??a h???p l???. Vui l??ng ki???m tra l???i');
      }
      setOpen(true);
      console.log(error);
    }
  };
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

  // render form create steps

  const steps = [
    {
      label: 'Nh???p ti??u ????? cho chuy???n ??i c???a b???n',
      description: (
        <TextField
          label="T??n c???a chuy???n ??i:"
          margin="normal"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          fullWidth
          required
          InputLabelProps={{
            shrink: true,
          }}
          className={classes.infoLocation}
        />
      ),
    },

    // Time for trip
    {
      label: 'Ch???n th???i gian c???a chuy???n ??i',
      description: (
        <>
          <Stack direction="row" sx={{ marginBottom: 2 }} justifyContent="flext-start" alignItems="center" spacing={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Formik
                // initialValues={{
                //   startDate: moment().format("DD/MM/YYYY HH:mm"),
                //   endDate: null,
                // }}
                validationSchema={DisplayingErrorMessagesSchema}
                onSubmit={(values, { setSubmitting }) => {
                  setTimeout(() => {
                    setSubmitting(false);
                    alert(JSON.stringify(values, null, 2));
                  }, 500);
                }}
              >
                {({ errors, touched, values }) => (
                  <Form>
                    <DateTimePicker
                      className={classes.customInput}
                      label="Ng??y b???t ?????u chuy???n ??i"
                      value={formik.values.startDate}
                      disablePast
                      name="startDate"
                      format="DD/MM/YYYY HH:mm"
                      onChange={(value) => {
                        formik.setFieldValue('startDate', value);
                      }}
                    />
                    {touched.startDate && errors.startDate && <div>{errors.startDate}</div>}
                    <DatePicker
                      disablePast
                      label="Ng??y k???t th??c chuy???n ??i"
                      className={classes.customInput}
                      value={formik.values.endDate}
                      name="endDate"
                      format="DD/MM/YYYY"
                      onChange={(value) => {
                        if (dayjs(value) >= formik.values.startDate) {
                          formik.setFieldValue('endDate', dayjs(value));
                        } else {
                          formik.setFieldValue('endDate', null);
                          setMsg('Ng??y k???t th??c chuy???n ??i ph???i b???ng ho???c sau ng??y xu???t ph??t');
                          setOpen(true);
                        }
                      }}
                      renderInput={(params) => <TextField size="small" {...params} sx={{ width: '100%' }} />}
                    />
                  </Form>
                )}
              </Formik>
            </LocalizationProvider>
          </Stack>
        </>
      ),
    },
    // Start Location
    {
      label: 'Th??ng tin ?????a ??i???m b???t ?????u',
      description: (
        <Stack>
          <TextField
            label="T??n ?????a ??i???m b???t ?????u:"
            margin="normal"
            name="startLocation.name"
            value={formik.values.startLocation.name}
            onChange={formik.handleChange}
            fullWidth
            required
            InputLabelProps={{
              shrink: true,
            }}
            className={classes.infoLocation}
          />
          <TextField
            label="S??? ??i???n thoai"
            name="startLocation.phoneNum"
            value={formik.values.startLocation.phoneNum}
            onChange={formik.handleChange}
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
              label="S??? nh??"
              name="startLocation.addressNum"
              value={formik.values.startLocation.addressNum}
              onChange={formik.handleChange}
              required
              className={classes.infoLocation}
              fullWidth
              sx={{ marginRight: '30px' }}
            />
            <FormControl fullWidth margin="normal" className={classes.infoLocation}>
              <InputLabel required id="province-label">
                T???nh/ Th??nh ph???
              </InputLabel>
              <Select
                labelId="province-label"
                displayEmpty
                name="startLocation.province"
                value={formik.values.startLocation.province}
                onChange={handleStartProvinceChange}
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
                Qu???n/ Huy???n
              </InputLabel>
              <Select
                labelId="district-label"
                name="startLocation.district"
                value={formik.values.startLocation.district}
                displayEmpty
                onChange={handleStartDistrictChange}
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
                Ph?????ng/ X??
              </InputLabel>
              <Select
                labelId="ward-label"
                name="startLocation.ward"
                value={formik.values.startLocation.ward}
                onChange={formik.handleChange}
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
              Lo???i ?????a ??i???m
            </InputLabel>
            <Select name="startLocation.type" value={formik.values.startLocation.type} onChange={formik.handleChange}>
              {startLocationTypeDisplay.length > 0 &&
                startLocationTypeDisplay.map((type, _index) => {
                  return (
                    <MenuItem key={type} value={type}>
                      <div style={{ paddingLeft: 10 }}>{type}</div>
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
          <TextField
            label="M?? t??? ??i???m xu???t ph??t"
            margin="normal"
            name="startLocation.description"
            value={formik.values.startLocation.description}
            onChange={formik.handleChange}
            fullWidth
            className={classes.infoLocation}
          />
        </Stack>
      ),
    },
    // End Location
    {
      label: 'Th??ng tin ?????a ??i???m k???t th??c',
      description: (
        <Stack>
          <TextField
            label="T??n ?????a ??i???m k???t th??c:"
            margin="normal"
            name="endLocation.name"
            value={formik.values.endLocation.name}
            onChange={formik.handleChange}
            fullWidth
            required
            InputLabelProps={{
              shrink: true,
            }}
            className={classes.infoLocation}
          />
          <TextField
            label="S??? ??i???n thoai"
            name="endLocation.phoneNum"
            value={formik.values.endLocation.phoneNum}
            onChange={formik.handleChange}
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
              label="S??? nh??"
              name="endLocation.addressNum"
              value={formik.values.endLocation.addressNum}
              onChange={formik.handleChange}
              className={classes.infoLocation}
              required
              fullWidth
              sx={{ marginRight: '30px' }}
            />
            <FormControl fullWidth margin="normal" className={classes.infoLocation}>
              <InputLabel required id="province-label">
                T???nh/ Th??nh ph???
              </InputLabel>
              <Select
                labelId="province-label"
                displayEmpty
                name="endLocation.province"
                value={formik.values.endLocation.province}
                onChange={handleEndProvinceChange}
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
                Qu???n/ Huy???n
              </InputLabel>
              <Select
                labelId="district-label"
                name="endLocation.district"
                value={formik.values.endLocation.district}
                displayEmpty
                onChange={handleEndDistrictChange}
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
                Ph?????ng/ X??
              </InputLabel>
              <Select
                labelId="ward-label"
                name="endLocation.ward"
                value={formik.values.endLocation.ward}
                onChange={formik.handleChange}
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
              Lo???i ?????a ??i???m
            </InputLabel>
            <Select name="endLocation.type" value={formik.values.endLocation.type} onChange={formik.handleChange}>
              {endLocationTypeDisplay.length > 0 &&
                endLocationTypeDisplay.map((type, _index) => {
                  return (
                    <MenuItem key={type} value={type}>
                      <div style={{ paddingLeft: 10 }}>{type}</div>
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
          <TextField
            label="M?? t??? ??i???m ?????n"
            name="endLocation.description"
            value={formik.values.endLocation.description}
            onChange={formik.handleChange}
            margin="normal"
            fullWidth
            className={classes.infoLocation}
          />
        </Stack>
      ),
    },
    // trip description
    {
      label: 'M?? t??? cho chuy???n ??i c???a b???n',
      description: (
        <>
          <TextField
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            label="M?? t??? v??? chuy???n ??i c???a b???n"
            margin="normal"
            fullWidth
          />
          <Stack direction="row" spacing={4} alignItems="center" sx={{ marginTop: '20px', marginBottom: '20px' }}>
            <InputLabel htmlFor="standard-adornment-amount">Ti???n ?????t c???c</InputLabel>
            <CurrencyInput
              customInput={TextField}
              name="deposit"
              variant="outlined"
              decimalsLimit={2}
              value={formik.values.deposit}
              onValueChange={(value, name) => formik.setFieldValue(name, value)}
              InputProps={{
                startAdornment: <span style={{ paddingRight: '10px' }}>VN??</span>,
              }}
            />
          </Stack>
          <Stack direction="row" spacing={5} alignItems="center" sx={{ marginTop: '20px', marginBottom: '20px' }}>
            <InputLabel>S??? ng?????i tham gia</InputLabel>
            <OutlinedInput
              name="minMember"
              value={formik.values.minMember}
              onChange={formik.handleChange}
              required
              id="standard-adornment-amount"
              startAdornment={<InputAdornment position="start">T???</InputAdornment>}
            />
            <OutlinedInput
              name="maxMember"
              value={formik.values.maxMember}
              onChange={formik.handleChange}
              required
              id="standard-adornment-amount"
              startAdornment={<InputAdornment position="start">?????n</InputAdornment>}
            />
          </Stack>
        </>
      ),
    },
    {
      label: 'Th??m h??nh ???nh m?? t??? cho chuy???n ??i',
      description: (
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
      ),
    },
    // Choose Voucher for trip
    {
      label: 'Ch???n phi???u gi???m gi?? cho chuy???n ??i c???a b???n',
      description: <></>,
    },
  ];

  return (
    <>
      <Helmet>
        <title> C??c Ph?????t </title>
      </Helmet>
      <Snackbar open={open} anchorOrigin={{ vertical, horizontal }} autoHideDuration={2000} onClose={handleClose}>
        <Alert variant="outlined" onClose={handleClose} sx={{ width: '100%' }} severity="success">
          <strong>T???o chuy???n ??i th??nh c??ng</strong>
        </Alert>
      </Snackbar>
      {msg && (
        <Snackbar open={open} anchorOrigin={{ vertical, horizontal }} autoHideDuration={2000} onClose={handleClose}>
          <Alert variant="outlined" onClose={handleClose} sx={{ width: '100%' }} severity="error">
            <strong>{msg}</strong>
          </Alert>
        </Snackbar>
      )}
      {/* <Formik>
        {(formilProps) => {
          return ( */}
      <Container maxWidth="xl" className={classes.root}>
        <Paper className={classes.trip}>
          <Typography variant="h3" component="h1" className={classes.title}>
            T???o chuy???n ??i m???i
          </Typography>
          <Box sx={{ minWidth: 800 }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel optional={index === 6 ? <Typography variant="caption">B?????c cu???i</Typography> : null}>
                    {step.label}
                  </StepLabel>
                  <StepContent>
                    <Typography>{step.description}</Typography>
                    <Box sx={{ mb: 2 }}>
                      <div>
                        <LoadingButton
                          className={classes.button}
                          variant="contained"
                          onClick={handleNext}
                          sx={{ mt: 1, mr: 1, marginTop: '30px' }}
                        >
                          {index === steps.length - 1 ? 'K???t th??c' : 'Ti???p t???c'}
                        </LoadingButton>
                        <LoadingButton
                          disabled={index === 0}
                          onClick={handleBack}
                          sx={{ mt: 1, mr: 1, marginTop: '30px' }}
                        >
                          Quay l???i
                        </LoadingButton>
                      </div>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length && (
              <Paper square elevation={0} sx={{ p: 3 }}>
                <Typography>??i???n th??ng tin ho??n th??nh, b???n c?? th??? nh???n x??c nh???n ????? t???o chuy???n ??i</Typography>
                <LoadingButton className={classes.button} onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                  ??i???n l???i th??ng tin
                </LoadingButton>
              </Paper>
            )}
          </Box>
          <LoadingButton
            className={classes.button}
            sx={{ marginTop: '30px' }}
            fullWidth
            size="small"
            type="submit"
            variant="contained"
            onClick={handleSubmit}
          >
            T???o chuy???n ??i
          </LoadingButton>
        </Paper>
      </Container>
      {/* );
        }} */}
      {/* </Formik> */}
    </>
  );
};

export default CreateTrip;
