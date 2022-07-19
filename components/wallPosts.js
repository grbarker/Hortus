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
        console.log('FETCH WALL POST RESPONSEJSON....', responseJSON)
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
      otherUserID, showingReplyInput, showingReplyInputNum
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
        <ScrollView style={styles.scrollViewAsContainer}>
          <View style = {styles.scrollViewHeaderContainer}>
            <Text style = {styles.scrollViewHeaderText}>Recent Wall Posts</Text>
          </View>
          <View>
            {items.map((item, index) => (
              <View key = {item.id} style = {styles.container}>
                <Text style = {styles.myGreenText}>{item.user}: </Text>
                <Text style = {styles.text}>{item.body}</Text>
                <View>
                  <AlteredTextButton onPress={() => this.toggleWallPostReplyInput(item.id)}>
                    Reply
                  </AlteredTextButton>
                </View>
                {!showCurrentUser && showingReplyInput && showingReplyInputNum == item.id
                  ? <View>
                      <WallPostReplyForm onSubmit={this.wallPostReplySubmit} />
                    </View>
                  : null
                }
              </View>
            ))}
          </View>
          <View style={styles.moreLessButtonsContainer}>
            {(linkss.prev) ?
              <AlteredTextButton
                style={styles.filledTextButton}
                textStyle={styles.whiteText}
                onPress={e => this.lessWallPosts()}
              >
                Less Wall Posts
              </AlteredTextButton>
              :
                <AlteredTextButton
                  style={styles.inactiveFilledTextButton}
                  textStyle={styles.whiteText}
                  onPress={this.inactiveButton}
                >
                  Less Wall Posts
                </AlteredTextButton>
            }
            {(linkss.next) ?
              <AlteredTextButton
                style={styles.filledTextButton}
                textStyle={styles.whiteText}
                onPress={e => this.nextWallPosts(token, linkss.next)}
              >
                More Wall Posts
              </AlteredTextButton>
              :
                <AlteredTextButton
                  style={styles.inactiveFilledTextButton}
                  textStyle={styles.whiteText}
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
        <View style = {styles.errorContainer}>
          <Text style = {styles.text}>{error}</Text>
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

const styles = StyleSheet.create ({
  scrollViewAsContainer: {
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderRadius: 3,
    borderColor: my_green,
    marginTop: 3,
  },
  scrollViewHeaderContainer: {
    backgroundColor: my_green,
  },
  container: {
    padding: 5,
    marginTop: 3,
    backgroundColor: '#f0f4f0',
  },
  moreLessButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 5,
    margin: 3,
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
  scrollViewHeaderText: {
    fontSize: 20,
    color: '#f0f4f0',
  },
  text: {
    fontSize: 14,
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
