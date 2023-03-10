import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// @mui
import { Grid, Button, Container, Stack, Typography } from '@mui/material';
// components
import Iconify from '../components/iconify';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../sections/@dashboard/blog';
// mock
import POSTS from '../_mock/blog';
import tripApi from '../api/tripApi';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Mới nhất' },
  { value: 'popular', label: 'Phổ biến' },
  { value: 'oldest', label: 'Cũ nhất' },
];

// ----------------------------------------------------------------------

export default function BlogPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await tripApi.getAllTrips();
        setTrips(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  const myData = [].concat(trips)
    .sort((a, b) => a.postDate < b.postDate ? 1 : -1)
    .map((item, i) => 
    <BlogPostCard key={item.id} post={item} index={i} />
    );

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
          <Button onClick={() => navigate('/trip')} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Tạo chuyến đi mới
          </Button>
        </Stack>

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <BlogPostsSearch posts={POSTS} />
          <BlogPostsSort options={SORT_OPTIONS} />
        </Stack>

        <Grid container spacing={3}>
          {/* {trips.map((post, index) => (
            <BlogPostCard key={post.id} post={post} index={index} />
          ))} */}
          {myData}
        </Grid>
      </Container>
    </>
  );
}
