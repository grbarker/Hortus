import React, { Component } from 'react'
import { change } from 'redux-form'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Button, Platform } from 'react-native'
import TextButton from './TextButton'
import AlteredTextButton from './AlteredTextButton'
import Moment from 'react-moment';
import 'moment-timezone';
import { connect } from 'react-redux'
import { setAddress } from '../actions/map'
import { white, black, gray, purple, green, blue, my_green, my_blue, pink, lightPurp, red, orange} from '../utils/colors'
import { toPlacingMap } from '../actions/map'
import { Ionicons } from '../node_modules/@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome'
import Icons from 'react-native-vector-icons/Ionicons'

class AddressCheck extends Component {

  alertPress = () => {
   alert("TouchableOpacity Has Been Pressed!!!")
  }
  toProfileWithAddress = (address) => {
    this.props.dispatch(change('garden', 'address', address))
    console.log(address)
    this.props.navigation.navigate('Profile')
    console.log(address)
  }

  render() {
    const { navigation, addresses, dispatch } = this.props

    return (
      <ScrollView contentContainerStyle={styles.viewContainer}>
        <Text style={styles.profileText}>Choose your address from the list or cancel to go back and try again!</Text>
        {addresses.map((address, index) => {
          return (
            <View
              key={index}
              style={index == 0 ? [styles.container, {borderTopWidth: 2, borderTopColor: "e1f2e1"}] : styles.container}>
              <TouchableOpacity
                onPress={() => this.toProfileWithAddress(address)}
              >
                <Text style={styles.text}>{address}</Text>
              </TouchableOpacity>
            </View>
          )
        })}
        <AlteredTextButton
          style={styles.myGreenTextButton}
          textStyle={styles.profileText}
          onPress={() => {
            dispatch(toPlacingMap())
            navigation.navigate('Map')}
          }>
          Cancel
        </AlteredTextButton>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
    return {
      addresses: state.map.addresses
    };
}


export default connect(mapStateToProps)(AddressCheck);

const styles = StyleSheet.create ({
  viewContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 5,
   },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 5,
    marginTop: 3,
    backgroundColor: '#f0f4f0',
    borderBottomWidth: 2,
    borderColor: '#e1f2e1',
   },
  myGreenTextButton: {
     margin: 5,
     padding: 5,
     borderColor: my_green,
     borderWidth: 2,
     borderRadius: 5
   },
  text: {
    fontSize: 18,
    color: black
   },
  profileText: {
     fontSize: 20,
     color: my_green
   },
})
