import React, { Component } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native'
import AlteredTextButton from './AlteredTextButton'
import Moment from 'react-moment';
import 'moment-timezone';
import { connect } from 'react-redux'
import {
  white, my_green, green, gray, red, purple, orange, blue, my_blue,
  lightPurp, black, pink, gray4
} from '../utils/colors'
import { getUserGardens, lessUserGardens, getUserGardensSuccess, getUserGardensFailure } from '../actions/usergardens'
import { getOtherUserGardens, lessOtherUserGardens, getOtherUserGardensSuccess, getOtherUserGardensFailure } from '../actions/otherUserGardens'
import axios from 'axios';

class UserGardens extends Component {


  nextUserGardens = (token, uri) => {
    const { dispatch } = this.props
    console.log("Dispatching getNextUserGardens")
    dispatch(getUserGardens(dispatch, token, uri))
  }

  lessUserGardens = () => {
    const { dispatch } = this.props
    console.log("Dispatching lessUserGardens")
    dispatch(lessUserGardens())
  }

  showState = () => {
    console.log(this.props.state.gardens)
  }

  fetchUserGardens = () => {
    const { dispatch, token, showCurrentUser, otherUserBool, otherUserID } = this.props
    console.log('Other User ID__________Other User ID__________:', otherUserID)
    let uri = (showCurrentUser) ? `http://45.79.227.26/api/user/gardens` : `http://45.79.227.26/api/user/${otherUserID}/gardens`

    return axios({
      method: 'GET',
      url: uri,
      headers: {Authorization: `Bearer ${token}`}
    })
    .then((response) => {
      showCurrentUser
      ? (dispatch(getUserGardensSuccess(response.data)) && console.log('GET USER GARDEN SUCCESS ---- ', Object.keys(response.data)))
      : (dispatch(getOtherUserGardensSuccess(response.data)) && console.log('GET OTHER USER GARDEN SUCCESS ---- ', Object.keys(response.data)))
    })
    .catch(error => {
      console.log('ERROR --- ERROR --- ERROR', error)
      showCurrentUser
      ? dispatch(getUserGardensFailure(error.response))
      : dispatch(getOtherUserGardensFailure(error))
    })
  }

  async componentDidMount() {
    this.fetchUserGardens()
  }


  render() {
    const {
      links, garden_items, fetching, fetched_gardens, token, user, error, state,
      page, showCurrentUser, fetchedOtherUserGardens, otherUserGardensItems,
      otherUserGardensLinks, pageOtherUserGardens, errorOtherUserGardens,
      otherUserID, otherUser
    } = this.props

    if (fetched_gardens == true || fetchedOtherUserGardens == true) {

      let urii = (showCurrentUser) ? '/api/user/plants' : `/api/user/${otherUserID}/plants`
      let linkss = (showCurrentUser) ? links : otherUserGardensLinks;

      if (linkss.next) {
        uri = linkss.next;
      }
      let items = (showCurrentUser) ? garden_items : otherUserGardensItems;

      return (
        <ScrollView style = {styles.scrollViewAsContainer}>
          <View style = {styles.scrollViewHeaderContainer}>
            <Text style = {styles.scrollViewHeaderText}>{showCurrentUser ? 'Your' : otherUser.username + "'s"} Gardens</Text>
          </View>
          <View>
            {items.map((garden_item, index) => (
              <View key = {garden_item.id + 1897877577} style = {styles.container}>
                <Text style = {styles.myGreenText}>{garden_item.name}</Text>
                <Text style = {styles.text}>Gardener: {user.username}</Text>
                <Text style = {styles.text}>
                  Started: <Moment element={Text} fromNow>{garden_item.created}</Moment>
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.moreLessButtonsContainer}>
            {(linkss.prev) ?
              <AlteredTextButton
                style={styles.filledTextButton}
                textStyle={styles.whiteText}
                onPress={e => this.lessUserGardens()}
              >
                Less Gardens
              </AlteredTextButton>
              :
                <AlteredTextButton
                  style={styles.inactiveFilledTextButton}
                  textStyle={styles.whiteText}
                  onPress={this.inactiveButton}>
                  Less Gardens
                </AlteredTextButton>
            }
            {(linkss.next) ?
              <AlteredTextButton
                style={styles.filledTextButton}
                textStyle={styles.whiteText}
                onPress={e => this.nextUserGardens(token, uri)}>
                More Gardens
              </AlteredTextButton>
              :
                <AlteredTextButton
                  style={styles.inactiveTextButton}
                  textStyle={styles.whiteText}
                  onPress={this.inactiveButton}>
                  More Gardens
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
      fetched_gardens: state.usergardens.fetched,
      user: state.user.user,
      page: state.posts.page,
      links: state.usergardens.links,
      garden_items: state.usergardens.items,
      token: state.auth.token,
      error: state.usergardens.error,
      fetchedOtherUserGardens: state.otherUserGardens.fetched,
      pageOtherUserGardens: state.otherUserGardens.page,
      otherUserGardensItems: state.otherUserGardens.items,
      otherUserGardensLinks: state.otherUserGardens.links,
      errorOtherUserGardens: state.otherUserGardens.error,
      showCurrentUser: state.user.showCurrentUser,
      otherUserBool: state.user.otherUserBool,
      otherUserID: state.user.otherUserID,
      otherFetched: state.user.otherFetched,
      otherUser: state.user.otherUser,
      state: state
    };
}


export default connect(mapStateToProps)(UserGardens);

const styles = StyleSheet.create ({
  scrollViewAsContainer: {
    borderWidth: 2,
    borderRadius: 3,
    borderColor: my_green,
    marginTop: 3,
  },
  scrollViewHeaderContainer: {
    backgroundColor: my_green,
    padding: 8,
  },
  scrollViewHeaderText: {
    fontSize: 20,
    color: '#f0f4f0',
  },
  container: {
    padding: 5,
    marginTop: 3,
    backgroundColor: '#f0f4f0',
  },
  moreLessButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    margin: 2,
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
    fontSize: 16,
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
