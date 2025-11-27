import React, { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LottieView from 'lottie-react-native';

type RootStackParamList = {
  Home: undefined;
  // Add other screens as needed
};

type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const SplashScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const animation = useRef<LottieView>(null);

  useEffect(() => {
    // Start animation
    animation.current?.play();

    // Navigate to Home screen after animation completes (4 seconds)
    const timer = setTimeout(() => {
      navigation.navigate('Home');
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View className="flex-1 bg-indigo-600 items-center justify-center">
      <View className="items-center w-full h-1/2">
        <LottieView
          ref={animation}
          source={require('../assets/waiting sand.json')}
          autoPlay
          loop
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </View>
      <View className="items-center -mt-16">
        <Text className="text-white text-4xl font-bold mb-2">Stopwatch</Text>
        <Text className="text-indigo-200 text-lg">Track your time</Text>
      </View>
    </View>
  );
};

export default SplashScreen;