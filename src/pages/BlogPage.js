import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
// @mui
import { Grid, Button, Container, Stack, Typography, MenuItem, TextField } from '@mui/material';
// components
import Iconify from '../components/iconify';
import { BlogPostCard, BlogPostsSearch } from '../sections/@dashboard/blog';
// mock
import POSTS from '../_mock/blog';
import tripApi from '../api/tripApi';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { name: 'Mới nhất', value: 'desc', label: 'Mới nhất' },
  { value: '', label: 'Phổ biến' },
  { name: 'Cũ nhất', value: 'asc', label: 'Cũ nhất' },
];

// ----------------------------------------------------------------------

export default function BlogPage() {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.current);
  const [trips, setTrips] = useState([]);
  const [sort, setSort] = useState('desc');

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
          <BlogPostsSearch posts={POSTS} />
          <TextField select size="small" value={sort}>
            {SORT_OPTIONS.map((option) => (
              <MenuItem onClick={() => handleSort(option.value)} key={option.value} value={option.value}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        <Grid container spacing={3}>
          {trips.map((post, index) => (
            <BlogPostCard key={post.id} post={post} index={index} />
          ))}
        </Grid>
      </Container>
    </>
  );
}
