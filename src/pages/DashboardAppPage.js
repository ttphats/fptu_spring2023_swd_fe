import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import Iconify from '../components/iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';
import adminApi from '../api/adminApi';
import tripApi from '../api/tripApi';
import LoadingSpinner from '../components/loading/LoadingSpinner';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user);
  const [name, setName] = useState();
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [vouchersInactive, setVouchersInactive] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postDates, setPostDates] = useState([]);
  const [tripsCompleted, setTripsCompleted] = useState([]);
  const [tripsUpComing, setTripsUpComing] = useState([]);
  const [tripsInProgress, setTripsInProgress] = useState([]);
  const [upcomingTripsLength, setUpcomingTripsLength] = useState([]);
  const [inprogressTripsLength, setInProgressTripsLength] = useState([]);
  const [completedTripsLength, setCompletedTripsLength] = useState([]);
  const [topProvinces, setTopProvinces] = useState([]);
  const [topProvincesValue, setTopProvincesValue] = useState([]);
  const [voucherQuantity, setVoucherQuantity] = useState();

  useEffect(() => {
    fetchUser();
    fetchTrip();
    fetchVoucher();
    fetchDestination();
    setLoading(false);
  }, []);

  async function fetchUser() {
    const users = await adminApi.getListUser();
    setUsers(users.data);
  }

  async function fetchTrip() {
    const trips = await tripApi.getAllTrips('desc');
    setTrips(trips.data);
  }

  async function fetchVoucher() {
    const vouchers = await adminApi.getListVoucher();
    setVouchers(vouchers?.data);
  }

  async function fetchDestination() {
    const destinations = await adminApi.getDestinations();
    setTopProvinces(Object.keys(destinations?.data));
    setTopProvincesValue(Object.values(destinations?.data));
  }

  useEffect(() => {
    trips?.map((trip, _index) => {
      if (trip.status === 'UPCOMING') {
        setTripsUpComing((prev) => [...prev, trip]);
      }
      if (trip.status === 'IN_PROGRESS') {
        setTripsInProgress((prev) => [...prev, trip]);
      }
      if (trip.status === 'COMPLETED') {
        setTripsCompleted((prev) => [...prev, trip]);
      }
      return _index;
    });
    const grouped = groupBy(trips, (trip) => dayjs.tz(trip.postDate, 'Asia/Ho_Chi_Minh').format('MM/DD/YYYY'));
    const keys = [...grouped.keys()];
    setPostDates(keys.reverse());
    if (vouchers) {
      let quantity = 0;
      vouchers.map((voucher, _index) => {
        if (voucher.status === 'INACTIVE') {
          setVouchersInactive((prev) => [...prev, voucher]);
        }
        quantity += voucher.quantity;
        return _index;
      });
      setVoucherQuantity(quantity);
    }
  }, [trips]);

  useEffect(() => {
    const groupedTripsUpComing = groupBy(tripsUpComing, (trip) =>
      dayjs.tz(trip.postDate, 'Asia/Ho_Chi_Minh').format('MM/DD/YYYY')
    );
    const keysTripsUpComing = [...groupedTripsUpComing];
    const upcomings = keysTripsUpComing.reverse();
    postDates.some((postdate) => {
      const reps = upcomings.some((trip) => {
        if (trip[0] === postdate) {
          setUpcomingTripsLength((prev) => [...prev, trip[1].length]);
          return true;
        }
        return false;
      });

      if (!reps) {
        setUpcomingTripsLength((prev) => [...prev, 0]);
      }
      return false;
    });

    const groupedTripsInProgress = groupBy(tripsInProgress, (trip) =>
      dayjs.tz(trip.postDate, 'Asia/Ho_Chi_Minh').format('MM/DD/YYYY')
    );
    const keysTripsInProgress = [...groupedTripsInProgress];
    const inprogress = keysTripsInProgress.reverse();
    postDates.some((postdate) => {
      const reps = inprogress.some((trip) => {
        if (trip[0] === postdate) {
          setInProgressTripsLength((prev) => [...prev, trip[1].length]);
          return true;
        }
        return false;
      });

      if (!reps) {
        setInProgressTripsLength((prev) => [...prev, 0]);
      }
      return false;
    });

    const groupedTripsCompleted = groupBy(tripsCompleted, (trip) =>
      dayjs.tz(trip.postDate, 'Asia/Ho_Chi_Minh').format('MM/DD/YYYY')
    );
    const keysTripsCompleted = [...groupedTripsCompleted];
    const completeds = keysTripsCompleted.reverse();
    postDates.some((postdate) => {
      const reps = completeds.some((trip) => {
        if (trip[0] === postdate) {
          setCompletedTripsLength((prev) => [...prev, trip[1].length]);
          return true;
        }
        return false;
      });

      if (!reps) {
        setCompletedTripsLength((prev) => [...prev, 0]);
      }
      return false;
    });
  }, [tripsUpComing, tripsInProgress, tripsCompleted]);

  function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }

  useEffect(() => {
    if (localStorage.getItem('access-token')) {
      setName(userInfo.current.fullname);
    }
    if (userInfo.current.role !== 'ADMIN') {
      navigate('/home');
    }
  }, [localStorage.getItem('access-token'), userInfo]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <title> Cóc Phượt </title>
      </Helmet>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Xin chào {name}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Người dùng trong hệ thống"
              total={users?.length}
              color="info"
              icon={'emojione-monotone:motorcycle'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Chuyến đi" total={trips?.length} icon={'fluent:beach-16-filled'} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Phiếu giảm giá hiện có"
              total={voucherQuantity}
              color="warning"
              icon={'fluent:gift-card-money-20-filled'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Mã giảm giá vô hiệu hoá"
              total={vouchersInactive.length}
              color="error"
              icon={'ant-design:bug-filled'}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            {completedTripsLength && inprogressTripsLength && upcomingTripsLength && (
              <AppWebsiteVisits
                title="Trạng thái các chuyến đi"
                chartLabels={postDates}
                chartData={[
                  {
                    name: 'Thành công',
                    type: 'column',
                    fill: 'solid',
                    data: [...completedTripsLength],
                  },
                  {
                    name: 'Đang diễn ra',
                    type: 'area',
                    fill: 'gradient',
                    data: [...inprogressTripsLength],
                  },
                  {
                    name: 'Sắp diễn ra',
                    type: 'line',
                    fill: 'solid',
                    data: [...upcomingTripsLength],
                  },
                ]}
              />
            )}
          </Grid>
          {topProvinces.length > 0 && topProvincesValue.length > 0 && (
            <Grid item xs={12} md={6} lg={4}>
              <AppCurrentVisits
                title="Các điểm đến thu hút nhất"
                chartData={[
                  { label: `${topProvinces[0]}`, value: topProvincesValue[0] },
                  { label: `${topProvinces[1]}`, value: topProvincesValue[1] },
                  { label: `${topProvinces[2]}`, value: topProvincesValue[2] },
                  { label: `${topProvinces[3]}`, value: topProvincesValue[3] },
                ]}
                chartColors={[
                  theme.palette.primary.main,
                  theme.palette.info.main,
                  theme.palette.warning.main,
                  theme.palette.error.main,
                ]}
              />
            </Grid>
          )}
          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Tỷ lệ chuyển đổi"
              subheader="(+43%) so với tháng trước"
              chartData={[
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ]}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Tỷ lệ người dùng"
              chartLabels={['Bắc', 'Trung', 'Nam', 'Đông Nam Bộ', 'Tây Nam Bộ', 'Tây Nguyên']}
              chartData={[
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="Tin tức mới"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.jobTitle(),
                description: faker.name.jobTitle(),
                image: `/assets/images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Lịch trình báo cáo"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  '1983, orders, $4220',
                  '12 Invoices have been paid',
                  'Order #37745 from September',
                  'New order placed #XF-2356',
                  'New order placed #XF-2346',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Lượt truy cập mạng xã hội"
              list={[
                {
                  name: 'FaceBook',
                  value: 323234,
                  icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} />,
                },
                {
                  name: 'Google',
                  value: 341212,
                  icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} />,
                },
                {
                  name: 'Linkedin',
                  value: 411213,
                  icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} />,
                },
                {
                  name: 'Twitter',
                  value: 443232,
                  icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} />,
                },
              ]}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Công việc cần làm"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '5', label: 'Sprint Showcase' },
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
