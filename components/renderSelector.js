import React, { Component, PropTypes } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native'
import ModalSelector from 'react-native-modal-selector'


const renderSelector = ({ input, data, style, placeholder, label, type, meta: { touched, error, invalid, warning } }) => (
  <View className="text-input">
    <View>
      <ModalSelector
          data={data}
          keyExtractor= {item => item.id}
          labelExtractor= {item => item.name}
          initValue="What garden did you plant in?"
          supportedOrientations={['landscape', 'portrait']}
          accessible={true}
          scrollViewAccessibilityLabel={'Scrollable options'}
          cancelButtonAccessibilityLabel={'Cancel Button'}
          onChange={input.onChange}>
          <TextInput
              style={style}
              editable={false}
              placeholder={placeholder}
              value={input.value.garden}/>

      </ModalSelector>
      {touched && ((error && <Text>{error}</Text>) || (warning && <Text>{warning}</Text>))}
    </View>
  </View>
)

export default renderSelector;
