import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Box, Card, Typography, Stack, CardActions } from '@mui/material';
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import dayjs from 'dayjs';

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
  const locationName = voucher.location.name;
  const { id, name, imageUrl, price, description, status, quantity } = voucher;
  const currentUser = useSelector((state) => state.user.current);
  console.log(status);

  if (status === 'DELETE' || status === 'INACTIVE')
    return (
      <>
        {currentUser.role === 'ADMIN' ? (
          <Card sx={{ opacity: 0.5 }}>
            <Box sx={{ pt: '100%', position: 'relative' }}>
              <StyledVoucherImg alt={name} src={imageUrl} />
            </Box>

            <Stack spacing={2} sx={{ p: 3 }}>
              <Typography variant="subtitle1" noWrap>
                {name}
              </Typography>

              <Typography variant="body2" color="text.secondary" noWrap>
                {description}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {voucher?.startDate ? dayjs.tz(voucher.startDate, 'Asia/Ho_Chi_Minh').format('DD/MM/YYYY') : 'Không xác định'}
                - {voucher?.endDate ? dayjs.tz(voucher.endDate, 'Asia/Ho_Chi_Minh').format('DD/MM/YYYY') : 'Không xác định'}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                Số lượng còn lại: {quantity}
              </Typography>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle1">{locationName}</Typography>
                <Typography variant="subtitle1">{price} Xu</Typography>
              </Stack>

              <CardActions>
                <LoadingButton disabled>Không còn khả dụng</LoadingButton>
              </CardActions>
            </Stack>
          </Card>
        ) : null}
      </>
    );

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        <StyledVoucherImg alt={name} src={imageUrl} />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography variant="subtitle1" noWrap>
          {name}
        </Typography>

        <Typography variant="body2" color="text.secondary" noWrap>
          {description}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {voucher?.startDate ? dayjs.tz(voucher.startDate, 'Asia/Ho_Chi_Minh').format('DD/MM/YYYY') : 'Không xác định'}
          - {voucher?.endDate ? dayjs.tz(voucher.endDate, 'Asia/Ho_Chi_Minh').format('DD/MM/YYYY') : 'Không xác định'}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          Số lượng còn lại: {quantity}
        </Typography>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1">{locationName}</Typography>
          <Typography variant="subtitle1">{price} Xu</Typography>
        </Stack>

        <CardActions>
          <Link to={`/voucher/${id}`} style={{ textDecoration: 'none' }} variant="body2">
            <LoadingButton>Xem chi tiết</LoadingButton>
          </Link>
        </CardActions>
      </Stack>
    </Card>
  );
}
