import {NavigationContainer} from '@react-navigation/native';
import React, {ReactNode} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import store from '../redux/store.tsx';

type Props = {
  children: ReactNode;
};

export const navigationRef: any = React.createRef();

const AppProvider = ({children}: Props) => {
  const insets = useSafeAreaInsets();

  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef}>{children}</NavigationContainer>
    </Provider>
  );
};

export default AppProvider;
