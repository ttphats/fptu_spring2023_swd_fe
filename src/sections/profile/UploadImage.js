import React, { useState, createRef } from 'react';
import { useSelector } from 'react-redux';
// @mui
import AvatarEdit from 'react-avatar-edit';
import { Avatar } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import userProfileApi from '../../api/userProfileApi';

const UploadImage = () => {
  const userInfo = useSelector((state) => state.user);
  const [image, setImage] = useState([]);
  const [imageCrop, setImageCrop] = useState(false);
  const [dialog, setDialog] = useState(false);

  const fileRef = createRef();

  const onFileInputChange = (e) => {
    const file = e.target?.files?.[0];
    console.log('file', file);
    const formData = new FormData();
    formData.append('image', file);
    if (file) {
      userProfileApi.updateImageUrl(formData);
    }
  };

  const onCrop = (view) => {
    setImageCrop(view);
  };

  const onClose = () => {
    setImageCrop(null);
  };

  const handleClickOpen = () => {
    setDialog(true);
  };

  const handleClose = () => {
    setDialog(false);
  };

  const saveImage = () => {
    const fileElement = fileRef?.current;
    console.log(1, fileElement);
    setImage([...image, { imageCrop }]);
    setDialog(false);
  };

  const profileImageShow = image.map((item) => item.imageCrop);

  return (
    <>
      <Avatar
        alt=""
        src={profileImageShow.length ? profileImageShow[profileImageShow.length - 1] : userInfo.current.avatarUrl}
        sx={{ width: 200, height: 200 }}
        onClick={handleClickOpen}
      />
      <Dialog
        open={dialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Cập nhật ảnh đại diện'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <input
              type="file"
              style={{ display: 'none' }}
              ref={fileRef}
              onChange={onFileInputChange}
              accept="image/png,image/jpeg,image/gif"
            />
            <AvatarEdit
              ref={fileRef}
              width={390}
              height={295}
              onBeforeFileLoad={onFileInputChange}
              onCrop={onCrop}
              onClose={onClose}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Huỷ bỏ</Button>
          <Button type="submit" onClick={saveImage} autoFocus>
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UploadImage;
