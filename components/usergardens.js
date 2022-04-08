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

  async componentDidMount() {
    const { dispatch, token, user } = this.props
    //console.log(user)
    try {
      let response = await fetch(
        `http://34.221.120.52/api/user/gardens`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      let responseJSON = await response.json();
      //console.log(responseJSON)
      dispatch(getUserGardensSuccess(responseJSON))
    } catch (error) {
      console.error(error);
    }
  }


  render() {
    const { links, garden_items, fetching, fetched_gardens, token, user, error, state, page } = this.props
    if (fetched_gardens == true) {
      let uri = '/api/gardens'
      if (links.next) {
        uri = links.next;
      }

      return (
        <ScrollView style = {styles.scrollViewAsContainer}>
          <View style = {styles.scrollViewHeaderContainer}>
            <Text style = {styles.scrollViewHeaderText}>Your Gardens</Text>
          </View>
          <View>
            {garden_items.map((garden_item, index) => (
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
            {(links.prev) ?
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
            {(links.next) ?
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
      state: state
    };
}


export default connect(mapStateToProps)(UserGardens);

const styles = StyleSheet.create ({
  scrollViewAsContainer: {
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderRadius: 3,
    borderColor: my_green,
    marginTop: 3,
  },
  container: {
    padding: 5,
    marginTop: 3,
    backgroundColor: '#f0f4f0',
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
  scrollViewHeaderText: {
    fontSize: 20,
    color: '#f0f4f0',
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
