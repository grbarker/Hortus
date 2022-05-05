import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { ScrollView, View, Text, TextInput,TouchableOpacity, StyleSheet, Button, Platform } from 'react-native'
import TextButton from './TextButton'
import * as SecureStore from 'expo-secure-store';
import 'moment-timezone';
import { connect } from 'react-redux'
import {
  white, black, gray, purple, green, blue, my_green, my_blue, pink, lightPurp,
  red, orange
} from '../utils/colors'
import { login } from '../actions/auth';
import renderField from './renderField'
import renderPasswordField from './renderPasswordField'
import axios from 'axios';
import { loginSubmit } from './login'



class LoginForm extends Component {

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
        let token = responseJSON.token;
        dispatch(login(values.username, values.password, token));
        this.saveUserInfo(values.username, values.password)
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

  render() {
    const { error, handleSubmit, submitting, reset, pristine, data, invalid,
      style, loginScreen } = this.props



    return (
      <ScrollView onSubmit={handleSubmit(this.onSubmit)}>
        <Field
          name="username"
          type="text"
          component={renderField}
          label="Username"
          placeholder="Username"
          style={styles.loginInputField}
        />
        {loginScreen
          ? null
          : <Field
              name="email"
              type="text"
              component={renderField}
              label="Email"
              placeholder="Email"
              style={styles.loginInputField}
            />
        }
        <Field
          name="password"
          type="text"
          component={renderPasswordField}
          label="Password"
          placeholder="Password"
          style={styles.loginInputField}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
        <View>
          <Button title='Submit' type="submit" disabled={pristine || submitting || invalid} onPress={handleSubmit(this.onSubmit)}>
            Submit
          </Button>
          <Button title='Cancel' type="button" disabled={pristine || submitting} onPress={reset}>
            Clear Values
          </Button>
        </View>
      </ScrollView>
    )
  }
}


LoginForm = reduxForm({
  form: 'login',
  validate: (values) => {
    const errors = {};

    errors.username = !values.username
      ? 'Username required'
      : undefined;

    errors.email = !values.email
      ? 'Username required'
      : !values.email.includes("@")
        ? 'Not a valid email'
        : undefined;

    errors.password = !values.password
      ? 'Password required'
      :  undefined;

    return errors;
  }
})(LoginForm);


export default LoginForm


const styles = StyleSheet.create ({
   container: {
      padding: 5,
      marginTop: 3,
      backgroundColor: '#f0f4f0',
      alignItems: 'center',
   },
   loginInputField: {
     marginTop: 5,
     fontSize: 37,
     paddingTop: 8,
     paddingLeft: 5,
     paddingRight: 5,
     paddingBottom: 1,
     backgroundColor: '#ffffff',
     borderColor: my_green,
     borderWidth: 2,
     borderRadius: 5,
   },
   errorContainer: {
     padding: 5,
     marginTop: 3,
     marginBottom: 30,
     backgroundColor: '#d9f9b1',
     alignItems: 'center',
   },
   text: {
     fontSize: 20,
      color: black
   },
   errorText: {
    fontSize: 20,
    color: red,
   },
   gardenInputField: {
     margin: 5,
     padding: 5,
     backgroundColor: '#f0f4f0',
     borderWidth: 2,
     borderColor: my_green,

   }
})
