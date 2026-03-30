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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Who's playing?</Text>

      {names.map((name, i) => (
        <View key={i} style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder={`Player ${i + 1}`}
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
  container: {
    padding: 24,
    gap: 12,
  },
  heading: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  removeBtn: {
    padding: 10,
  },
  removeBtnText: {
    fontSize: 16,
    color: '#999',
  },
  addBtn: {
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  addBtnText: {
    fontSize: 16,
    color: '#666',
  },
  startBtn: {
    marginTop: 16,
    backgroundColor: '#f5c518',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  startBtnDisabled: {
    opacity: 0.4,
  },
  startBtnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a2e',
  },
});
