import React, { Component } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native'
import AlteredTextButton from './AlteredTextButton'
import Moment from 'react-moment';
import 'moment-timezone';
import { connect } from 'react-redux'
import axios from 'axios';
import {
  white, my_green, green, gray, red, purple, orange, blue, my_blue,
  lightPurp, black, pink, gray4
} from '../utils/colors'
import { getPosts, lessPosts, getPostsSuccess, getPostsFailure, getMorePostsSuccess, getMorePostsFailure } from '../actions/posts'

class Posts extends Component {


  nextPosts = (token, uri) => {
    const { dispatch } = this.props
    console.log("Dispatching getPosts")
    dispatch(getPosts(dispatch, token, uri))
  }

  lessPosts = () => {
    const { dispatch } = this.props
    console.log("Dispatching lessPosts")
    dispatch(lessPosts())
  }

  showState = () => {
    console.log(this.props.state.posts)
  }

  async componentDidMount() {
    const { dispatch, token, page } = this.props
    //console.log(page);
    try {
      let response = await fetch(
        `http://34.221.120.52/api/posts`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      let responseJSON = await response.json();
      //console.log('FIRST API CALL RESPONSEJSON....', responseJSON)
      dispatch(getPostsSuccess(responseJSON))
    } catch (error) {
      console.error(error.response);
    }
  }


  render() {
    const {  links, post_items, fetching, fetched_posts, token, error, state, page } = this.props
    //TRYING TO SET UP A 'NEXT' Button
    //TRYING TO PASS THE 'NEXT' LINK DOWN TO THE AlteredTextButton
    //AND THEN FIGURE OUT HOW TO dispatch getPosts
    //console.log("Here's the token!.....", token)
    //console.log("Fetching the next set of posts.")
    if (fetched_posts == true) {
      //console.log(page);
      let uri = '/api/posts'
      //console.log("Here are the links!.....", links.next)
      if (links.next) {
        uri = links.next;
      }
      //console.log(state)
      //console.log("Trying to get the uri.....", uri)
      return (
        <ScrollView style={styles.scrollViewAsContainer}>
          <View style = {styles.scrollViewHeaderContainer}>
            <Text style = {styles.scrollViewHeaderText}>Recent Posts</Text>
          </View>
          <View>
            {post_items.map((post_item, index) => (
              <View key = {post_item.id} style = {styles.container}>
                <Text style = {styles.myGreenText}>{post_item.user}: </Text>
                <Text style = {styles.text}>{post_item.body}</Text>
              </View>
            ))}
          </View>
          <View style={styles.moreLessButtonsContainer}>
            {(links.prev) ?
              <AlteredTextButton
                style={styles.filledTextButton}
                textStyle={styles.whiteText}
                onPress={e => this.lessPosts()}
              >
                Less Posts
              </AlteredTextButton>
              :
                <AlteredTextButton
                  style={styles.inactiveFilledTextButton}
                  textStyle={styles.whiteText}
                  onPress={this.inactiveButton}
                >
                  Less Posts
                </AlteredTextButton>
            }
            {(links.next) ?
              <AlteredTextButton
                style={styles.filledTextButton}
                textStyle={styles.whiteText}
                onPress={e => this.nextPosts(token, uri)}
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
      fetched_posts: state.posts.fetched,
      postSuccessfull: state.posts.postSuccessfull,
      page: state.posts.page,
      post_items: state.posts.items,
      links: state.posts.links,
      token: state.auth.token,
      error: state.posts.error,
      state: state
    };
}


export default connect(mapStateToProps)(Posts);

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
