import React, { Component } from 'react'
import { ScrollView, View, Text, TouchableOpacity, TouchableHighlight,
  StyleSheet, Button, Image, Modal, Alert } from 'react-native'
import Moment from 'react-moment';
import 'moment-timezone';
import TextButton from './TextButton'
import StreetView from 'react-native-streetview';
import { MapView } from 'expo';
import { connect } from 'react-redux'
import { white, blue, my_blue, my_green, my_light_green } from '../utils/colors'
import { getLocationsSuccess, getLocationsFailure } from '../actions/userposts'


class Location extends Component {
  static navigationOptions = ({ navigation }) => {

    return {
      title: 'Location',
      headerRight: (
        <Button
          onPress={() => navigation.navigate('Home')}
          title="Home"
          color= {white}
        />
      )
    }
  }
  state = {
    gardenSelected: false,
    selectedGarden: {},
    gardensSelected: true,
    plantsSelected: false,
    plantsList0: [],
    plantsList1: [],
    plantsList2: [],
    modalVisible: false,
    selectedPlant: {},
  };

  componentDidMount() {
    const { location } = this.props.navigation.state.params

    length = location.plants.length
    if (length % 2 == 0) {
      half = length / 2
    } else {
      half = (length + 1) / 2
    }
    list1 = location.plants.slice(0, half)
    list2 = location.plants.slice(half, length)
    this.setState({
      plantsList1: list1,
      plantsList2: list2,
    })
  }

  toMap = () => {
    this.props.navigation.navigate('Map');
  }
  toHome = () => {
    this.props.navigation.navigate('Home');
  }

  setModalVisible = (plantObj) => {
    this.setState({
      modalVisible: true,
      selectedPlant: plantObj
    })
    console.log('SELECTED PLANT:     -------', this.state.selectedPlant)
  }
  setModalHidden = () => {
    this.setState({
      modalVisible: false,
      selectedPlant: {}
    })
  }

  selectGarden = (garden) => {
    this.setState({
      gardenSelected: true,
      selectedGarden: garden,
    })
  }

  showGardens = (e) => {
    this.setState({
      gardensSelected: true,
      plantsSelected: false,
      gardenSelected: false,
      selectedGarden: {},
    })
    console.log(this.state)
    e.preventDefault();
  }

  showPlants = (e) => {
    this.setState({
      gardensSelected: false,
      plantsSelected: true,
      gardenSelected: false,
      selectedGarden: {},
    })
    e.preventDefault();
  }


