import MyPage from './src/pages/MyPage';
import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp/SignUp';
import Home from './src/pages/Home';
import {NavigationContainer} from '@react-navigation/native';
import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {RootState} from './src/store/reducer';
import {useEffect} from 'react';
import {useAppDispatch} from './src/store';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
import Config from 'react-native-config';
import userSlice from './src/slices/user';
import {Alert} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import CustomJob from './src/pages/CustomJob';
import JobState from './src/pages/JobState';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import usePermissions from './src/hooks/usePermissions';
import OldUserSignUp from './src/pages/SignUp/OldUserSignUp';
import DefaultUserSignUp from './src/pages/SignUp/DefaultUserSignUp';
import InstitutionUserSignUp from './src/pages/SignUp/InstitutionUserSignUp';

export type LoggedInParamList = {
  Orders: undefined;
  Settings: undefined;
  Delivery: undefined;
  Complete: {orderId: string};
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AppInner() {
  const isLoggedIn = useSelector((state: RootState) => !!state.user.email);
  const dispatch = useAppDispatch();

  console.log('isLoggedIn >> ', isLoggedIn);
  usePermissions();

  SplashScreen.hide();

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator initialRouteName="Home">
          <Tab.Screen
            name="Home"
            component={Home}
            options={{
              title: '홈',
              headerShown: false,
              tabBarIcon: () => <AntDesignIcon name="home" size={20} />,
            }}
          />
          <Tab.Screen
            name="CustomJob"
            component={CustomJob}
            options={{
              ...TabOptionStyle,
              title: '맞춤형',
              tabBarIcon: () => <AntDesignIcon name="pushpino" size={20} />,
            }}
          />
          <Tab.Screen
            name="JobState"
            component={JobState}
            options={{
              ...TabOptionStyle,
              title: '구직현황',
              tabBarIcon: () => <AntDesignIcon name="hourglass" size={20} />,
            }}
          />
          <Tab.Screen
            name="MyPage"
            component={MyPage}
            options={{
              ...TabOptionStyle,
              title: '마이페이지',
              tabBarIcon: () => <AntDesignIcon name="user" size={20} />,
            }}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{
              ...TabOptionStyle,
              title: '회원가입',
            }}
          />
          <Stack.Screen
            name="OldUserSignUp"
            component={OldUserSignUp}
            options={{
              ...TabOptionStyle,
              title: '고령유저 회원가입',
            }}
          />
          <Stack.Screen
            name="DefaultUserSignUp"
            component={DefaultUserSignUp}
            options={{...TabOptionStyle, title: '일반유저 회원가입'}}
          />
          <Stack.Screen
            name="InstitutionUserSignUp"
            component={InstitutionUserSignUp}
            options={{...TabOptionStyle, title: '기관유저 회원가입'}}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

const TabOptionStyle: any = {
  tabBarActiveTintColor: '#1f6038',
  headerStyle: {
    backgroundColor: '#1f6038',
  },
  headerTintColor: '#ffffff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  headerTitleAlign: 'center',
};

export default AppInner;
