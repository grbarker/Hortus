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
  getUserPosts, lessUserPosts, getUserPostsSuccess, getUserPostsFailure,
  getMoreUserPostsSuccess, getMoreUserPostsFailure
} from '../actions/userposts'
import {
  getOtherUserPosts, lessOtherUserPosts, getOtherUserPostsSuccess, getOtherUserPostsFailure,
  getMoreOtherUserPostsSuccess, getMoreOtherUserPostsFailure
} from '../actions/otherUserPosts'

class UserPosts extends Component {


  lessUserPosts = () => {
    const { dispatch, showCurrentUser, initNextLink, initSelfLink } = this.props
    showCurrentUser
    ? (dispatch(lessUserPosts(initNextLink, initSelfLink)) && console.log("Dispatching lessUserPosts"))
    : (dispatch(lessOtherUserPosts(initNextLink, initSelfLink)) && console.log("Dispatching lessOtherUserPosts"))

  }

  inactiveButton = () => {
    var inactiveButtonPressed = true
  }

  showState = () => {
    console.log(this.props.state.userposts)
  }


  nextUserPosts = (token, uri_end) => {
    const { dispatch, showCurrentUser } = this.props
    let url = `http://45.79.227.26` + uri_end
    return axios({
      method: 'GET',
      url: url,
      headers: {Authorization: `Bearer ${token}`}
    })
    .then((response) => {
      showCurrentUser
      ? (dispatch(getMoreUserPostsSuccess(response.data)) && console.log('GET MORE USER POST SUCCESS ---- ', Object.keys(response.data)))
      : (dispatch(getMoreOtherUserPostsSuccess(response.data)) && console.log('GET MORE OTHER USER POST SUCCESS ---- ', Object.keys(response.data)))
    })
    .catch(error => {
      console.log('ERROR --- ERROR --- ERROR', error)
      showCurrentUser
      ? dispatch(getMoreUserPostsFailure(error.response))
      : dispatch(getMoreOtherUserPostsFailure(error))
    })
  }


  fetchUserPosts = () => {
    const { dispatch, token, showCurrentUser, otherUserBool, otherUserID } = this.props
    let uri = (showCurrentUser) ? `http://45.79.227.26/api/user/posts` : `http://45.79.227.26/api/user/${otherUserID}/posts`

    return axios({
      method: 'GET',
      url: uri,
      headers: {Authorization: `Bearer ${token}`}
    })
    .then((response) => {
      showCurrentUser
      ? (dispatch(getUserPostsSuccess(response.data)) && console.log('GET USER POST SUCCESS ---- ', Object.keys(response.data)))
      : (dispatch(getOtherUserPostsSuccess(response.data)) && console.log('GET OTHER USER POST SUCCESS ---- ', Object.keys(response.data)))
    })
    .catch(error => {
      console.log('ERROR --- ERROR --- ERROR', error)
      showCurrentUser
      ? dispatch(getUserPostsFailure(error.response))
      : dispatch(getOtherUserPostsFailure(error))
    })
  }

  async componentDidMount() {
    const { dispatch, token, page } = this.props
    //console.log(page);
    this.fetchUserPosts()
    /*try {
      let response = await fetch(
        `http://@45.79.227.26/api/user/posts`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      let responseJSON = await response.json();
      //console.log('FIRST API CALL RESPONSEJSON....', responseJSON)
      dispatch(getUserPostsSuccess(responseJSON))
    } catch (error) {
      console.error(error);
    }*/
  }


  render() {
    const {
      currentUserLinks, userpost_items, fetching, fetched_userposts, token, error,
      state, page, showCurrentUser, fetchedOtherUserPosts, otherUserPostsItems,
      otherUserPostsLinks, pageOtherUserPosts, errorOtherUserPosts,
      otherUserID, otherUser, style
    } = this.props
    //TRYING TO SET UP A 'NEXT' Button
    //TRYING TO PASS THE 'NEXT' LINK DOWN TO THE AlteredTextButton
    //AND THEN FIGURE OUT HOW TO dispatch getUsers
    //console.log("Here's the token!.....", token)
    //console.log("Fetching the next set of userposts.")
    if (fetched_userposts == true || fetchedOtherUserPosts == true) {
      //console.log(page);
      //console.log('OTHER USER POSTS FETCHED ???? <><><><><> ', fetchedOtherUserPosts,)
      let urii = (showCurrentUser) ? '/api/user/posts' : `/api/user/${otherUserID}/posts`
      let linksss = (showCurrentUser) ? currentUserLinks : otherUserPostsLinks;
      //let uri = '/api/user/posts'
      //console.log("Here are the links!.....", links.next)
      if (linksss.next) {
        uurrii = linksss.next;
      }
      //console.log('USER POST LINKS', otherUserPostsLinks)
      let items = (showCurrentUser) ? userpost_items : otherUserPostsItems;
      //console.log(state)
      //console.log("Trying to get the uri.....", uri)
      return (
        <ScrollView style={style.scrollViewAsContainer}>
          <View style = {style.scrollViewHeaderContainer}>
            <Text style = {style.scrollViewHeaderText}>
              Here are {showCurrentUser ? 'your' : otherUser.username + "'s"} most recent posts
            </Text>
          </View>
          <View>
            {items.map((item, index) => (
              <View key = {item.id} style = {style.container}>
                <Text style = {style.myGreenText}>{item.user}: </Text>
                <Text style = {style.text}>{item.body}</Text>
              </View>
            ))}
          </View>
          <View style={style.moreLessButtonsContainer}>
            {(linksss.prev) ?
              <AlteredTextButton
                style={style.filledTextButton}
                textStyle={style.whiteText}
                onPress={e => this.lessUserPosts()}>
                Less Posts
              </AlteredTextButton>
              :
                <AlteredTextButton
                  style={style.inactiveFilledTextButton}
                  textStyle={style.whiteText}
                  onPress={this.inactiveButton}>
                  Less Posts
                </AlteredTextButton>
            }
            {(linksss.next) ?
              <AlteredTextButton
                style={style.filledTextButton}
                textStyle={style.whiteText}
                onPress={e => this.nextUserPosts(token, linksss.next)}
              >
                More Posts
                </AlteredTextButton>
              :
                <AlteredTextButton
                  style={style.inactiveFilledTextButton}
                  textStyle={style.whiteText}
                  onPress={this.inactiveButton}
                >
                  More Posts
                </AlteredTextButton>
            }
          </View>
        </ScrollView>
      )
    } else if (error) {
      return (
        <View style = {style.errorContainer}>
          <Text style = {style.text}>{error}</Text>
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
      fetched_userposts: state.userposts.fetched,
      page: state.userposts.page,
      userpost_items: state.userposts.items,
      currentUserLinks: state.userposts.links,
      error: state.userposts.error,
      fetchedOtherUserPosts: state.otherUserPosts.fetched,
      pageOtherUserPosts: state.otherUserPosts.page,
      otherUserPostsItems: state.otherUserPosts.items,
      otherUserPostsLinks: state.otherUserPosts.links,
      errorOtherUserPosts: state.otherUserPosts.error,
      token: state.auth.token,
      state: state,
      initNextLink: state.otherUserPosts.initNextLink,
      initSelfLink: state.otherUserPosts.initSelfLink,
      showCurrentUser: state.user.showCurrentUser,
      otherUserBool: state.user.otherUserBool,
      otherUserID: state.user.otherUserID,
      otherFetched: state.user.otherFetched,
      otherUser: state.user.otherUser,
    };
}


export default connect(mapStateToProps)(UserPosts);
