import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types';
import { MIN_PLAYERS, MAX_PLAYERS } from '@/constants';
import { useGame } from '@/game/GameContext';
import { generateId } from '@/utils';

type Props = NativeStackScreenProps<RootStackParamList, 'PlayerSetup'>;

export function PlayerSetupScreen({ navigation }: Props) {
  const { startGame } = useGame();
  const [names, setNames] = useState<string[]>(['', '']);

  function updateName(index: number, value: string) {
    setNames(prev => prev.map((n, i) => (i === index ? value : n)));
  }

  function addPlayer() {
    setNames(prev => [...prev, '']);
  }

  function removePlayer(index: number) {
    setNames(prev => prev.filter((_, i) => i !== index));
  }

  function handleStart() {
    const players = names.map(name => ({ id: generateId(), name: name.trim() }));
    startGame(players);
    navigation.navigate('RoundEntry', { roundNumber: 1 });
  }

  const canStart = names.length >= MIN_PLAYERS && names.every(n => n.trim().length > 0);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Who's playing?</Text>

      {names.map((name, i) => (
        <View key={i} style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder={`Player ${i + 1}`}
            placeholderTextColor="#B8945A"
            value={name}
            onChangeText={val => updateName(i, val)}
            maxLength={20}
          />
          {names.length > MIN_PLAYERS && (
            <TouchableOpacity style={styles.removeBtn} onPress={() => removePlayer(i)}>
              <Text style={styles.removeBtnText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      {names.length < MAX_PLAYERS && (
        <TouchableOpacity style={styles.addBtn} onPress={addPlayer}>
          <Text style={styles.addBtnText}>+ Add Player</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.startBtn, !canStart && styles.startBtnDisabled]}
        onPress={handleStart}
        disabled={!canStart}
      >
        <Text style={styles.startBtnText}>Start Game</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: '#EDD9A3',
  },
  container: {
    padding: 24,
    gap: 12,
    flexGrow: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C1810',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#B8945A',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#FAF0D7',
    color: '#2C1810',
  },
  removeBtn: {
    padding: 10,
  },
  removeBtnText: {
    fontSize: 16,
    color: '#B8945A',
  },
  addBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#B8945A',
    borderRadius: 6,
    borderStyle: 'dashed',
  },
  addBtnText: {
    fontSize: 16,
    color: '#7A4E2A',
    fontWeight: '600',
  },
  startBtn: {
    marginTop: 16,
    backgroundColor: '#C9841A',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E8A820',
  },
  startBtnDisabled: {
    opacity: 0.4,
  },
  startBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C1810',
    letterSpacing: 0.5,
  },
});
