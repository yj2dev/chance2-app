import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../AppInner';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import randomNameGenerator from 'korean-random-names-generator';
import DeviceInfo from 'react-native-device-info';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  PERMISSIONS,
  request,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';
import RNOtpVerify from 'react-native-otp-verify';

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

function SignUp({navigation}: SignUpScreenProps) {
  const [activeUserName, setActiveUserName] = useState('고령유저');
  const [loading, setLoading] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [nickname, setNickname] = useState('');

  const phoneNumberRef = useRef<TextInput | null>(null);
  const nameRef = useRef<TextInput | null>(null);

  const canGoNext = phoneNumber && nickname;

  const [otp, setOtp] = useState('');

  useEffect(() => {
    const getHash = () =>
      RNOtpVerify.getHash().then(console.log).catch(console.log);

    const startListeningForOtp = () =>
      RNOtpVerify.getOtp()
        .then(p => RNOtpVerify.addListener(otpHandler))
        .catch(p => console.log(p));

    getHash();
    startListeningForOtp();
  });

  const otpHandler = message => {
    const otp = /(\d{4})/g.exec(message)[1];
    setOtp(otp);
  };

  const askPermission = async () => {
    console.log('Platform.OS >> ', Platform.OS);
    if (Platform.OS !== 'android') {
      console.log('안드로이드 아님');
      return;
    }
    try {
      const result = await request(PERMISSIONS.ANDROID.READ_SMS);
      console.log('result >> ', result);

      getPhoneNumber();

      if (result === RESULTS.GRANTED) {
        // do something
      }
    } catch (error) {
      console.log('askPermission', error);
    }
  };

  const askPermission2 = async () => {
    console.log('Platform.OS >> ', Platform.OS);
    if (Platform.OS !== 'android') {
      console.log('안드로이드 아님');
      return;
    }
    try {
      const result = await request(PERMISSIONS.ANDROID.CAMERA);
      console.log('result >> ', result);
      if (result === RESULTS.GRANTED) {
        // do something
      }
    } catch (error) {
      console.log('askPermission', error);
    }
  };

  const askMultiplePermission = async () => {
    if (Platform.OS !== 'android') {
      return;
    }
    try {
      const result = await requestMultiple([
        PERMISSIONS.ANDROID.READ_PHONE_NUMBERS,
        PERMISSIONS.ANDROID.CAMERA,
        PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
        PERMISSIONS.ANDROID.CALL_PHONE,
        PERMISSIONS.ANDROID.READ_CONTACTS,
        PERMISSIONS.ANDROID.READ_SMS,
      ]);
      console.log('Multiple result >> ', result);
    } catch (error) {
      console.log('askPermission', error);
    }
  };

  useEffect(() => {
    askPermission();
    // askPermission2();
    // askMultiplePermission();

    // requestMultiple([
    //   PERMISSIONS.ANDROID.CAMERA,
    //   PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
    // ]).then(statuses => {
    //   console.log('Camera', statuses[PERMISSIONS.ANDROID.CAMERA]);
    //   console.log(
    //     'ACCESS_BACKGROUND_LOCATION',
    //     statuses[PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION],
    //   );
    // });

    getRandomNickname();
    DeviceInfo.getUniqueId().then(uniqueId => {
      console.log('uniqueId >> ', uniqueId);
      // iOS: "FCDBD8EF-62FC-4ECB-B2F5-92C9E79AC7F9"
      // Android: "dd96dec43fb81c97"
      // Windows: "{2cf7cb3c-da7a-d508-0d7f-696bb51185b4}"
    });
    getPhoneNumber();
  }, []);

  const getRandomNickname = useCallback(() => {
    // TODO: 중복되는 닉네임인지 확인
    const rNickname = randomNameGenerator().toString().replace(/ /gi, '');
    const response = axios.get(`/user/${rNickname}/nickname-check`);
    console.log('response >> ', response);
    setNickname(rNickname);
  }, []);

  const getPhoneNumber = useCallback(() => {
    DeviceInfo.getPhoneNumber().then(pNumber => {
      const _pNumber = '0' + pNumber.substring(3, pNumber.length);
      setPhoneNumber(_pNumber);
      // Android: null return: no permission, empty string: unprogrammed or empty SIM1, e.g. "+15555215558": normal return value
    });
  }, []);

  const onChangePhoneNumber = useCallback(text => {
    const regex = /[^0-9]/g;
    const value = text.replace(regex, '');
    if (value.length < 12) {
      setPhoneNumber(value.trim());
    }
  }, []);

  const onChangeNickname = useCallback(text => {
    if (text < 25) {
      setNickname(text.trim());
    }
  }, []);

  const onSubmit = useCallback(() => {}, []);

  return (
    <KeyboardAwareScrollView>
      <View style={styles.signUpTypeWrapper}>
        <Pressable
          onPress={() => {
            setActiveUserName('고령유저');
          }}
          style={
            activeUserName == '고령유저'
              ? [styles.signUpType, styles.signUpTypeActive]
              : styles.signUpType
          }>
          <Image
            source={require('../assets/images/default-user.png')}
            style={styles.signUpTypeImage}
          />
          <Text
            style={
              activeUserName === '고령유저'
                ? [styles.signUpTypeText, styles.signUpTypeTextActive]
                : styles.signUpTypeText
            }>
            고령유저
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setActiveUserName('일반유저');
          }}
          style={
            activeUserName === '일반유저'
              ? [styles.signUpType, styles.signUpTypeActive]
              : styles.signUpType
          }>
          <Image
            source={require('../assets/images/old-user.png')}
            style={styles.signUpTypeImage}
          />
          <Text
            style={
              activeUserName === '일반유저'
                ? [styles.signUpTypeText, styles.signUpTypeTextActive]
                : styles.signUpTypeText
            }>
            일반유저
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setActiveUserName('기관유저');
          }}
          style={
            activeUserName === '기관유저'
              ? [styles.signUpType, styles.signUpTypeActive]
              : styles.signUpType
          }>
          <Image
            source={require('../assets/images/institution-user.png')}
            style={styles.signUpTypeImage}
          />
          <Text
            style={
              activeUserName === '기관유저'
                ? [styles.signUpTypeText, styles.signUpTypeTextActive]
                : styles.signUpTypeText
            }>
            기관유저
          </Text>
        </Pressable>
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>휴대번호</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={onChangePhoneNumber}
          placeholder="휴대번호를 입력해주세요"
          placeholderTextColor="#666"
          textContentType="telephoneNumber"
          keyboardType="number-pad"
          value={phoneNumber}
          returnKeyType="next"
          clearButtonMode="while-editing"
          ref={phoneNumberRef}
          onSubmitEditing={() => nameRef.current?.focus()}
          blurOnSubmit={false}
        />
      </View>
      <Text>OTP: {otp}</Text>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>닉네임</Text>
        <TextInput
          style={styles.textInput}
          placeholder="닉네임을 입력해주세요."
          placeholderTextColor="#666"
          onChangeText={onChangeNickname}
          value={nickname}
          textContentType="name"
          returnKeyType="next"
          clearButtonMode="while-editing"
          ref={nameRef}
          onSubmitEditing={onSubmit}
        />
      </View>
      <View style={styles.buttonWrapper}>
        <Pressable
          style={
            canGoNext
              ? StyleSheet.compose(
                  styles.SignUpButton,
                  styles.SignUpButtonActive,
                )
              : styles.SignUpButton
          }
          disabled={!canGoNext || loading}
          onPress={onSubmit}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.SignUpButtonText}>
              {activeUserName}&nbsp;회원가입
            </Text>
          )}
        </Pressable>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  signUpTypeActive: {
    backgroundColor: '#1f6038',
  },
  signUpTypeImage: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  signUpTypeWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 24,
  },
  signUpTypeText: {
    fontWeight: 'bold',
    color: '#1f6038',
  },
  signUpTypeTextActive: {color: '#ffffff'},
  signUpType: {
    borderColor: '#1f6038',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    borderWidth: 3,
    borderRadius: 6,
  },
  textInput: {
    padding: 5,
    color: '#000000',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  inputWrapper: {
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    color: '#1f6038',
    fontSize: 16,
    marginBottom: 10,
  },
  buttonWrapper: {
    alignItems: 'center',
  },
  SignUpButton: {
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  SignUpButtonActive: {
    backgroundColor: '#1f6038',
  },
  SignUpButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SignUp;
