import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>☠️ Skull King</Text>
      <Text style={styles.subtitle}>Score Tracker</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PlayerSetup')}>
        <Text style={styles.buttonText}>New Game</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a2e',
    gap: 12,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#f5c518',
  },
  subtitle: {
    fontSize: 18,
    color: '#aaa',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#f5c518',
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a2e',
  },
});
