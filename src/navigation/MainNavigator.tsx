import React, {createContext, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {RootStackParamList} from './types';
import Home from '../module/Home/Home';
import History from '../module/History';
import Header from '../components/Header';
import SvgHome from '../assets/SvgHome';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: 'white',
          paddingHorizontal: 24,
          paddingTop: 10,
          height: 60,
        },
      }}>
      <Tab.Screen
        name="Home"
        options={{
          header: props => <Header title="Home" />,
          tabBarLabel: 'Home',
          tabBarIcon: ({focused}: any) => (focused ? <SvgHome /> : <SvgHome />),
        }}
        component={Home} 
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
            header: props => <Header title="History" />,
            tabBarLabel: 'History',
            tabBarIcon: ({focused}: any) => (focused ? <SvgHome /> : <SvgHome />),
          }}
        />
    </Tab.Navigator>
    // <Stack.Navigator initialRouteName="Home">
    //   <Stack.Screen
    //     options={{headerShown: false}}
    //     name="Home"
    //     component={Home}
    //   />

    //   <Stack.Screen
    //     options={{headerShown: false}}
    //     name="History"
    //     component={History}
    //   />
    // </Stack.Navigator>
  );
};

export default MainNavigator;