  render() {
    const {
      gardensSelected, gardenSelected, selectedGarden, plantsSelected,
      plantsList1, plantsList2, modalVisible, selectedPlant
    } = this.state
    const { location } = this.props.navigation.state.params
    //console.log("Location--->", location);
    // console.log("Plant List 1--->", plantsList1);
    // console.log("Plant List 2--->", plantsList2);

    return (
      <ScrollView>
        <Modal
          style={{
            flex: 1, justifyContent: 'space-around', alignItems: 'center',
            backgroundColor: white, marginTop: 70,
          }}
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.textItem}>
              <Text style={styles.text}>Hello World!</Text>
            </View>
            <View style={styles.textItem}>
              <Text style={styles.text}>Plant:   {selectedPlant.name}</Text>
            </View>
            <View style={styles.textItem}>
              <Text style={styles.text}>Garden:   {selectedPlant.garden}</Text>
            </View>
            <View style={styles.textItem}>
              <Text style={styles.text}>Grower:   {selectedPlant.grower}</Text>
            </View>
            <View style={styles.textItem}>
              <Text style={styles.text}>
                Planted <Moment element={Text} fromNow>{selectedPlant.timestamp}</Moment>
              </Text>
            </View>
            <TouchableHighlight
              style={{ marginTop: 50}}
              onPress={ e => {
                this.setModalHidden();
              }}>
              <Text style={{ fontSize: 16, color: '#42260A' }}>Hide Modal</Text>
            </TouchableHighlight>
          </View>
        </Modal>
        <View style = {styles.imageContainer}>
          <Image
            source={{
              uri: `http://maps.googleapis.com/maps/api/streetview?size=200x200&location=${location.address}&pitch=-25&key=AIzaSyDhPSBWrhJwAnF7awFAIq2fzba7AWM8AuQ`,
              method: 'GET',
              headers: {
                'Authorization': 'Bearer qzikpYaoWdBQuKTRf3rKypWyi14HfoPp',
              },
            }}
            style={{width: 400, height: 400}}
          />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.locationAddressContainer}>
            <Text style = {{fontSize: 18, color: 'white'}}>{location.address}</Text>
          </View>
          <View style={styles.gardenPlantTabContainer}>
            <TouchableOpacity
             style={styles.gardenPlantTab}
             onPress={this.showGardens}
            >
              <Text style = {{fontSize: 18, color: 'white'}}>Gardens</Text>
            </TouchableOpacity>
            <TouchableOpacity
             style={styles.gardenPlantTab}
             onPress={this.showPlants}
            >
              <Text style = {{fontSize: 18, color: 'white'}}>Plants</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.gardenPlantListContainer}>
            <ScrollView style={styles.gardenPlantScrollView}>
            {plantsSelected
            ? plantsList1.map((plant, index) => {
                return (
                  <TouchableOpacity key={index} style={styles.gardenPlantTextBox} onPress={ e => this.setModalVisible(plant)}>
                    <Text key={index} style={styles.text}>{plant.name}</Text>
                  </TouchableOpacity>
                )
              })
            :
              location.gardens.map((garden, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.gardenPlantTextBox}
                    onPress={ e => this.selectGarden(garden)}
                  >
                      <Text key={index} style={styles.text}>{garden.name}</Text>
                  </TouchableOpacity>
                )
              })
            }
            </ScrollView>
            <ScrollView style={styles.gardenPlantScrollView}>
              {plantsSelected
              ? plantsList2.map((plant, index) => {
                  return (
                    <TouchableOpacity key={index} style={styles.gardenPlantTextBox} onPress={ e => this.setModalVisible(plant)}>
                      <Text key={index} style={styles.text}>{plant.name}</Text>
                    </TouchableOpacity>
                  )
                })
              : (gardenSelected
                ? selectedGarden.plants.map((plant, index) => {
                    return (
                      <TouchableOpacity key={index} style={styles.gardenPlantTextBox} onPress={ e => this.setModalVisible(plant)}>
                        <Text key={index} style={styles.text}>{plant.name}</Text>
                      </TouchableOpacity>
                    )
                  })
                :
                  location.plants.map((plant, index) => {
                    //sconsole.log(plant)
                    return (
                      <TouchableOpacity key={index} style={styles.gardenPlantTextBox} onPress={ e => this.setModalVisible(plant)}>
                        <Text key={index} style={styles.text}>{plant.name}</Text>
                      </TouchableOpacity>
                    )
                  })
                )
              }
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
    return {
      token: state.auth.token,
    };
}


export default connect(mapStateToProps)(Location);

const styles = StyleSheet.create ({
   container: {
      flex: 1,
      padding: 5,
      marginTop: 3,
      backgroundColor: '#d9f9b1',
      alignItems: 'center',
   },
   imageContainer: {
      height: 215,
      backgroundColor: '#f0f4f0',
   },
   contentContainer: {
      flex: 1,
      height: 435,
      padding: 0,
      marginTop: 0,
      backgroundColor: '#2d882d',
      justifyContent: 'space-evenly',
   },
   modalContainer: {
     flex: 1,
     justifyContent: 'space-between',
     alignItems: 'center',
     marginTop: 52,
     borderWidth: 2,
     borderColor: my_light_green,
     borderRadius: 12,
   },
   locationAddressContainer: {
      flex: 1,
      alignItems: 'center',
      padding: 0,
      marginTop: 0,
      backgroundColor: '#2d882d',
   },
   gardenPlantTabContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 2,
      marginTop: 0,
   },
   gardenPlantListContainer: {
      flex: 8,
      flexDirection: 'row',
      padding: 0,
      marginTop: 0,
      backgroundColor: '#f0f4f0',
   },
   gardenPlantTab: {
      alignItems: 'center',
      width: '50%',
      justifyContent: 'center',
      backgroundColor: '#2d882d',
      borderRadius: 4,
      borderColor: '#fff',
      borderLeftWidth: 1.5,
      borderTopWidth: 1.5,
      borderRightWidth: 1.5,
      borderBottomWidth: 1.5,
   },
   gardenPlantScrollView: {
      flex: 1,
      padding: 0,
      marginTop: 0,
      backgroundColor: '#f0f4f0',
   },
   gardenPlantTextBox: {
      alignItems: 'center',
      padding: 5,
      margin: 2,
      backgroundColor: '#f0f4f0',
   },
   textItem: {
     margin: 20,
     borderBottomWidth: 2,
     borderColor: my_green,
     borderRadius: 2,
   },
   text: {
      fontSize: 18,
      color: '#42260A'
   }
})
