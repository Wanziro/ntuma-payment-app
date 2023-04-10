import React from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../reducers';
import NotLoggedIn from './not-logged-in';
import LoggedIn from './logged-in';

const Navigation = () => {
  const {token} = useSelector((state: RootState) => state.user);
  return <>{String(token).trim() === '' ? <NotLoggedIn /> : <LoggedIn />}</>;
};

export default Navigation;
