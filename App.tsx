import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types';
import { GameProvider } from '@/game/GameContext';
import { HomeScreen } from '@/screens/HomeScreen';
import { PlayerSetupScreen } from '@/screens/PlayerSetupScreen';
import { RoundEntryScreen } from '@/screens/RoundEntryScreen';
import { ScoreboardScreen } from '@/screens/ScoreboardScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GameProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PlayerSetup" component={PlayerSetupScreen} options={{ title: 'Players' }} />
          <Stack.Screen name="RoundEntry" component={RoundEntryScreen} />
          <Stack.Screen name="Scoreboard" component={ScoreboardScreen} options={{ headerBackVisible: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </GameProvider>
  );
}
