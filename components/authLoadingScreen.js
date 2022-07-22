import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { connect } from 'react-redux';
import { login } from '../actions/auth';
import { getTokenFailure, getTokenSuccess, noLoginStored } from '../actions/auth';

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._getLoginInfoAsync();
  }


  // Fetch the token from storage then navigate to our appropriate place
  _getLoginInfoAsync = async () => {
    const { dispatch } = this.props
    let userToken = false;
    const username = await SecureStore.getItemAsync('username');
    const password = await SecureStore.getItemAsync('password');
    if (username && password) {
      console.log('THE SecureStore CALL SUCCEEDED')
      console.log('THE STORED LOGIN INFO IS:____________', username, password)
      try {
        let response = await fetch(
          `http://${username}:${password}@45.79.227.26/api/tokens`, {
          method: 'POST'
        });
        let responseJSON = await response.json();
        console.log('This is the login response:    ', responseJSON);
        let token = responseJSON.token;
        dispatch(login(username, password, token));
      } catch (error) {
        console.log('This is the failed login error:    ', error);
        dispatch(getTokenFailure(error))
      }
    } else {
      userToken = false
      console.log('THE SecureStore CALL FOUND NO STORED LOGIN CREDENTIALS')
      dispatch(noLoginStored())
    }

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    //this.props.navigation.navigate(userToken ? 'App' : 'Login');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
    return {
      token: state.auth.token,
    };
}


export default connect(mapStateToProps)(AuthLoadingScreen);

const styles = StyleSheet.create ({
   container: {
      padding: 5,
      marginTop: 3,
      backgroundColor: '#d9f9b1',
      alignItems: 'center',
   },
   text: {
      color: '#4f603c'
   }
})
