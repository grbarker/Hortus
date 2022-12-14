import React, { Component } from 'react'
import {
  ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet,
  Button, Image, Platform, Animated, Easing
} from 'react-native'
import ModalSelector from 'react-native-modal-selector'
import Moment from 'react-moment';
import 'moment-timezone';
import AlteredTextButton from './AlteredTextButton'
import { MapView } from 'expo';
import { connect } from 'react-redux'
import {
  white, my_green, green, gray, gray4, red, purple, orange, blue, my_blue,
  lightPurp, black, pink
} from '../utils/colors'
import {
  getUserPosts, getUserPostsSuccess, getUserPostsFailure,
  submitUserPost, hidePostInput, showPostInput
} from '../actions/userposts'
import {
  getWallPosts, getWallPostsSuccess, getWallPostsFailure,
  submitWallPost, hideWallPostInput, showWallPostInput
} from '../actions/wallPosts'
import { submitOtherWallPost } from '../actions/otherWallPosts'
import {
  getUserPlants, getUserPlantsSuccess, getUserPlantsFailure,
  submitUserPlant, hidePlantInput, showPlantInput
} from '../actions/userplants'
import {
  submitUserGarden, hideGardenInput, showGardenInput, updatePicker,
  submitUserGardenFailure, getUserGardens
} from '../actions/usergardens'
import {
  getUser, getUserSuccess, getUserFailure, getOtherUserSuccess, setUser,
  setOtherUser, goBackProfile } from '../actions/user'
import { showFollowers, hideFollowers } from '../actions/followers'
import { showFollowed, hideFollowed } from '../actions/followed'
import { toMap } from '../actions/map'
import PostInput from './postInput'
import Followers from './followers'
import Followed from './followed'
import UserPosts from './userposts'
import UserPlants from './userplants'
import UserGardens from './usergardens'
import WallPosts from './wallPosts'
import PlantInput from './plantInput'
import PlantForm from './plantForm'
import PostForm from './postForm'
import GardenForm from './gardenForm'
import WallPostForm from './wallPostForm'
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome'
import Icons from 'react-native-vector-icons/Ionicons'
import Iconss from 'react-native-vector-icons/SimpleLineIcons'
import {
  Ionicons, MaterialCommunityIcons, SimpleLineIcons, FontAwesome5
} from '@expo/vector-icons';



class Profile extends Component {

