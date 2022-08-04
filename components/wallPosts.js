import React, { Component } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native'
import AlteredTextButton from './AlteredTextButton'
import Moment from 'react-moment';
import WallPostReplyForm from './wallPostReplyForm'
import 'moment-timezone';
import { connect } from 'react-redux'
import axios from 'axios';
import {
  white, my_green, green, gray, red, purple, orange, blue, my_blue,
  lightPurp, black, pink, gray4
} from '../utils/colors'
import {
  getWallPosts, lessWallPosts, getWallPostsSuccess, getWallPostsFailure,
  getMoreWallPostsSuccess, getMoreWallPostsFailure, hideReplyInput,
  showReplyInput
} from '../actions/wallPosts'
import {
  getOtherWallPosts, lessOtherWallPosts, getOtherWallPostsSuccess, getOtherWallPostsFailure,
  getMoreOtherWallPostsSuccess, getMoreOtherWallPostsFailure
} from '../actions/otherWallPosts'

class WallPosts extends Component {


  async nextWallPosts(token, uri) {
    const { dispatch, showCurrentUser } = this.props
    let url = `http://45.79.227.26` + uri
    try {
      let response = await fetch(
        `${url}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      let responseJSON = await response.json();
      //console.log('FIRST API CALL RESPONSEJSON....', responseJSON)
      showCurrentUser
      ? dispatch(getMoreWallPostsSuccess(responseJSON))
      : dispatch(getMoreOtherWallPostsSuccess(responseJSON))
    } catch (error) {
      console.error(error.response);
      showCurrentUser
      ? dispatch(getMoreWallPostsFailure(error.response))
      : dispatch(getMoreOtherWallPostsFailure(error))
    }
  }

  lessWallPosts = () => {
    const { dispatch } = this.props
    console.log("Dispatching lessWallPosts")
    dispatch(lessWallPosts())
  }

  showState = () => {
    console.log(this.props.state.wallPosts)
  }

  toggleWallPostReplyInput = (id) => {
    const { dispatch, showingReplyInput, showingReplyInputNum} = this.props
      !showingReplyInput
        ? dispatch(showReplyInput(id)) && console.log('SHOWING WALL POST REPLY INPUT')
        : showingReplyInputNum === id
          ? dispatch(hideReplyInput(id)) && console.log('HIDING WALL POST REPLY INPUT')
          : dispatch(hideReplyInput(showingReplyInputNum))
            && dispatch(showReplyInput(id))
            && console.log('HIDING ONE REPLY INPUT AND SHOWING ANOTHER')
  }
  toggleReplies = (e) => {
    const { dispatch, showingReplies } = this.props
    showingFollowers
    ? dispatch(hideFollowers())
    : dispatch(showFollowers()) && dispatch(hideFollowed())
    e.preventDefault();
  }

  async componentDidMount() {
    const { dispatch, token, page, fetchedWallPosts, showCurrentUser,
      otherUserBool, otherUserID } = this.props
    let uri = (showCurrentUser) ? `http://45.79.227.26/api/user/wall_posts` : `http://45.79.227.26/api/user/${otherUserID}/wall_posts`

      try {
        let response = await fetch(
          `${uri}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        let responseJSON = await response.json();
        showCurrentUser
        ? dispatch(getWallPostsSuccess(responseJSON))
        : dispatch(getOtherWallPostsSuccess(responseJSON))
      } catch (error) {
        console.error(error.response);
      }
    }


  render() {
    const {  links, wallPostItems, fetching, fetchedWallPosts, token, error,
      state, page, fetchedOtherWallPosts, otherWallPostSuccessfull, otherWallPage,
      otherWallPostItems, otherWallPostLinks, otherWallPostError, showCurrentUser,
      otherUserID, showingReplyInput, showingReplyInputNum, style
    } = this.props
    //TRYING TO SET UP A 'NEXT' Button
    //TRYING TO PASS THE 'NEXT' LINK DOWN TO THE AlteredTextButton
    //AND THEN FIGURE OUT HOW TO dispatch getWallPosts
    //console.log("Here's the token!.....", token)
    //console.log("Fetching the next set of wallPosts.")
    //console.log("OTHER WALL POSTS LINKS:____________", otherWallPostLinks)
    if (fetchedWallPosts == true  || fetchedOtherWallPosts == true) {
      //console.log(page);
      let uri = (showCurrentUser) ? '/api/user/wall_posts' : `api/user/${otherUserID}/wall_posts`
      let linkss = (showCurrentUser) ? links : otherWallPostLinks
      //console.log("Here are the links!.....", links.next)
      if (linkss.next) {
        uri = linkss.next;
      }
      let items = (showCurrentUser) ? wallPostItems : otherWallPostItems;
      //console.log(state)
      //console.log("Trying to get the uri.....", uri)
      return (
        <ScrollView style={style.scrollViewAsContainer}>
          <View style = {style.scrollViewHeaderContainer}>
            <Text style = {style.scrollViewHeaderText}>Recent Wall Posts</Text>
          </View>
          <View>
            {items.map((item, index) => (
              <View key = {item.id} style = {style.container}>
                <Text style = {style.myGreenText}>{item.user}: </Text>
                <Text style = {style.text}>{item.body}</Text>
                {!showCurrentUser && showingReplyInput && showingReplyInputNum == item.id
                  ? <View>
                      <WallPostReplyForm onSubmit={this.wallPostReplySubmit} />
                    </View>
                  : null
                }
              </View>
            ))}
          </View>
          <View style={style.moreLessButtonsContainer}>
            {(linkss.prev) ?
              <AlteredTextButton
                style={style.filledTextButton}
                textStyle={style.whiteText}
                onPress={e => this.lessWallPosts()}
              >
                Less Wall Posts
              </AlteredTextButton>
              :
                <AlteredTextButton
                  style={style.inactiveFilledTextButton}
                  textStyle={style.whiteText}
                  onPress={this.inactiveButton}
                >
                  Less Wall Posts
                </AlteredTextButton>
            }
            {(linkss.next) ?
              <AlteredTextButton
                style={style.filledTextButton}
                textStyle={style.whiteText}
                onPress={e => this.nextWallPosts(token, linkss.next)}
              >
                More Wall Posts
              </AlteredTextButton>
              :
                <AlteredTextButton
                  style={style.inactiveFilledTextButton}
                  textStyle={style.whiteText}
                  onPress={this.inactiveButton}
                >
                  More Wall Posts
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
          <Text>Couldn't get Wall Posts. Sorry for the inconvenience</Text>
        </View>
      )
    }
  }
}

const mapStateToProps = (state, ownProps) => {
    return {
      fetchedWallPosts: state.wallPosts.fetched,
      wallPostSuccessfull: state.wallPosts.wallPostSuccessfull,
      page: state.wallPosts.page,
      wallPostItems: state.wallPosts.items,
      links: state.wallPosts.links,
      token: state.auth.token,
      error: state.wallPosts.error,
      fetchedOtherWallPosts: state.otherWallPosts.fetched,
      otherWallPostSuccessfull: state.otherWallPosts.otherWallPostSuccessfull,
      otherWallPage: state.otherWallPosts.page,
      otherWallPostItems: state.otherWallPosts.items,
      otherWallPostLinks: state.otherWallPosts.links,
      otherWallPostError: state.otherWallPosts.error,
      state: state,
      showCurrentUser: state.user.showCurrentUser,
      otherUserBool: state.user.otherUserBool,
      otherUserID: state.user.otherUserID,
      otherFetched: state.user.otherFetched,
      otherUser: state.user.otherUser,
      showingReplyInput: state.wallPosts.showingReplyInput,
      showingReplyInputNum: state.wallPosts.showingReplyInputNum
    };
}


export default connect(mapStateToProps)(WallPosts);
