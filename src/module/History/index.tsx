import {StyleSheet, Text, View, FlatList} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {useTheme} from '../../context/ThemeContext'; 

const History = () => {
  const completedTimers = useSelector(
    (state: RootState) => state.timers.history,
  );
  const {theme} = useTheme();
  const isDark = theme === 'dark';

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return date.toLocaleDateString('en-IN', options);
  };

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <Text style={[styles.title, isDark && styles.darkText]}>
        Completed Timers
      </Text>

      {completedTimers?.length === 0 ? (
        <Text style={[styles.noData, isDark && styles.darkText]}>
          No completed timers yet
        </Text>
      ) : (
        <FlatList
          data={completedTimers}
          renderItem={({item}) => (
            <View style={[styles.timerCard, isDark && styles.darkTimerCard]}>
              <Text style={[styles.timerName, isDark && styles.darkText]}>
                Name: {item.name}
              </Text>
              <Text style={[styles.timerDetail, isDark && styles.darkText]}>
                Category: {item.category}
              </Text>
              <Text style={[styles.timerDetail, isDark && styles.darkText]}>
                Duration: {item.timetaken}s
              </Text>
              <Text style={[styles.timerDetail, isDark && styles.darkText]}>
                Completed At: {formatDate(new Date(item.timeOfCompletion))}
              </Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

export default History;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#fff'},
  darkContainer: {backgroundColor: '#121212'},
  title: {fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: 'black'},
  darkText: {color: 'white'},
  noData: {fontSize: 16, color: 'gray', textAlign: 'center', marginTop: 20},
  timerCard: {
    padding: 15,
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    borderColor: '#e0e0e0',
  },
  darkTimerCard: {
    backgroundColor: '#333',
    borderColor: '#555',
  },
  timerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  timerDetail: {fontSize: 14, color: 'gray', marginBottom: 3},
});
