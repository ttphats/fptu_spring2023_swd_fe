import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import Iconify from '../components/iconify';
import { VoucherSort, VoucherList, VoucherCartWidget, VoucherFilterSidebar } from '../sections/@dashboard/voucher';

export default function VoucherPage() {
  const navigate = useNavigate();
  const [openFilter, setOpenFilter] = useState(false);
  const currentUser = useSelector((state) => state.user.current);
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    async function fetchVouchers() {
      try {
        const response = await axios.get('https://hqtbe.site/api/v1/vouchers/getAllVoucher?page=1&size=10&sortBy=id&sortType=asc', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        });
        setVouchers(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchVouchers();
  }, []);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
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
          {currentUser.role === 'ADMIN' ? (
            <LoadingButton onClick={() => navigate('/voucher')} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Tạo ưu đãi mới
            </LoadingButton>
          ) : (
            <></>
          )}
        </Stack>
        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <VoucherFilterSidebar openFilter={openFilter} onOpenFilter={handleOpenFilter} onCloseFilter={handleCloseFilter} />
            <VoucherSort />
          </Stack>
        </Stack>
        <VoucherList vouchers={vouchers} />
      </Container>
    </>
  );
}
