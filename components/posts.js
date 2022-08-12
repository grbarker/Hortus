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
import { getPosts, lessPosts, getPostsSuccess, getPostsFailure,
  getMorePostsSuccess, getMorePostsFailure } from '../actions/posts'
import { setOtherUser } from '../actions/user'

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

  toOtherUserProfile = (id) => {
    const { dispatch, navigation } = this.props
    dispatch(setOtherUser(id)) && navigation.navigate('Profile');
  }

  async componentDidMount() {
    const { dispatch, token, page, fetched_posts } = this.props
    //console.log(page);
    if (!fetched_posts) {
      try {
        let response = await fetch(
          `http://45.79.227.26/api/posts`, {
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
  }


  render() {
    const {  links, post_items, fetching, fetched_posts, token, error, state, page, style } = this.props
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
        <ScrollView style={style.scrollViewAsContainer}>
          <View style = {style.scrollViewHeaderContainer}>
            <Text style = {style.scrollViewHeaderText}>Recent Posts</Text>
          </View>
          <View>
            {post_items.map((post_item, index) => (
              <View key = {post_item.id} style = {style.container}>
                <AlteredTextButton
                  style={{alignItems: 'start', }}
                  textStyle={style.myGreenText}
                  onPress={() => this.toOtherUserProfile(post_item.user_id)}>
                  {post_item.user}:
                </AlteredTextButton>
                <Text style = {style.text}>{post_item.body}</Text>
              </View>
            ))}
          </View>
          <View style={style.moreLessButtonsContainer}>
            {(links.prev) ?
              <AlteredTextButton
                style={style.filledTextButton}
                textStyle={style.whiteText}
                onPress={e => this.lessPosts()}
              >
                Less Posts
              </AlteredTextButton>
              :
                <AlteredTextButton
                  style={style.inactiveFilledTextButton}
                  textStyle={style.whiteText}
                  onPress={this.inactiveButton}
                >
                  Less Posts
                </AlteredTextButton>
            }
            {(links.next) ?
              <AlteredTextButton
                style={style.filledTextButton}
                textStyle={style.whiteText}
                onPress={e => this.nextPosts(token, uri)}
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
