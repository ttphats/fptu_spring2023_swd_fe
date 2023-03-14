import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Nav from '../layouts/dashboard/nav';
import NavUser from '../layouts/dashboard/nav-user';
import CreateVoucher from '../sections/@dashboard/voucher/CreateVoucher'

const StyledRoot = styled('div')({
    display: 'flex',
    minHeight: '100%',
    overflow: 'hidden',
});

const CreateVoucherPage = () => {
    const currentUser = useSelector((state) => state.user.current);

    return (
        <StyledRoot>
            {currentUser.role === 'ADMIN' ? <Nav /> : <NavUser />}
            {currentUser.role === 'ADMIN' ? <CreateVoucher /> : <Navigate to="/dashboard" />}
        </StyledRoot>
    );
};

export default CreateVoucherPage;