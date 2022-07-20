import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  ActivityIndicator,
} from 'react-native';
import RNOtpVerify from 'react-native-otp-verify';
import Config from 'react-native-config';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import randomNameGenerator from 'korean-random-names-generator';

function OldUserSignUp() {
  const [verifyNumberLoading, setVerifyNumberLoading] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);

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
    setVerifyNumberLoading(true);
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
        setVerifyNumberLoading(false);
      });
  }, [phoneNumber, identificationCode, nickname]);

  const onSubmitSignUp = useCallback(async () => {
    console.log('Try Signup...');

    setSignUpLoading(true);

    setTimeout(() => {
      setSignUpLoading(false);
    }, 4000);

    return;
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
        setVerifyNumberLoading(false);
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
      <View style={styles.oneClickSignUpButtonWrapper}>
        <Pressable
          style={
            signUpLoading
              ? [styles.oneClickSignUpButton, styles.oneClickSignUpButtonActive]
              : styles.oneClickSignUpButton
          }
          onPress={onSubmitSignUp}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            {signUpLoading ? (
              <View>
                <ActivityIndicator color="#1f6038" size={240} />
                <Text
                  style={{
                    fontSize: 18,
                    color: '#1f6038',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    position: 'absolute',
                    left: 70,
                    top: 90,
                  }}>
                  잠시만{'\n'}기다려주세요.
                </Text>
              </View>
            ) : (
              <Text
                style={{
                  fontSize: 28,
                  color: '#1f6038',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                원클릭{'\n'}가입하기
              </Text>
            )}
          </View>
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
          disabled={verifyNumberLoading}
          style={styles.sendVerifyNumberButton}
          onPress={sendVerifyNumber}>
          {verifyNumberLoading ? (
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
          disabled={!canGoNext || signUpLoading}
          onPress={onSubmitSignUp}>
          {signUpLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.SignUpButtonText}>고령유저&nbsp;회원가입</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  oneClickSignUpButtonActive: {
    borderWidth: 0,
  },

  oneClickSignUpButtonWrapper: {
    marginVertical: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  oneClickSignUpButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 20,
    borderColor: '#1f6038',
    justifyContent: 'center',
    alignItems: 'center',
  },
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

export default OldUserSignUp;
