import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Link, Card, Grid, Avatar, Typography, CardContent } from '@mui/material';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import ButtonBase from '@mui/material/ButtonBase';

// utils
import { fDate } from '../../../utils/formatTime';
import { fShortenNumber } from '../../../utils/formatNumber';
//
import SvgColor from '../../../components/svg-color';
import Iconify from '../../../components/iconify';
import tripApi from '../../../api/tripApi';

// ----------------------------------------------------------------------

const StyledCardMedia = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% * 3 / 4)',
});

const StyledTitle = styled(Link)({
  height: 44,
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  zIndex: 9,
  width: 32,
  height: 32,
  position: 'absolute',
  left: theme.spacing(3),
  bottom: theme.spacing(-2),
}));

const StyledInfo = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(3),
  color: theme.palette.text.disabled,
}));

const StyledCover = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

// ----------------------------------------------------------------------

BlogPostCard.propTypes = {
  post: PropTypes.object.isRequired,
  index: PropTypes.number,
};

export default function BlogPostCard({ post, index }) {
  const { title, view, comment, share, author, createdAt } = post;
  const latestPostLarge = index === 0;
  const latestPost = index === 1 || index === 2;
  const [host, setHost] = useState();
  const [open, setOpen] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const getUser = await tripApi.getTripMembers(post.id);
  //       getUser.data.map((mem, _index) => {
  //         if (mem.role === 'HOST') {
  //           setHost(mem.user);
  //         }
  //         return mem;
  //       });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   fetchData();
  // }, [post.id]);

  const handleJoinTrip = async () => {
    setOpenSnackBar(true);
    try {
      const response = await tripApi.joinTripById(post.id);
      console.log(response);
      setSuccessMsg(response.data.message);
    } catch (error) {
      setErrorMsg(error.response.data.message);
      console.log(error.response.data.message);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackBar(false);
    setOpen(false);
  };

  const POST_INFO = [
    { number: comment, icon: 'eva:message-circle-fill' },
    { number: view, icon: 'eva:eye-fill' },
    { number: share, icon: 'eva:share-fill' },
  ];

  return (
    <Grid item xs={12} sm={latestPostLarge ? 12 : 6} md={latestPostLarge ? 6 : 3}>
      {successMsg && (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert variant="filled"  onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            {successMsg}
          </Alert>
        </Snackbar>
      )}
      {errorMsg && (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert variant="filled"  severity="error">{errorMsg}</Alert>
        </Snackbar>
      )}

      <Card
        sx={{
          '&:hover': {
            cursor: 'pointer',
          },
          position: 'relative',
        }}
        onClick={handleClickOpen}
      >
        <StyledCardMedia
          sx={{
            ...((latestPostLarge || latestPost) && {
              pt: 'calc(100% * 4 / 3)',
              '&:after': {
                top: 0,
                content: "''",
                width: '100%',
                height: '100%',
                position: 'absolute',
                bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
              },
            }),
            ...(latestPostLarge && {
              pt: {
                xs: 'calc(100% * 4 / 3)',
                sm: 'calc(100% * 3 / 4.66)',
              },
            }),
          }}
        >
          <SvgColor
            color="paper"
            src="/assets/icons/shape-avatar.svg"
            sx={{
              width: 80,
              height: 36,
              zIndex: 9,
              bottom: -15,
              position: 'absolute',
              color: 'background.paper',
              ...((latestPostLarge || latestPost) && { display: 'none' }),
            }}
          />
          <StyledAvatar
            alt="avatar"
            src={
              !post?.host.avatarUrl
                ? 'https://bcp.cdnchinhphu.vn/Uploaded/duongphuonglien/2020_09_24/giai%20nhat%20thuyen%20hoa.jpg'
                : post.host.avatarUrl
            }
            sx={{
              ...((latestPostLarge || latestPost) && {
                zIndex: 9,
                top: 24,
                left: 24,
                width: 40,
                height: 40,
              }),
            }}
          />

          <StyledCover alt={title} src={post.imageUrls[0]} />
        </StyledCardMedia>

        <CardContent
          sx={{
            pt: 4,
            ...((latestPostLarge || latestPost) && {
              bottom: 0,
              width: '100%',
              position: 'absolute',
            }),
          }}
        >
          <Typography gutterBottom variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
            {fDate(post.postDate)}
          </Typography>

          <StyledTitle
            color="inherit"
            variant="subtitle2"
            underline="hover"
            sx={{
              ...(latestPostLarge && { typography: 'h5', height: 60 }),
              ...((latestPostLarge || latestPost) && {
                color: 'common.white',
              }),
            }}
          >
            {!post.description ? 'Đã bao lâu rồi chúng ta chưa có dịp đi chơi cùng nhau' : post.description}
          </StyledTitle>

          <StyledTitle
            color="inherit"
            variant="subtitle2"
            underline="hover"
            sx={{
              ...(latestPostLarge && { typography: 'p', height: 30 }),
              ...((latestPostLarge || latestPost) && {
                color: 'common.white',
              }),
            }}
          >
            {post.startDate && post.endDate ? `${fDate(post.startDate)} - ${fDate(post.endDate)} ` : ''}
          </StyledTitle>

          <StyledTitle
            color="inherit"
            variant="subtitle2"
            underline="hover"
            sx={{
              ...(latestPostLarge && { typography: 'p', height: 30 }),
              ...((latestPostLarge || latestPost) && {
                color: 'common.white',
              }),
            }}
          >
            {post.endLocation.address ? post.endLocation.address : ''}
          </StyledTitle>

          <StyledInfo>
            {POST_INFO.map((info, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  ml: index === 0 ? 0 : 1.5,
                  ...((latestPostLarge || latestPost) && {
                    color: 'grey.500',
                  }),
                }}
              >
                <Iconify icon={info.icon} sx={{ width: 16, height: 16, mr: 0.5 }} />
                <Typography variant="caption">{fShortenNumber(info.number)}</Typography>
              </Box>
            ))}
          </StyledInfo>
        </CardContent>
      </Card>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Chi tiết chuyến đi</DialogTitle>
        <DialogContent>
          <Paper
            sx={{
              p: 2,
              margin: 'auto',
              maxWidth: 900,
              flexGrow: 1,
              backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : '#fff'),
            }}
          >
            <Grid container spacing={2}>
              <Grid item>
                <Typography gutterBottom variant="h3" component="div">
                  {!post.description ? 'Đã bao lâu rồi chúng ta chưa có dịp đi chơi cùng nhau?' : post.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ngày đăng bài: {post.postDate ? fDate(post.postDate) : 'Không xác định'}
                </Typography>
              </Grid>
              <Grid item>
                <ButtonBase sx={{ width: 500, height: 500 }}>
                  <Img alt="complex" src={post.imageUrls[0]} />
                </ButtonBase>
              </Grid>
              <Grid item xs={12} sm container>
                <Grid item xs container direction="column" spacing={4}>
                  <Grid item xs>
                    <Typography gutterBottom variant="subtitle1" component="div">
                      Người tạo chuyến đi: <strong>{post?.host.fullname ? post.host.fullname : ''}</strong>
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Thông tin liên hệ:
                      <strong>
                        &nbsp;{post?.host.email}&nbsp;{post?.host.phoneNum ? `- ${post.host.phoneNum}` : ''}&nbsp;
                        {post?.host.address ? `- ${post.host.address}` : ''}{' '}
                      </strong>
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Địa điểm xuất phát:
                      <strong>
                        &nbsp;{post.startLocation.address} ({post.startLocation.type})
                      </strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tên địa điểm xuất phát: {post.startLocation.name ? post.startLocation.name : ''} - Mô tả:{' '}
                      {post.startLocation.description ? post.startLocation.description : ''}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Ngày khởi hành: <strong>{post.startDate ? fDate(post.startDate) : 'Chưa xác định'}</strong>
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Địa điểm đến:
                      <strong>
                        {post.endLocation.address} ({post.endLocation.type})
                      </strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tên địa điểm đến: {post.endLocation.name ? post.endLocation.name : ''} - Mô tả:{' '}
                      {post.endLocation.description ? post.endLocation.description : ''}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Ngày kết thúc: <strong>{post.endDate ? fDate(post.endDate) : 'Chưa xác định'}</strong>
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Số thành viên tham gia chuyến đi: Từ <strong>{post.minMember} </strong> Đến{' '}
                      <strong>{post.maxMember}</strong> người
                    </Typography>
                    <Typography variant="subtitle1" component="div">
                      Số tiền cần đặt cọc: {Intl.NumberFormat('en-US').format(post.deposit)} VNĐ
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Quay lại</Button>
          <Button onClick={handleJoinTrip}>Tham gia ngay</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
