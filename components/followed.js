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

class Followed extends Component {


  nextFollowed = (token, uri) => {
    const { dispatch } = this.props
    console.log("Dispatching getFollowed")
    dispatch(getFollowed(dispatch, token, uri))
  }

  lessFollowed = () => {
    const { dispatch } = this.props
    console.log("Dispatching lessFollowed")
    dispatch(lessFollowed())
  }

  showState = () => {
    console.log(this.props.state.followed)
  }

  async componentDidMount() {
    const { dispatch, token, fetched_followed, page } = this.props
    //console.log(page);
    if (fetched_followed == false) {
      try {
        let response = await fetch(
          `http://@34.221.120.52/api/user/followed`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        let responseJSON = await response.json();
        console.log('FIRST API CALL RESPONSEJSON....', responseJSON)
        dispatch(getFollowedSuccess(responseJSON))
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('Followed already fetched!')
    }
  }


  render() {
    const {  links, followed_items, fetching, fetched_followed, token, error, state, user } = this.props
    //TRYING TO SET UP A 'NEXT' Button
    //TRYING TO PASS THE 'NEXT' LINK DOWN TO THE TextButton
    //AND THEN FIGURE OUT HOW TO dispatch getFollowed
    console.log("Here's the token!.....", token)
    console.log("Fetching the next set of followed.")
    if (fetched_followed == true) {
      let uri = '/api/user/followed'
      //console.log("Here are the links!.....", links.next)
      if (links.next) {
        uri = links.next;
      }
      //console.log(state)
      console.log("Trying to get the uri.....", uri)
      return (
        <ScrollView style={styles.scrollViewAsContainer}>
          <View>
            <View style={styles.scrollViewHeaderContainer}>
              <Text style = {styles.scrollViewHeaderText}>You are following {user.followed_count} people</Text>
            </View>
            {followed_items.map((followed_item, index) => (
              <View key = {index} style = {{flex: 1, flexDirection: 'row'}}>
                <View style = {styles.listAvatarContainer}>
                  <Image
                    style={{width: 95, height: 95}}
                    source={{uri: followed_item._links.avatar}}
                  />
                </View>
                <View style = {styles.listUserInfoContainer}>
                  <Text style = {styles.text}>{followed_item.username}</Text>
                  <Text style = {styles.text}>Following: {followed_item.followed_count}</Text>
                  <Text style = {styles.text}>Followed: {followed_item.followed_count}</Text>
                  <Text style = {styles.text}>{followed_item.post_count} posts</Text>
                  <Text style = {styles.text}>
                    Last seen <Moment element={Text} fromNow>{followed_item.last_seen}</Moment>
                  </Text>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.moreLessButtonsContainer}>
            {(links.prev) ?
              <AlteredTextButton
                style={styles.filledTextButton}
                textStyle={styles.whiteText}
                onPress={e => this.lessFollowed()}>
                Less Followed
              </AlteredTextButton>
              :
                <AlteredTextButton
                  style={styles.inactiveFilledTextButton}
                  textStyle={styles.whiteText}
                  onPress={this.inactiveButton}>
                  Less Followed
                </AlteredTextButton>
            }
            {(links.next) ?
              <AlteredTextButton
                style={styles.filledTextButton}
                textStyle={styles.whiteText}
                onPress={e => this.nextFollowed(token, uri)}
              >
                More Followed
                </AlteredTextButton>
              :
                <AlteredTextButton
                  style={styles.inactiveFilledTextButton}
                  textStyle={styles.whiteText}
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
      fetched_followed: state.followed.fetched,
      page: state.followed.page,
      followed_items: state.followed.items,
      links: state.followed.links,
      token: state.auth.token,
      error: state.followed.error,
      state: state,
      user: state.user.user,
    };
}


export default connect(mapStateToProps)(Followed);

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
  moreLessButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    margin: 3,
    backgroundColor: my_green,
    borderTopWidth: 2,
    borderTopColor: my_green,
  },
   listContainer: {
      padding: 5,
      marginTop: 3,
      backgroundColor: '#d9f9b1',
      alignItems: 'center',
   },
   listAvatarContainer: {
      flex: 4,
      padding: 10,
      marginTop: 5,
      marginBottom: 5,
      backgroundColor: '#f0f4f0',
   },
   listUserInfoContainer: {
      flex: 9,
      justifyContent: 'space-around',
      padding: 10,
      marginTop: 5,
      marginBottom: 5,
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
