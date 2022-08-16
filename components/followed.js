import React, { Component } from 'react'
import {
  ScrollView, View, Text, TouchableOpacity, StyleSheet, Button, Image
} from 'react-native'
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
  getFollowed, lessFollowed, getFollowedSuccess, getFollowedFailure,
  getMoreFollowedSuccess, getMoreFollowedFailure
} from '../actions/followed'
import {
  getOtherUserFollowed, lessOtherUserFollowed, getOtherUserFollowedSuccess, getOtherUserFollowedFailure,
  getMoreOtherUserFollowedSuccess, getMoreOtherUserFollowedFailure
} from '../actions/otherUserFollowed'
import { setOtherUser } from '../actions/user'


class Followed extends Component {


  nextFollowed = (token, uri) => {
    const { dispatch } = this.props
    console.log("Dispatching getFollowed")
    return axios({
      method: 'GET',
      url: url,
      headers: {Authorization: `Bearer ${token}`}
    })
    .then((response) => {
      showCurrentUser
      ? (dispatch(getMoreUserFollowedSuccess(response.data)) && console.log('GET MORE USER FOLLOWED SUCCESS ---- ', Object.keys(response.data)))
      : (dispatch(getMoreOtherUserFollowedSuccess(response.data)) && console.log('GET MORE OTHER USER FOLLOWED SUCCESS ---- ', Object.keys(response.data)))
    })
    .catch(error => {
      console.log('ERROR --- ERROR --- ERROR', error)
      showCurrentUser
      ? dispatch(getMoreUserFollowedFailure(error.response))
      : dispatch(getMoreOtherUserFollowedFailure(error))
    })
  }

  lessFollowed = () => {
    const { dispatch, showCurrentUser, initNextLink, initSelfLink } = this.props
    showCurrentUser
    ? (dispatch(lessUserFollowed(initNextLink, initSelfLink)) && console.log("Dispatching lessUserFollowed"))
    : (dispatch(lessOtherUserFollowed(initNextLink, initSelfLink)) && console.log("Dispatching lessOtherUserFollowed"))
  }


  showState = () => {
    console.log(this.props.state.followed)
  }

  toOtherUserProfile = (id) => {
    const { dispatch, navigation } = this.props
    dispatch(setOtherUser(id)) && navigation.push('Profile');
  }

