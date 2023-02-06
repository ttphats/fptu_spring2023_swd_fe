import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import { Container, Stack, Typography } from '@mui/material';
// components
import { VoucherSort, VoucherList, VoucherCartWidget, VoucherFilterSidebar } from '../sections/@dashboard/voucher';
// mock
import VOUCHERS from '../_mock/vouchers';

// ----------------------------------------------------------------------

export default function VoucherPage() {
  const [openFilter, setOpenFilter] = useState(false);

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
        <Typography variant="h4" sx={{ mb: 5 }}>
          Tất cả phiếu giảm giá hiện có
        </Typography>

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

        <VoucherList vouchers={VOUCHERS} />
        <VoucherCartWidget />
      </Container>
    </>
  );
}
