import React, { Component } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native'
import TextButton from './TextButton'
import Moment from 'react-moment';
import 'moment-timezone';
import { connect } from 'react-redux'
import { white } from '../utils/colors'
import { getPlants, getPlantsSuccess, getPlantsFailure } from '../actions/plants'

class Plants extends Component {

  nextPlants = (token, uri) => {
    const { dispatch } = this.props
    console.log("Dispatching getPlants")
    dispatch(getPlants(dispatch, token, uri))
      .then((response) => {
        dispatch(getPlantsSuccess(response.data)) && console.log(response.data)
      })
      .catch(error => {
         dispatch(getMorePlantsFailure(error.response.data)) && console.log(error.response.data.error)
      })
  }

  showState = () => {
    console.log(this.props.state.plants)
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
    const { links, plant_items, fetching, fetched_plants, token, error, state } = this.props
    if (fetched_plants == true) {
      let uri = '/api/plants'
      if (links.next) {
        uri = links.next;
      }
      return (
        <ScrollView>
          <View>
            {plant_items.map((plant_item, index) => (
              <View key = {plant_item.id} style = {styles.container}>
                <Text style = {styles.text}>{plant_item.name}</Text>
                <Text style = {styles.text}>Grown by {plant_item.grower}</Text>
                <Text style = {styles.text}>
                  Planted <Moment element={Text} fromNow>{plant_item.timestamp}</Moment>
                </Text>
              </View>
            ))}
          </View>
          {(links.next) ?
            <TextButton style={{margin: 20}} onPress={e => this.nextPlants(token, uri)}>
              More Plants
            </TextButton>
            : null
          }
          <TextButton style={{margin: 20}} onPress={e => this.showState()}>
            Show State
          </TextButton>
            <View>
              {Object.values(links).map((link, index) => (
                <View key = {index} style = {styles.container}>
                  <Text style = {styles.text}>{link}</Text>
                </View>
              ))}
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
   container: {
      padding: 5,
      marginTop: 3,
      backgroundColor: '#d9f9b1',
      alignItems: 'center',
   },
   errorContainer: {
      padding: 5,
      marginTop: 3,
      marginBottom: 30,
      backgroundColor: '#d9f9b1',
      alignItems: 'center',
   },
   text: {
     fontSize: 20,
      color: '#4f603c'
   }
})
