import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Stack, Typography, InputAdornment, OutlinedInput } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import Pagination from '@mui/material/Pagination';
import Grid from '@mui/material/Grid';
import { filter } from 'lodash';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import Iconify from '../components/iconify';
import { VoucherSort, VoucherList, VoucherCartWidget, VoucherFilterSidebar } from '../sections/@dashboard/voucher';


const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 320,
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

function applySortFilter(array, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  if (query) {
    return filter(array, (_trip) => {
      if (_trip.name !== null) {
        console.log(_trip)
        return _trip.name?.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
          _trip.description?.toLowerCase().indexOf(query.toLowerCase()) !== -1;
      }
      return false;
    });
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function VoucherPage() {
  const navigate = useNavigate();
  const [openFilter, setOpenFilter] = useState(false);
  const currentUser = useSelector((state) => state.user.current);
  const [vouchers, setVouchers] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(200);
  const [totalPages, setTotalPages] = useState(0);
  const [filterName, setFilterName] = useState('');

  const filteredVouchers = applySortFilter(vouchers, filterName);
  const isNotFound = !filteredVouchers.length && !!filterName;

  useEffect(() => {
    async function fetchVouchers() {
      try {
        if (!currentUser) {
          navigate('/login');
          return;
        }
        const response = await axios.get(`https://hqtbe.site/api/v1/vouchers?page=1&size=50&sortType=desc`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        });
        setVouchers(response.data.data);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error(error);
      }
    }

    fetchVouchers();
  }, [currentUser, page, size]);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <>
      <Helmet>
        <title> Cóc Phượt </title>
      </Helmet>
      <Container>
        <StyledSearch
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          placeholder="Tìm phiếu giảm giá..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          }
        />
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Tất cả phiếu giảm giá hiện có
          </Typography>
          {currentUser.role === 'ADMIN' ? (
            <LoadingButton
              onClick={() => navigate('/voucher/create')}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Tạo ưu đãi mới
            </LoadingButton>
          ) : null}
        </Stack>
        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <VoucherFilterSidebar
              openFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <VoucherSort />
          </Stack>
        </Stack>
        {Array.isArray(filteredVouchers) ? (
          <Container>
            <VoucherList vouchers={filteredVouchers} />
            <br />
            <Grid xs display="flex" justifyContent="center" alignItems="center">
              <Pagination color="primary" count={totalPages} page={page} onChange={handlePageChange} />
            </Grid>
          </Container>
        ) : (
          <div>Loading...</div>
        )}
      </Container>
    </>
  );
}
