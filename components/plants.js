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
    var uri = 'http://45.79.227.26' + uri_end
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
        `http://@45.79.227.26/api/plants`, {
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
    const { links, plant_items, fetching, fetched_plants, token, error, state, page, style } = this.props
    if (fetched_plants == true) {
      let uri = '/api/plants'
      if (links.next) {
        uri = links.next;
      }
      return (
        <ScrollView style = {style.scrollViewAsContainer}>
          <View style = {style.scrollViewHeaderContainer}>
            <Text style = {style.scrollViewHeaderText}>Recent Plants</Text>
          </View>
          <View>
            {plant_items.map((plant_item, index) => (
              <View key = {plant_item.id} style = {style.container}>
                <Text style = {style.myGreenText}>{plant_item.name}</Text>
                <Text style = {style.text}>
                  <AlteredTextButton onPress={() => this.toOtherUserProfile(plant_item.grower_id)}>
                    Grown by {plant_item.grower}
                  </AlteredTextButton>
                </Text>
                <Text style = {style.text}>
                  Planted <Moment element={Text} fromNow>{plant_item.timestamp}</Moment>
                </Text>
              </View>
            ))}
          </View>
          <View style={style.moreLessButtonsContainer}>
            {(links.prev) ?
              <AlteredTextButton
                style={style.filledTextButton}
                textStyle={style.whiteText}
                onPress={e => this.lessPlants()}
              >
                Less Plants
              </AlteredTextButton>
              :
                <AlteredTextButton
                  style={style.inactiveFilledTextButton}
                  textStyle={style.whiteText}
                  onPress={this.inactiveButton}>
                  Less Plants
                </AlteredTextButton>
            }
            {(links.next) ?
              <AlteredTextButton
                style={style.filledTextButton}
                textStyle={style.whiteText}
                onPress={e => this.nextPlants(token, uri)}>
                More Plants
              </AlteredTextButton>
              :
                <AlteredTextButton
                  style={style.inactiveTextButton}
                  textStyle={style.whiteText}
                  onPress={this.inactiveButton}>
                  More Plants
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
