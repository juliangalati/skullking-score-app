import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const COVER_URI = 'https://www.grandpabecksgames.com/cdn/shop/files/sk_rulebook_thumbnail_250x369.jpg';

export function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: COVER_URI }} style={styles.cover} resizeMode="contain" />
      <Text style={styles.title}>Skull King</Text>
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
  cover: {
    width: 200,
    height: 295,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#f5c518',
  },
  subtitle: {
    fontSize: 18,
    color: '#aaa',
    marginBottom: 16,
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