  async componentDidMount() {
    const { dispatch, token, fetched_followed, page, showCurrentUser, otherUserID } = this.props
    console.log('SHOWING CURRENT USER....', showCurrentUser)
    console.log('---=-=-==--=-====--==- OTHER USER ID=-=-==-=---=-==-==-=-', otherUserID)
    let uri = (showCurrentUser) ? `http://45.79.227.26/api/user/followed` : `http://45.79.227.26/api/users/${otherUserID}/followed`

    //console.log(page);
    try {
      let response = await fetch(
        uri, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      let responseJSON = await response.json();
      //console.log('FIRST API CALL RESPONSEJSON....', responseJSON)
      if (showCurrentUser) {
        dispatch(getFollowedSuccess(responseJSON))
      } else {
        dispatch(getOtherUserFollowedSuccess(responseJSON))
      }
    } catch (error) {
      console.error(error);
    }
  }


  render() {
    const {  currentUserLinks, followed_items, fetching, fetched_followed, token, error,
      state, user, showCurrentUser, fetchedOtherUserFollowed, otherUserFollowedItems,
      otherUserFollowedLinks, pageOtherUserFollowed, errorOtherUserFollowed,
      otherUserID, otherUser, style } = this.props
    //TRYING TO SET UP A 'NEXT' Button
    //TRYING TO PASS THE 'NEXT' LINK DOWN TO THE TextButton
    //AND THEN FIGURE OUT HOW TO dispatch getFollowed
    //console.log("Here's the token!.....", token)
    //console.log("Fetching the next set of followed.")
    console.log("Here's the token!.....", token)
    console.log("====fetchedOtherUserFollowed================================", fetchedOtherUserFollowed)
    console.log("===================================otherUserFollowedItems==========================", otherUserFollowedItems)
    if (fetched_followed == true || fetchedOtherUserFollowed == true) {
      console.log('<><><><><><><><><>OTHER USER FOLLOWED FETCHED ???? <><><><><><><><><><><><> ', fetchedOtherUserFollowed,)
      let uri = (showCurrentUser) ? '/api/user/followed' : `/api/user/${otherUserID}/followed`
      let links = (showCurrentUser) ? currentUserLinks : otherUserFollowedLinks;
      //console.log("Here are the links!.....", links.next)
      //console.log(state)
      //console.log("Trying to get the uri.....", uri)
      let items = (showCurrentUser) ? followed_items : otherUserFollowedItems;

      return (
        <ScrollView style={style.scrollViewAsContainer}>
          <View>
            <View style={style.scrollViewHeaderContainer}>
              <Text style={style.scrollViewHeaderText}>{showCurrentUser ? 'You are' : otherUser.username + " is"} following {showCurrentUser ? user.followed_count : otherUser.followed_count} people</Text>
            </View>
            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={index == items.length - 1 ? styles.endListContainer : styles.listContainer}
                onPress={() => this.toOtherUserProfile(item.id)}
                >
                <View style={styles.listAvatarContainer}>
                  <Image
                    style={{width: 95, height: 95}}
                    source={{uri: item._links.avatar}}
                  />
                </View>
                <View style={styles.listUserInfoContainer}>
                  <Text style = {styles.profileNameText}>{item.username}</Text>
                  <Text style = {styles.profileText}>Following: {item.followed_count}</Text>
                  <Text style = {styles.profileText}>Followed: {item.followed_count}</Text>
                  <Text style = {styles.profileText}>{item.post_count} posts</Text>
                  <Text style = {styles.profileText}>
                    Last seen <Moment element={Text} fromNow>{item.last_seen}</Moment>
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <View style={style.moreLessButtonsContainer}>
            {(links.prev) ?
              <AlteredTextButton
                style={style.filledTextButton}
                textStyle={style.whiteText}
                onPress={e => this.lessFollowed()}>
                Less Followed
              </AlteredTextButton>
              :
                <AlteredTextButton
                  style={style.inactiveFilledTextButton}
                  textStyle={style.whiteText}
                  onPress={this.inactiveButton}>
                  Less Followed
                </AlteredTextButton>
            }
            {(links.next) ?
              <AlteredTextButton
                style={style.filledTextButton}
                textStyle={style.whiteText}
                onPress={e => this.nextFollowed(token, links.next)}
              >
                More Followed
                </AlteredTextButton>
              :
                <AlteredTextButton
                  style={style.inactiveFilledTextButton}
                  textStyle={style.whiteText}
                  onPress={this.inactiveButton}
                >
                  More Followed
                </AlteredTextButton>
            }
          </View>
        </ScrollView>
      )
    } else if (error) {
      return (
        <View style={style.errorContainer}>
          <Text style={style.text}>{error}</Text>
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
      fetched_followed: state.followed.fetched,
      page: state.followed.page,
      followed_items: state.followed.items,
      currentUserLinks: state.followed.links,
      error: state.followed.error,
      fetchedOtherUserFollowed: state.otherUserFollowed.fetched,
      pageOtherUserFollowed: state.otherUserFollowed.page,
      otherUserFollowedItems: state.otherUserFollowed.items,
      otherUserFollowedLinks: state.otherUserFollowed.links,
      errorOtherUserFollowed: state.otherUserFollowed.error,
      token: state.auth.token,
      state: state,
      user: state.user.user,
      initNextLink: state.otherUserFollowed.initNextLink,
      initSelfLink: state.otherUserFollowed.initSelfLink,
      showCurrentUser: state.user.showCurrentUser,
      otherUserBool: state.user.otherUserBool,
      otherUserID: state.user.otherUserID,
      otherFetched: state.user.otherFetched,
      otherUser: state.user.otherUser,
    };
}


export default connect(mapStateToProps)(Followed);

const styles = StyleSheet.create ({
  listContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 5,
    marginTop: 3,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: '#e1f2e1',
   },
  endListContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 5,
    marginTop: 3,
    alignItems: 'center',
    },
  listAvatarContainer: {
    flex: 4,
    paddingRight: 10,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: '#f0f4f0',
  },
  listUserInfoContainer: {
    flex: 9,
    justifyContent: 'space-around',
    paddingLeft: 10,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: '#f0f4f0',
  },
  profileNameText: {
    fontSize: 18,
    color: my_green
  },
  profileText: {
    fontSize: 16,
    color: '#4f603c'
  },
})
