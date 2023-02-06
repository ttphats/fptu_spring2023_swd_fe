// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.png`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Bảng điều khiển',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Người dùng',
    path: '/dashboard/user',
    icon: icon('ic_user'),
  },
  {
    title: 'Phiếu giảm giá',
    path: '/dashboard/voucher',
    icon: icon('ic_voucher'),
  },
  {
    title: 'Chuyến đi',
    path: '/dashboard/blog',
    icon: icon('ic_trip'),
  },
  {
    title: 'Đăng xuất',
    path: '/login',
    icon: icon('ic_logout'),
  },
  {
    title: 'Cài đặt',
    path: '/404',
    icon: icon('ic_setting'),
  },
];

export default navConfig;
