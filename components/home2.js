import React, { Component } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Button, Platform, Animated, Easing } from 'react-native'
import TextButton from './TextButton'
import AlteredTextButton from './AlteredTextButton'
import Moment from 'react-moment';
import 'moment-timezone';
import { MapView } from 'expo';
import { connect } from 'react-redux'
import { white, black, gray, purple, green, blue, my_green, my_blue, pink, lightPurp, red, orange} from '../utils/colors'
import { submitUserPost, hidePostInput, showPostInput } from '../actions/posts'
import { setCurrentUser } from '../actions/user'
import { toMap } from '../actions/map'
import { getLocationsSuccess, getLocationsFailure, getOwnLocation, getOwnLocationDenied } from '../actions/locations'
import Posts  from './posts'
import Plants from './plants'
import PostInput from './postInput'
import PostForm from './postForm'
import { Constants } from 'expo';
import * as Location from 'expo-location';
import {
  Ionicons, MaterialCommunityIcons, SimpleLineIcons, FontAwesome5
} from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome'
import Icons from 'react-native-vector-icons/Ionicons'


class Home extends Component {


  state = {
    locationResult: null,
    postFormHeight: new Animated.Value(0)
  }
  postSubmit = (values) => {
    const { dispatch, token} = this.props

    dispatch(submitUserPost(dispatch, token, values.post))
    // print the form values to the console
    console.log(values);
    }
  toMap = () => {
    const { dispatch } = this.props
    dispatch(toMap())
    this.props.navigation.navigate('Map');
  }
  toProfile = () => {
    const { dispatch } = this.props
    dispatch(setCurrentUser())
    this.props.navigation.navigate('Profile');
  }

  growIn = () => {
    // Will change postFormHeight value to 1 in 5 seconds
    Animated.timing(this.state.postFormHeight, {
      toValue: 200,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: false
    }).start();
  };

  shrinkOut = () => {
    // Will change postFormHeight value to 0 in 3 seconds
    Animated.timing(this.state.postFormHeight, {
      toValue: 0,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: false
    }).start();
  };

  togglePostInput = (e) => {
    const { dispatch, showingPostInput } = this.props
    showingPostInput
    ? dispatch(hidePostInput())
    : dispatch(showPostInput())
    e.preventDefault();
  }
  async fetchMarkerData() {
    const { dispatch, token } = this.props
    try {
      let response = await fetch(
        `http://@45.79.227.26/api/locations`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      let responseJSON = await response.json({limit: '5mb'});
      //console.log("This is the response!!!!!", responseJSON )
      dispatch(getLocationsSuccess(responseJSON))
    } catch (error) {
      console.error(error);
    }
  }

  componentDidMount() {
    this.fetchMarkerData();
  }

  render() {
    const { showingPostInput, navigation } = this.props
    const { postFormHeight } = this.state
    showingPostInput ? this.growIn() : this.shrinkOut()

    return (
      <View style={styles.container}>
        <View style={styles.iconButtonsContainer}>
          {Platform.OS === 'ios'
          ? <Ionicons.Button
              name="ios-map"
              size={22}
              color={my_green}
              backgroundColor="#f0f4f0"
              onPress={this.toMap}
            >
              Map
            </Ionicons.Button>
          : <Ionicons.Button
              name="md-map"
              size={22}
              color={my_green}
              borderWidth="3"
              borderRadius="3"
              borderColor={my_green}
              backgroundColor="#f0f4f0"
              onPress={this.toMap}
            >
              Map
            </Ionicons.Button>
          }
          {Platform.OS === 'ios'
          ? <Ionicons.Button
              name="ios-person"
              size={22}
              color={my_green}
              backgroundColor="#f0f4f0"
              onPress={this.toProfile}
            >
              Profile
            </Ionicons.Button>
          : <Ionicons.Button
              name="md-person"
              size={22}
              color={my_green}
              backgroundColor="#f0f4f0"
              onPress={this.toProfile}
            >
              Profile
            </Ionicons.Button>
          }
          {Platform.OS === 'ios'
          ? <FontAwesome5.Button
            name="pencil-alt"
            size={22}
            color={my_green}
            backgroundColor="#f0f4f0"
            onPress={this.togglePostInput}
            >
              Got something to say?
            </FontAwesome5.Button>
          : <FontAwesome5.Button
            name="pencil-alt"
            size={22}
            color={my_green}
            backgroundColor="#f0f4f0"
            onPress={this.togglePostInput}
            >
              Got something to say?
            </FontAwesome5.Button>
        }
        </View>
        <ScrollView style={styles.scrollViewContainer}>
              <Animated.View style={{ height: postFormHeight }}>
                <PostForm onSubmit={this.postSubmit}/>
              </Animated.View>
          <View>
            <Posts />
            <Plants navigation={navigation}/>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
    return {
      token: state.auth.token,
      showingPostInput: state.posts.showingPostInput,
      locations: state.locations.items,
    };
}


export default connect(mapStateToProps)(Home);

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 5,
    marginTop: 3,
    backgroundColor: '#f0f4f0',
    alignItems: 'center',
   },
  scrollViewContainer: {
    flex: 1,
    width: '100%'
  },
  postFormContainer: {
    height: 200,
  },
  iconButtonsContainer: {
     maxHeight: 40,
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
   }
})
