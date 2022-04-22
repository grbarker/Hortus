import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { ScrollView, View, Text, TextInput,TouchableOpacity, StyleSheet, Button, Platform } from 'react-native'
import TextButton from './TextButton'
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


  toHome = () => {
    this.props.navigation.navigate('Home', {
      isLoggedIn: true
    });
  }

  onSubmit = async (values) => {
    const { dispatch } = this.props
    console.log(values)
    console.log("PLATFORM____________", Platform.OS)
    try {
      let response = await fetch(
        `http://${values.username}:${values.password}@45.79.227.26/api/tokens`, {
          method: 'POST',
        }
      );
      console.log(response);
      let responseJSON = await response.json();
      console.log('This is the login response:    ', responseJSON);
      let token = responseJSON.token;
      //this.toHome();
      dispatch(login(values.username, values.password, token));
    } catch (error) {
      console.error('react native form error:   ', error);
    }
  };

  render() {
    const { error, handleSubmit, submitting, reset, pristine, data, style } = this.props



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
          <Button title='Submit' type="submit" disabled={pristine || submitting} onPress={handleSubmit(this.onSubmit)}>
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
