import React, {useCallback, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../AppInner';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';
import Config from 'react-native-config';
import axios, {AxiosError} from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;
function SignIn({navigation}: SignInScreenProps) {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const doneInput = email && password;
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const onChangeEmail = useCallback(text => {
    setEmail(text.trim());
  }, []);

  const onChangePassword = useCallback(text => {
    setPassword(text.trim());
  }, []);

  const onSubmit = useCallback(async () => {
    // console.log(email);
    // console.log(password);

    if (!email || !email.trim()) {
      return Alert.alert('알림', '이메일을 입력해주세요.');
    }
    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요.');
    }

    try {
      setLoading(true);

      const response = await axios.post(`${Config.API_URL}/login`, {
        email,
        password,
      });
      console.log('login response data >> ', response.data);
      dispatch(
        userSlice.actions.setUser({
          name: response.data.data.name,
          email: response.data.data.email,
          accessToken: response.data.data.accessToken,
        }),
      );
      Alert.alert('알림', '로그인이 완료되었습니다.');

      await EncryptedStorage.setItem(
        'refreshToken',
        response.data.data.refreshToken,
      );
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      if (errorResponse) {
        Alert.alert('알림', (errorResponse as any).data.message);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, dispatch, email, password]);

  const toSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  const onPressGetPhoneNumber = () => {
    DeviceInfo.getPhoneNumber().then(phoneNumber => {
      console.log('phoneNumber >> ', phoneNumber);
      // Android: null return: no permission, empty string: unprogrammed or empty SIM1, e.g. "+15555215558": normal return value
    });
  };

  return (
    <View>
      <Text style={styles.label} onPress={onPressGetPhoneNumber}>
        번호 내놔
      </Text>
      {/*<Text style={styles.label}>{DeviceInfo.getPhoneNumber()}</Text>*/}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>이메일</Text>
        <TextInput
          style={styles.textInput}
          placeholder="이메일을 입력해주세요."
          onChangeText={onChangeEmail}
          value={email}
          importantForAutofill="yes"
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
          onSubmitEditing={() => {
            passwordRef.current?.focus();
          }}
          blurOnSubmit={false}
          ref={emailRef}
        />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          style={styles.textInput}
          placeholder="비밀번호를 입력해주세요."
          onChangeText={onChangePassword}
          secureTextEntry
          value={password}
          importantForAutofill="yes"
          autoComplete="password"
          textContentType="password"
          onSubmitEditing={onSubmit}
          ref={passwordRef}
        />
      </View>
      <View style={styles.buttonZone}>
        <Pressable
          onPress={onSubmit}
          style={
            !doneInput
              ? styles.loginButton
              : [styles.loginButton, styles.loginButtonActive]
          }
          disabled={!doneInput || loading}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.loginButtonText}>로그인</Text>
          )}
        </Pressable>
        <Pressable onPress={toSignUp}>
          <Text>회원가입하기</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    padding: 20,
  },
  textInput: {padding: 5, borderBottomWidth: StyleSheet.hairlineWidth},
  label: {fontWeight: 'bold', fontSize: 16, marginBottom: 20, color: '#000000'},
  loginButton: {
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  loginButtonActive: {
    backgroundColor: 'blue',
  },

  loginButtonText: {
    color: '#ffffff',
  },
  buttonZone: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default SignIn;
