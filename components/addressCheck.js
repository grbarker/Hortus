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
import { Ionicons } from '../node_modules/@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome'
import Icons from 'react-native-vector-icons/Ionicons'

class AddressCheck extends Component {
  static navigationOptions = ({ navigation }) => {

    return {
      title: 'Address Check',
      headerRight: (
        <Button
          onPress={() => navigation.navigate('Auth')}
          title="Logout"
          color= {white}
        />
      )
    }
  }

  state = {
    locationResult: null
  }

  componentDidMount() {
    null
  }

  alertPress = () => {
   alert("TouchableOpacity Has Been Pressed!!!")
  }


  toProfileWithAddress = (address) => {
    const { dispatch } = this.props
    dispatch(change('garden', 'address', address))
    console.log(address)
    this.props.navigation.navigate('Profile')
    console.log(address)
  }

  render() {
    const { showingPostInput, navigation, addresses } = this.props

    //console.log(addresses)

    return (
      <ScrollView contentContainerStyle={styles.viewContainer}>
        <Text style={styles.profileText}>Choose your address from the list or cancel to go back and try again!</Text>
        {addresses.map((address, index) => {
          return (
            <View key={index} style={styles.container}>
              <TouchableOpacity
                style={styles.container}
                onPress={() => this.toProfileWithAddress(address)}
              >
                <Text style={styles.text}>{address}</Text>
              </TouchableOpacity>
            </View>
          )
        })}
        <AlteredTextButton style={styles.myGreenTextButton} textStyle={styles.profileText} onPress={() => navigation.goBack()}>
          Cancel
        </AlteredTextButton>

      </ScrollView>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
    return {
      token: state.auth.token,
      showingPostInput: state.posts.showingPostInput,
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
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    padding: 5,
    marginTop: 3,
    backgroundColor: '#f0f4f0',
   },
  scrollViewContainer: {
      width: '100%'
    },
  iconButtonsContainer: {
     maxHeight: 50,
     width: '100%',
     flex: 1,
     flexDirection: 'row',
     justifyContent: 'space-evenly',
     borderBottomWidth: 3,
     borderColor: my_green,
   },
  myGreenTextButton: {
     margin: 5,
     padding: 5,
     borderColor: my_green,
     borderWidth: 2,
     borderRadius: 5
   },
  newposticon: {
     marginLeft: 10,
   },
  profileText: {
     fontSize: 24,
     color: my_green
   },
  text: {
    fontSize: 20,
    color: black
   },
   profileText: {
     fontSize: 24,
     color: my_green
   },
})
