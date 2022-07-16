import React from 'react';
import {Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import {useAppDispatch} from '../store';

function JobState() {
  // const accessToken = useSelector((state: RootState) => state.user.accessToken);
  // const dispatch = useAppDispatch();

  return (
    <View>
      <Text>JobState</Text>
    </View>
  );
}

export default JobState;