  state = {
    selectedGarden: {},
    gardenName: '',
    gardenID: 0,
    gardenImg: null,
    inputHeight: new Animated.Value(0),
    wallInputHeight: new Animated.Value(0),
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

  fetchUUser(id){
    const { dispatch, token, usersList } = this.props
    fetch(
        `http://@45.79.227.26/api/users/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => response.json())
        .then((data) => {
          usersList.push(data)
          dispatch(setOtherUser(data.id))
          dispatch(setUser(usersList))
          dispatch(getOtherUserSuccess(data)) && console.log(data)
        })
        .catch((error) => {
          console.log(error);
        })
  }

  async fetchCurrentUser(){
    const { dispatch, token } = this.props
    try {
      let response = await fetch(
        `http://@45.79.227.26/api/user`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("This is the fetchCurrentUser response:____________", response)
      let responseJSON =  await response.json();
      console.log("This is the fetchCurrentUser responseJSON:____________", responseJSON)
      dispatch(getUserSuccess(responseJSON));
    } catch (error) {
      console.error("There was an error in fetching the current user:____________", error.response);
    }
  }
  fetchUser(id){
    const { dispatch, token } = this.props
    try {
      let response =  fetch(
        `http://@45.79.227.26/api/users/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      let responseJSON = response.json();
      console.log(responseJSON)
      dispatch(getOtherUserSuccess(responseJSON))
    } catch (error) {
      console.error(error);
    }
  }

  componentDidMount() {
    const { dispatch, token, otherUserBool, otherUserID, showCurrentUser,
    navigation, route, usersList } = this.props
    //showCurrentUser ? (this.fetchCurrentUUser() && console.log('Current User')) : (this.fetchUUser(otherUserID) && console.log('Other User --> user id --> ', otherUserID))
    this.fetchUUser(route.params.id)
  }
  componentWillUnmount(){
    const { dispatch, route, usersList } = this.props
    usersList.pop()
    dispatch(goBackProfile())
    dispatch(setUser(usersList))
    dispatch(setOtherUser(usersList[usersList.length - 1].id))
  }

  plantSubmit = (values) => {
    const { dispatch, token} = this.props

    this.togglePlantInput()
    dispatch(submitUserPlant(dispatch, token, values.garden, values.garden.name, values.garden.id, values.plant))
    // print the form values to the console
    console.log(
      'Garden:  ', values.garden,
      ',  Garden Name:  ', values.garden.name,
      ',  Garden ID:  ',  values.garden.id,
      ',  Plant:  ', values.plant
    );
  }
  postSubmit = (values) => {
    const { dispatch, token} = this.props

    this.togglePostInput()
    dispatch(submitUserPost(dispatch, token, values.post))
    // print the form values to the console
    console.log(values.post);
    }
  wallPostSubmit = (values) => {
    const { dispatch, token, otherUserID } = this.props
    console.log('WALL POST SUMBISSION PREFACE; WALL OWNER ID:____________', otherUserID)

    this.toggleWallPostInput()
    dispatch(submitOtherWallPost(dispatch, token, values.wallPost, otherUserID))
    console.log(values.wallPost);
    }
  gardenSubmit = (values) => {
    const { dispatch, token} = this.props

    this.toggleGardenInput()
    //Note: The following request is disabled while troubleshooting error
    //handling on the gardenForm to keep from adding so many new gardens
    return axios({
      method: 'POST',
      url: `http://45.79.227.26/api/user/garden`,
      headers: {
        "Authorization": `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: {
        "gardenName": values.garden,
        "gardenAddress": values.address
      }
    })
    .then((response) => {
      console.log('RESPONSE     RESPONSE     RESPONSE', response)
      dispatch(getUserGardens(dispatch, token, '/api/user/gardens'))
      console.log(response);
    })
    .catch((error) => {
      console.log('ERROR RESPONSE! ! !', error.response.data.error)
      console.log('ERROR MESSAGE! ! !', error.response.data.message)
      //dispatch(submitUserGardenFailure(error.response.data.message));
      //console.log('submitUserGardenFailure dispatched successfully ! ! !', error.response.data.message)
      console.log('SUBMISSION ERROR SUCCESS! ! !', error.response.data.message)

    })

    //dispatch(submitUserGarden(dispatch, token, values.garden, values.address))
    // print the form values to the console
    //console.log('GARDEN FORM VALUES   ', values);
    }
  toMap = () => {
    const { dispatch, navigation } = this.props
    dispatch(toMap())
    navigation.navigate('Map');
  }
  toHome = () => {
    this.props.navigation.navigate('Home');
  }
  growIn = (wall) => {
    // Will change postFormHeight value to 1 in 5 seconds
    Animated.timing(wall ? this.state.wallInputHeight : this.state.inputHeight,{
      toValue: 300,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false
    }).start();
  };
  shrinkOut = (wall) => {
    // Will change postFormHeight value to 0 in 3 seconds
    Animated.timing(wall ? this.state.wallInputHeight : this.state.inputHeight,{
        toValue: 0,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: false
    }).start();
  };
  toggleWallPostInput = (e) => {
    const { dispatch, showingWallPostInput} = this.props
      showingWallPostInput
        ? dispatch(hideWallPostInput()) && this.shrinkOut('wall')  && console.log('HIDING WALL POST INPUT')
        : dispatch(showWallPostInput()) && this.growIn('wall')  && console.log('SHOWING WALL POST INPUT')
  }
  togglePostInput = (e) => {
    const { dispatch, showingWallPostInput, showingPostInput, showingGardenInput, showingPlantInput } = this.props
    showingGardenInput || showingPostInput || showingPlantInput
      ? showingPostInput
        ? dispatch(hidePostInput()) && this.shrinkOut()
        : dispatch(showPostInput()) && dispatch(hidePlantInput()) && dispatch(hideGardenInput())
      : dispatch(showPostInput()) && this.growIn()
  }
  togglePlantInput = (e) => {
    const { dispatch, showingWallPostInput, showingPostInput, showingGardenInput, showingPlantInput } = this.props
    showingPlantInput
    ? dispatch(hidePlantInput()) && this.shrinkOut()
    : (showingGardenInput || showingPostInput)
      ? dispatch(showPlantInput()) && dispatch(hidePostInput()) && dispatch(hideGardenInput())
      : dispatch(showPlantInput()) && this.growIn()
  }
  toggleGardenInput = (e) => {
    const { dispatch, showingWallPostInput, showingPostInput, showingGardenInput, showingPlantInput } = this.props
    showingGardenInput
    ? dispatch(hideGardenInput()) && this.shrinkOut()
    : (showingPlantInput || showingPostInput)
      ? dispatch(showGardenInput()) && dispatch(hidePostInput()) && dispatch(hidePlantInput())
      : dispatch(showGardenInput()) && this.growIn()
  }
  toggleFollowers = (e) => {
    const { dispatch, showingFollowers } = this.props
    showingFollowers
    ? dispatch(hideFollowers())
    : dispatch(showFollowers()) && dispatch(hideFollowed())
    e.preventDefault();
  }
  toggleFollowed = (e) => {
    const { dispatch, showingFollowed } = this.props
    showingFollowed
    ? dispatch(hideFollowed())
    : dispatch(showFollowed()) && dispatch(hideFollowers())
    e.preventDefault();
  }

  render() {
    const { dispatch, user, fetching, fetched_user, showingFollowers,
      showingFollowed, showingPlantInput, showingGardenInput, showingPostInput,
      followers, length,fetched_usergardens, usergarden_items, gardenChoice,
      addressError, navigation, address, state, otherUserBool, otherFetched,
      otherUser, showingWallPostInput, route, usersList, usersIdList
    } = this.props
    const { selectedGarden, gardenName, gardenID, inputHeight, wallInputHeight
    } = this.state
    //address && console.log('CHECKING IF ADDRESS IS ACCESSIBLE ON RETURN TO PROFILE  ', address)

    if (fetched_user == true || otherFetched == true) {
      //console.log('User', user)
      //console.log('Avatar', user._links['avatar'])
      //fetched_user && console.log('----CURRENT-USER----CURRENT-USER----', user)
      //console.log('LOGGING FETCHED CURRENT USER----CURRENT USER----CURRENT USER-------------', fetched_user)
      //console.log('LOGGING FETCHED OTHER USER----OTHER USER----OTHER USER----------', otherFetched)
      //otherFetched && console.log('OTHER USER----OTHER USER    ', otherUser)
      let currentUser = route.params.id == user.id ? true : false
      //let selectedUser = otherUserBool == true ? otherUser: user;
      let selectedUser = usersList[usersList.length - 1]
      let imageSrc = selectedUser._links['avatar'];
      let id = selectedUser.id
      //let imgSrc = user._links['avatar'];
      return (
      <View style={styles.homeScreenContainer}>
        {currentUser
          ? <View style = {styles.iconButtonsContainer}>
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
                  backgroundColor="#f0f4f0"
                  onPress={this.toMap}
                >
                  Map
                </Ionicons.Button>
              }
              {Platform.OS === 'ios'
                ? <FontAwesome5.Button
                  name="pencil-alt"
                  size={22}
                  color={my_green}
                  backgroundColor="#f0f4f0"
                  onPress={this.togglePostInput}
                  >Post
                  </FontAwesome5.Button>
                : <FontAwesome5.Button
                  name="pencil-alt"
                  size={22}
                  color={my_green}
                  backgroundColor="#f0f4f0"
                  onPress={this.togglePostInput}
                  >Post
                  </FontAwesome5.Button>
              }
              {Platform.OS === 'ios'
                ? <Ionicons.Button
                  name="ios-leaf"
                  size={22}
                  color={my_green}
                  backgroundColor="#f0f4f0"
                  onPress={this.togglePlantInput}
                  >
                    Plant
                  </Ionicons.Button>
                : <Ionicons.Button
                  name="md-leaf"
                  size={22}
                  color={my_green}
                  backgroundColor="#f0f4f0"
                  onPress={this.togglePlantInput}
                  >
                    Plant
                  </Ionicons.Button>
              }
              <TouchableOpacity style={styles.gardenIconButton} onPress={this.toggleGardenInput}>
                <Image
                  source={require('../utils/img/soilsolid64px.png')}
                  resizeMode={"contain"}
                  style={styles.gardenIcon}
                />
                <Text style={styles.iconText}>Garden</Text>
              </TouchableOpacity>
            </View>
          : <View style = {styles.iconButtonsContainer}>
              {Platform.OS === 'ios'
                ? <FontAwesome5.Button
                  name="pencil-alt"
                  size={22}
                  color={my_green}
                  backgroundColor="#f0f4f0"
                  onPress={this.toggleWallPostInput}
                  ><Text style={styles.iconText}>Post to {selectedUser.username}'s wall</Text>
                  </FontAwesome5.Button>
                : <FontAwesome5.Button
                  name="pencil-alt"
                  size={22}
                  color={my_green}
                  backgroundColor="#f0f4f0"
                  onPress={this.toggleWallPostInput}
                  ><Text style={styles.iconText}>Post to {selectedUser.username}'s wall</Text>
                  </FontAwesome5.Button>
              }
            </View>
        }
          <ScrollView style={styles.scrollViewContainer}>
            <View style = {styles.postplantsContainer}>
              <View style = {styles.userProfileContainer}>
                <View style = {styles.avatarContainer}>
                  <Image
                    style={{width: 110, height: 110}}
                    source={{uri: imageSrc}}
                  />
                </View>
                <View style = {styles.profileInfoContainer}>
                  <Text style = {styles.profileNameText}>{selectedUser.username}</Text>
                  <AlteredTextButton onPress={this.toggleFollowed}>
                    <Text style = {styles.profileText}>
                      Following: {selectedUser.followed_count}
                    </Text>
                  </AlteredTextButton>
                  <AlteredTextButton style = {styles.profileText} onPress={this.toggleFollowers}>
                    <Text style = {styles.profileText}>
                      Followers: {selectedUser.follower_count}
                    </Text>
                  </AlteredTextButton>
                  <Text style = {styles.profileText}>{selectedUser.post_count} posts</Text>
                  <Text style = {styles.profileText}>
                    Last seen <Moment element={Text} fromNow>{selectedUser.last_seen}</Moment>
                  </Text>
                </View>
              </View>
              <View>
                <Animated.View style={{ height: wallInputHeight }}>
                  <WallPostForm onSubmit={this.wallPostSubmit} style={styles} />
                </Animated.View>
                <Animated.View style={{ height: inputHeight }}>
                  {showingPostInput ? <PostForm onSubmit={this.postSubmit} style={styles} /> : null}
                  {showingPlantInput ? <PlantForm onSubmit={this.plantSubmit} style={styles} data={usergarden_items}/> : null}
                  {showingGardenInput ? <GardenForm onSubmit={this.gardenSubmit} style={styles} navigation={navigation} /> : null}
                </Animated.View>
              </View>
              <View>
                {showingFollowed == true
                  ? <View>
                      <Followed id={id} style={styles} navigation={navigation}/>
                    </View>
                  : null
                }
                {showingFollowers == true
                  ? <View>
                      <Followers id={id} style={styles} navigation={navigation}/>
                    </View>
                  : null
                }
                <WallPosts style={styles} navigation={navigation} />
                <UserPosts style={styles} />
                <UserPlants style={styles} />
                <UserGardens style={styles} />
              </View>
            </View>
          </ScrollView>
        </View>
      )
    } else {
      return (
        <View>
          <Text>Fetching the resources. Did you know that you're awesome?</Text>
        </View>
      )
    }
  }
}

const mapStateToProps = (state, ownProps) => {
    return {
      fetched_user: state.user.fetched,
      fetched_posts: state.userposts.fetched,
      fetched_plants: state.userplants.fetched,
      fetched_usergardens: state.usergardens.fetched,
      showCurrentUser: state.user.showCurrentUser,
      user: state.user.user,
      otherUserBool: state.user.otherUserBool,
      otherUserID: state.user.otherUserID,
      otherFetched: state.user.otherFetched,
      otherUser: state.user.otherUser,
      post_items: state.userposts.items,
      plant_items: state.userplants.items,
      usergarden_items: state.usergardens.items,
      gardenChoice: state.usergardens.gardenChoice,
      address: state.map.address,
      addressError: state.usergardens.error,
      token: state.auth.token,
      showingFollowers: state.followers.showingFollowers,
      showingFollowed: state.followed.showingFollowed,
      showingPostInput: state.userposts.showingPostInput,
      showingPlantInput: state.userplants.showingPlantInput,
      showingWallPostInput: state.wallPosts.showingWallPostInput,
      showingGardenInput: state.usergardens.showingGardenInput,
      followers: state.followers,
      length: state.followers.items.length,
      state: state,
      usersList: state.user.usersList,
      usersIdList: state.user.usersIdList

    };
}


export default connect(mapStateToProps)(Profile);

const styles = StyleSheet.create ({
  homeScreenContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 5,
    marginTop: 3,
    backgroundColor: '#f0f4f0',
    alignItems: 'center',
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
  scrollViewContainer: {
    flex: 1,
    width: '100%'
  },
  gardenPlantListContainer: {
    flex: 8,
    flexDirection: 'row',
    padding: 0,
    marginTop: 0,
    backgroundColor: '#f0f4f0',
  },
  userProfileContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 2,
    marginTop: 4,
    backgroundColor: '#f0f4f0',
  },
  postPlantsContainer: {
    flex: 1,
    padding: 2,
    marginTop: 3,
    backgroundColor: '#d9f9b1',
    justifyContent: 'space-evenly',
  },
  userpanecontainer: {
    flex: 2,
    padding: 0,
    marginTop: 0,
    backgroundColor: '#f0f4f0',
    justifyContent: 'space-evenly',
  },
  profileTitleContainer: {
    padding: 0,
    marginTop: 0,
    alignItems: 'center',
  },
  avatarContainer: {
    flex: 2,
    padding: 0,
    marginTop: 0,
  },
  profileInfoContainer: {
    flex: 3,
    padding: 0,
    marginTop: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  followerscontainer: {
    padding: 8,
    marginTop: 5,
  },
  iconTextButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: "#f0f4f0",
    borderRadius: 5,
    borderTopWidth: 3,
    borderBottomWidth: 3,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: my_green,
  },
  gardenIconButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: "#f0f4f0",
    borderRadius: 5,
    borderColor: my_green,
  },
  myGreenTextButton: {
    margin: 5,
    padding: 5,
    borderColor: my_green,
    borderWidth: 2,
    borderRadius: 5
  },
  gardenIcon: {
    width: 24,
    height: 24,
    marginLeft: 10,
    marginRight: 15,
    padding: 0
  },
  iconText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: my_green,
    borderRadius: 5
  },
  profileNameText: {
     fontSize: 26,
     color: my_green
   },
  profileText: {
    fontSize: 16,
    color: '#4f603c'
  },
  errorText: {
   fontSize: 20,
   color: red,
 },
  reduxFormField: {
    margin: 5,
    padding: 5,
    backgroundColor: '#f0f4f0',
    borderWidth: 2,
    borderRadius: 8,
    borderColor: my_green,
    height: 80,
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
  textButton: {
    padding: 5,
    borderColor: white,
    borderWidth: 2,
    borderRadius: 5
  },
  inactiveTextButton: {
    padding: 5,
    borderColor: gray4,
    borderWidth: 2,
    borderRadius: 5
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
  gray4Text: {
   fontSize: 16,
   color: gray4
  }
})
