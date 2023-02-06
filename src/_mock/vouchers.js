import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const VOUCHER_NAME = [
  'Voucher Air Force 1 NDESTRUKT',
  'Voucher Space Hippie 04',
  'Voucher Air Zoom Pegasus 37 A.I.R. Chaz Bear',
  'Voucher Blazer Low 77 Vintage',
  'Voucher ZoomX SuperRep Surge',
  'Zoom Freak 2',
  'Voucher Air Max Zephyr',
  'Jordan Delta',
  'Air Jordan XXXV PF',
  'Voucher Waffle Racer Crater',
  'Kyrie 7 EP Sisterhood',
  'Voucher Air Zoom BB NXT',
  'Voucher Air Force 1 07 LX',
  'Voucher Air Force 1 Shadow SE',
  'Voucher Air Zoom Tempo NEXT%',
  'Voucher DBreak-Type',
  'Voucher Air Max Up',
  'Voucher Air Max 270 React ENG',
  'VoucherCourt Royale',
  'Voucher Air Zoom Pegasus 37 Premium',
  'Voucher Air Zoom SuperRep',
  'Voucher Court Royale',
  'Voucher React Art3mis',
  'Voucher React Infinity Run Flyknit A.I.R. Chaz Bear',
];
const PRODUCT_COLOR = ['#00AB55', '#000000', '#FFFFFF', '#FFC0CB', '#FF4842', '#1890FF', '#94D82D', '#FFC107'];

// ----------------------------------------------------------------------

const vouchers = [...Array(24)].map((_, index) => {
  const setIndex = index + 1;

  return {
    id: faker.datatype.uuid(),
    cover: `/assets/images/vouchers/voucher_${setIndex}.jpg`,
    name: VOUCHER_NAME[index],
    price: faker.datatype.number({ min: 4, max: 99, precision: 0.01 }),
    priceSale: setIndex % 3 ? null : faker.datatype.number({ min: 19, max: 29, precision: 0.01 }),
    colors:
      (setIndex === 1 && PRODUCT_COLOR.slice(0, 2)) ||
      (setIndex === 2 && PRODUCT_COLOR.slice(1, 3)) ||
      (setIndex === 3 && PRODUCT_COLOR.slice(2, 4)) ||
      (setIndex === 4 && PRODUCT_COLOR.slice(3, 6)) ||
      (setIndex === 23 && PRODUCT_COLOR.slice(4, 6)) ||
      (setIndex === 24 && PRODUCT_COLOR.slice(5, 6)) ||
      PRODUCT_COLOR,
    status: sample(['sale', 'new', '', '']),
  };
});

export default vouchers;
