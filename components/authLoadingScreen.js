import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { getTokenFailure, getTokenSuccess, noLoginStored } from '../actions/auth';

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const { dispatch } = this.props
    let userToken = false;
    const userName = await AsyncStorage.getItem('userName');
    const userPassword = await AsyncStorage.getItem('userPassword');
    if (userName && userPassword) {
      return fetch(`https://${userName}:${userPassword}@192.168.0.11:5000/api/tokens`, {
        method: 'POST'
      })
        .then((response) => response.json())
        .then((responseJSON) => {
          (response.error) ? dispatch(getTokenFailure(responseJSON)) : dispatch(getTokenSuccess(responseJSON))
        })
    } else {
      userToken = false
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
