import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types';
import { GameProvider } from '@/game/GameContext';
import { FaqButton } from '@/components/FaqButton';
import { ReferenceCardsButton } from '@/components/ReferenceCardsButton';
import { HomeScreen } from '@/screens/HomeScreen';
import { PlayerSetupScreen } from '@/screens/PlayerSetupScreen';
import { RoundEntryScreen } from '@/screens/RoundEntryScreen';
import { ScoreboardScreen } from '@/screens/ScoreboardScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GameProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerRight: () => (
              <View style={{ flexDirection: 'row' }}>
                <ReferenceCardsButton />
                <FaqButton />
              </View>
            ),
            headerStyle: { backgroundColor: '#1a1a2e' },
            headerTintColor: '#f5c518',
            headerTitleStyle: { color: '#fff' },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Skull King' }} />
          <Stack.Screen name="PlayerSetup" component={PlayerSetupScreen} options={{ title: 'Players' }} />
          <Stack.Screen name="RoundEntry" component={RoundEntryScreen} options={({ route }) => ({ title: `Round ${route.params.roundNumber}` })} />
          <Stack.Screen name="Scoreboard" component={ScoreboardScreen} options={{ headerBackVisible: false, title: 'Scoreboard' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </GameProvider>
  );
}
