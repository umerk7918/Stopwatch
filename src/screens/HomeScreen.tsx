import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Custom Colors
const COLORS = {
  background: '#0F0F1E',
  surface: '#1A1A2E',
  primary: '#6C63FF',
  primaryDark: '#4D44DB',
  text: '#FFFFFF',
  textSecondary: '#A0A0B0',
  accent: '#FF6584',
  divider: '#2A2A3A',
};

// Custom Shadow Style
const SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 4.65,
  elevation: 8,
};

type MainButtonProps = {
  onPress: () => void;
  text: string;
  isActive?: boolean;
};

const MainButton = ({ onPress, text, isActive = false }: MainButtonProps) => {
  const buttonStyle = {
    ...styles.mainButton,
    backgroundColor: isActive ? COLORS.accent : COLORS.primary,
    ...(isActive ? styles.buttonActive : {}),
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={buttonStyle}
      activeOpacity={0.8}
    >
      <Text style={styles.mainButtonText}>{text}</Text>
    </TouchableOpacity>
  );
};

type ControlButtonProps = {
  onPress: () => void;
  text: string;
  isActive?: boolean;
};

const ControlButton = ({ onPress, text, isActive = false }: ControlButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.controlButton, isActive && styles.controlButtonActive]}
    activeOpacity={0.7}
  >
    <Text style={[styles.controlButtonText, isActive && styles.controlButtonTextActive]}>{text}</Text>
  </TouchableOpacity>
);

type Lap = {
  id: number;
  time: string;
  totalTime: number;
};

const HomeScreen = () => {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTime = useRef<number>(0);
  const lapNumber = useRef<number>(1);

  useEffect(() => {
    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, []);

  const startStopwatch = () => {
    if (isRunning) {
      if (interval.current) clearInterval(interval.current);
    } else {
      startTime.current = Date.now() - time;
      interval.current = setInterval(() => {
        setTime(Date.now() - startTime.current);
      }, 10);
    }
    setIsRunning(!isRunning);
  };

  const resetStopwatch = () => {
    if (interval.current) clearInterval(interval.current);
    setTime(0);
    setIsRunning(false);
    setLaps([]);
    lapNumber.current = 1;
  };

  const addLap = () => {
    const newLap: Lap = {
      id: Date.now(),
      time: formatTime(time),
      totalTime: time,
    };
    setLaps(prevLaps => [newLap, ...prevLaps]);
    lapNumber.current += 1;
  };

  const formatTime = (timeInMs: number): string => {
    const date = new Date(timeInMs);
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    const milliseconds = Math.floor(date.getUTCMilliseconds() / 10).toString().padStart(2, '0');
    
    return `${minutes}:${seconds}.${milliseconds}`;
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Stopwatch</Text>
      </View>

      {/* Timer Display */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>
          {formatTime(time)}
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.controlsContainer}>
        <View style={styles.mainButtonContainer}>
          {!isRunning ? (
            <MainButton
              onPress={startStopwatch}
              text="Start"
              isActive={true}
            />
          ) : (
            <MainButton
              onPress={startStopwatch}
              text="Stop"
              isActive={true}
            />
          )}
          
          <View style={styles.secondaryButtonContainer}>
            {isRunning ? (
              <ControlButton
                onPress={addLap}
                text="Lap"
                isActive={true}
              />
            ) : (
              <ControlButton
                onPress={resetStopwatch}
                text="Reset"
                isActive={false}
              />
            )}
          </View>
        </View>
      </View>

      {/* Laps List */}
      <View style={styles.lapsContainer}>
        <ScrollView contentContainerStyle={styles.lapsScrollView}>
          {laps.length > 0 && (
            <View style={styles.lapsHeader}>
              <Text style={styles.lapsHeaderText}>Laps</Text>
            </View>
          )}
          {laps.map((lap, index) => (
            <View key={lap.id} style={styles.lapItem}>
              <Text style={styles.lapNumber}>Lap {laps.length - index}</Text>
              <Text style={styles.lapTime}>{lap.time}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text,
    letterSpacing: 1,
  },
  timerContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 72,
    fontWeight: '200',
    color: COLORS.text,
    fontVariant: ['tabular-nums'],
    letterSpacing: -2,
  },
  controlsContainer: {
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  mainButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    ...SHADOW,
  },
  buttonActive: {
    transform: [{ scale: 1.05 }],
  },
  mainButtonText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButtonContainer: {
    position: 'absolute',
    right: 0,
  },
  controlButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  controlButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  controlButtonText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
  controlButtonTextActive: {
    color: COLORS.text,
  },
  lapsContainer: {
    flex: 3,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    ...SHADOW,
  },
  lapsScrollView: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  lapsHeader: {
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    marginBottom: 15,
  },
  lapsHeaderText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
  },
  lapItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  lapNumber: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  lapTime: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
});

export default HomeScreen;