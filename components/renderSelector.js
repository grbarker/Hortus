import React, { Component, PropTypes } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native'
import ModalSelector from 'react-native-modal-selector'
import { white, black, gray, purple, green, blue, my_green, my_blue, pink, lightPurp, red, orange} from '../utils/colors'



const renderSelector = ({ input, data, style, placeholder, label, type, meta: { touched, error, invalid, warning } }) => (
  <View className="text-input">
    <View>
      <ModalSelector
          data={data}
          keyExtractor= {item => item.id}
          labelExtractor= {item => item.name}
          supportedOrientations={['landscape', 'portrait']}
          accessible={true}
          style={styles.modalWraper}
          scrollViewAccessibilityLabel={'Scrollable options'}
          cancelButtonAccessibilityLabel={'Cancel Button'}
          onChange={input.onChange}>
          <TextInput
              style={styles.input}
              editable={false}
              placeholder="What garden did you plant it in?"
              value={input.value.garden}/>

      </ModalSelector>
      {touched && ((error && <Text>{error}</Text>) || (warning && <Text>{warning}</Text>))}
    </View>
  </View>
)

export default renderSelector;


const styles = StyleSheet.create ({
   container: {
      padding: 5,
      marginTop: 3,
      backgroundColor: '#f0f4f0',
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
     color: black
   },
   input: {
     borderWidth:1,
     borderColor:'#ccc',
     backgroundColor: my_green,
     padding:10,
     height:40,
     fontSize: 20,
     color: black
   },
   modalWraper: {
     borderWidth:1,
     borderColor:'#ccc',
     padding:10,
     height:60,
     fontSize: 20,
     color: my_green
   }
})
