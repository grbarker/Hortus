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
    let url = `http://34.221.120.52` + uri_end
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
    let uri = (showCurrentUser) ? `http://34.221.120.52/api/user/posts` : `http://34.221.120.52/api/user/${otherUserID}/posts`

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
        `http://@34.221.120.52/api/user/posts`, {
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
      otherUserID
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
        <ScrollView style={styles.scrollViewAsContainer}>
          <View style = {styles.scrollViewHeaderContainer}>
            <Text style = {styles.scrollViewHeaderText}>Here are you're most recent posts</Text>
          </View>
          <View>
            {items.map((item, index) => (
              <View key = {item.id} style = {styles.container}>
                <Text style = {styles.myGreenText}>{item.user}: </Text>
                <Text style = {styles.text}>{item.body}</Text>
              </View>
            ))}
          </View>
          <View style={styles.moreLessButtonsContainer}>
            {(linksss.prev) ?
              <AlteredTextButton
                style={styles.filledTextButton}
                textStyle={styles.whiteText}
                onPress={e => this.lessUserPosts()}>
                Less Posts
              </AlteredTextButton>
              :
                <AlteredTextButton
                  style={styles.inactiveFilledTextButton}
                  textStyle={styles.whiteText}
                  onPress={this.inactiveButton}>
                  Less Posts
                </AlteredTextButton>
            }
            {(linksss.next) ?
              <AlteredTextButton
                style={styles.filledTextButton}
                textStyle={styles.whiteText}
                onPress={e => this.nextUserPosts(token, linksss.next)}
              >
                More Posts
                </AlteredTextButton>
              :
                <AlteredTextButton
                  style={styles.inactiveFilledTextButton}
                  textStyle={styles.whiteText}
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
   textButton: {
     padding: 5,
     color: white,
     backgroundColor: my_green,
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
