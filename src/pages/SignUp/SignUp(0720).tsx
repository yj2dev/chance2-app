import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../AppInner';
import axios from 'axios';
import Config from 'react-native-config';
import randomNameGenerator from 'korean-random-names-generator';
import DeviceInfo from 'react-native-device-info';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import RNOtpVerify from 'react-native-otp-verify';

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

function SignUp0720({navigation}: SignUpScreenProps) {
  const [activeUserName, setActiveUserName] = useState('고령유저');
  const [verifyNumberloading, setVerifyNumberloading] = useState(false);
  const [signUploading, setSignUploading] = useState(false);

  const [identificationCode, setIdentificationCode] = useState('');
  const [verifyNumber, setVerifyNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nickname, setNickname] = useState('');
  const [showInputVerifyNumber, setShowInputVerifyNumber] = useState(false);

  const phoneNumberRef = useRef<TextInput | null>(null);
  const nameRef = useRef<TextInput | null>(null);

  const canGoNext = phoneNumber && verifyNumber && nickname;

  useEffect(() => {
    getIdentificationCode(); // 문자 식별코드 생성
    startListeningForOtp(); // 문자 인증코드 자동입력
    getPhoneNumber(); // 휴대번호 가져오기
    getRandomNickname(); // 랜덤 닉네임 생성
  }, []);

  const getIdentificationCode = useCallback(() => {
    RNOtpVerify.getHash()
      .then(hash => {
        console.log(hash);
        setIdentificationCode(hash[0]);
      })
      .catch(console.log);
  }, []);

  const startListeningForOtp = () => {
    RNOtpVerify.getOtp()
      .then(p => RNOtpVerify.addListener(otpHandler))
      .catch(p => console.log(p));
  };

  const otpHandler = (message: string) => {
    const number = message.replace(/[^0-9]/g, '').substring(0, 4);
    setVerifyNumber(number);
  };

  const sendVerifyNumber = useCallback(async () => {
    console.log('INFO >> ', phoneNumber, identificationCode, nickname);
    console.log('URL >> ', Config.API_URL);
    setVerifyNumberloading(true);
    await axios
      .get(`${Config.API_URL}/`)
      .then(res => {
        console.log('res.data >> ', res.data);
      })
      .catch(console.error);

    await axios
      .post(`${Config.API_URL}/message/verify-number/send`, {
        phoneNumber,
        identificationCode,
      })
      .then(res => {
        console.log('res.data >> ', res.data);
      })
      .catch(console.error)
      .finally(() => {
        setVerifyNumberloading(false);
      });
  }, [phoneNumber, identificationCode, nickname]);

  const onSubmitSignUp = useCallback(async () => {
    console.log('Try Signup...');
    await axios
      .post(`${Config.API_URL}/old-user/signup`, {
        phoneNumber,
        nickname,
      })
      .then(res => {
        console.log('res.data >> ', res.data);
      })
      .catch(console.error)
      .finally(() => {
        setVerifyNumberloading(false);
      });
  }, [phoneNumber, identificationCode, nickname]);

  const getPhoneNumber = useCallback(() => {
    DeviceInfo.getPhoneNumber().then(pNumber => {
      const _pNumber = '0' + pNumber.substring(3, pNumber.length);
      setPhoneNumber(_pNumber);
      return _pNumber;
    });
  }, []);

  const getRandomNickname = useCallback(() => {
    // TODO: 중복되는 닉네임인지 확인
    const rNickname = randomNameGenerator().toString().replace(/ /gi, '');
    // const response = axios.get(`/user/${rNickname}/nickname-check`);
    // console.log('response >> ', response);
    setNickname(rNickname);
  }, [nickname]);

  const onChangePhoneNumber = useCallback(
    text => {
      const _text = text.replace(/[^0-9]/g, '');
      if (_text.length < 12) {
        setPhoneNumber(_text.trim());
      }
    },
    [phoneNumber],
  );

  const onChangeVerifyNumber = useCallback(
    text => {
      const _text = text.replace(/[^0-9]/g, '');
      if (_text.length < 5) {
        setVerifyNumber(_text.trim());
      }
    },
    [verifyNumber],
  );

  const onChangeNickname = useCallback(
    text => {
      if (text.length < 25) {
        setNickname(text.trim());
      }
    },
    [nickname],
  );

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
            source={require('../../assets/images/default-user.png')}
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
            source={require('../../assets/images/old-user.png')}
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
            source={require('../../assets/images/institution-user.png')}
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
        <Pressable
          disabled={verifyNumberloading}
          style={styles.sendVerifyNumberButton}
          onPress={sendVerifyNumber}>
          {verifyNumberloading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{color: '#fff'}}>휴대폰 인증</Text>
          )}
        </Pressable>
      </View>

      {!showInputVerifyNumber && (
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>인증번호</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={onChangeVerifyNumber}
            placeholder="인증번호를 입력해주세요"
            placeholderTextColor="#666"
            textContentType="creditCardNumber"
            keyboardType="number-pad"
            value={verifyNumber}
            returnKeyType="next"
            clearButtonMode="while-editing"
            // ref={phoneNumberRef}
            onSubmitEditing={() => nameRef.current?.focus()}
            blurOnSubmit={false}
          />
        </View>
      )}

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
          onSubmitEditing={onSubmitSignUp}
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
          disabled={!canGoNext || signUploading}
          onPress={onSubmitSignUp}>
          {signUploading ? (
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
  sendVerifyNumberButton: {
    position: 'absolute',
    right: 0,
    marginTop: 20,
    marginRight: 24,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#1f6038',
  },

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
    position: 'relative',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  label: {
    fontWeight: 'bold',
    color: '#1f6038',
    fontSize: 16,
  },
  buttonWrapper: {
    alignItems: 'center',
  },
  SignUpButton: {
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 8,
  },
  SignUpButtonActive: {
    backgroundColor: '#1f6038',
  },
  SignUpButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SignUp0720;
