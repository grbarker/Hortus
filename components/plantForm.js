import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native'
import TextButton from './TextButton'
import 'moment-timezone';
import { connect } from 'react-redux'
import { white, black, gray, purple, green, blue, my_green, my_blue, pink, lightPurp, red, orange} from '../utils/colors'
import { getUserPlants, submitUserPlant, submitUserPlantFetch, hidePlantInput } from '../actions/userplants'
import renderField from './renderField'
import renderSelector from './renderSelector'



class PlantForm extends Component {


  render() {
    const { handleSubmit, submitting, reset, pristine, data, style } = this.props

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
          type="text"
          component={renderSelector}
          label="Garden"
          placeholder="What garden did you plant it in?"
          data= {data}
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
   plantInputField: {
     margin: 5,
     padding: 5,
     backgroundColor: '#f0f4f0',
     borderWidth: 2,
     borderColor: my_green,

   }
})
