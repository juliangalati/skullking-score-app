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
  const [globalError, setGlobalError] = useState<string>('');

  const isFormValid = players.every(p => {
    const bid = bids[p.id];
    const trick = tricks[p.id];
    const bonus = bonuses[p.id];
    const bidVal = parseInt(bid, 10);
    const trickVal = parseInt(trick, 10);
    const bonusVal = bonus === '' ? 0 : parseInt(bonus, 10);
    return (
      bid !== '' && !isNaN(bidVal) && bidVal >= 0 && bidVal <= roundNumber &&
      trick !== '' && !isNaN(trickVal) && trickVal >= 0 && trickVal <= roundNumber &&
      !isNaN(bonusVal) && bonusVal >= 0
    );
  });

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
      let global = '';
      for (const e of validationErrors) {
        if (e.field === 'tricks_total') {
          global = e.message;
        } else {
          errMap[`${e.playerId}-${e.field}`] = e.message;
        }
      }
      setErrors(errMap);
      setGlobalError(global);
      return;
    }

    setErrors({});
    setGlobalError('');
    submitRound(round);
    navigation.navigate('Scoreboard');
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
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
              placeholder="--"
              placeholderTextColor="#2C1810"
              value={bids[player.id]}
              onChangeText={val => setBids(prev => ({ ...prev, [player.id]: val.replace(/[^0-9]/g, '') }))}
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
              placeholder="--"
              placeholderTextColor="#2C1810"
              value={tricks[player.id]}
              onChangeText={val => setTricks(prev => ({ ...prev, [player.id]: val.replace(/[^0-9]/g, '') }))}
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
              placeholderTextColor="#B8945A"
              value={bonuses[player.id]}
              onChangeText={val => setBonuses(prev => ({ ...prev, [player.id]: val.replace(/[^0-9]/g, '') }))}
              maxLength={3}
            />
            {errors[`${player.id}-bonus`] && (
              <Text style={styles.errorText}>{errors[`${player.id}-bonus`]}</Text>
            )}
          </View>
        </View>
      ))}

      {globalError !== '' && (
        <View style={styles.globalErrorBanner}>
          <Text style={styles.globalErrorText}>{globalError}</Text>
        </View>
      )}

      <Text style={styles.bonusHint}>
        Bonus (only if bid exact): +10 std 14 · +20 black 14 · +20 Pirate captures Mermaid · +30 Skull King captures Pirate · +40 Mermaid captures Skull King
      </Text>

      <TouchableOpacity
        style={[styles.submitBtn, !isFormValid && styles.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={!isFormValid}
      >
        <Text style={styles.submitBtnText}>Submit Round</Text>
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
    gap: 8,
    flexGrow: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2C1810',
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderColor: '#B8945A',
    marginBottom: 4,
  },
  headerCell: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7A4E2A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 6,
    gap: 8,
    borderBottomWidth: 1,
    borderColor: '#D4BA7A',
  },
  nameCell: {
    fontSize: 16,
    paddingTop: 10,
    color: '#2C1810',
    fontWeight: '600',
  },
  nameCol: {
    flex: 1.5,
  },
  numCol: {
    flex: 1,
  },
  numInput: {
    borderWidth: 1.5,
    borderColor: '#B8945A',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#FAF0D7',
    color: '#2C1810',
    fontWeight: '600',
  },
  inputError: {
    borderColor: '#C84B1A',
    backgroundColor: '#FAE8E0',
  },
  errorText: {
    fontSize: 11,
    color: '#C84B1A',
    marginTop: 2,
  },
  globalErrorBanner: {
    marginTop: 12,
    backgroundColor: '#FAE8E0',
    borderWidth: 1.5,
    borderColor: '#C84B1A',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  globalErrorText: {
    color: '#C84B1A',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  bonusHint: {
    marginTop: 12,
    fontSize: 12,
    color: '#7A4E2A',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  submitBtn: {
    marginTop: 16,
    backgroundColor: '#C9841A',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E8A820',
  },
  submitBtnDisabled: {
    backgroundColor: '#C4B49A',
    borderColor: '#C4B49A',
  },
  submitBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C1810',
    letterSpacing: 0.5,
  },
});
