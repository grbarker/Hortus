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
  getFollowers, lessFollowers, getFollowersSuccess, getFollowersFailure,
  getMoreFollowersSuccess, getMoreFollowersFailure
} from '../actions/followers'
import { setOtherUser } from '../actions/user'


class Followers extends Component {


  nextFollowers = (token, uri) => {
    const { dispatch } = this.props
    console.log("Dispatching getFollowers")
    return axios({
      method: 'GET',
      url: url,
      headers: {Authorization: `Bearer ${token}`}
    })
    .then((response) => {
      showCurrentUser
      ? (dispatch(getMoreUserFollowersSuccess(response.data)) && console.log('GET MORE USER FOLLOWERS SUCCESS ---- ', Object.keys(response.data)))
      : (dispatch(getMoreOtherUserFollowersSuccess(response.data)) && console.log('GET MORE OTHER USER FOLLOWERS SUCCESS ---- ', Object.keys(response.data)))
    })
    .catch(error => {
      console.log('ERROR --- ERROR --- ERROR', error)
      showCurrentUser
      ? dispatch(getMoreUserFollowersFailure(error.response))
      : dispatch(getMoreOtherUserFollowersFailure(error))
    })
  }

  lessFollowers = () => {
    const { dispatch, showCurrentUser, initNextLink, initSelfLink } = this.props
    showCurrentUser
    ? (dispatch(lessUserFollowers(initNextLink, initSelfLink)) && console.log("Dispatching lessUserFollowers"))
    : (dispatch(lessOtherUserFollowers(initNextLink, initSelfLink)) && console.log("Dispatching lessOtherUserFollowers"))
  }

  showState = () => {
    console.log(this.props.state.followers)
  }

  toOtherUserProfile = (id) => {
    const { dispatch, navigation } = this.props
    dispatch(setOtherUser(id)) && navigation.push('Profile');
  }

  async componentDidMount() {
    const { dispatch, token, fetched_followers, page, showCurrentUser, otherUserID } = this.props
    let uri = (showCurrentUser) ? `http://45.79.227.26/api/user/followers` : `http://45.79.227.26/api/users/${otherUserID}/followers`
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
      //console.log('FIRST API CALL FOR FOLLOWERS RESPONSEJSON....', responseJSON)
      dispatch(getFollowersSuccess(responseJSON))
    } catch (error) {
      console.error(error);
    }
  }


  render() {
    const {  currentUserLinks, followers_items, fetching, fetched_followers,
      token, error, state, user, showCurrentUser, fetchedOtherUserFollowers, otherUserFollowersItems,
      otherUserFollowersLinks, pageOtherUserFollowers, errorOtherUserFollowers,
      otherUserID, otherUser, style } = this.props
    // console.log("Here's the token!.....", token)
    // console.log("Fetching the next set of followers.")
    if (fetched_followers == true || fetchedOtherUserFollowers == true) {
      let uri = (showCurrentUser) ? '/api/user/followers' : `/api/user/${otherUserID}/followers`
      let links = (showCurrentUser) ? currentUserLinks : otherUserFollowersLinks;
      //console.log("Here are the links!.....", links.next)
      //console.log("Trying to get the uri.....", uri)
      console.log("NUMBER OF OTHER USER FOLLOWERS.....", otherUser)
      let items = (showCurrentUser) ? followers_items : otherUserFollowersItems;
      //console.log(state)
      //console.log("Trying to get the uri.....", uri)
      return (
        <ScrollView style={style.scrollViewAsContainer}>
          <View>
            <View style={style.scrollViewHeaderContainer}>
              <Text style = {style.scrollViewHeaderText}>{showCurrentUser ? user.follower_count : otherUser.follower_count} people are following {showCurrentUser ? 'you' : otherUser.username}.</Text>
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
                  <Text style={styles.profileNameText}>{item.username}</Text>
                  <Text style={styles.profileText}>Following: {item.follower_count}</Text>
                  <Text style={styles.profileText}>Followers: {item.follower_count}</Text>
                  <Text style={styles.profileText}>{item.post_count} posts</Text>
                  <Text style={styles.profileText}>
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
                onPress={e => this.lessFollowers()}>
                Less Followers
              </AlteredTextButton>
              :
                <AlteredTextButton
                  style={style.inactiveFilledTextButton}
                  textStyle={style.whiteText}
                  onPress={this.inactiveButton}>
                  Less Followers
                </AlteredTextButton>
            }
            {(links.next) ?
              <AlteredTextButton
                style={style.filledTextButton}
                textStyle={style.whiteText}
                onPress={e => this.nextFollowers(token, links.next)}
              >
                More Followers
                </AlteredTextButton>
              :
                <AlteredTextButton
                  style={style.inactiveFilledTextButton}
                  textStyle={style.whiteText}
                  onPress={this.inactiveButton}
                >
                  More Followers
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
      fetched_followers: state.followers.fetched,
      page: state.followers.page,
      followers_items: state.followers.items,
      currentUserLinks: state.followers.links,
      error: state.followers.error,
      fetchedOtherUserFollowers: state.otherUserFollowers.fetched,
      pageOtherUserFollowers: state.otherUserFollowers.page,
      otherUserFollowersItems: state.otherUserFollowers.items,
      otherUserFollowersLinks: state.otherUserFollowers.links,
      errorOtherUserFollowers: state.otherUserFollowers.error,
      token: state.auth.token,
      state: state,
      user: state.user.user,
      initNextLink: state.otherUserFollowers.initNextLink,
      initSelfLink: state.otherUserFollowers.initSelfLink,
      showCurrentUser: state.user.showCurrentUser,
      otherUserBool: state.user.otherUserBool,
      otherUserID: state.user.otherUserID,
      otherFetched: state.user.otherFetched,
      otherUser: state.user.otherUser,
    };
}


export default connect(mapStateToProps)(Followers);

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
    justifyContent: 'space-around',
    paddingRight: 10,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: '#f0f4f0',
  },
  listUserInfoContainer: {
    flex: 9,
    paddingLeft: 10,
    marginTop: 5,
    marginBottom: 5,
    marginRight: 5,
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
