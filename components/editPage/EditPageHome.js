import {StyleSheet, Text, View, Button} from 'react-native';
import React from 'react';


const EditPageHome = ({navigation}) => {
  return (
    <View>
      <Text>EditPageHome</Text>
      <Button
        title="vamos a otra pagina"
        // onPress={() => navigation.navigate('Profile', {name: 'Jane'})}
      />
    </View>
  );
};

export default EditPageHome;
const ProfileScreen = ({navigation, route}) => {
  return <Text>This is {route.params.name}'s profile</Text>;
};

const styles = StyleSheet.create({});
