import firebase from 'firebase/compat/app';
// ----------------------------------------------------------------------

const account = {
  displayName: firebase.auth().currentUser.displayName,
  email: firebase.auth().currentUser.email,
  photoURL: '/assets/images/avatars/avatar_default.jpg',
};

export default account;
