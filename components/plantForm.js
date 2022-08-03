import React, { Component } from 'react'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native'
import TextButton from './TextButton'
import AlteredTextButton from './AlteredTextButton'
import 'moment-timezone';
import { connect } from 'react-redux'
import { white, black, gray, purple, green, blue, my_green, my_blue, pink, lightPurp, red, orange} from '../utils/colors'
import { getUserPlants, submitUserPlant, submitUserPlantFetch, hidePlantInput } from '../actions/userplants'
import renderField from './renderField'
import renderSelector from './renderSelector'



class PlantForm extends Component {



  render() {
    const { handleSubmit, submitting, reset, pristine, data, style, garden } = this.props

    return (
      <ScrollView onSubmit={handleSubmit}>
        <Field
          name="plant"
          type="text"
          component={renderField}
          label="Plant Name"
          placeholder="What did you plant?"
          style={style.reduxFormField}
        />
        <Field
          name="garden"
          type="select"
          component={renderSelector}
          label="Garden"
          placeholder="What garden did you plant it in?"
          data= {data}
          garden={garden ? garden.name : 'Choose a garden please.'}
        />
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


PlantForm = reduxForm({
  form: 'plant',
  validate: (values) => {
    const errors = {};
    errors.plant = !values.plant
      ? 'Plant field is required'
      : undefined;

    errors.garden = !values.garden
      ? 'Garden field is required'
      :  undefined;

    return errors;
  }
})(PlantForm);

// Decorate with connect to read form values
const selector = formValueSelector('plant') // <-- same as form name
PlantForm = connect(
  state => {
    // can select values individually
    const garden = selector(state, 'garden')

    return {
      garden
    }
  }
)(PlantForm)

export default PlantForm


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
})
