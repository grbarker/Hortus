import React, { Component } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Button, Platform, Animated, Easing } from 'react-native'
import TextButton from './TextButton'
import AlteredTextButton from './AlteredTextButton'
import Moment from 'react-moment';
import 'moment-timezone';
import { MapView } from 'expo';
import { connect } from 'react-redux'
import { white, black, gray, gray4, purple, green, blue, my_green, my_blue, pink, lightPurp, red, orange} from '../utils/colors'
import { submitUserPost, hidePostInput, showPostInput } from '../actions/posts'
import { setCurrentUser } from '../actions/user'
import { toMap } from '../actions/map'
import { getLocationsSuccess, getLocationsFailure, getOwnLocation, getOwnLocationDenied } from '../actions/locations'
import { getUser, getUserSuccess, getUserFailure, getOtherUserSuccess } from '../actions/user'
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
    const { dispatch, user, usersList, usersIdList } = this.props
    dispatch(setCurrentUser());
    usersList.push(user)
    usersIdList.push(user.id)
    this.props.navigation.navigate('Profile', {
      key: Math.random().toString(),
      id: user.id,
    });
  }
  fetchCurrentUUser(){
    const { dispatch, token } = this.props
    fetch(
        `http://@45.79.227.26/api/user`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => response.json())
        .then(data => dispatch(getUserSuccess(data)))
        .catch((error) => {
          console.log(error);
        })
  }
  growIn = () => {
    // Will change postFormHeight value to 1 in 5 seconds
    Animated.timing(this.state.postFormHeight, {
      toValue: 260,
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
    this.fetchCurrentUUser();
  }

  render() {
    const { showingPostInput, navigation } = this.props
    const { postFormHeight } = this.state
    showingPostInput ? this.growIn() : this.shrinkOut()

    return (
      <View style={styles.homeScreenContainer}>
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
            <PostForm onSubmit={this.postSubmit} style={styles} />
          </Animated.View>
          <View>
            <Posts style={styles} navigation={navigation}/>
            <Plants style={styles} navigation={navigation}/>
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
      user: state.user.user,
      usersList: state.user.usersList,
      usersIdList: state.user.usersIdList
    };
}


export default connect(mapStateToProps)(Home);

const styles = StyleSheet.create ({
  homeScreenContainer: {
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
  reduxFormField: {
    margin: 5,
    padding: 5,
    backgroundColor: '#f0f4f0',
    borderWidth: 2,
    borderRadius: 8,
    borderColor: my_green,
    minHeight: 80,
    maxHeight: 160,
    fontSize: 16,
  },
  submitCancelButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    margin: 2,
    backgroundColor: '#f0f4f0',
    borderTopColor: my_green,
  },
  scrollViewAsContainer: {
    borderWidth: 2,
    borderRadius: 3,
    borderColor: my_green,
    marginTop: 3,
    borderTopWidth: 1,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    borderTopColor: '#ccc',
  },
  scrollViewHeaderContainer: {
    backgroundColor: my_green,
    padding: 8,
    paddingLeft: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  scrollViewHeaderText: {
    fontSize: 20,
    color: '#f0f4f0',
  },
  container: {
    padding: 5,
    marginTop: 3,
    backgroundColor: '#f0f4f0',
    borderBottomWidth: 2,
    borderColor: '#e1f2e1',
  },
  moreLessButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    marginLeft: 8,
    marginRight: 8,
    backgroundColor: '#f0f4f0',
    borderTopWidth: 2,
    borderTopColor: my_green,
  },
  errorContainer: {
      padding: 5,
      marginTop: 3,
      marginBottom: 30,
      backgroundColor: '#d9f9b1',
      alignItems: 'center',
    },
  filledTextButton: {
    padding: 10,
    backgroundColor: my_green,
    borderColor:'#ccc',
    borderWidth: 1,
    borderRadius: 5
  },
  inactiveFilledTextButton: {
   padding: 8,
   backgroundColor: gray4,
   borderColor: gray4,
   borderWidth: 2,
   borderRadius: 5
  },
  profileText: {
    fontSize: 24,
    color: my_green
  },
  text: {
   fontSize: 16,
   color: black
 },
  whiteText: {
    fontSize: 16,
    color: white
  },
  myGreenText: {
   fontSize: 18,
   color: my_green
  },
})
