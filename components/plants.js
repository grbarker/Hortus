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
import { getPlants, lessPlants, getPlantsSuccess, getPlantsFailure, getMorePlantsSuccess, getMorePlantsFailure } from '../actions/plants'
import { setOtherUser } from '../actions/user'

class Plants extends Component {



  nextPlantsS = (token, uri) => {
    const { dispatch } = this.props
    console.log("Dispatching getPlants")
    dispatch(getPlants(dispatch, token, uri))
  }

  nextPlants = (token, uri_end) => {
    const { dispatch } = this.props
    var uri_end = uri_end
    var uri = 'http://34.221.120.52' + uri_end
    console.log("Trying to DEBUG this get request for the next set of plants!!!", token, ", ", uri)
    return axios({
      method: 'GET',
      url: uri,
      headers: {Authorization: `Bearer ${token}`}
      })
      .then((response) => {
        dispatch(getMorePlantsSuccess(response.data))
        console.log('GETTING MORE PLANTS')
      })
      .catch(error => {
        console.log('ERROR --- ERROR --- ERROR', error)
         dispatch(getMorePlantsFailure(error.response.data)) && console.log(error.response.data.error)
      })
    console.log("Dispatching getPlants")
    dispatch(getPlants(dispatch, token, uri))
  }

  lessPlants = () => {
    const { dispatch } = this.props
    console.log("Dispatching lessPosts")
    dispatch(lessPlants())
  }

  showState = () => {
    console.log(this.props.state.plants)
  }


toOtherUserProfile = (id) => {
  const { dispatch, navigation } = this.props
  dispatch(setOtherUser(id)) && navigation.navigate('Profile');
}

  async componentDidMount() {
    const { dispatch, token } = this.props
    try {
      let response = await fetch(
        `http://@34.221.120.52/api/plants`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      let responseJSON = await response.json();
      //console.log(responseJSON)
      dispatch(getPlantsSuccess(responseJSON))
    } catch (error) {
      console.error(error);
    }
  }


  render() {
    const { links, plant_items, fetching, fetched_plants, token, error, state, page } = this.props
    if (fetched_plants == true) {
      let uri = '/api/plants'
      if (links.next) {
        uri = links.next;
      }
      return (
        <ScrollView style = {styles.scrollViewAsContainer}>
          <View style = {styles.scrollViewHeaderContainer}>
            <Text style = {styles.scrollViewHeaderText}>Recent Plants</Text>
          </View>
          <View>
            {plant_items.map((plant_item, index) => (
              <View key = {plant_item.id + 1897877777} style = {styles.container}>
                <Text style = {styles.myGreenText}>{plant_item.name}</Text>
                <Text style = {styles.text}>
                  <AlteredTextButton onPress={() => this.toOtherUserProfile(plant_item.grower_id)}>
                    Grown by {plant_item.grower}
                  </AlteredTextButton>
                </Text>
                <Text style = {styles.text}>
                  Planted <Moment element={Text} fromNow>{plant_item.timestamp}</Moment>
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.moreLessButtonsContainer}>
            {(links.prev) ?
              <AlteredTextButton
                style={styles.filledTextButton}
                textStyle={styles.whiteText}
                onPress={e => this.lessPlants()}
              >
                Less Plants
              </AlteredTextButton>
              :
                <AlteredTextButton
                  style={styles.inactiveFilledTextButton}
                  textStyle={styles.whiteText}
                  onPress={this.inactiveButton}>
                  Less Plants
                </AlteredTextButton>
            }
            {(links.next) ?
              <AlteredTextButton
                style={styles.filledTextButton}
                textStyle={styles.whiteText}
                onPress={e => this.nextPlants(token, uri)}>
                More Plants
              </AlteredTextButton>
              :
                <AlteredTextButton
                  style={styles.inactiveTextButton}
                  textStyle={styles.whiteText}
                  onPress={this.inactiveButton}>
                  More Plants
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
      fetched_plants: state.plants.fetched,
      page: state.posts.page,
      links: state.plants.links,
      plant_items: state.plants.items,
      token: state.auth.token,
      error: state.plants.error,
      state: state
    };
}


export default connect(mapStateToProps)(Plants);

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
