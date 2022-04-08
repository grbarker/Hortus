import React from 'react'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import { purple } from '../utils/colors'

 export default function TextButton ({ children, onPress, style = {}, textStyle = {}, }) {
   return (
     <TouchableOpacity style={style} onPress={onPress}>
       <Text style={[styles.home, textStyle]}>{children}</Text>
     </TouchableOpacity>
   )
 }


const styles = StyleSheet.create({
  home: {
    textAlign: 'center',
  }
})
