import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { ScrollView, View, Text, TextInput,TouchableOpacity, StyleSheet, Button, Platform } from 'react-native'
import TextButton from './TextButton'
import AlteredTextButton from './AlteredTextButton'
import 'moment-timezone';
import { connect } from 'react-redux'
import {
  white, black, gray, purple, green, blue, my_green, my_blue, pink, lightPurp,
  red, orange
} from '../utils/colors'
import renderField from './renderField'
import renderPasswordField from './renderPasswordField'
import axios from 'axios';



class LoginForm extends Component {



  render() {
    const { error, handleSubmit, submitting, reset, pristine, data, invalid,
      style, loginScreen } = this.props



    return (
      <ScrollView onSubmit={handleSubmit}>
        <Field
          name="username"
          type="text"
          component={renderField}
          label="Username"
          placeholder="Username"
          style={style.reduxFormField}
        />
        {loginScreen
          ? null
          : <Field
              name="email"
              type="text"
              component={renderField}
              label="Email"
              placeholder="Email"
              style={style.reduxFormField}
            />
        }
        <Field
          name="password"
          type="text"
          component={renderPasswordField}
          label="Password"
          placeholder="Password"
          style={style.reduxFormField}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={style.submitCancelButtonsContainer}>
          <AlteredTextButton
            style={style.filledTextButton}
            textStyle={style.whiteText}
            title='Submit'
            type="submit"
            disabled={pristine || submitting}
            onPress={handleSubmit}
          >
              Submit
          </AlteredTextButton>
          <AlteredTextButton
            style={style.filledTextButton}
            textStyle={style.whiteText}
            title='Cancel'
            type="button"
            disabled={pristine || submitting}
            onPress={reset}
          >
              Cancel
          </AlteredTextButton>
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
