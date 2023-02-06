import PropTypes from 'prop-types';
// @mui
import { Grid } from '@mui/material';
import ShopVoucherCard from './VoucherCard';

// ----------------------------------------------------------------------

VoucherList.propTypes = {
  vouchers: PropTypes.array.isRequired,
};

export default function VoucherList({ vouchers, ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {vouchers.map((voucher) => (
        <Grid key={voucher.id} item xs={12} sm={6} md={3}>
          <ShopVoucherCard voucher={voucher} />
        </Grid>
      ))}
    </Grid>
  );
}
