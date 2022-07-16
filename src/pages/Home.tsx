import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import {useAppDispatch} from '../store';

function Home() {
  // const accessToken = useSelector((state: RootState) => state.user.accessToken);
  // const dispatch = useAppDispatch();

  return (
    <View style={styles.headerWrapper}>
      <Text style={styles.header}>우연이</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    display: 'flex',
    alignItems: 'center',
    borderWidth: 1,
    paddingVertical: 8,
    borderColor: '#000000',
  },
  header: {
    fontSize: 24,
    fontFamily: 'JalnanOTF',
    color: '#1f6038',
  },
});

export default Home;
