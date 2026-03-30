import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types';
import { TOTAL_ROUNDS } from '@/constants';
import { useGame } from '@/game/GameContext';
import { calculateTotals } from '@/game';

type Props = NativeStackScreenProps<RootStackParamList, 'Scoreboard'>;

const PLAYER_COLORS = ['#C9841A', '#C84B1A', '#5A8FA8', '#2A6B3A', '#7A4E8A', '#E8821A'];

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

  // Cumulative score per player per round for the chart
  const cumulativeByPlayer: Record<string, number[]> = {};
  for (const player of players) {
    let running = 0;
    cumulativeByPlayer[player.id] = rounds.map(r => {
      running += r.scoresByPlayerId[player.id] ?? 0;
      return running;
    });
  }

  const chartWidth = Dimensions.get('window').width - 48;

  const chartData = {
    labels: rounds.map(r => String(r.number)),
    datasets: players.map((p, i) => ({
      data: cumulativeByPlayer[p.id],
      color: () => PLAYER_COLORS[i % PLAYER_COLORS.length],
      strokeWidth: 2.5,
    })),
  };

  function handleNext() {
    navigation.navigate('RoundEntry', { roundNumber: nextRoundNumber });
  }

  function handleNewGame() {
    resetGame();
    navigation.navigate('Home');
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
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
        const playerIndex = players.findIndex(p => p.id === player.id);
        const color = PLAYER_COLORS[playerIndex % PLAYER_COLORS.length];
        return (
          <View key={player.id} style={[styles.row, index === 0 && styles.topRow]}>
            <Text style={[styles.cell, styles.rankCol, index === 0 && styles.topText]}>
              {index + 1}
            </Text>
            <View style={[styles.nameCol, styles.nameWithDot]}>
              <View style={[styles.dot, { backgroundColor: color }]} />
              <Text style={[styles.cell, index === 0 && styles.topText]} numberOfLines={1}>
                {player.name}
              </Text>
            </View>
            <Text style={[styles.cell, styles.scoreCol, roundScore >= 0 ? styles.pos : styles.neg]}>
              {roundScore >= 0 ? '+' : ''}{roundScore}
            </Text>
            <Text style={[styles.cell, styles.scoreCol, styles.totalScore, index === 0 && styles.topText]}>
              {total}
            </Text>
          </View>
        );
      })}

      {/* Score progression chart */}
      {rounds.length >= 1 && (
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Score Progression</Text>
          <LineChart
            data={chartData}
            width={chartWidth}
            height={220}
            chartConfig={{
              backgroundColor: '#FAF0D7',
              backgroundGradientFrom: '#FAF0D7',
              backgroundGradientTo: '#EDD9A3',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(44, 24, 16, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(90, 60, 30, ${opacity})`,
              propsForDots: { r: '4', strokeWidth: '2' },
              propsForBackgroundLines: { stroke: '#D4BA7A', strokeDasharray: '4,4' },
            }}
            bezier
            style={styles.chart}
          />
        </View>
      )}

      {isFinished ? (
        <>
          <Text style={styles.winner}>⚓ {sortedPlayers[0]?.name} wins!</Text>
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
  scroll: {
    backgroundColor: '#EDD9A3',
  },
  container: {
    padding: 24,
    gap: 4,
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
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#D4BA7A',
    alignItems: 'center',
  },
  topRow: {},
  cell: {
    fontSize: 16,
    color: '#2C1810',
  },
  topText: {
    fontWeight: '700',
    color: '#2C1810',
  },
  rankCol: { flex: 0.5 },
  nameCol: { flex: 2.5 },
  nameWithDot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  scoreCol: { flex: 1, textAlign: 'right' },
  pos: { color: '#2A6B3A', fontWeight: '600' },
  neg: { color: '#C84B1A', fontWeight: '600' },
  totalScore: { fontWeight: '700', color: '#2C1810' },
  chartSection: {
    marginTop: 24,
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7A4E2A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  chart: {
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#B8945A',
  },
  winner: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 4,
    color: '#C9841A',
    letterSpacing: 1,
  },
  btn: {
    marginTop: 16,
    backgroundColor: '#C9841A',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E8A820',
  },
  btnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C1810',
    letterSpacing: 0.5,
  },
  progress: {
    textAlign: 'center',
    color: '#7A4E2A',
    fontSize: 13,
    marginTop: 10,
    fontStyle: 'italic',
  },
});
