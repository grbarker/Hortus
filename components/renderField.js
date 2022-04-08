import React, { Component, PropTypes } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native'
import { red, orange } from '../utils/colors'

const formStates = ['active', 'autofilled', 'asyncValidating', 'dirty', 'invalid', 'pristine',
    'submitting', 'touched', 'valid', 'visited'];

const renderField = ({ input, label, type, placeholder, style, meta, meta: { visited, touched, error, invalid, warning, dirty, pristine } }) => (

  <View>
    <TextInput {...input}
        style={style}
        autoCapitalize='none'
        autoCorrect={false}
        autoFocus={false}
        keyboardType='default'
        placeholder={placeholder}
        value={input.value}
        onChangeText={input.onChange}
        onBlur={input.onBlur}
        onFocus={input.onFocus} />
    <Text>The { input.name} input is:</Text>
    {
      formStates.filter((state) => meta[state]).map((state) => {
        return <Text key={state}> - { state }</Text>;
      })
    }
      {touched && (
        (error && <Text style={{ fontSize: 20, color: red, }}>{error}</Text>) ||
        (warning && <Text style={{ fontSize: 20, color: orange }}>{warning}</Text>)
      )}
  </View>
)

export default renderField;
