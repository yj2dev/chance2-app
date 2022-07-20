import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  unstable_enableLogBox,
  View,
} from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../AppInner';
import axios from 'axios';
import Config from 'react-native-config';
import randomNameGenerator from 'korean-random-names-generator';
import DeviceInfo from 'react-native-device-info';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import RNOtpVerify from 'react-native-otp-verify';
import OldUserSignUp from './OldUserSignUp';
import {NavigationContainer} from '@react-navigation/native';
import DefaultUserSignUp from './DefaultUserSignUp';

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

const fullWidth = Dimensions.get('window').width;
const fullHeight = Dimensions.get('window').height;

function SignUp({navigation}: SignUpScreenProps) {
  console.log(fullWidth, fullHeight);

  return (
    <View style={styles.typeButtonWrapper}>
      <Pressable
        style={styles.signUpTypeButton}
        onPress={() => navigation.navigate('OldUserSignUp')}>
        <Image
          source={require('../../assets/images/default-user.png')}
          style={styles.signUpTypeImage}
        />
        <Text style={styles.typeTitleText}>고령회원</Text>
        <Text style={styles.typeDescriptionText}>일자리를 찾고 계시나요?</Text>
      </Pressable>
      <Pressable
        style={styles.signUpTypeButton}
        onPress={() => navigation.navigate('DefaultUserSignUp')}>
        <Image
          source={require('../../assets/images/old-user.png')}
          style={styles.signUpTypeImage}
        />
        <Text style={styles.typeTitleText}>일반회원</Text>
        <Text style={styles.typeDescriptionText}>부업을 찾고 계시나요?</Text>
      </Pressable>
      <Pressable
        style={styles.signUpTypeButton}
        onPress={() => navigation.navigate('InstitutionUserSignUp')}>
        <Image
          source={require('../../assets/images/institution-user.png')}
          style={styles.signUpTypeImage}
        />
        <Text style={styles.typeTitleText}>기관회원</Text>
        <Text style={styles.typeDescriptionText}>
          멋진 일자리를 소개할 곳이 없다고요?
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  signUpTypeImage: {
    opacity: 0.5,
    width: 150,
    height: 150,
    marginBottom: 8,
    bottom: -6,
    left: 12,
    position: 'absolute',
  },
  typeButtonWrapper: {},
  signUpTypeButton: {
    height: fullHeight * 0.28,
    marginTop: 8,
    marginHorizontal: 8,
    padding: 32,
    backgroundColor: '#3a8a59',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeTitleText: {
    color: '#fff',
    fontSize: 48,
  },
  typeDescriptionText: {
    color: '#fff',
    fontSize: 24,
  },
});

export default SignUp;
