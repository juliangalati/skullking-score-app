import React from 'react';
import Svg, { Line, Polyline, Circle, Text as SvgText } from 'react-native-svg';
import type { Player } from '@/types';

type Props = {
  players: Player[];
  cumulativeByPlayer: Record<string, number[]>;
  colors: string[];
  width: number;
  height?: number;
};

const PAD = { top: 16, right: 92, bottom: 28, left: 44 };

export function ScoreChart({ players, cumulativeByPlayer, colors, width, height = 220 }: Props) {
  const plotW = width - PAD.left - PAD.right;
  const plotH = height - PAD.top - PAD.bottom;

  const allScores = players.flatMap(p => cumulativeByPlayer[p.id] ?? []);
  if (allScores.length === 0) return null;

  const numRounds = (cumulativeByPlayer[players[0]?.id] ?? []).length;

  let minVal = Math.min(...allScores);
  let maxVal = Math.max(...allScores);
  if (minVal === maxVal) { minVal -= 10; maxVal += 10; }

  const range = maxVal - minVal;
  const yMin = minVal - range * 0.12;
  const yMax = maxVal + range * 0.12;

  function toY(score: number): number {
    return PAD.top + ((yMax - score) / (yMax - yMin)) * plotH;
  }

  function toX(index: number): number {
    if (numRounds <= 1) return PAD.left + plotW / 2;
    return PAD.left + (index / (numRounds - 1)) * plotW;
  }

  // 5 evenly-spaced y-axis grid labels
  const yGridValues = Array.from({ length: 5 }, (_, i) =>
    yMin + (i / 4) * (yMax - yMin)
  );

  return (
    <Svg width={width} height={height}>
      {/* Horizontal grid lines + y-axis labels */}
      {yGridValues.map((val, i) => {
        const y = toY(val);
        return (
          <React.Fragment key={i}>
            <Line
              x1={PAD.left} y1={y}
              x2={PAD.left + plotW} y2={y}
              stroke="#D4BA7A" strokeWidth={1} strokeDasharray="4,4"
            />
            <SvgText x={PAD.left - 5} y={y + 4} textAnchor="end" fontSize={10} fill="#7A4E2A">
              {Math.round(val)}
            </SvgText>
          </React.Fragment>
        );
      })}

      {/* X-axis labels (round numbers) */}
      {Array.from({ length: numRounds }, (_, i) => (
        <SvgText key={i} x={toX(i)} y={height - 5} textAnchor="middle" fontSize={10} fill="#7A4E2A">
          {i + 1}
        </SvgText>
      ))}

      {/* Player lines, dots, and end labels */}
      {players.map((player, pi) => {
        const scores = cumulativeByPlayer[player.id] ?? [];
        const color = colors[pi % colors.length];
        const points = scores.map((s, i) => `${toX(i)},${toY(s)}`).join(' ');
        const lastX = toX(scores.length - 1);
        const lastY = toY(scores[scores.length - 1] ?? 0);

        return (
          <React.Fragment key={player.id}>
            {scores.length > 1 && (
              <Polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth={2.5}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            )}
            {scores.map((score, i) => (
              <Circle
                key={i}
                cx={toX(i)} cy={toY(score)}
                r={4}
                fill={color}
                stroke="#FAF0D7"
                strokeWidth={1.5}
              />
            ))}
            {scores.length > 0 && (
              <SvgText
                x={lastX + 8}
                y={lastY + 4}
                fontSize={11}
                fill={color}
                fontWeight="bold"
              >
                {player.name}
              </SvgText>
            )}
          </React.Fragment>
        );
      })}
    </Svg>
  );
}
