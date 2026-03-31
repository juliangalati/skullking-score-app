import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import { headerButtonStyles } from './headerButtonStyles';

const FAQ: { q: string; a: string }[] = [
  {
    q: 'When do pirate powers have to be used?',
    a: "When winning a trick with a pirate, and using its power, that power must be used immediately after the trick the pirate won. Harry the Giant's power is the only one that can be used after the last trick of a round as the other pirate's powers are of no benefit after the last trick.",
  },
  {
    q: 'What happens during Rascal scoring when a player uses the Rascal special ability to place a wager, and their bid is off by one?',
    a: 'You lose the points wagered. You must still be exactly right to earn a bonus from a wager with the Rascal. This remains the same when using cannonball.',
  },
  {
    q: 'What happens when the Kraken and the White Whale are played in the same trick?',
    a: 'Whichever was played second retains its power. The first one played acts as an escape card. If the Kraken is played after the White Whale, the player who would have won the trick had neither creature been played, leads out the next trick. For example: Player 1 plays a yellow 12, player two plays a black 3, player three plays the White Whale, and player four plays the Kraken. No one wins, and player two would lead out the next trick.',
  },
  {
    q: 'Loot cards require that both players get their bids exactly right or neither gets any bonus points. Is this requirement the same under Rascal scoring, or can players get any points from an off-by-one bid?',
    a: 'You still must get your bid exactly correct.',
  },
  {
    q: 'When Graybeard plays the Tigress does it play as an escape or pirate?',
    a: 'It plays as an escape.',
  },
  {
    q: 'What happens when a Mermaid, the Skull King, and a pirate are all played in the same trick?',
    a: 'The Mermaid wins the trick.',
  },
  {
    q: 'If the Tigress is played as an escape, are bonus points awarded for its capture?',
    a: 'Not when played as an escape.',
  },
  {
    q: 'What suit leads when a Kraken or White Whale are played first in a trick?',
    a: 'There is no assigned suit.',
  },
  {
    q: 'When a loot card leads the trick, what suit is played?',
    a: 'The next player to play chooses the suit. It plays like an escape card.',
  },
  {
    q: 'If the White Whale is played mid-trick, after a suit is already established, do remaining players have to follow the suit when playing?',
    a: 'Yes. Remaining players play the established suit if they have it, or a special card if they choose.',
  },
  {
    q: 'When the Kraken is played, who leads off the next trick?',
    a: 'There was a discrepancy between the rulebook and the players aids in one print run of the game. The person who would have won the trick had the kraken not been played will lead off the next trick.',
  },
];

export function FaqButton() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity style={headerButtonStyles.trigger} onPress={() => setVisible(true)}>
        <Text style={headerButtonStyles.triggerText}>FAQ</Text>
      </TouchableOpacity>

      <Modal visible={visible} animationType="fade" transparent onRequestClose={() => setVisible(false)}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setVisible(false)}>
          <TouchableOpacity style={styles.sheet} activeOpacity={1} onPress={() => {}}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>FAQ</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.modalContent}>
              {FAQ.map((item, i) => (
                <View key={i} style={styles.faqItem}>
                  <Text style={styles.question}>Q: {item.q}</Text>
                  <Text style={styles.answer}>A: {item.a}</Text>
                </View>
              ))}
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
    padding: 24,
  },
  sheet: {
    backgroundColor: '#EDD9A3',
    borderRadius: 8,
    width: '100%',
    maxHeight: '80%',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#B8945A',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 2,
    borderColor: '#B8945A',
    backgroundColor: '#2C1A0A',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#C9841A',
  },
  closeBtn: {
    fontSize: 18,
    color: '#D4BA7A',
    paddingHorizontal: 4,
  },
  modalContent: {
    padding: 20,
    gap: 20,
  },
  faqItem: {
    gap: 6,
    borderBottomWidth: 1,
    borderColor: '#D4BA7A',
    paddingBottom: 16,
  },
  question: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2C1810',
  },
  answer: {
    fontSize: 14,
    color: '#5C3318',
    lineHeight: 22,
  },
});
