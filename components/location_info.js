import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { purple } from '../utils/colors'

 export default function LocationInfo ({ location, style = {} }) {
   return (
    <View>
      {location.gardens.map((garden, index ) => {
        return (
          <Text>{garden.name}</Text>
         )
      })}
      {location.plants.map((plant, index ) => {
        return (
          <Text>{plant.name}</Text>
         )
      })}
    </View>

   )
 }


const styles = StyleSheet.create({
  home: {
    textAlign: 'center',
    color: purple,
  }
})
