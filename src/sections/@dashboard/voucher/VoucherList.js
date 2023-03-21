import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Grid } from '@mui/material';
import VoucherCard from './VoucherCard';

VoucherList.propTypes = {
  vouchers: PropTypes.array.isRequired,
};

export default function VoucherList({ vouchers = [], ...other }) {
  const currentUser = useSelector((state) => state.user.current);
  if (!Array.isArray(vouchers)) {
    return <div>Error: Vouchers is not an array</div>;
  }

  return (
    <Grid container spacing={3} {...other}>
      {vouchers
        .filter((voucher) => currentUser.role === 'ADMIN' || voucher.status === 'ACTIVE')
        .map((voucher) => (
          <Grid key={voucher.id} item xs={12} sm={8} md={4}>
            <VoucherCard voucher={voucher} />
          </Grid>
        ))}
    </Grid>
  );
}






