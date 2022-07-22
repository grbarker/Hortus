import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { AsyncStorage } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { login, loginFail, submitLogin, loginSubmit, getTokenSuccess, getTokenFailure } from '../actions/auth';
import {
  white, my_green, green, gray4, red, purple, orange, blue, my_blue,
  lightPurp, black, pink
} from '../utils/colors'
import LoginForm from './loginForm'

const api = "http://45.79.227.26/catalog/mobilelogin/JSON"


class Login extends Component {

  async saveUserInfo(uname, pword) {
    await SecureStore.setItemAsync('username', uname);
    await SecureStore.setItemAsync('password', pword);
  }

  async userLogin(values) {
      const { dispatch, username, password } = this.props
      let uname = username ? username : values.username
      let pword = password ? password : values.password
      console.log('These are the input values for Log In:    ', values);
      try {
        let response = await fetch(
          `http://${uname}:${pword}@45.79.227.26/api/tokens`, {
            method: 'POST',
          }
        );
        console.log(response);
        let responseJSON = await response.json();
        console.log('This is the login response:    ', responseJSON);
        if (responseJSON.error) {
          dispatch(loginFail(responseJSON.error, responseJSON.message));
        } else {
          let token = responseJSON.token;
          dispatch(login(values.username, values.password, token));
          this.saveUserInfo(values.username, values.password)
        }
      } catch (error) {
        console.error('react native form error:   ', error);
      }
  }
  async userSignup (values) {
      const { dispatch } = this.props
      console.log('These are the input values for Sign Up:    ', values);

      try {
        let response = await fetch(
          `http://45.79.227.26/api/users`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "username": `${values.username}`,
              "email": `${values.email}`,
              "password": `${values.password}`,
            })
          }
        );
        let responseJSON = await response.json();
        console.log("This is the Sign Up response:____________", responseJSON);
        this.userLogin(values)
      } catch (error) {
        console.error(error);
      }
    }

  onSubmit = (values) => {
    this.props.loginScreen ? this.userLogin(values) : this.userSignup(values)

  };


  render () {
    const { isLoggedIn, error, message, loginScreen } = this.props

      return (
          <ScrollView style={{flex: 1, padding: 20}}>
            <Text style={{flex: 1, fontSize: 27, color: my_green}}>{loginScreen ? "Log In" : "Sign Up"}</Text>
            <LoginForm  onSubmit={this.onSubmit} loginScreen={loginScreen ? true : false} />
            {error
              ? <Text style={styles.errorText}>{message}</Text>
              : null
            }
          </ScrollView>
      );
  }
}


const mapStateToProps = (state, ownProps) => {
    return {
        isLoggedIn: state.auth.isLoggedIn,
        error: state.auth.error,
        message: state.auth.message,
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
 },
 errorText: {
   fontSize: 24,
   color: red,
   textAlign: 'center',
 },
})
