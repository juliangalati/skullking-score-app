import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types';
import { TOTAL_ROUNDS } from '@/constants';
import { useGame } from '@/game/GameContext';
import { calculateTotals } from '@/game';

type Props = NativeStackScreenProps<RootStackParamList, 'Scoreboard'>;

export function ScoreboardScreen({ navigation }: Props) {
  const { game, resetGame } = useGame();

  if (!game) return null;

  const { players, rounds, status } = game;
  const lastRound = rounds[rounds.length - 1];
  const totals = calculateTotals(rounds);
  const isFinished = status === 'finished';
  const nextRoundNumber = rounds.length + 1;

  const sortedPlayers = [...players].sort(
    (a, b) => (totals[b.id] ?? 0) - (totals[a.id] ?? 0)
  );

  function handleNext() {
    navigation.navigate('RoundEntry', { roundNumber: nextRoundNumber });
  }

  function handleNewGame() {
    resetGame();
    navigation.navigate('Home');
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>
        {isFinished ? 'Final Scores' : `After Round ${lastRound.number}`}
      </Text>

      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.rankCol]}>#</Text>
        <Text style={[styles.headerCell, styles.nameCol]}>Player</Text>
        <Text style={[styles.headerCell, styles.scoreCol]}>Round</Text>
        <Text style={[styles.headerCell, styles.scoreCol]}>Total</Text>
      </View>

      {sortedPlayers.map((player, index) => {
        const roundScore = lastRound?.scoresByPlayerId[player.id] ?? 0;
        const total = totals[player.id] ?? 0;
        return (
          <View key={player.id} style={[styles.row, index === 0 && styles.topRow]}>
            <Text style={[styles.cell, styles.rankCol, index === 0 && styles.topText]}>
              {index + 1}
            </Text>
            <Text style={[styles.cell, styles.nameCol, index === 0 && styles.topText]} numberOfLines={1}>
              {player.name}
            </Text>
            <Text style={[styles.cell, styles.scoreCol, roundScore >= 0 ? styles.pos : styles.neg]}>
              {roundScore >= 0 ? '+' : ''}{roundScore}
            </Text>
            <Text style={[styles.cell, styles.scoreCol, styles.totalScore, index === 0 && styles.topText]}>
              {total}
            </Text>
          </View>
        );
      })}

      {isFinished ? (
        <>
          <Text style={styles.winner}>🏆 {sortedPlayers[0]?.name} wins!</Text>
          <TouchableOpacity style={styles.btn} onPress={handleNewGame}>
            <Text style={styles.btnText}>New Game</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.btn} onPress={handleNext}>
          <Text style={styles.btnText}>Round {nextRoundNumber} →</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.progress}>
        Round {lastRound.number} of {TOTAL_ROUNDS}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 4,
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
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    alignItems: 'center',
  },
  topRow: {
    backgroundColor: '#fffbe6',
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  cell: {
    fontSize: 16,
  },
  topText: {
    fontWeight: '700',
  },
  rankCol: { flex: 0.5 },
  nameCol: { flex: 2.5 },
  scoreCol: { flex: 1, textAlign: 'right' },
  pos: { color: '#27ae60' },
  neg: { color: '#e74c3c' },
  totalScore: { fontWeight: '600', color: '#1a1a2e' },
  winner: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
    color: '#f5c518',
  },
  btn: {
    marginTop: 16,
    backgroundColor: '#f5c518',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  progress: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 13,
    marginTop: 8,
  },
});
