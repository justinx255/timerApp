import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Platform, TouchableOpacity, Text} from 'react-native';
import AppProvider from './src/navigation/AppProvider';
import MainNavigator from './src/navigation/MainNavigator';
import {ThemeProvider} from './src/context/ThemeContext';
import CustomStatusBar from './src/components/CustomStatusBar';

const App = () => {
  return (

    <SafeAreaProvider>
      <AppProvider>
        <ThemeProvider >
        <CustomStatusBar/>
          <MainNavigator />
        </ThemeProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
};

export default App;
