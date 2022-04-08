import React, { Component } from 'react';
import { ScrollView, ListView, View, Text, Image, TouchableOpacity, StyleSheet, Platform, Button } from 'react-native'
import { MapView, Marker } from 'expo';
import { connect } from 'react-redux'
import {
  white, grey, my_blue, purple, my_light_green, my_green, gray1, gray2, gray3,
  gray4, gray5, gray6, gray7, gray8, gray9, gray10
} from '../utils/colors'
import StreetView from 'react-native-streetview';

class CalloutView extends Component {

  alertMarkerInfo = (location) => {
   alert(location.address)
  }

/*
  //Note: the following function is called for each marker upon rendering them on the map.
  //The CalloutView "Mounts" apparently even when the marker had not been pressed which is
  //what is supposed to trigger the CalloutView to mount
  async componentDidMount() {
    const { location } = this.props

    try {
      let response = await fetch(
        `https://maps.googleapis.com/maps/api/streetview?size=200X200&location=${location.address}&key=AIzaSyDhPSBWrhJwAnF7awFAIq2fzba7AWM8AuQ`, {
          method: 'GET',
        }
      );
      //console.log("This is the response to the IMAGE request!!!!!", response)
    } catch (error) {
      console.error(error);
    }
  }
*/

  render() {
    const { location } = this.props
    //console.log(location)

    return (
      <View style = {styles.popupContainer}>\
        <Image
          source={{
            uri: `http://maps.googleapis.com/maps/api/streetview?size=200x200&location=${location.address}&pitch=-25&key=AIzaSyDhPSBWrhJwAnF7awFAIq2fzba7AWM8AuQ`,
            method: 'GET',
            headers: {
              'Authorization': 'Bearer qzikpYaoWdBQuKTRf3rKypWyi14HfoPp',
            },
          }}
          style={{width: '100%', height: 220}}
        />
        <View style={styles.infoContainer}>
          <View style={styles.addressContainer}>
            <Text style={styles.addressText}>{location.address}</Text>
          </View>
          <View style={styles.columnContainer}>
            <View style={styles.gardenPlantColumn}>
              <Text style={styles.h2Text}>{location.gardens.length + ' gardens'}</Text>
              <ScrollView style={styles.gardenPlantScrollView}>
                {location.gardens.map((garden, index) => {
                  return (
                    <Text key={index} style={styles.text}>{garden.name}</Text>
                  )
                })}
              </ScrollView>
            </View>
            <View style={styles.gardenPlantColumn}>
              <Text style={styles.h2Text}>{location.plants.length + ' plants'}</Text>
              <ScrollView style={styles.gardenPlantScrollView}>
                {location.plants.map((plant, index) => {
                  //console.log(plant.name)
                  return (
                    <Text key={index} style={styles.text}>{plant.name}</Text>
                  )
                })}
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
    return {
      token: state.auth.token,
      location: ownProps.location
    };
}

export default connect(mapStateToProps)(CalloutView);

const styles = StyleSheet.create ({
  popupContainer: {
    height: 425,
    width: 330,
    flex: 1,
    margin: -5,
    backgroundColor: white,
    borderRadius: 4,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  imageContainer: {
    height: 240,
    margin: 0,
    borderBottomWidth: 10,
    borderColor: white,
  },
  infoContainer: {
    height: 185,
    width: '100%',
    margin: 0,
  },
  addressContainer: {
    margin: 0,
    width: '100%',
    backgroundColor: my_light_green,
  },
  columnContainer: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  gardenPlantColumn: {
    width: '50%',
    margin: 1,
    alignItems: 'center',
  },
  addressText: {
    fontSize: 18,
    color: white,
    fontWeight: 'bold',
  },
  gardenPlantScrollView: {
    borderTopWidth: 2,
    borderColor: my_green,
  },
  h2Text: {
    width: '100%',
    textAlign: 'center',
    fontSize: 18,
    color: my_green,
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderColor: my_green,
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    color: my_green,
  }
})
