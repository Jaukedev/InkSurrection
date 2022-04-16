import {View, Text, Button} from 'react-native';
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

export default HomePage;
