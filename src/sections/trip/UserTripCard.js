import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Avatar, Typography, CardContent } from '@mui/material';
import { Icon } from '@iconify/react';
import dayjs from 'dayjs';
// utils
import { fDate } from '../../utils/formatTime';
//
import SvgColor from '../../components/svg-color';
import Iconify from '../../components/iconify';
import tripApi from '../../api/tripApi';

// ----------------------------------------------------------------------

const StyledCardMedia = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% * 3 / 4)',
});

const StyledTitle = styled('div')({
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
  marginTop: theme.spacing(1),
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

UserTripCard.propTypes = {
  post: PropTypes.object.isRequired,
  index: PropTypes.number,
};

export default function UserTripCard({ post, index }) {
  const currentUser = useSelector((state) => state.user.current);
  const { title, view, comment, share, author, createdAt } = post;
  const latestPostLarge = index === 0;
  const latestPost = index === 1 || index === 2;
  const [open, setOpen] = useState(false);

  return (
    <Grid item xs={12} sm={8} md={6}>
      <Link
        to={{
          pathname: `/trip/${post.id}`,
        }}
        state={{ postId: post.id }}
        style={{ textDecoration: 'none' }}
      >
        <Card
          sx={{
            '&:hover': {
              cursor: 'pointer',
            },
            position: 'relative',
          }}
        >
          <StyledCardMedia>
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
              }}
            />
            <StyledAvatar
              alt="avatar"
              src={
                !post?.host.avatarUrl
                  ? 'https://media-cdn-v2.laodong.vn/storage/newsportal/2017/8/28/551691/Du-Lich_1.jpg'
                  : post.host.avatarUrl
              }
            />

            <StyledCover
              alt={title}
              src={
                post.imageUrls[0]
                  ? post.imageUrls[0]
                  : 'https://daihoc.fpt.edu.vn/wp-content/uploads/2021/12/fpt-hinh-1-thumbnail-1618982244543115484692-768x432.png'
              }
            />
          </StyledCardMedia>

          <CardContent>
            <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
              {dayjs.tz(post.postDate, 'Asia/Ho_Chi_Minh').format('DD/MM/YYYY')}
            </Typography>
            <StyledTitle
              color="inherit"
              variant="subtitle2"
              underline="hover"
              sx={{
                fontWeight: 'bold',
              }}
            >
              {!post?.name ? 'Đã bao lâu rồi chúng ta chưa có dịp đi chơi cùng nhau' : post.name}
            </StyledTitle>

            <StyledTitle
              color="inherit"
              variant="body2"
              underline="hover"
              sx={{
                fontSize: 13,
              }}
            >
              <Icon icon="simple-line-icons:calender" /> &nbsp;
              {post.startDate && post.endDate
                ? `${dayjs.tz(post.startDate, 'Asia/Ho_Chi_Minh').format('DD/MM/YYYY')} - ${dayjs(post.endDate).format('DD/MM/YYYY')} `
                : ''}
            </StyledTitle>

            <StyledTitle
              color="inherit"
              variant="subtitle2"
              underline="hover"
            >
              <Icon icon="ic:outline-location-on" />
              {post.startLocation.name ? post.startLocation.name : ''}
              &nbsp; &nbsp;
              <Icon icon="mdi:location-radius-outline" />
              {post.endLocation.name ? post.endLocation.name : ''}
            </StyledTitle>

            {post.currentMember === post.maxMember || post.currentMember > post.maxMember ? (
              <StyledInfo>
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    ml: index === 0 ? 0 : 1.5,
                  }}
                >
                  <Iconify icon="mdi:user-group" sx={{ width: 16, height: 16, mr: 0.5, color: '#F94A29' }} />
                  <Typography sx={{ color: '#F94A29' }} variant="caption">
                    {post.currentMember} / {post.maxMember}
                  </Typography>
                </Box>
              </StyledInfo>
            ) : (
              <StyledInfo>
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    ml: index === 0 ? 0 : 1.5,
                  }}
                >
                  <Iconify icon="mdi:user-group" sx={{ width: 16, height: 16, mr: 0.5, color: '#39B5E0' }} />
                  <Typography sx={{ color: '#39B5E0' }} variant="caption">
                    {post.currentMember} / {post.maxMember}
                  </Typography>
                </Box>
              </StyledInfo>
            )}

            {post.status === 'UPCOMING' ? (
              <StyledInfo sx={{ justifyContent: 'flex-end' }}>
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    ml: index === 0 ? 0 : 1.5,
                  }}
                >
                  <Iconify icon="pajamas:status-active" sx={{ width: 16, height: 16, mr: 0.5, color: '#84D2C5' }} />
                  <Typography sx={{ color: '#84D2C5' }} variant="caption">
                    Sắp diễn ra
                  </Typography>
                </Box>
              </StyledInfo>
            ) : (
              <></>
            )}
            {post.status === 'IN_PROGRESS' ? (
              <StyledInfo sx={{ justifyContent: 'flex-end' }}>
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    ml: index === 0 ? 0 : 1.5,
                  }}
                >
                  <Iconify icon="pajamas:status-active" sx={{ width: 16, height: 16, mr: 0.5, color: '#FF6E31' }} />
                  <Typography sx={{ color: '#FF6E31' }} variant="caption">
                    Đang diễn ra
                  </Typography>
                </Box>
              </StyledInfo>
            ) : (
              <></>
            )}
            {post.status === 'COMPLETED' ? (
              <StyledInfo sx={{ justifyContent: 'flex-end' }}>
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    ml: index === 0 ? 0 : 1.5,
                  }}
                >
                  <Iconify icon="pajamas:status-active" sx={{ width: 16, height: 16, mr: 0.5, color: '#F55050' }} />
                  <Typography sx={{ color: '#F55050' }} variant="caption">
                    Đã kết thúc
                  </Typography>
                </Box>
              </StyledInfo>
            ) : (
              <></>
            )}
            {post.status === 'DELAY' ? (
              <StyledInfo sx={{ justifyContent: 'flex-end' }}>
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    ml: index === 0 ? 0 : 1.5,
                  }}
                >
                  <Iconify icon="pajamas:status-active" sx={{ width: 16, height: 16, mr: 0.5, color: '#FEC868' }} />
                  <Typography sx={{ color: '#FEC868' }} variant="caption">
                    Tạm hoãn
                  </Typography>
                </Box>
              </StyledInfo>
            ) : (
              <></>
            )}
          </CardContent>
        </Card>
      </Link>
    </Grid>
  );
}
