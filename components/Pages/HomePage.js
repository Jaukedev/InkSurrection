import {StyleSheet, View, Text, Button} from 'react-native';
import React from 'react';

const HomePage = ({navigation}) => {

  
  return (
    <View>
      <Text>HomePage</Text>
      <Button
        title="Go to Editing"
        onPress={() => navigation.navigate('Editing')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
  },
  bigBlue: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
  },
  red: {
    color: 'red',
  },
})

export default HomePage;
