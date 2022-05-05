import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { AsyncStorage } from "react-native";
import { login, submitLogin, loginSubmit, getTokenSuccess, getTokenFailure } from '../actions/auth';
import {
  white, my_green, green, gray4, red, purple, orange, blue, my_blue,
  lightPurp, black, pink
} from '../utils/colors'
import LoginForm from './loginForm'

const api = "http://45.79.227.26/catalog/mobilelogin/JSON"


class Login extends Component {



  render () {
    const { isLoggedIn, error, loginScreen } = this.props

      return (
          <ScrollView style={{padding: 20}}>
            <Text style={{fontSize: 27, color: my_green}}>{loginScreen ? "Log In" : "Sign Up"}</Text>
            <LoginForm  loginScreen={loginScreen ? true : false} />
          </ScrollView>
      );
  }
}


const mapStateToProps = (state, ownProps) => {
    return {
        isLoggedIn: state.auth.isLoggedIn,
        error: state.auth.error,
        loginScreen: state.auth.loginScreen
    };
}

export default connect(mapStateToProps)(Login);


const styles = StyleSheet.create ({
  filledTextButton: {
   padding: 5,
   backgroundColor: my_green,
   borderColor: my_green,
   borderWidth: 2,
   borderRadius: 5
  }
})
