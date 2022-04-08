import React, { Component } from 'react'
import {
  ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet,
  Button, Image, Platform
} from 'react-native'
import ModalSelector from 'react-native-modal-selector'
import Moment from 'react-moment';
import 'moment-timezone';
import AlteredTextButton from './AlteredTextButton'
import { MapView } from 'expo';
import { connect } from 'react-redux'
import {
  white, my_green, green, gray, red, purple, orange, blue, my_blue,
  lightPurp, black, pink
} from '../utils/colors'
import {
  getUserPosts, getUserPostsSuccess, getUserPostsFailure,
  submitUserPost, hidePostInput, showPostInput
} from '../actions/userposts'
import {
  getUserPlants, getUserPlantsSuccess, getUserPlantsFailure,
  submitUserPlant, hidePlantInput, showPlantInput
} from '../actions/userplants'
import {
  submitUserGarden, hideGardenInput, showGardenInput, updatePicker,
  submitUserGardenFailure, getUserGardens
} from '../actions/usergardens'
import { getUser, getUserSuccess, getUserFailure, getOtherUserSuccess } from '../actions/user'
import { showFollowers, hideFollowers } from '../actions/followers'
import { showFollowed, hideFollowed } from '../actions/followed'
import PostInput from './postInput'
import Followers from './followers'
import Followed from './followed'
import UserPosts from './userposts'
import UserPlants from './userplants'
import UserGardens from './usergardens'
import PlantInput from './plantInput'
import PlantForm from './plantForm'
import PostForm from './postForm'
import GardenForm from './gardenForm'
import axios from 'axios';
import { SubmissionError } from 'redux-form'
import { Ionicons } from '../node_modules/@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome'
import Icons from 'react-native-vector-icons/Ionicons'
import Iconss from 'react-native-vector-icons/SimpleLineIcons'



