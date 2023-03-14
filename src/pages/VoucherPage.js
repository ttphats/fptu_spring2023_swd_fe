import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Pagination from '@mui/material/Pagination';
import Grid from '@mui/material/Grid';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import Iconify from '../components/iconify';
import { VoucherSort, VoucherList, VoucherCartWidget, VoucherFilterSidebar } from '../sections/@dashboard/voucher';

export default function VoucherPage() {
  const navigate = useNavigate();
  const [openFilter, setOpenFilter] = useState(false);
  const currentUser = useSelector((state) => state.user.current);
  const [vouchers, setVouchers] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    async function fetchVouchers() {
      try {
        if (!currentUser) {
          navigate('/login');
          return;
        }
        const response = await axios.get(`https://hqtbe.site/api/v1/vouchers?page=${page}&size=${size}&sortBy=id&sortType=asc`, {
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
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Tất cả phiếu giảm giá hiện có
          </Typography>
          {currentUser?.role === 'ADMIN' ? (
            <LoadingButton onClick={() => navigate('/voucher')} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Tạo ưu đãi mới
            </LoadingButton>
          ) : null}
        </Stack>
        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <VoucherFilterSidebar openFilter={openFilter} onOpenFilter={handleOpenFilter} onCloseFilter={handleCloseFilter} />
            <VoucherSort />
          </Stack>
        </Stack>
        {Array.isArray(vouchers) ? (
          <Container>
            <VoucherList vouchers={vouchers} />
            <br/>
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
