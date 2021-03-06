import React from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import firebase from 'firebase/app';
import 'firebase/auth';
import {getFirestoreUserData} from '../../firebase/auth';
import LogoutButton from '../login/LogoutButton';
import { USER } from '../../translations/messages';

import './UserControls.scss';

import {
  initiateUserDetailsCall,
  addCustomUserData,
  clearUser,
} from '../../dux/user';



class UserControls extends React.Component {
  constructor(props) {
    super(props);

    this.determineUserState = this.determineUserState.bind(this);
    this.clearUser = this.clearUser.bind(this);
    this.setUser = this.setUser.bind(this);
  }

  componentDidMount() {
    const cookies = new Cookies();
    // Create Firebase authorization ovbservable, do a thing if it changes
     const userEmailCookieExist = cookies.get('messengerUser');
    if (userEmailCookieExist) {
      console.log('user exists, watch authentication object');
      firebase.auth().onAuthStateChanged((user) => {
        if (user && !this.props.isCreatingUser && !this.props.isFetchingUserData) {
          this.setUser(user);
        } else {
          this.clearUser();
        }
      });
    } else {
      console.log('no user!');
    }
  }

  setUser(user){
    this.props.initiateUserDetailsCall();
    let accountSource = 'email';
    let userID = '';
    if (user && user.providerData[0]) {
      accountSource = user.providerData[0].providerId;
    }
    if (user && user.email && (user.id || user.l)){
      if (user.l) {
        userID = user.l
      }
    }
    this.props.addCustomUserData(user, accountSource, userID);
    if (user && this.props.haveUser) {
      getFirestoreUserData(user.uid, accountSource, user.uid);
    }
  }



  clearUser(){
    const cookies = new Cookies();
    this.props.clearUser();
    cookies.remove('messengerUser');
    cookies.remove('messengerUserId');
    cookies.remove('messengerUserRole');
  }


  determineUserState(user){
    const accountSource = "email";
    this.props.addCustomUserData(user);
    if (user && !this.props.isCreatingUser) {
      console.log(user.uid, accountSource, user.uid);
    }
  }


  render() {
    return (
      <div className="user-controls">
        { this.props.user
          && this.props.haveUser
          && (
            <span className="user-id">
              { this.props.intl.formatMessage(USER.HELLO) }
              &nbsp;
              { this.props.user.id }
              <br />
              { this.props.user.email }
              <LogoutButton />
            </span>
          )
        }
        { !this.props.haveUser
          && (
            <ul className="no-user">
              <li>
                <Link to="/signup">Signup</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <LogoutButton />
              </li>
            </ul>
          )
        }
      </div>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  user: user.user,
  userCreated: user.userCreated,
  accountSource: user.accountSource,
  isCreatingUser: user.isCreatingUser,
  isFetchingUserData: user.isFetchingUserData,
  haveToken: user.haveToken,
  haveUser: user.haveUser,
});

const mapDispatchToProps = dispatch => ({
  initiateUserDetailsCall: () => dispatch(initiateUserDetailsCall()),
  addCustomUserData: (user, accountSource) => dispatch(addCustomUserData(user, accountSource)),
  clearUser: () => dispatch(clearUser()),
});

UserControls.propTypes = {
  intl: intlShape.isRequired,
  user: PropTypes.shape({
    accountSource: PropTypes.string,
    email: PropTypes.string,
    id: PropTypes.string,
    role:  PropTypes.shape({
      isAdmin: PropTypes.bool,
      isPropertyManager: PropTypes.bool,
      isStaff: PropTypes.bool
    })
  }),
  isCreatingUser: PropTypes.bool.isRequired,
  isFetchingUserData: PropTypes.bool.isRequired,
  haveUser: PropTypes.bool.isRequired,
  initiateUserDetailsCall: PropTypes.func.isRequired,
  addCustomUserData: PropTypes.func.isRequired,
  clearUser: PropTypes.func.isRequired,
};

UserControls.defaultProps = {
  user: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(injectIntl(UserControls));
