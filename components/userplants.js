import React, { Component } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native'
import AlteredTextButton from './AlteredTextButton'
import Moment from 'react-moment';
import 'moment-timezone';
import { connect } from 'react-redux'
import axios from 'axios';
import {
  white, my_green, green, gray4, red, purple, orange, blue, my_blue,
  lightPurp, black, pink
} from '../utils/colors'
import {
  getUserPlants, lessUserPlants, getUserPlantsSuccess, getUserPlantsFailure,
  getMoreUserPlantsSuccess, getMoreUserPlantsFailure
} from '../actions/userplants'
import {
  getOtherUserPlants, lessOtherUserPlants, getOtherUserPlantsSuccess, getOtherUserPlantsFailure,
  getMoreOtherUserPlantsSuccess, getMoreOtherUserPlantsFailure
} from '../actions/otherUserPlants'
import { setOtherUser } from '../actions/user'

class UserPlants extends Component {


  nextUserPlants = (token, uri_end) => {
    const { dispatch, showCurrentUser } = this.props
    let uri = `http://34.221.120.52` + uri_end
    console.log("Dispatching getUserPlants")
    return axios({
      method: 'GET',
      url: uri,
      headers: {Authorization: `Bearer ${token}`}
    })
    .then((response) => {
      showCurrentUser
      ? (dispatch(getMoreUserPlantsSuccess(response.data)) && console.log('GET MORE USER PLANT SUCCESS ---- ', Object.keys(response.data)))
      : (dispatch(getMoreOtherUserPlantsSuccess(response.data)) && console.log('GET MORE OTHER USER PLANT SUCCESS ---- ', Object.keys(response.data)))
    })
    .catch(error => {
      console.log('ERROR --- ERROR --- ERROR', error)
      showCurrentUser
      ? dispatch(getMoreUserPlantsFailure(error.response))
      : dispatch(getMoreOtherUserPlantsFailure(error))
    })
  }

  lessUserPlants = () => {
    const { dispatch, showCurrentUser, initNextLink, initSelfLink } = this.props
    showCurrentUser
    ? (dispatch(lessUserPlants(initNextLink, initSelfLink)) && console.log("Dispatching lessUserPlants"))
    : (dispatch(lessOtherUserPlants(initNextLink, initSelfLink)) && console.log("Dispatching lessOtherUserPlants"))

  }

  inactiveButton = () => {
    var inactiveButtonPressed = true
  }

  showState = () => {
    console.log(this.props.state.userplants)
  }

  fetchUserPlants = () => {
    const { dispatch, token, showCurrentUser, otherUserBool, otherUserID } = this.props
    let uri = (showCurrentUser) ? `http://34.221.120.52/api/user/plants` : `http://34.221.120.52/api/user/${otherUserID}/plants`

    return axios({
      method: 'GET',
      url: uri,
      headers: {Authorization: `Bearer ${token}`}
    })
    .then((response) => {
      showCurrentUser
      ? (dispatch(getUserPlantsSuccess(response.data)) && console.log('GET USER PLANT SUCCESS ---- ', Object.keys(response.data)))
      : (dispatch(getOtherUserPlantsSuccess(response.data)) && console.log('GET OTHER USER PLANT SUCCESS ---- ', Object.keys(response.data)))
    })
    .catch(error => {
      console.log('ERROR --- ERROR --- ERROR', error)
      showCurrentUser
      ? dispatch(getUserPlantsFailure(error.response))
      : dispatch(getOtherUserPlantsFailure(error))
    })
  }

  async componentDidMount() {
    const { dispatch, token, page, showCurrentUser, otherUserBool, otherUser } = this.props
    //console.log(page);
    this.fetchUserPlants()
    /*try {
      let response = await fetch(
        `http://@34.221.120.52/api/user/plants`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      let responseJSON = await response.json();
      //console.log('FIRST API CALL RESPONSEJSON....', responseJSON)
      dispatch(getUserPlantsSuccess(responseJSON))
    } catch (error) {
      console.error(error);
    }*/
  }

  toOtherUserProfile = (id) => {
    const { dispatch, navigation } = this.props
    dispatch(setOtherUser(id))
    navigation.navigate('Profile');
  }


