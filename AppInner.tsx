import MyPage from './src/pages/MyPage';
import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
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
// import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

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

  SplashScreen.hide();

  return (
    <NavigationContainer>
      <Tab.Navigator>
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
            title: '맞춤형',
            tabBarIcon: () => <AntDesignIcon name="pushpino" size={20} />,
          }}
        />
        <Tab.Screen
          name="JobState"
          component={JobState}
          options={{
            title: '구직현황',
            tabBarIcon: () => <AntDesignIcon name="hourglass" size={20} />,
          }}
        />
        <Tab.Screen
          name="MyPage"
          component={MyPage}
          options={{
            title: '마이페이지',
            tabBarIcon: () => <AntDesignIcon name="user" size={20} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default AppInner;
