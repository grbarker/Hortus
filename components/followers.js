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

class Followers extends Component {


  nextFollowers = (token, uri) => {
    const { dispatch } = this.props
    console.log("Dispatching getFollowers")
    dispatch(getFollowers(dispatch, token, uri))
  }

  lessFollowers = () => {
    const { dispatch } = this.props
    console.log("Dispatching lessFollowers")
    dispatch(lessFollowers())
  }

  showState = () => {
    console.log(this.props.state.followers)
  }

  toUserProfile = (user) => {
    this.props.navigation.push('Profile',
      { user: user }
    );
  }

  async componentDidMount() {
    const { dispatch, token, fetched_followers, page } = this.props
    //console.log(page);
    if (fetched_followers == false) {
      try {
        let response = await fetch(
          `http://@34.221.120.52/api/user/followers`, {
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
    } else {
      //console.log('Followers already fetched!')
    }
  }


  render() {
    const {  links, follower_items, fetching, fetched_followers, token, error, state, user } = this.props
    //console.log("Info coming up next")
    //console.info(this.props.navigation);
    //console.log("Info should have printed")
    //TRYING TO SET UP A 'NEXT' Button
    //TRYING TO PASS THE 'NEXT' LINK DOWN TO THE TextButton
    //AND THEN FIGURE OUT HOW TO dispatch getFollowers
    // console.log("Here's the token!.....", token)
    // console.log("Fetching the next set of followers.")
    if (fetched_followers == true) {
      let uri = '/api/user/followers'
      //console.log("Here are the links!.....", links.next)
      if (links.next) {
        uri = links.next;
      }
      //console.log(state)
      //console.log("Trying to get the uri.....", uri)
      return (
        <ScrollView style={styles.scrollViewAsContainer}>
          <View>
            <View style={styles.scrollViewHeaderContainer}>
              <Text style = {styles.scrollViewHeaderText}>{user.follower_count} people are following you.</Text>
            </View>
            {follower_items.map((follower_item, index) => (
              <TouchableOpacity
                key = {index}
                style = {{flex: 1, flexDirection: 'row'}}
                onPress={() => {
                    this.props.navigation.push('Profile', {
                      user: follower_item
                    })
                  }
                }
              >
                <View style = {styles.listAvatarContainer}>
                  <Image
                    style={{width: 95, height: 95}}
                    source={{uri: follower_item._links.avatar}}
                  />
                </View>
                <View style = {styles.listUserInfoContainer}>
                  <Text style = {styles.text}>{follower_item.username}</Text>
                  <Text style = {styles.text}>Following: {follower_item.followed_count}</Text>
                  <Text style = {styles.text}>Followers: {follower_item.follower_count}</Text>
                  <Text style = {styles.text}>{follower_item.post_count} posts</Text>
                  <Text style = {styles.text}>
                    Last seen <Moment element={Text} fromNow>{follower_item.last_seen}</Moment>
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.moreLessButtonsContainer}>
            {(links.prev) ?
              <AlteredTextButton
                style={styles.filledTextButton}
                textStyle={styles.whiteText}
                onPress={e => this.lessFollowers()}>
                Less Followers
              </AlteredTextButton>
              :
                <AlteredTextButton
                  style={styles.inactiveFilledTextButton}
                  textStyle={styles.whiteText}
                  onPress={this.inactiveButton}>
                  Less Followers
                </AlteredTextButton>
            }
            {(links.next) ?
              <AlteredTextButton
                style={styles.filledTextButton}
                textStyle={styles.whiteText}
                onPress={e => this.nextFollowers(token, uri)}
              >
                More Followers
                </AlteredTextButton>
              :
                <AlteredTextButton
                  style={styles.inactiveFilledTextButton}
                  textStyle={styles.whiteText}
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
      fetched_followers: state.followers.fetched,
      page: state.followers.page,
      follower_items: state.followers.items,
      links: state.followers.links,
      token: state.auth.token,
      error: state.followers.error,
      state: state,
      user: state.user.user,
      navigation: ownProps.navigation
    };
}


export default connect(mapStateToProps)(Followers);

const styles = StyleSheet.create ({
  scrollViewAsContainer: {
    borderWidth: 2,
    borderRadius: 3,
    borderColor: my_green,
    marginTop: 3,
  },
  scrollViewHeaderContainer: {
    backgroundColor: my_green,
  },
  listContainer: {
    padding: 5,
    marginTop: 3,
    backgroundColor: '#d9f9b1',
    alignItems: 'center',
  },
  listAvatarContainer: {
    flex: 4,
    justifyContent: 'space-around',
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: '#f0f4f0',
  },
  listUserInfoContainer: {
    flex: 9,
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
    marginRight: 5,
    backgroundColor: '#f0f4f0',
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
