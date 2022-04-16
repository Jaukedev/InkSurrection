import {StyleSheet, Text, View, Button} from 'react-native';
import React from 'react';


const EditPageHome = ({navigation}) => {
  return (
    <View>
      <Text>EditPageHome</Text>
      <Button
        title="Go to Home"
        onPress={() => navigation.navigate('InkSurrection')}
      />
    </View>
  );
};

export default EditPageHome;
const ProfileScreen = ({navigation, route}) => {
  return <Text>This is {route.params.name}'s profile</Text>;
};

const styles = StyleSheet.create({});
