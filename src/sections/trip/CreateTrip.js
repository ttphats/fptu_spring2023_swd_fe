import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
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
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import 'firebase/auth';
import addressApi from '../../api/addressApi';
import tripApi from '../../api/tripApi';

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

  const [open, setOpen] = useState(false);
  const { vertical, horizontal } = {
    vertical: 'top',
    horizontal: 'right',
  };

  const formik = useFormik({
    initialValues: {
      startDate: null,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = formik.values;
    try {
      const json = JSON.stringify(form);
      const blob = new Blob([json], {
        type: 'application/json',
      });

      const formData = new FormData();
      formData.append('images', fileUpload);
      formData.append('createTripRequestForm', blob);
      const response = await tripApi.createTrip(formData);
      if (response) {
        setOpen(true);
      }
    } catch (error) {
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
      label: 'Chọn thời gian của chuyến đi',
      description: (
        <>
          <Stack direction="row" sx={{ marginBottom: 2 }} justifyContent="flext-start" alignItems="center" spacing={2}>
            <Box>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  className={classes.customInput}
                  label="Ngày bắt đầu chuyến đi"
                  value={formik.values.startDate}
                  name="startDate"
                  format="DD/MM/YYYY"
                  onChange={(value) => {
                    formik.setFieldValue('startDate', dayjs(value));
                  }}
                />
              </LocalizationProvider>
            </Box>
            <Box>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Ngày kết thúc chuyến đi"
                  className={classes.customInput}
                  value={formik.values.endDate}
                  name="endDate"
                  format="DD/MM/YYYY"
                  onChange={(value) => {
                    formik.setFieldValue('endDate', dayjs(value));
                  }}
                />
              </LocalizationProvider>
            </Box>
          </Stack>
        </>
      ),
    },
    // Start Location
    {
      label: 'Thông tin địa điểm bắt đầu',
      description: (
        <Stack>
          <TextField
            label="Tên địa điểm bắt đầu:"
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
            label="Số điện thoai"
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
              label="Số nhà"
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
                Tỉnh/ Thành phố
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
                Quận/ Huyện
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
                Phường/ Xã
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
              Loại địa điểm
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
            label="Mô tả điểm xuất phát"
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
      label: 'Thông tin địa điểm kết thúc',
      description: (
        <Stack>
          <TextField
            label="Tên địa điểm kết thúc:"
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
            label="Số điện thoai"
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
              label="Số nhà"
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
                Tỉnh/ Thành phố
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
                Quận/ Huyện
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
                Phường/ Xã
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
              Loại địa điểm
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
            label="Mô tả điểm đến"
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
      label: 'Mô tả cho chuyến đi của bạn',
      description: (
        <>
          <TextField
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            label="Mô tả về chuyến đi của bạn"
            margin="normal"
            fullWidth
          />
          <Stack direction="row" spacing={4} alignItems="center" sx={{ marginTop: '20px', marginBottom: '20px' }}>
            <InputLabel htmlFor="standard-adornment-amount">Tiền đặt cọc</InputLabel>
            <CurrencyTextField
              label="Số tiền"
              variant="standard"
              name="deposit"
              value={formik.values.deposit}
              currencySymbol="VNĐ"
              minimumValue="0"
              outputFormat="string"
              decimalCharacter="."
              digitGroupSeparator=","
              onChange={formik.handleChange}
            />
          </Stack>
          <Stack direction="row" spacing={5} alignItems="center" sx={{ marginTop: '20px', marginBottom: '20px' }}>
            <InputLabel>Số người tham gia</InputLabel>
            <OutlinedInput
              name="minMember"
              value={formik.values.minMember}
              onChange={formik.handleChange}
              required
              id="standard-adornment-amount"
              startAdornment={<InputAdornment position="start">Từ</InputAdornment>}
            />
            <OutlinedInput
              name="maxMember"
              value={formik.values.maxMember}
              onChange={formik.handleChange}
              required
              id="standard-adornment-amount"
              startAdornment={<InputAdornment position="start">Đến</InputAdornment>}
            />
          </Stack>
        </>
      ),
    },
    {
      label: 'Thêm hình ảnh mô tả cho chuyến đi',
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
  ];

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
      {/* <Formik>
        {(formilProps) => {
          return ( */}
      <Container maxWidth="xl" className={classes.root}>
        <Paper className={classes.trip}>
          <Typography variant="h3" component="h1" className={classes.title}>
            Tạo chuyến đi mới
          </Typography>
          <Box sx={{ minWidth: 800 }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel optional={index === 4 ? <Typography variant="caption">Bước cuối</Typography> : null}>
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
                          {index === steps.length - 1 ? 'Kết thúc' : 'Tiếp tục'}
                        </LoadingButton>
                        <LoadingButton
                          disabled={index === 0}
                          onClick={handleBack}
                          sx={{ mt: 1, mr: 1, marginTop: '30px' }}
                        >
                          Quay lại
                        </LoadingButton>
                      </div>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length && (
              <Paper square elevation={0} sx={{ p: 3 }}>
                <Typography>Điền thông tin hoàn thành, bạn có thể nhấn xác nhận để tạo chuyến đi</Typography>
                <LoadingButton className={classes.button} onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                  Điền lại thông tin
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
            Tạo chuyến đi
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
