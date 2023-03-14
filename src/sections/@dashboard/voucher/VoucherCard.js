import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, Card, Typography, Stack, CardActions } from '@mui/material';
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
  const { id, nameVoucher, imageUrl, priceVoucher, description, locationName } = voucher;

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        <StyledVoucherImg alt={nameVoucher} src={imageUrl} />
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

        <CardActions>
          <Link to={`/voucher/${id}`} variant="body2">
            Xem chi tiết
          </Link>
        </CardActions>
      </Stack>
    </Card>
  );
}
