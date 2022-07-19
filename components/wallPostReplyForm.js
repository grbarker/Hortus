import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native'
import TextButton from './TextButton'
import 'moment-timezone';
import { connect } from 'react-redux'
import { white, black, gray, purple, green, blue, my_green, my_blue, pink, lightPurp, red, orange} from '../utils/colors'
import renderField from './renderField'



class WallPostReplyForm extends Component {


  render() {
    const { handleSubmit, submitting, reset, pristine, data, style } = this.props

    return (
      <ScrollView onSubmit={handleSubmit}>
        <Field
          name="wallPostReply"
          type="text"
          component={renderField}
          label="Wall Post Name"
          placeholder="Whatcha wanna say?"
          style={styles.reduxFormField}
        />
        <View>
          <Button title='Submit' type="submit" disabled={pristine || submitting} onPress={handleSubmit}>
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


WallPostReplyForm = reduxForm({
  form: 'wallPostReply',
  validate: (values) => {
    const errors = {};
    errors.wallPostReply = !values.wallPostReply
      ? 'Wall post field is required'
      : undefined;
    return errors;
  }
})(WallPostReplyForm);


export default WallPostReplyForm


const styles = StyleSheet.create ({
   container: {
      padding: 5,
      marginTop: 3,
      backgroundColor: '#f0f4f0',
      alignItems: 'center',
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
   reduxFormField: {
     margin: 5,
     padding: 5,
     backgroundColor: '#f0f4f0',
     borderWidth: 2,
     borderColor: my_green,

   },
   postInputField: {
     margin: 5,
     padding: 5,
     backgroundColor: '#f0f4f0',
     borderWidth: 2,
     borderColor: my_green,

   }
})
