import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../AppInner';
// import DismissKeyboardView from '../components/DismissKeyboardView';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import randomNameGenerator from 'korean-random-names-generator';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

function SignUp({navigation}: SignUpScreenProps) {
  const [loading, setLoading] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [nickname, setNickname] = useState('');

  const phoneNumberRef = useRef<TextInput | null>(null);
  const nameRef = useRef<TextInput | null>(null);

  const canGoNext = phoneNumber && nickname;

  useEffect(() => {
    getRandomNickname();
  }, []);

  const getRandomNickname = useCallback(() => {
    // TODO: 중복되는 닉네임인지 확인
    const rNickname = randomNameGenerator().toString().replace(' ', '');
    const response = axios.get(`/user/${rNickname}/nickname-check`);
    console.log('response >> ', response);
    setNickname(rNickname);
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

  console.log('Config.API_URL >> ', Config.API_URL);

  return (
    <KeyboardAwareScrollView>
      <View style={styles.signUpTypeWrapper}>
        <Pressable style={styles.signUpType}>
          <Text>고령유저</Text>
        </Pressable>
        <Pressable style={styles.signUpType}>
          <Text>일반유저</Text>
        </Pressable>
        <Pressable style={styles.signUpType}>
          <Text>기관유저</Text>
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
            <Text style={styles.SignUpButtonText}>회원가입</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  signUpTypeWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  signUpType: {
    borderColor: '#000000',
    borderWidth: 1,
  },
  textInput: {
    padding: 5,
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