class Profile extends Component {
  static navigationOptions = ({ navigation }) => {

    return {
      title: 'Profile',
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
    selectedGarden: {},
    gardenName: '',
    gardenID: 0,
    gardenImg: null,

  }

  async fetchCurrentUser(){
    const { dispatch, token } = this.props
    try {
      let response = await fetch(
        `http://@34.221.120.52/api/user`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      let responseJSON = await response.json();
      //console.log(responseJSON)
      dispatch(getUserSuccess(responseJSON))
    } catch (error) {
      console.error(error);
    }
  }
  async fetchUser(id){
    const { dispatch, token } = this.props
    try {
      let response = await fetch(
        `http://@34.221.120.52/api/users/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      let responseJSON = await response.json();
      console.log(responseJSON)
      dispatch(getOtherUserSuccess(responseJSON))
    } catch (error) {
      console.error(error);
    }
  }

  componentDidMount() {
    const { dispatch, token, gardenChoice, otherUserBool, otherUserID, showCurrentUser } = this.props
    console.log('PROFILE   ', token);
    console.log('ARE WE SHOWING THE CURRENT USER ---> ', showCurrentUser);
    (showCurrentUser) ? (this.fetchCurrentUser() && console.log('Current User')) : (this.fetchUser(otherUserID) && console.log('Other User --> user id --> ', otherUserID))
    this.setState({
      selectedGarden: gardenChoice,
      gardenName: gardenChoice.name,
      gardenID: gardenChoice.id
    })
  }

  plantSubmit = (values) => {
    const { dispatch, token} = this.props

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

    dispatch(submitUserPost(dispatch, token, values.post))
    // print the form values to the console
    console.log(values.post);
    }
  gardenSubmit = (values) => {
    const { dispatch, token} = this.props

    //Note: The following request is disabled while troubleshooting error
    //handling on the gardenForm to keep from adding so many new gardens
    return axios({
      method: 'POST',
      url: `http://34.221.120.52/api/user/garden`,
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
      throw new SubmissionError({ _error: 'Invalid Address' });
      console.log('SUBMISSION ERROR SUCCESS! ! !', error.response.data.message)

    })

    //dispatch(submitUserGarden(dispatch, token, values.garden, values.address))
    // print the form values to the console
    //console.log('GARDEN FORM VALUES   ', values);
    }

  toMap = () => {
    this.props.navigation.navigate('Map',
      {placingGarden: false}
    );
  }
  toHome = () => {
    this.props.navigation.navigate('Home');
  }

  togglePostInput = (e) => {
    const { dispatch, showingPostInput } = this.props
    showingPostInput
    ? dispatch(hidePostInput())
    : dispatch(showPostInput())
    e.preventDefault();
  }
  togglePlantInput = (e) => {
    const { dispatch, showingPlantInput } = this.props
    showingPlantInput
    ? dispatch(hidePlantInput())
    : dispatch(showPlantInput())
    e.preventDefault();
  }
  toggleGardenInput = (e) => {
    const { dispatch, showingGardenInput } = this.props
    showingGardenInput
    ? dispatch(hideGardenInput())
    : dispatch(showGardenInput())
    e.preventDefault();
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
      otherUser, showCurrentUser
    } = this.props
    const { selectedGarden, gardenName, gardenID } = this.state
    //console.log(this.props)
    //const { address } = this.props.navigation.state.params
    //address && console.log('CHECKING IF ADDRESS IS ACCESSIBLE ON RETURN TO PROFILE  ', address)
    //console.log('IS GARDEN INPUT SHOWING -- ', showingGardenInput)
    //console.log('SHOWING -- FORM -- STATE -- SHOWING -- FORM -- STATE -- SHOWING -- FORM -- STATE ', state.form)

    if (fetched_user == true || otherFetched == true) {
      //console.log('User', user)
      //console.log('Avatar', user._links['avatar'])
      // console.log("Showing Followers?", showingFollowers)
      // console.log("Showing Followed?", showingFollowed)
      //console.log('Followers', followers, length)
      //fetched_user && console.log('----CURRENT-USER----CURRENT-USER----', user)
      //console.log('LOGGING FETCHED CURRENT USER----CURRENT USER----CURRENT USER-------------', fetched_user)
      //console.log('LOGGING FETCHED OTHER USER----OTHER USER----OTHER USER----------', otherFetched)
      //otherFetched && console.log('OTHER USER----OTHER USER    ', otherUser)
      let imageSrc = (otherUserBool == true) ? otherUser._links['avatar'] : user._links['avatar'];
      let selectedUser = (otherUserBool == true) ? otherUser: user;
      //let imgSrc = user._links['avatar'];
      return (
        <View>
          <MapView
            initialRegion={{
              latitude: 45.487292,
              longitude: -122.635435,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
          <ScrollView>
            <View style = {styles.postplantsContainer}>
              <View style = {styles.userProfileContainer}>
                <View style = {styles.avatarContainer}>
                  <Image
                    style={{width: 110, height: 110}}
                    source={{uri: imageSrc}}
                  />
                </View>
                <View style = {styles.profileInfoContainer}>
                  <Text style = {styles.profileText}>{selectedUser.username}</Text>
                  <Text style = {styles.text}>
                    <AlteredTextButton onPress={this.toggleFollowed}>
                      Following: {selectedUser.followed_count}
                    </AlteredTextButton>
                  </Text>
                  <Text style = {styles.text}>
                    <AlteredTextButton onPress={this.toggleFollowers}>
                      Followers: {selectedUser.follower_count}
                    </AlteredTextButton>
                  </Text>
                  <Text style = {styles.text}>{selectedUser.post_count} posts</Text>
                  <Text style = {styles.text}>
                    Last seen <Moment element={Text} fromNow>{selectedUser.last_seen}</Moment>
                  </Text>
                </View>
              </View>
              <View style = {styles.iconButtonsContainer}>
                {Platform.OS === 'ios'
                ? <Icons.Button
                    name="ios-map"
                    size={28}
                    color={my_green}
                    backgroundColor="#f0f4f0"
                    onPress={this.toMap}
                  >
                    Map
                  </Icons.Button>
                : <Icons.Button
                    name="md-map"
                    size={28}
                    color={my_green}
                    backgroundColor="#f0f4f0"
                    onPress={this.toMap}
                  >
                    Map
                  </Icons.Button>
                }
                {Platform.OS === 'ios'
                  ? <Icon.Button
                    name="pencil"
                    size={28}
                    color={my_green}
                    backgroundColor="#f0f4f0"
                    onPress={this.togglePostInput}
                    >Post
                    </Icon.Button>
                  : <Icon.Button
                    name="pencil"
                    size={28}
                    color={my_green}
                    backgroundColor="#f0f4f0"
                    onPress={this.togglePostInput}
                    >Post
                    </Icon.Button>
                }
                {Platform.OS === 'ios'
                  ? <Icons.Button
                    name="ios-leaf"
                    size={28}
                    color={my_green}
                    backgroundColor="#f0f4f0"
                    onPress={this.togglePlantInput}
                    >
                      Plant
                    </Icons.Button>
                  : <Icons.Button
                    name="md-leaf"
                    size={28}
                    color={my_green}
                    backgroundColor="#f0f4f0"
                    onPress={this.togglePlantInput}
                    >
                      Plant
                    </Icons.Button>
                }
                <TouchableOpacity style={styles.iconTextButton} onPress={this.toggleGardenInput}>
                  <Image
                    source={require('../utils/img/soilsolid64px.png')}
                    resizeMode={"contain"}
                    style={styles.gardenIcon}
                  />
                  <Text style={styles.iconText}>Garden</Text>
                </TouchableOpacity>
              </View>
              <View>
              {showingPostInput == true
                ? <PostForm onSubmit={this.postSubmit} style={styles} />
                : null
              }
              {showingPlantInput == true
                ? <PlantInput />
                : null
              }
              {showingPlantInput == true
                ? <PlantForm onSubmit={this.plantSubmit} style={styles} data={usergarden_items}/>
                : null
              }
              {showingGardenInput == true
                ? <GardenForm onSubmit={this.gardenSubmit} style={styles} navigation={navigation} />
                : null
              }
              </View>
              <View>
                {showingFollowed == true
                  ? <View style = {styles.followerscontainer}>
                      <Followed />
                    </View>
                  : null
                }
                {showingFollowers == true
                  ? <View style = {styles.followerscontainer}>
                      <Followers navigation={ this.props.navigation }/>
                    </View>
                  : null
                }
                <UserPlants />
                <UserGardens />
                <UserPosts />
              </View>
            </View>
          </ScrollView>
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
      showingGardenInput: state.usergardens.showingGardenInput,
      followers: state.followers,
      length: state.followers.items.length,
      state: state,

    };
}


export default connect(mapStateToProps)(Profile);

const styles = StyleSheet.create ({
  container: {
    padding: 5,
    marginTop: 3,
    backgroundColor: '#d9f9b1',
    alignItems: 'center',
  },
  gardenPlantListContainer: {
    flex: 8,
    flexDirection: 'row',
    padding: 0,
    marginTop: 0,
    backgroundColor: '#f0f4f0',
  },
  postPlantsContainer: {
    flex: 2,
    padding: 2,
    marginTop: 1,
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
  userProfileContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 0,
    marginTop: 0,
    backgroundColor: '#f0f4f0',
  },
  avatarContainer: {
    flex: 12,
    padding: 0,
    marginTop: 0,
  },
  profileInfoContainer: {
    flex: 28,
    padding: 0,
    marginTop: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  followerscontainer: {
    padding: 8,
    marginTop: 5,
  },
  iconButtonsContainer: {
   maxHeight: 50,
   width: '100%',
   flex: 1,
   flexDirection: 'row',
   justifyContent: 'space-around',
   borderBottomWidth: 3,
   borderColor: my_green,
  },
  iconTextButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: "#f0f4f0",
    borderRadius: 5,
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
  text: {
    fontSize: 16,
    color: '#4f603c'
  },
  errorText: {
   fontSize: 20,
   color: red,
 },
  profileText: {
    fontSize: 24,
    color: my_green
  },
  reduxFormField: {
    margin: 5,
    padding: 5,
    backgroundColor: '#f0f4f0',
    borderWidth: 2,
    borderColor: my_green,
  }
})


/*<AlteredTextButton style={styles.myGreenTextButton} textStyle={styles.profileText} onPress={this.toMap}>
  Map
</AlteredTextButton>
<AlteredTextButton style={styles.myGreenTextButton} textStyle={styles.profileText} onPress={this.togglePostInput}>
  Got something to say?
</AlteredTextButton>
<AlteredTextButton style={styles.myGreenTextButton} textStyle={styles.profileText} onPress={this.toggleGardenInput}>
  Add a Garden
  {Platform.OS === 'ios'
    ? <Ionicons name="ios-add" size={28} color={my_green} />
    : <Ionicons name="md-add" size={20} color={my_green} />
  }
  <Image
    source={require('../utils/img/gardeningsolid64px.png')}
    resizeMode={"contain"}
    style={{width: 28, height: 28}}
  />
</AlteredTextButton>
{addressError
? <Text>{addressError}</Text>
: null
}
<AlteredTextButton style={styles.myGreenTextButton} textStyle={styles.profileText} onPress={this.togglePlantInput}>
  {Platform.OS === 'ios'
    ? <Ionicons name="ios-leaf" size={28} color={my_green} />
    : <Ionicons name="md-leaf" size={20} color={my_green} />
  }
</AlteredTextButton>*/
