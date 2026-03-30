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
    backgroundColor: '#2C1A0A',
    gap: 12,
  },
  cover: {
    width: 200,
    height: 295,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 3,
    borderColor: '#C9841A',
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#C9841A',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 17,
    color: '#D4BA7A',
    marginBottom: 16,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  button: {
    backgroundColor: '#C9841A',
    paddingHorizontal: 52,
    paddingVertical: 14,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#E8A820',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C1810',
    letterSpacing: 1,
  },
});
