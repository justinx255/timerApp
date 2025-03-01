import React from 'react';
import {StatusBar, StatusBarStyle, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = {
  backgroundColor?: string;
  barStyle?: StatusBarStyle;
};
const CustomStatusBar = ({
  backgroundColor = 'white',
  barStyle = 'dark-content',
}: Props) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{height: insets.top, backgroundColor}}>
      <StatusBar
        barStyle={barStyle}
        animated
        backgroundColor={backgroundColor}
      />
    </View>
  );
};
export default CustomStatusBar;
