import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { filter } from 'lodash';
import { styled, alpha } from '@mui/material/styles';
// @mui
import {
  Grid,
  Container,
  Stack,
  Typography,
  MenuItem,
  TextField,
  OutlinedInput,
  InputAdornment,
  Paper,
} from '@mui/material';
// components
import Iconify from '../components/iconify';
import { BlogPostCard } from '../sections/@dashboard/blog';
import tripApi from '../api/tripApi';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { name: 'Mới nhất', value: 'desc', label: 'Mới nhất' },
  { value: '', label: 'Phổ biến' },
  { name: 'Cũ nhất', value: 'asc', label: 'Cũ nhất' },
];

// ----------------------------------------------------------------------

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 320,
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

// -----------------------------------------------------------------
function applySortFilter(array, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  if (query) {
    return filter(array, (_trip) => {
      if (_trip.name !== null) {
        console.log(_trip);
        return (
          _trip.name?.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
          _trip.startLocation.name?.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
          _trip.endLocation.name?.toLowerCase().indexOf(query.toLowerCase()) !== -1
        );
      }
      return false;
    });
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function BlogPage() {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.current);
  const [trips, setTrips] = useState([]);
  const [sort, setSort] = useState('desc');
  const [filterName, setFilterName] = useState('');

  const filteredTrips = applySortFilter(trips, filterName);
  const isNotFound = !filteredTrips.length && !!filterName;
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await tripApi.getAllTrips(sort);
        setTrips(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  const handleSort = async (sort) => {
    const response = await tripApi.getAllTrips(sort);
    setSort(sort);
    setTrips(response.data);
    console.log(response);
  };

  return (
    <>
      <Helmet>
        <title> Cóc Phượt </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Tất cả chuyến đi
          </Typography>
          {currentUser.role !== 'ADMIN' ? (
            <LoadingButton
              sx={{
                backgroundColor: '#FF7300',
                '&:hover': {
                  backgroundColor: '#F2C6A5',
                  boxShadow: 'none',
                },
              }}
              onClick={() => navigate('/trip')}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Tạo chuyến đi mới
            </LoadingButton>
          ) : (
            <></>
          )}
        </Stack>

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <StyledSearch
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            placeholder="Tìm chuyến đi..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            }
          />
          <TextField select size="small" value={sort}>
            {SORT_OPTIONS.map((option) => (
              <MenuItem onClick={() => handleSort(option.value)} key={option.value} value={option.value}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        <Grid container spacing={3}>
          {filteredTrips.map((post, index) => (
            <BlogPostCard key={post.id} post={post} index={index} />
          ))}
        </Grid>
        {isNotFound && (
          <Paper
            sx={{
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" paragraph>
              Không tìm thấy kết quả
            </Typography>

            <Typography variant="body2">
              Không tìm thấy kết quả cho &nbsp;
              <strong>&quot;{filterName}&quot;</strong>.
              <br /> Vui lòng thử lại.
            </Typography>
          </Paper>
        )}
      </Container>
    </>
  );
}
