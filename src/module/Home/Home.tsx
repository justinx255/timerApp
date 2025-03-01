import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import TimerCard from '../../components/TimerCard';
import {useTheme} from '../../context/ThemeContext';
import Toast from 'react-native-toast-message';
import AddTimerModel from '../../components/AddTimerModel';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../../redux/store';
import {
  startAllCategoryTimers,
  pauseAllCategoryTimers,
  resetAllCategoryTimers,
  startTimer,
  pauseTimer,
  resetTimer,
  tickTimers,
  completeTimer,
} from './store/homeReducer';
import {useNavigation} from '@react-navigation/native';

const Home: React.FC = () => {
  const {theme} = useTheme();
  const isDark = theme === 'dark';
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const timers = useSelector((state: RootState) => state.timers.timers);
  const timersState = useSelector(
    (state: RootState) => state.timers.timersState,
  );
  const history = useSelector((state: RootState) => state.timers.history);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);

  const categorizedTimers = timers.reduce((acc, timer) => {
    acc[timer.category] = acc[timer.category] || [];
    acc[timer.category].push(timer);
    return acc;
  }, {} as Record<string, typeof timers>);

  const categories = Object.keys(categorizedTimers);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(tickTimers());
    }, 1000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const renderCategoryItem = ({item: category}) => {
    const categoryTimerCount = categorizedTimers[category].length;

    return (
      <TouchableOpacity
        style={[
          styles.categoryButton,
          selectedCategory === category && styles.selectedCategoryButton,
          isDark && styles.darkCategoryButton,
          selectedCategory === category &&
            isDark &&
            styles.darkSelectedCategoryButton,
        ]}
        onPress={() => setSelectedCategory(category)}>
        <Text
          style={[
            styles.categoryButtonText,
            selectedCategory === category && styles.selectedCategoryButtonText,
            isDark && styles.darkCategoryButtonText,
            selectedCategory === category &&
              isDark &&
              styles.darkSelectedCategoryButtonText,
          ]}>
          {category} ({categoryTimerCount})
        </Text>
      </TouchableOpacity>
    );
  };

  const renderTimerItem = ({item: timer}) => (
    <TimerCard
      key={timer.id}
      timer={timer}
      isRunning={timersState[timer.id]?.isRunning}
      timeLeft={timersState[timer.id]?.timeLeft ?? timer.duration}
      onStart={() => dispatch(startTimer(timer.id))}
      onPause={() => dispatch(pauseTimer(timer.id))}
      onReset={() => dispatch(resetTimer(timer.id))}
      onComplete={() => dispatch(completeTimer(timer.id))}
      status={timersState[timer.id]?.status || 'pending'}
    />
  );

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <AddTimerModel
        visible={addModalVisible}
        close={() => setAddModalVisible(false)}
        isDarkMode={isDark}
      />
      <View style={styles.headerActions}>
        <Text
          style={[
            styles.categoryCount,
            isDark && styles.headerText,
            isDark && styles.darkHeaderText,
          ]}>
          Categories: {categories?.length}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('History')}>
          <Text
            style={[
              styles.completedCount,
              isDark && styles.headerText,
              isDark && styles.darkHeaderText,
            ]}>
            Completed: {history?.length}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setAddModalVisible(true)}
          style={[styles.addButton, isDark && styles.darkAddButton]}>
          <Text style={[styles.addButtonText]}>+Add</Text>
        </TouchableOpacity>
      </View>
      {categories.length > 0 ? (
        <>
          <View style={styles.categoryScrollView}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={item => item}
            />
          </View>

          {selectedCategory && (
            <View style={styles.timersListContainer}>
              <View style={styles.categoryActions}>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    isDark && styles.darkActionButton,
                  ]}
                  onPress={() =>
                    dispatch(startAllCategoryTimers(selectedCategory))
                  }>
                  <Text style={[styles.actionButtonText]}>Start All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    isDark && styles.darkActionButton,
                  ]}
                  onPress={() =>
                    dispatch(pauseAllCategoryTimers(selectedCategory))
                  }>
                  <Text style={[styles.actionButtonText]}>Pause All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    isDark && styles.darkActionButton,
                  ]}
                  onPress={() =>
                    dispatch(resetAllCategoryTimers(selectedCategory))
                  }>
                  <Text style={[styles.actionButtonText]}>Reset All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={categorizedTimers[selectedCategory]}
                renderItem={renderTimerItem}
                keyExtractor={item => item.id}
              />
            </View>
          )}
        </>
      ) : (
        <View style={styles.noCategoriesContainer}>
          <Text style={[styles.noCategoriesText, isDark && styles.darkText]}>
            No categories available. Please add a task.
          </Text>
        </View>
      )}

      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
  darkContainer: {backgroundColor: '#121212'},
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryCount: {
    fontSize: 16,
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
    marginRight: 5,
  },
  completedCount: {
    fontSize: 16,
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
  },
  addButton: {padding: 10, borderRadius: 5, backgroundColor: '#007bff'},
  darkAddButton: {backgroundColor: '#0056b3'},
  addButtonText: {color: 'white'},
  categoryScrollView: {marginBottom: 10},
  categoryButton: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
  },
  darkCategoryButton: {backgroundColor: '#3a3a3a'},
  selectedCategoryButton: {backgroundColor: '#007bff'},
  darkSelectedCategoryButton: {backgroundColor: '#0056b3'},
  categoryButtonText: {color: '#000'},
  darkCategoryButtonText: {color: '#fff'},
  selectedCategoryButtonText: {color: '#fff'},
  darkSelectedCategoryButtonText: {color: '#fff'},
  timersListContainer: {flex: 1},
  categoryActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  actionButton: {padding: 10, backgroundColor: '#007bff', borderRadius: 5},
  darkActionButton: {backgroundColor: '#0056b3'},
  actionButtonText: {color: 'white'},
  darkText: {color: '#fff'},
  noCategoriesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCategoriesText: {fontSize: 18, textAlign: 'center'},
  headerText: {color: 'black'},
  darkHeaderText: {color: 'black'},
});

export default Home;
