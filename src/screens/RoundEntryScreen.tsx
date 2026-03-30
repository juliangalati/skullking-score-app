import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types';
import { TOTAL_ROUNDS } from '@/constants';
import { useGame } from '@/game/GameContext';
import { createRound, validateRoundInput } from '@/game';

type Props = NativeStackScreenProps<RootStackParamList, 'RoundEntry'>;

export function RoundEntryScreen({ route, navigation }: Props) {
  const { roundNumber } = route.params;
  const { game, submitRound } = useGame();
  const players = game?.players ?? [];

  const [bids, setBids] = useState<Record<string, string>>(
    Object.fromEntries(players.map(p => [p.id, '']))
  );
  const [tricks, setTricks] = useState<Record<string, string>>(
    Object.fromEntries(players.map(p => [p.id, '']))
  );
  const [bonuses, setBonuses] = useState<Record<string, string>>(
    Object.fromEntries(players.map(p => [p.id, '']))
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit() {
    const round = createRound(roundNumber, players);
    round.bidsByPlayerId = Object.fromEntries(
      players.map(p => [p.id, parseInt(bids[p.id] ?? '0', 10) || 0])
    );
    round.tricksByPlayerId = Object.fromEntries(
      players.map(p => [p.id, parseInt(tricks[p.id] ?? '0', 10) || 0])
    );
    round.bonusByPlayerId = Object.fromEntries(
      players.map(p => [p.id, parseInt(bonuses[p.id] ?? '0', 10) || 0])
    );

    const validationErrors = validateRoundInput(round, players);
    if (validationErrors.length > 0) {
      const errMap: Record<string, string> = {};
      for (const e of validationErrors) {
        errMap[`${e.playerId}-${e.field}`] = e.message;
      }
      setErrors(errMap);
      return;
    }

    setErrors({});
    submitRound(round);
    navigation.navigate('Scoreboard');
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Round {roundNumber} of {TOTAL_ROUNDS}</Text>

      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.nameCol]}>Player</Text>
        <Text style={[styles.headerCell, styles.numCol]}>Bid</Text>
        <Text style={[styles.headerCell, styles.numCol]}>Tricks</Text>
        <Text style={[styles.headerCell, styles.numCol]}>Bonus</Text>
      </View>

      {players.map(player => (
        <View key={player.id} style={styles.playerRow}>
          <Text style={[styles.nameCell, styles.nameCol]} numberOfLines={1}>
            {player.name}
          </Text>
          <View style={styles.numCol}>
            <TextInput
              style={[styles.numInput, errors[`${player.id}-bid`] && styles.inputError]}
              keyboardType="number-pad"
              placeholder="0"
              value={bids[player.id]}
              onChangeText={val => setBids(prev => ({ ...prev, [player.id]: val }))}
              maxLength={2}
            />
            {errors[`${player.id}-bid`] && (
              <Text style={styles.errorText}>{errors[`${player.id}-bid`]}</Text>
            )}
          </View>
          <View style={styles.numCol}>
            <TextInput
              style={[styles.numInput, errors[`${player.id}-tricks`] && styles.inputError]}
              keyboardType="number-pad"
              placeholder="0"
              value={tricks[player.id]}
              onChangeText={val => setTricks(prev => ({ ...prev, [player.id]: val }))}
              maxLength={2}
            />
            {errors[`${player.id}-tricks`] && (
              <Text style={styles.errorText}>{errors[`${player.id}-tricks`]}</Text>
            )}
          </View>
          <View style={styles.numCol}>
            <TextInput
              style={[styles.numInput, errors[`${player.id}-bonus`] && styles.inputError]}
              keyboardType="number-pad"
              placeholder="0"
              value={bonuses[player.id]}
              onChangeText={val => setBonuses(prev => ({ ...prev, [player.id]: val }))}
              maxLength={3}
            />
            {errors[`${player.id}-bonus`] && (
              <Text style={styles.errorText}>{errors[`${player.id}-bonus`]}</Text>
            )}
          </View>
        </View>
      ))}

      <Text style={styles.bonusHint}>
        Bonus (only if bid exact): +10 std 14 · +20 black 14 · +20 Pirate captures Mermaid · +30 Skull King captures Pirate · +40 Mermaid captures Skull King
      </Text>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitBtnText}>Submit Round</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 8,
  },
  heading: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginBottom: 4,
  },
  headerCell: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 6,
    gap: 8,
  },
  nameCell: {
    fontSize: 16,
    paddingTop: 10,
  },
  nameCol: {
    flex: 1.5,
  },
  numCol: {
    flex: 1,
  },
  numInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    textAlign: 'center',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    fontSize: 11,
    color: '#e74c3c',
    marginTop: 2,
  },
  bonusHint: {
    marginTop: 12,
    fontSize: 12,
    color: '#888',
    lineHeight: 18,
  },
  submitBtn: {
    marginTop: 16,
    backgroundColor: '#f5c518',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitBtnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a2e',
  },
});
