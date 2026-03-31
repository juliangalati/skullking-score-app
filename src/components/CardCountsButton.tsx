import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { headerButtonStyles } from './headerButtonStyles';

const CARD_COUNTS = [
  { label: 'Skull King', count: 1 },
  { label: 'Mermaid',    count: 2 },
  { label: 'Pirate',     count: 5 },
  { label: 'Tigress',    count: 1 },
  { label: 'Escape',     count: 5 },
];

export function CardCountsButton() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity style={headerButtonStyles.trigger} onPress={() => setVisible(true)}>
        <Text style={headerButtonStyles.triggerText}>Card Counts</Text>
      </TouchableOpacity>

      <Modal visible={visible} animationType="fade" transparent onRequestClose={() => setVisible(false)}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setVisible(false)}>
          <TouchableOpacity style={styles.sheet} activeOpacity={1} onPress={() => {}}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Card Counts</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
            {CARD_COUNTS.map((entry, i) => (
              <View
                key={i}
                style={[styles.item, i < CARD_COUNTS.length - 1 && styles.itemBorder]}
              >
                <Text style={styles.itemText}>{entry.label}</Text>
                <Text style={styles.countBadge}>{entry.count}</Text>
              </View>
            ))}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(44,26,10,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
    paddingVertical: 24,
  },
  sheet: {
    backgroundColor: '#EDD9A3',
    borderRadius: 8,
    width: '100%',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#B8945A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderColor: '#B8945A',
    backgroundColor: '#2C1A0A',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#C9841A',
  },
  closeBtn: {
    fontSize: 18,
    color: '#D4BA7A',
    paddingHorizontal: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderColor: '#D4BA7A',
  },
  itemText: {
    fontSize: 16,
    color: '#2C1810',
    fontWeight: '600',
  },
  countBadge: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C1810',
    minWidth: 24,
    textAlign: 'right',
  },
});