  render() {
    const {
      links, userplant_items, fetching, fetched_userplants, token, error,
      state, page, showCurrentUser, fetchedOtherUserPlants, otherUserPlantsItems,
      otherUserPlantsLinks, pageOtherUserPlants, errorOtherUserPlants,
      otherUserID
    } = this.props
    //TRYING TO SET UP A 'NEXT' Button
    //TRYING TO PASS THE 'NEXT' LINK DOWN TO THE AlteredTextButton
    //AND THEN FIGURE OUT HOW TO dispatch getUsers
    //console.log("Here's the token!.....", token)
    //console.log("Fetching the next set of userplants.")
    //fetchedOtherUserPlants && console.log('OTHER USER PLANTS FETCHED SUCCESS<><><><><> ', otherUserPlantsItems)
    if (fetched_userplants == true || fetchedOtherUserPlants == true) {
      //console.log(page);
      //console.log('OTHER USER PLANTS FETCHED ???? <><><><><> ', fetchedOtherUserPlants)
      let urii = (showCurrentUser) ? '/api/user/plants' : `/api/user/${otherUserID}/plants`
      let linkss = (showCurrentUser) ? links : otherUserPlantsLinks;
      //let uri = '/api/user/plants'
      //console.log("Here are the links!.....", links.next)
      if (linkss.next) {
        uri = linkss.next;
      }
      let items = (showCurrentUser) ? userplant_items : otherUserPlantsItems;
      //console.log(state)
      //console.log("Trying to get the uri.....", uri)
      return (
        <ScrollView style={styles.scrollViewAsContainer}>
          <View style = {styles.scrollViewHeaderContainer}>
            <Text style = {styles.scrollViewHeaderText}>Here are you're most recent plants</Text>
          </View>
          <View>
            {items.map((item, index) => (
              <View key = {item.timestamp} style = {styles.container}>
                <Text style = {styles.text}>{item.grower} planted {item.name}:  </Text>
                <Text style = {styles.text}>
                  <Moment element={Text} fromNow>{item.timestamp}</Moment>
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.moreLessButtonsContainer}>
            {(linkss.prev) ?
              <AlteredTextButton
                style={styles.filledTextButton}
                textStyle={styles.whiteText}
                onPress={e => this.lessUserPlants()}
              >
                Less Plants
              </AlteredTextButton>
              :
                <AlteredTextButton
                  style={styles.inactiveFilledTextButton}
                  textStyle={styles.whiteText}
                  onPress={this.inactiveButton}>
                  Less Plants
                </AlteredTextButton>
            }
            {(linkss.next) ?
              <AlteredTextButton
                style={styles.filledTextButton}
                textStyle={styles.whiteText}
                onPress={e => this.nextUserPlants(token, uri)}
              >
                More Plants
              </AlteredTextButton>
              :
                <AlteredTextButton
                  style={styles.inactiveFilledTextButton}
                  textStyle={styles.whiteText}
                  onPress={this.inactiveButton}
                >
                  More Plants
                </AlteredTextButton>
            }
          </View>
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
      fetched_userplants: state.userplants.fetched,
      page: state.userplants.page,
      userplant_items: state.userplants.items,
      links: state.userplants.links,
      error: state.userplants.error,
      fetchedOtherUserPlants: state.otherUserPlants.fetched,
      pageOtherUserPlants: state.otherUserPlants.page,
      otherUserPlantsItems: state.otherUserPlants.items,
      otherUserPlantsLinks: state.otherUserPlants.links,
      errorOtherUserPlants: state.otherUserPlants.error,
      token: state.auth.token,
      state: state,
      showCurrentUser: state.user.showCurrentUser,
      otherUserBool: state.user.otherUserBool,
      otherUserID: state.user.otherUserID,
      otherFetched: state.user.otherFetched,
      otherUser: state.user.otherUser,
    };
}


export default connect(mapStateToProps)(UserPlants);

const styles = StyleSheet.create ({
  scrollViewAsContainer: {
    borderWidth: 2,
    borderRadius: 3,
    borderColor: my_green,
    marginTop: 3,
  },
  container: {
    padding: 5,
    marginTop: 3,
    backgroundColor: '#f0f4f0',
    alignItems: 'center',
  },
  scrollViewHeaderContainer: {
    backgroundColor: my_green,
  },
  moreLessButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 5,
    margin: 3,
    backgroundColor: '#f0f4f0',
  },
  errorContainer: {
    padding: 5,
    marginTop: 3,
    marginBottom: 30,
    backgroundColor: '#d9f9b1',
    alignItems: 'center',
  },
  textButton: {
    padding: 5,
    color: my_green,
    borderColor: my_green,
    borderWidth: 2,
    borderRadius: 5
  },
  inactiveTextButton: {
    padding: 5,
    borderColor: gray4,
    borderWidth: 2,
    borderRadius: 5
  },
  filledTextButton: {
    padding: 5,
    backgroundColor: my_green,
    borderColor: my_green,
    borderWidth: 2,
    borderRadius: 5
  },
  inactiveFilledTextButton: {
    padding: 5,
    backgroundColor: gray4,
    borderColor: gray4,
    borderWidth: 2,
    borderRadius: 5
  },
  text: {
    fontSize: 20,
    color: black
  },
  whiteText: {
    fontSize: 16,
    color: white
  },
  myGreenText: {
    fontSize: 16,
    color: my_green
  },
  gray4Text: {
    fontSize: 16,
    color: gray4
  }
})
