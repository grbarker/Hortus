import React, { Component } from 'react'
import { Field, reduxForm, actions, change } from 'redux-form'
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native'
import TextButton from './TextButton'
import AlteredTextButton from './AlteredTextButton'
import 'moment-timezone';
import { connect } from 'react-redux'
import { white, black, gray, purple, green, blue, my_green, my_blue, pink, lightPurp, red, orange} from '../utils/colors'
import { getUserGardens, submitUserGarden, submitUserGardenFetch, hideGardenInput } from '../actions/usergardens'
import { toPlacingMap } from '../actions/map'
import renderField from './renderField'
import axios from 'axios';



class GardenForm extends Component {

  toPlacingMap = (navigation) => {
    const { dispatch } = this.props

    dispatch(toPlacingMap())
    navigation.navigate('Map');
  }


  render() {
    const { error, handleSubmit, submitting, reset, pristine, style, navigation } = this.props
    //The following log causes a massive tide of warnings about reusing an
    //event or something when navigating back from addressCheck component
    //console.log(this.props)

    return (
      <ScrollView onSubmit={handleSubmit}>
        <Field
          name="garden"
          type="text"
          component={renderField}
          label="Plant Name"
          placeholder="What is the name of your new garden?"
          style={style.reduxFormField}
        />
        <Field
          name="address"
          type="text"
          component={renderField}
          label="Address"
          placeholder="What is the address of your new garden?"
          style={style.reduxFormField}
        />

        {error && <Text style={styles.errorText}>{error}</Text>}
        <View>
          <View style={styles.toMap}>
            <TouchableOpacity onPress={() => {this.toPlacingMap(navigation) && reset}}>
              <Text style={styles.text}>Place on map</Text>
            </TouchableOpacity>
          </View>
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
        </View>
      </ScrollView>
    )
  }
}


GardenForm = reduxForm({
  form: 'garden',
  validate: (values) => {
    const errors = {};
    errors.garden = !values.garden
      ? 'Garden field is required'
      : undefined;

    errors.address = !values.address
      ? 'Address field is required'
      :  console.log(values.address);


    return errors;
  }
})(GardenForm);


export default GardenForm


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
    fontSize: 16,
    color: white,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 20,
    color: red,
  },
  toMap: {
    borderWidth:1,
    borderColor:'#ccc',
    backgroundColor: my_green,
    borderRadius: 5,
    margin: 5,
    padding: 10,
  }
})
