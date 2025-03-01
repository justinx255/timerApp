import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Modal} from 'react-native';
import Toast from 'react-native-toast-message';
import * as Progress from 'react-native-progress';
import {useTheme} from '../context/ThemeContext';

interface TimerCardProps {
  timer: {id: string; name: string; duration: number};
  isRunning: boolean | undefined;
  timeLeft: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onComplete: (timerId: string) => void;
  status: 'pending' | 'running' | 'completed';
}

const TimerCard: React.FC<TimerCardProps> = ({
  timer,
  isRunning,
  timeLeft,
  onStart,
  onPause,
  onReset,
  onComplete,
  status,
}) => {
  const {theme} = useTheme();
  const isDark = theme === 'dark';

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const [formattedTime, setFormattedTime] = useState(formatTime(timeLeft));
  const [notified, setNotified] = useState(false);
  const [showCongratulationsModal, setShowCongratulationsModal] =
    useState(false);

  useEffect(() => {
    setFormattedTime(formatTime(timeLeft));
    setNotified(false);
  }, [timeLeft]);

  useEffect(() => {
    if (!notified && timeLeft === Math.floor(timer.duration / 2)) {
      Toast.show({
        type: 'info',
        text1: 'Timer Alert',
        text2: `${timer.name} is at 50%`,
      });
      setNotified(true);
    }

    if (timeLeft === 0 && isRunning) {
      setShowCongratulationsModal(true);
      onComplete(timer.id);
    }
  }, [timeLeft, isRunning, timer, onComplete, notified]);

  useEffect(() => {
    if (showCongratulationsModal) {
      const timerId = setTimeout(() => {
        setShowCongratulationsModal(false);
      }, 2000);

      return () => clearTimeout(timerId);
    }
  }, [showCongratulationsModal]);

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return isDark ? '#555' : '#ddd';
      case 'running':
        return '#007bff';
      case 'completed':
        return '#28a745';
      default:
        return '#000';
    }
  };

  return (
    <View style={[styles.card, isDark && styles.darkCard]}>
      <Text style={[styles.name, isDark && styles.darkText]}>{timer.name}</Text>
      <Text style={[styles.time, isDark && styles.darkText]}>
        {formattedTime}
      </Text>
      <Progress.Bar
        progress={timeLeft / timer.duration}
        width={null}
        color={getStatusColor()}
        height={10}
        borderRadius={5}
        style={styles.progressBar}
      />
      <Text style={[styles.statusText, {color: getStatusColor()}]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Text>
      {status !== 'completed' && (
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.button}
            onPress={isRunning ? onPause : onStart}>
            <Text style={styles.buttonText}>
              {isRunning ? 'Pause' : 'Start'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onReset}>
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={showCongratulationsModal}>
        <View style={[styles.modalContent, isDark && styles.darkModalContent]}>
          <Text style={[styles.modalText, isDark && styles.darkText]}>
            Congratulations!
          </Text>
          <Text style={[styles.modalText, isDark && styles.darkText]}>
            You completed {timer.name}!
          </Text>
        </View>
      </Modal>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  darkCard: {
    backgroundColor: '#333',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  time: {
    fontSize: 28,
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: '600',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#007bff',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  progressBar: {
    marginTop: 10,
    marginBottom: 5,
  },
  darkText: {
    color: '#fff',
  },
  statusText: {
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  darkModalContent: {
    backgroundColor: '#333',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
  },
});

export default TimerCard;
