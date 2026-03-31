import React, { useState } from 'react';
import {
  View, Text, Image, TouchableOpacity, Modal, ScrollView, StyleSheet, useWindowDimensions,
} from 'react-native';
import { headerButtonStyles } from './headerButtonStyles';

const CARDS = [
  { title: 'Card Hierarchy',   image: require('../../assets/reference/card-hierarchy.png') },
  { title: 'Bonus Points',     image: require('../../assets/reference/bonus-points.png') },
  { title: 'Pirate Abilities', image: require('../../assets/reference/pirate-abilities.png') },
  { title: 'Advanced Rules',   image: require('../../assets/reference/advanced-rules.png') },
];

export function ReferenceCardsButton() {
  const [listVisible, setListVisible] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const { width } = useWindowDimensions();
  const imgWidth = width - 96;
  const imgHeight = imgWidth * (369 / 250); // preserve aspect ratio of reference cards

  return (
    <>
      <TouchableOpacity style={headerButtonStyles.trigger} onPress={() => setListVisible(true)}>
        <Text style={headerButtonStyles.triggerText}>Reference Cards</Text>
      </TouchableOpacity>

      {/* List popup */}
      <Modal visible={listVisible} animationType="fade" transparent onRequestClose={() => setListVisible(false)}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setListVisible(false)}>
          <TouchableOpacity style={styles.sheet} activeOpacity={1} onPress={() => {}}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Reference Cards</Text>
              <TouchableOpacity onPress={() => setListVisible(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
            {CARDS.map((card, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.item, i < CARDS.length - 1 && styles.itemBorder]}
                onPress={() => { setSelected(i); setListVisible(false); }}
              >
                <Text style={styles.itemText}>{card.title}</Text>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            ))}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Image viewer */}
      <Modal
        visible={selected !== null}
        animationType="fade"
        transparent
        onRequestClose={() => setSelected(null)}
      >
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setSelected(null)}>
          <TouchableOpacity style={[styles.sheet, styles.imageSheet]} activeOpacity={1} onPress={() => {}}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>{CARDS[selected!].title}</Text>
              <TouchableOpacity onPress={() => setSelected(null)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.imageContent}>
              {selected !== null && (
                <Image
                  source={CARDS[selected].image}
                  style={{ width: imgWidth, height: imgHeight }}
                  resizeMode="contain"
                />
              )}
            </ScrollView>
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
  imageSheet: {
    maxHeight: '90%',
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
  chevron: {
    fontSize: 22,
    color: '#B8945A',
  },
  imageContent: {
    padding: 12,
    alignItems: 'center',
  },
});
