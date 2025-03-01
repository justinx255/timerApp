import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {useTheme} from '../context/ThemeContext';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({title}) => {
  const {theme, toggleTheme} = useTheme();
  const isDark = theme === 'dark';

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View
        style={[styles.header, {backgroundColor: isDark ? '#333' : '#f4f4f4'}]}>
        <Text style={[styles.title, {color: isDark ? '#fff' : '#000'}]}>
          {title}
        </Text>
        <TouchableOpacity style={styles.button} onPress={toggleTheme}>
          <Text style={{color: isDark ? '#fff' : '#000'}}>
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#007bff',
  },
});

export default Header;
