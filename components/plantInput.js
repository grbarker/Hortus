import React, { Component } from 'react'
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native'
import ModalSelector from 'react-native-modal-selector'
import TextButton from './TextButton'
import Moment from 'react-moment';
import 'moment-timezone';
import { connect } from 'react-redux'
import { white, black, gray, purple, green, blue, my_green, my_blue, pink, lightPurp, red, orange} from '../utils/colors'
import { Constants, Location, Permissions } from 'expo';
import { getUserPlants, submitUserPlant, submitUserPlantFetch, hidePlantInput } from '../actions/userplants'

class PlantInput extends Component {
    constructor (props) {
        super(props);
        this.state = {
          selectedGarden: {},
          gardenName: '',
          gardenID: 0,
          plantText: "",
          token: "",
          error: ""
        };
    }

    submitUserPlant = (e) => {
      const { dispatch, token } = this.props
      const { selectedGarden, gardenName, gardenID, plantText } = this.state
      e.preventDefault();
      dispatch(submitUserPlant(dispatch, token, selectedGarden, gardenName, gardenID, plantText));
      dispatch(hidePlantInput());
      this.setState({
        plantText: ""
      })
    }


  render() {
    const { token, fetched_usergardens, usergarden_items, error } = this.props
    const { selectedGarden, gardenName, gardenID, plantText } = this.state

    if (fetched_usergardens == true) {
      return (
        <ScrollView>
          <TextInput
              style={styles.plantInputField}
              placeholder='What did you plant?'
              autoCapitalize='none'
              autoCorrect={false}
              autoFocus={false}
              keyboardType='email-address'
              value={plantText}
              onChangeText={(text) => {
                this.setState({ plantText: text });
              }} />
          <ModalSelector
              data={usergarden_items}
              keyExtractor= {item => item.id}
              labelExtractor= {item => item.name}
              initValue="Select a garden to plant something in!"
              supportedOrientations={['landscape', 'portrait']}
              accessible={true}
              scrollViewAccessibilityLabel={'Scrollable options'}
              cancelButtonAccessibilityLabel={'Cancel Button'}
              onChange={(option)=>{
                this.setState({
                  selectedGarden: option,
                  gardenName: option.name,
                  gardenID: option.id
                });
              }}>
              <TextInput
                  style={{borderWidth:1, borderColor:'#ccc', padding:7, height:40}}
                  editable={false}
                  placeholder="Select a garden to plant something in!"
                  value={this.state.gardenName} />

          </ModalSelector>
          <Button onPress={(e) => this.submitUserPlant(e)} title="Submit"/>
        </ScrollView>
      )
    } else if (error) {
      return (
        <View style = {styles.errorContainer}>
          <Text style = {styles.text}>{error}</Text>
        </View>
      )
    } else {
      return (
        <View>
          <Text>Hello broseph</Text>
        </View>
      )
    }
  }
}

const mapStateToProps = (state, ownProps) => {
    return {
      fetched_usergardens: state.usergardens.fetched,
      usergarden_items: state.usergardens.items,
      gardenChoice: state.usergardens.gardenChoice,
      token: state.auth.token,
      error: state.usergardens.error,
    };
}


export default connect(mapStateToProps)(PlantInput);

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
