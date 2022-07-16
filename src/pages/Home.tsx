import React from 'react';
import {Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import {useAppDispatch} from '../store';

function Home() {
  // const accessToken = useSelector((state: RootState) => state.user.accessToken);
  // const dispatch = useAppDispatch();

  return (
    <View>
      <Text>123</Text>
    </View>
  );
}

export default Home;
