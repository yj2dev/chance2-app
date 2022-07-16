import React from 'react';
import {Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import {useAppDispatch} from '../store';

function CustomJob() {
  // const accessToken = useSelector((state: RootState) => state.user.accessToken);
  // const dispatch = useAppDispatch();

  return (
    <View>
      <Text>CustomJob</Text>
    </View>
  );
}

export default CustomJob;
