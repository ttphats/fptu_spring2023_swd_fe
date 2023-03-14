import PropTypes from 'prop-types';
import { Box, Card, Link, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledVoucherImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

VoucherCard.propTypes = {
  voucher: PropTypes.object,
};

export default function VoucherCard({ voucher }) {
  const { nameVoucher, image, priceVoucher, description, locationName } = voucher;

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        <StyledVoucherImg alt={nameVoucher} src={image} />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover">
          <Typography variant="subtitle2" noWrap>
            {nameVoucher}
          </Typography>
        </Link>

        <Typography variant="body2" color="text.secondary" noWrap>
          {description}
        </Typography>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1">{locationName}</Typography>
          <Typography variant="subtitle1">{priceVoucher} Xu</Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
