# THE SHATTERED DOMINION — CAPTAIN MODE

## Draft System Design Document

---

*"The war for Aethara is not won on the battlefield. It is won in the war room — in the choices made before a single blade is drawn."*
— **Sylas Dreadhollow, Shadow Sovereign**

---

---

## 1. OVERVIEW

Captain Mode is the primary competitive game mode for The Shattered Dominion. Inspired by Dota 2's Captain's Mode, it replaces traditional deck building with a **live alternating draft** where two players ban and pick cards from the full shared pool of 54 cards.

### Core Principles

1. **All 54 cards are available to both players at all times.** No unlocking, no collecting, no pay-to-win. Every player has the full roster from the start. The game is the skill, not the wallet.
2. **Each card is exclusive.** Once picked by one side, the other side cannot pick it. There is only one Pyraxis, one Sylas, one Vaelkor. You draft them, or your opponent does.
3. **Bans remove cards entirely.** Banned cards cannot be picked by either side. They are gone for the duration of the match.
4. **The draft IS the strategy.** Reading your opponent's picks, denying key cards, counter-drafting tribal advantages, managing your energy curve, and building synergies under pressure — this is where high-level play lives.
5. **Balance through structure.** The snake draft pattern ensures neither player has a runaway advantage. Maximum consecutive picks: 2.

---

---

## 2. THE CARD POOL

### 2.1 Total Cards: 54

| Tribe | Element | Cards | Rarity Breakdown |
|-------|---------|-------|-----------------|
| Obsidian Veil | Shadow | 13 | 1 Legendary, 2 Epic, 3 Rare, 7 Common |
| Radiant Sanctum | Light | 13 | 1 Legendary, 2 Epic, 3 Rare, 7 Common |
| Emberheart Pact | Fire | 13 | 1 Legendary, 2 Epic, 3 Rare, 7 Common |
| Ironroot Bastion | Earth | 13 | 1 Legendary, 2 Epic, 3 Rare, 7 Common |
| Tribeless (Mythic) | All | 2 | 2 Mythic |
| **TOTAL** | | **54** | |

### 2.2 Tribal Advantage Cycle

```
    Shadow
   ↙      ↖
 Fire      Light
   ↘      ↗
    Earth
```

> **Shadow beats Fire → Fire beats Earth → Earth beats Light → Light beats Shadow**

Cards attacking a tribe they have advantage over deal **×1.5 damage** (50% bonus, rounded up). Cards attacking a tribe that has advantage over them deal **×0.75 damage** (25% reduction, rounded up, minimum 1). This is a multiplicative system — a 6 ATK card hitting a disadvantaged target deals 9, not 7. The cycle is critical during the draft: if your opponent is building Shadow-heavy, drafting Light (which beats Shadow) is a strong counter. But your opponent can see you doing it and adapt.

### 2.3 Key High-Value Draft Cards

These cards are expected to be frequently first-picked or first-banned:

| Card | Tribe | Rarity | Cost | Why It's Contested |
|------|-------|--------|------|--------------------|
| Vaelkor, the Hollow Crown | Tribeless | Mythic | 9 | Board wipe — destroys ALL other cards on deploy |
| Vaelith, the Shattered Memory | Tribeless | Mythic | 8 | Steals 1 card from opponent's hand + halves energy |
| Sylas Dreadhollow | Obsidian Veil | Legendary | 7 | +1 ATK to all Shadow + Stealth on kill |
| Aurelia Dawnspire | Radiant Sanctum | Legendary | 7 | Shield 2 on deploy + all Light cards gain +1 HP |
| Pyraxis the Unburnt | Emberheart Pact | Legendary | 6 | 3 damage to ALL enemies on deploy + Lifesteal |
| Thornwall the Ancient | Ironroot Bastion | Legendary | 7 | Stun 1 enemy + Taunt + all Earth cards gain +1 HP |
| Orin Crystalward | Radiant Sanctum | Epic | 5 | Taunt + ALL friendlies take -1 damage from attacks |
| Crimson Morrigan | Emberheart Pact | Epic | 5 | Lifesteal — heals Player HP equal to combat damage dealt. Core sustain engine. |

---

---

## 3. THE NUMBERS

| | Value |
|---|---|
| **Card pool** | 54 |
| **Bans per player** | 3 |
| **Total banned** | 6 |
| **Picks per player** | 15 |
| **Total picked** | 30 |
| **Unpicked** | 18 (33% of pool) |
| **Rounds** | 3 |
| **Picks per player per round** | 5 |
| **Total draft steps** | 36 (6 bans + 30 picks) |
| **Estimated draft time** | 7–8 minutes |
| **Estimated battle time** | 8–13 minutes |

### 3.1 Why 15 Cards (Not 20)

A player draws approximately 13–18 cards across a typical 8–13 turn game (5-card opening hand + 1 draw per turn). The deck size must be calibrated to this:

| Deck Size | Cards Seen | Phantom Picks (Never Drawn) | Pool Consumed |
|-----------|------------|----------------------------|---------------|
| 20 | 13–18 | 2–7 (up to 35%) | 89% |
| **15** | **13–15** | **0–2 (up to 13%)** | **67%** |

At 15 cards:
- **Nearly every drafted card enters the player's hand.** No phantom picks hiding bad decisions at the bottom of the deck.
- **Every draft pick has a traceable consequence in the battle.** You can point to the moment pick #11 won or lost the game.
- **The deck empties around turn 10–11.** This creates a natural game clock — aggressive decks want to kill before resources run out, defensive decks must ration a finite pool.
- **Hate-drafting costs 6.7% of your deck per denial pick.** At 20 cards it costs 5%. That difference means hate-drafting at 15 is a genuine sacrifice, not a free move. The math polices itself — no artificial tribal-minimum rules needed.
- **Energy curve becomes a drafting skill.** With only 15 slots, three Legendaries (cost 6–7 each) consume 20% of your deck with cards you can't deploy until turn 6. A bricked opening hand of expensive cards on turn 2 with 2 energy is a death sentence. At 20 cards, sloppy curves are absorbable. At 15, curve management separates good drafters from great ones.
- **One-third of the pool goes undrafted.** 18 unpicked cards provide rich metagame signal — which cards are consistently ignored reveals balance data that feeds directly into future patches.

### 3.2 Why 6 Bans (Not 8)

At 8 bans (4 per player), you can remove both Mythics AND two Legendaries. That strips the top of the pool and flattens every game into a midrange mirror.

At 6 bans (3 per player), you ban both Mythics and have **one surgical ban remaining**. That single ban becomes one of the most consequential decisions in the entire draft:

> *"Do I burn my last ban on Pyraxis because I'm going Earth and he'll melt my Taunters? Or do I save it for Round 2 when I know his plan and can snipe the exact card that completes his synergy?"*

One ban. Infinite tension. The constraint creates the decision.

### 3.3 Why 3 Rounds (Not 4)

Three rounds create a natural **three-act narrative structure**:

| Round | Act | Purpose |
|-------|-----|---------|
| **Round 1** | **Declaration** | Commit to a tribal direction. Reveal intent. |
| **Round 2** | **Confrontation** | React to opponent's plan. Counter-draft. Adapt. |
| **Round 3** | **Resolution** | Complete the deck with full information. Fill gaps. |

Four rounds blurred acts 3 and 4 into the same action (filling gaps from a depleting pool). Three rounds gives each round a **distinct emotional purpose**. The escalation happens naturally through growing information and a shrinking pool — not through structural inflation.

Additionally, 3 rounds keep the **mental model coherent**. At 15 cards and 3 rounds, players track 30 picks + 6 bans = 36 steps. The recursive mind-reading ("he knows I know he's going Shadow") runs from first pick to last without collapsing into autopilot fatigue.

---

---

## 4. THE SNAKE DRAFT

### 4.1 Pattern

Within each round, picks follow a **snake draft** pattern. For 5 picks per player (10 total picks per round):

```
Pick #:    1    2    3    4    5    6    7    8    9    10
Player:   FP   SP   SP   FP   FP   SP   SP   FP   FP   SP
```

Where **FP** = First Picker, **SP** = Second Picker.

**FP picks at positions:** 1, 4, 5, 8, 9 → **5 picks**
**SP picks at positions:** 2, 3, 6, 7, 10 → **5 picks**

### 4.2 Why This Pattern Works

- **FP gets the #1 pick** — this is the first pick advantage. The single strongest available card.
- **SP immediately gets TWO picks in a row** (#2, #3) — direct compensation. They see the first pick and respond with a pair.
- **The pattern alternates in pairs** (FP-FP, SP-SP) — no player ever gets more than 2 consecutive picks. No runaway advantage is possible.
- **SP gets the LAST pick** (#10) — balancing FP's #1 privilege. The first pick and last pick are held by opposite players.

### 4.3 First Picker Rotation

The player who gets First Pick **alternates each round**:

| Round | First Picker | Second Picker | Who Bans First |
|-------|-------------|---------------|----------------|
| Round 1 | Player 1 | Player 2 | Player 1 |
| Round 2 | Player 2 | Player 1 | Player 2 |
| Round 3 | Player 1 | Player 2 | Player 1 |

**P1 is First Picker in Rounds 1 and 3.** P2 is First Picker in Round 2.

P1 has 2 first-pick rounds vs P2's 1. This is balanced by:
1. P2 gets the compensating double-pick immediately after every P1 first-pick.
2. P2 gets the last overall pick of the draft (Round 3, position 10).
3. P1/P2 assignment is determined by coin flip (§9.1).

### 4.4 Ban Phase Order

Each round's Ban Phase mirrors its Pick Phase — the First Picker of that round also bans first:

| Round | Ban Sequence |
|-------|-------------|
| Round 1 | P1 bans → P2 bans |
| Round 2 | P2 bans → P1 bans |
| Round 3 | P1 bans → P2 bans |

This ensures the player who bans first also picks first — their ban is a blind commitment, balanced by the advantage of first pick. The player who bans second has seen the first ban (information advantage) but picks second.

---

---

## 5. COMPLETE DRAFT SEQUENCE

### 5.1 Visual Overview

```
ROUND 1 — DECLARATION            ROUND 2 — CONFRONTATION          ROUND 3 — RESOLUTION
┌────────────────────┐           ┌────────────────────┐           ┌────────────────────┐
│ BAN: P1 ban        │           │ BAN: P2 ban        │           │ BAN: P1 ban        │
│      P2 ban        │           │      P1 ban        │           │      P2 ban        │
│                    │           │                    │           │                    │
│ PICK: P1           │           │ PICK: P2           │           │ PICK: P1           │
│       P2 P2        │           │       P1 P1        │           │       P2 P2        │
│       P1 P1        │           │       P2 P2        │           │       P1 P1        │
│       P2 P2        │           │       P1 P1        │           │       P2 P2        │
│       P1 P1        │           │       P2 P2        │           │       P1 P1        │
│       P2           │           │       P1           │           │       P2           │
│                    │           │                    │           │                    │
│ Each player: 5     │           │ Each player: 10    │           │ Each player: 15 ✓  │
└────────────────────┘           └────────────────────┘           └────────────────────┘
```

### 5.2 Step-by-Step Sequence

---

#### ROUND 1 — DECLARATION

**Purpose:** Remove universal threats. Establish opening tribal direction. Declare intent.

**Ban Phase:**

| Step | Player | Action | Notes |
|------|--------|--------|-------|
| 1 | P1 | BAN 1 card | Typically a Mythic |
| 2 | P2 | BAN 1 card | Typically a Mythic |

**Pick Phase (P1 is First Picker):**

| Step | Player | Action | P1 Total | P2 Total | Pool |
|------|--------|--------|----------|----------|------|
| 3 | P1 | Pick | 1 | 0 | 51 |
| 4 | P2 | Pick | 1 | 1 | 50 |
| 5 | P2 | Pick | 1 | 2 | 49 |
| 6 | P1 | Pick | 2 | 2 | 48 |
| 7 | P1 | Pick | 3 | 2 | 47 |
| 8 | P2 | Pick | 3 | 3 | 46 |
| 9 | P2 | Pick | 3 | 4 | 45 |
| 10 | P1 | Pick | 4 | 4 | 44 |
| 11 | P1 | Pick | 5 | 4 | 43 |
| 12 | P2 | Pick | 5 | 5 | 42 |

**After Round 1:** 2 banned. 5 per player. 42 in pool.

**Strategic notes:**
- Opening bans are typically the two Mythics (Vaelkor + Vaelith). The default. The deviation from this default is itself a strategic signal — "he didn't ban Vaelkor, what's his angle?"
- The remaining third ban (spent in Round 2 or 3) becomes a surgical tool.
- First pick (#3) is the single most important decision. Often the tribe's Legendary.
- P2 immediately responds with 2 picks — this is where the draft conversation begins.
- By step 12, both players have revealed a tribal direction. The confrontation is set.

---

#### ROUND 2 — CONFRONTATION

**Purpose:** React to opponent's Round 1 picks. Counter-draft. Adapt strategy.

**Ban Phase:**

| Step | Player | Action | Notes |
|------|--------|--------|-------|
| 13 | P2 | BAN 1 card | Reactive — target what completes P1's Round 1 strategy |
| 14 | P1 | BAN 1 card | Reactive — target what completes P2's Round 1 strategy |

**Pick Phase (P2 is First Picker):**

| Step | Player | Action | P1 Total | P2 Total | Pool |
|------|--------|--------|----------|----------|------|
| 15 | P2 | Pick | 5 | 6 | 39 |
| 16 | P1 | Pick | 6 | 6 | 38 |
| 17 | P1 | Pick | 7 | 6 | 37 |
| 18 | P2 | Pick | 7 | 7 | 36 |
| 19 | P2 | Pick | 7 | 8 | 35 |
| 20 | P1 | Pick | 8 | 8 | 34 |
| 21 | P1 | Pick | 9 | 8 | 33 |
| 22 | P2 | Pick | 9 | 9 | 32 |
| 23 | P2 | Pick | 9 | 10 | 31 |
| 24 | P1 | Pick | 10 | 10 | 30 |

**After Round 2:** 4 banned. 10 per player. 30 in pool.

**Strategic notes:**
- Bans are now INFORMED. You've seen 5 of your opponent's cards. The ban targets the exact card that completes their plan.
- "He picked 3 Shadow cards in Round 1 → ban Sylas before he gets the +1 ATK aura."
- P2 gets first pick this round — direct compensation for P1's Round 1 first pick.
- Counter-drafting peaks here. Taking a card to deny your opponent is most tempting in Round 2 — but at 15-card decks, every denial pick costs you 6.7% of your deck in dead weight.
- Dual-tribal strategies emerge. Players splash 1–2 cards from a secondary tribe for flexibility.
- By step 24, both players have 10 cards. Two-thirds of each deck is locked. The resolution awaits.

---

#### ROUND 3 — RESOLUTION

**Purpose:** Complete the deck. Fill energy curve gaps. Make final reads.

**Ban Phase:**

| Step | Player | Action | Notes |
|------|--------|--------|-------|
| 25 | P1 | BAN 1 card | Final ban — remove the most dangerous card remaining |
| 26 | P2 | BAN 1 card | Final ban — remove the most dangerous card remaining |

**Pick Phase (P1 is First Picker):**

| Step | Player | Action | P1 Total | P2 Total | Pool |
|------|--------|--------|----------|----------|------|
| 27 | P1 | Pick | 11 | 10 | 27 |
| 28 | P2 | Pick | 11 | 11 | 26 |
| 29 | P2 | Pick | 11 | 12 | 25 |
| 30 | P1 | Pick | 12 | 12 | 24 |
| 31 | P1 | Pick | 13 | 12 | 23 |
| 32 | P2 | Pick | 13 | 13 | 22 |
| 33 | P2 | Pick | 13 | 14 | 21 |
| 34 | P1 | Pick | 14 | 14 | 20 |
| 35 | P1 | Pick | 15 | 14 | 19 |
| 36 | P2 | Pick | 15 | 15 | 18 |

**After Round 3:** 6 banned. 15 per player. **18 unpicked. Draft complete.**

**Strategic notes:**
- Players pick from a pool of 28 cards (after Round 3 bans). Under half the original roster.
- Energy curve management is critical. "I need two more 1–2 cost cards or my opening hand will brick."
- Smart players planned ahead — they left safe late-round picks that they knew would go uncontested.
- The last pick (Step 36, P2) is often a humble role-player. Not a star. But it completes the deck.
- The 18 unpicked cards are the ones both players agreed weren't worth taking — or couldn't afford in a 15-card deck.
- **The draft is over. The story has been written. Now the battle resolves it.**

---

---

## 6. FINAL DRAFT LEDGER

### 6.1 Complete Step-by-Step

| Step | Round | Phase | Player | Action | P1 | P2 | Banned | Pool |
|------|-------|-------|--------|--------|----|----|--------|------|
| — | — | Start | — | — | 0 | 0 | 0 | 54 |
| 1 | R1 | Ban | P1 | Ban | 0 | 0 | 1 | 53 |
| 2 | R1 | Ban | P2 | Ban | 0 | 0 | 2 | 52 |
| 3 | R1 | Pick | **P1** | Pick | **1** | 0 | 2 | 51 |
| 4 | R1 | Pick | P2 | Pick | 1 | 1 | 2 | 50 |
| 5 | R1 | Pick | **P2** | Pick | 1 | **2** | 2 | 49 |
| 6 | R1 | Pick | P1 | Pick | 2 | 2 | 2 | 48 |
| 7 | R1 | Pick | **P1** | Pick | **3** | 2 | 2 | 47 |
| 8 | R1 | Pick | P2 | Pick | 3 | 3 | 2 | 46 |
| 9 | R1 | Pick | **P2** | Pick | 3 | **4** | 2 | 45 |
| 10 | R1 | Pick | P1 | Pick | 4 | 4 | 2 | 44 |
| 11 | R1 | Pick | **P1** | Pick | **5** | 4 | 2 | 43 |
| 12 | R1 | Pick | P2 | Pick | 5 | 5 | 2 | 42 |
| 13 | R2 | Ban | P2 | Ban | 5 | 5 | 3 | 41 |
| 14 | R2 | Ban | P1 | Ban | 5 | 5 | 4 | 40 |
| 15 | R2 | Pick | **P2** | Pick | 5 | **6** | 4 | 39 |
| 16 | R2 | Pick | P1 | Pick | 6 | 6 | 4 | 38 |
| 17 | R2 | Pick | **P1** | Pick | **7** | 6 | 4 | 37 |
| 18 | R2 | Pick | P2 | Pick | 7 | 7 | 4 | 36 |
| 19 | R2 | Pick | **P2** | Pick | 7 | **8** | 4 | 35 |
| 20 | R2 | Pick | P1 | Pick | 8 | 8 | 4 | 34 |
| 21 | R2 | Pick | **P1** | Pick | **9** | 8 | 4 | 33 |
| 22 | R2 | Pick | P2 | Pick | 9 | 9 | 4 | 32 |
| 23 | R2 | Pick | **P2** | Pick | 9 | **10** | 4 | 31 |
| 24 | R2 | Pick | P1 | Pick | 10 | 10 | 4 | 30 |
| 25 | R3 | Ban | P1 | Ban | 10 | 10 | 5 | 29 |
| 26 | R3 | Ban | P2 | Ban | 10 | 10 | 6 | 28 |
| 27 | R3 | Pick | **P1** | Pick | **11** | 10 | 6 | 27 |
| 28 | R3 | Pick | P2 | Pick | 11 | 11 | 6 | 26 |
| 29 | R3 | Pick | **P2** | Pick | 11 | **12** | 6 | 25 |
| 30 | R3 | Pick | P1 | Pick | 12 | 12 | 6 | 24 |
| 31 | R3 | Pick | **P1** | Pick | **13** | 12 | 6 | 23 |
| 32 | R3 | Pick | P2 | Pick | 13 | 13 | 6 | 22 |
| 33 | R3 | Pick | **P2** | Pick | 13 | **14** | 6 | 21 |
| 34 | R3 | Pick | P1 | Pick | 14 | 14 | 6 | 20 |
| 35 | R3 | Pick | **P1** | Pick | **15** | 14 | 6 | 19 |
| 36 | R3 | Pick | P2 | Pick | 15 | 15 | 6 | 18 |

> **Bold** entries mark the start of a consecutive pair (the moment a player gets 2 picks in a row).

### 6.2 Balance Verification

| Metric | Player 1 | Player 2 | Balanced? |
|--------|----------|----------|-----------|
| Total picks | 15 | 15 | ✅ Equal |
| Total bans | 3 | 3 | ✅ Equal |
| Rounds as First Picker | 2 (R1, R3) | 1 (R2) | ⚖️ See §4.3 |
| Rounds as Second Picker | 1 (R2) | 2 (R1, R3) | ⚖️ See §4.3 |
| Rounds banning first | 2 (R1, R3) | 1 (R2) | ⚖️ See §4.3 |
| Max consecutive picks | 2 | 2 | ✅ Equal |
| First overall pick | P1 (Step 3) | — | ⚖️ Compensated |
| Last overall pick | — | P2 (Step 36) | ⚖️ Compensated |

**Balance notes:**
- P1 is First Picker in 2 of 3 rounds. This is compensated by P2 receiving the double-pick immediately after every P1 first-pick, and P2 getting the last pick of the entire draft.
- P1/P2 assignment is determined by coin flip (§9.1), ensuring random advantage distribution.
- This asymmetry is comparable to Dota 2's Captain's Mode, where Radiant/Dire have slight positional differences that are balanced through map design and meta adaptation.

---

---

## 7. STRATEGIC CONCEPTS

### 7.1 Draft Archetypes

#### Mono-Tribal
Pick 10+ cards from a single tribe. Maximizes tribal synergy (Legendary auras, passive bonuses).

**Strength:** Maximum synergy. Legendary auras (+1 ATK or +1 HP to all tribal allies) affect most of your board.
**Risk:** Predictable. Opponent can counter-draft your tribe's key cards and exploit your tribal weakness. At 15 cards, you're spending 67%+ of your deck on one tribe — if the opponent bans your Legendary, the entire strategy weakens.

#### Dual-Tribal
Pick 7–8 from a primary tribe, 5–6 from a complementary secondary tribe.

**Strength:** Flexibility. Can exploit two tribal advantages. Harder to counter-draft because your needs are spread across two tribes.
**Risk:** Weaker synergy. Legendary auras affect fewer cards. Jack-of-two-trades, master of neither.

**Best pairings:**
- Shadow + Earth: Assassins behind Taunt walls
- Fire + Shadow: Burst damage from two angles
- Light + Earth: Maximum defense (shields + stuns + healing)
- Fire + Light: Aggressive with sustain backup

#### Counter-Draft
Prioritize denying opponent's cards over building your own synergies.

**Strength:** Directly weakens the opponent's plan.
**Risk:** At 15 cards, every denial pick is 6.7% of your deck turned into dead weight. 2–3 hate picks are viable. 5+ will destroy your own deck.

#### Flex Draft
Delay tribal commitment. Pick versatile cards early. Commit in Round 2–3 based on what's available.

**Strength:** Adapts to the draft. Takes advantage of whatever the opponent leaves open.
**Risk:** You miss the strongest tribal cards (Legendaries, key synergy pieces) because you waited too long to commit.

### 7.2 Ban Strategy

#### Round 1 — Universal Threats
The default: ban both Mythics (Vaelkor + Vaelith). This is the "correct" play in most games and removes the two most game-warping cards.

**The deviation:** NOT banning a Mythic. This is a statement. A mind game. "He left Vaelkor in the pool — is he going to first-pick it and build a stall deck? Or is he baiting me into taking a 9-cost card that I can't deploy until turn 9 while he rushes me down?" The deviation from the default creates more strategic tension than the default itself.

#### Round 2 — Reactive Surgery
You've seen 5 of your opponent's cards. Your ban targets the specific card that completes their strategy:
- "3 Shadow picks → ban Sylas (the Shadow Legendary)"
- "Building Light defense → ban Orin (Taunt + damage reduction)"
- "Took Crimson Morrigan → ban Pyraxis (denies full Fire Lifesteal package)"

#### Round 3 — Final Denial
The pool is depleted. Your ban removes the most dangerous card remaining. By now you know your opponent's full strategy — the ban is precise, informed, and final.

### 7.3 Reading the Opponent

Every pick reveals intent. The draft is a conversation conducted through card selections:

| What They Pick | What It Tells You |
|----------------|-------------------|
| 3+ cards from one tribe in Round 1 | Committing to mono-tribal. Predictable, but synergistic. |
| Cards from 2+ tribes in Round 1 | Flexing. Waiting to see what you do. Dangerous opponent. |
| High-cost cards early | Planning a slow, value-oriented late game. |
| Low-cost aggro cards early | Planning to rush. They want the game over by turn 7–8. |
| A card they can't synergize with | Hate-drafting. They're denying you, not building themselves. |
| A Mythic first-pick | Building around a power spike. Everything else serves this card. |
| Healing/shield cards | Expecting a long game. Preparing to outlast. |
| Opponent's tribal counter-picks | They've read YOUR strategy and are building to exploit your weakness. |

### 7.4 The Mental Model

The draft is not just about cards — it's about building a **recursive model of your opponent's intentions:**

1. "They picked a Fire card." (Observation)
2. "They might be going Fire." (First-order read)
3. "If they're going Fire, I should go Shadow to counter." (Strategy)
4. "But they know I know Fire is weak to Shadow. Are they baiting me?" (Second-order read)
5. "If I commit to Shadow and they pivot to Light in Round 2, I'm the one who's countered." (Third-order read)

This recursive reasoning is what separates good drafters from great ones. At 15 cards and 3 rounds, the mental model stays coherent — the information load is manageable, the recursion runs from first pick to last without collapsing into noise.

### 7.5 Energy Curve Management

At 15 cards, your energy curve is a critical drafting constraint:

| Card Cost | Role | Draft Priority |
|-----------|------|---------------|
| 1–2 | Early deployers. Fill the board turns 1–3. | Must have 5–6 for consistent opening hands. |
| 3–4 | Midgame backbone. Efficient stats + abilities. | The core of most decks. 4–5 cards. |
| 5–6 | Power plays. Epics and strong rares. | 2–3 cards. More than that risks bricking. |
| 7–9 | Finishers. Legendaries and Mythics. | 1–2 maximum. Each is a massive commitment. |

A deck with three 7-cost cards has 20% of its deck locked behind turn 7. Opening hand probability of drawing at least one unplayable card on turn 1: extremely high. The draft forces a constant tension between power and deployability.

### 7.6 The 18 Unpicked Cards

After the draft, 18 cards remain — one-third of the entire roster. These cards were:

1. **Deliberately passed by both players.** They're the consensus "not worth a slot in a 15-card deck." This is metagame data.
2. **Victims of tribal commitment.** If both players went Shadow + Earth, most Fire and Light commons go unpicked. The unpicked pool reflects the game's tribal diversity (or lack thereof).
3. **Balance indicators.** If the same 10 cards go unpicked across 100 AI vs AI drafts, those cards need tuning. If all 54 cards rotate in and out of the unpicked pool, balance is healthy.

---

---

## 8. TIMERS

### 8.1 Timer Per Action

| Action | Timer | Notes |
|--------|-------|-------|
| Ban | 30 seconds | Time to evaluate threats and make a commitment |
| Pick (Round 1) | 25 seconds | Largest pool, most options to consider |
| Pick (Round 2) | 25 seconds | Reactive decisions require reading opponent |
| Pick (Round 3) | 20 seconds | Smaller pool, faster decisions |
| Reserve time (per player) | 90 seconds | Extra time bank, chess-clock style |

### 8.2 Total Draft Duration

| Component | Time |
|-----------|------|
| 6 bans × 30s | 3 min |
| 20 picks (R1–R2) × 25s | 8 min 20s |
| 10 picks (R3) × 20s | 3 min 20s |
| **Maximum total** | **~14 min 40s** |
| **Realistic (players pick faster)** | **~7–8 min** |

### 8.3 AI Opponent Timers

When drafting against AI (DeepSeek R1 / GPT-5.2):
- AI picks are processed in 2–5 seconds (API call + reasoning)
- AI draft reasoning is displayed in the Thinking Panel
- No timer pressure on AI — it decides as fast as the API responds
- Player retains their normal timer
- **Estimated draft duration vs AI: ~4–5 minutes**

---

---

## 9. RULES & PROCEDURES

### 9.1 Determining Player 1 vs Player 2

**PvP:** Coin flip before the draft. Random assignment. In ranked play, P1/P2 is random and cannot be chosen.

**vs AI:** Human is P1 by default (first pick experience). Option to play as P2 for a different strategic challenge.

**AI vs AI:** Random assignment.

### 9.2 Deck Rules After Draft

| Rule | Detail |
|------|--------|
| Deck size | Exactly 15 cards |
| Mythic limit | Maximum 1 per deck (only 2 exist in pool, split by exclusive draft) |
| Duplicate cards | Impossible (each card is unique in the pool) |
| Tribal restrictions | None. Mono, dual, or rainbow builds are all legal. |

### 9.3 Post-Draft Shuffle

After the draft, each player's 15 cards are **automatically shuffled** into a random draw order. Draft order does NOT determine draw order. This preserves the uncertainty of card draw that is core to battle gameplay.

### 9.4 Opening Hand

Each player draws **5 cards** from the top of their shuffled deck. Remaining deck: 10 cards.

### 9.5 Decking Out

If a player's deck is empty when they would draw, no card is drawn. The player is NOT eliminated for decking out — they continue playing with the cards in their hand and on the field. However, they receive no new resources. At 15 cards, this occurs around **turn 10–11**, creating a natural late-game pressure point.

---

---

## 10. GAME MODES

### 10.1 Captain Mode (Primary Competitive Mode)

The full draft experience as described in this document. Intended for:
- **Ranked PvP** — competitive ladder play
- **AI Battle** — human drafts against AI (DeepSeek R1 or GPT-5.2)
- **AI vs AI** — both sides drafted by AI for data collection and balance testing
- **Tournament play** — official competitive format

### 10.2 Quick Play (Casual Mode)

For players who want to skip the draft and jump straight into battle:

| Mode | Description |
|------|-------------|
| Random Deck | 15 random cards (1 random Mythic guaranteed) |
| Tribal Deck | 15 cards focused on a chosen tribe |
| Pre-Built Decks | Curated theme decks (e.g., "Shadow Assassin", "Light Fortress") |

Quick Play uses 15-card decks for consistency with Captain Mode. Quick Play is NOT used in ranked/competitive play.

### 10.3 AI vs AI Data Collection

Automated mode for overnight balance testing:
- Both AI players execute the full Captain Mode draft
- Complete draft log recorded (every ban/pick + AI reasoning)
- Battle played automatically after draft
- Results logged to `battle_results.log`
- Draft data logged for metagame analysis:
  - Which cards are most frequently first-picked?
  - Which cards are most frequently banned?
  - Which cards are most frequently unpicked?
  - Which tribal combinations win most often?
  - What is the average game length at 15-card decks?
  - How often do games reach deck-out?

---

---

## 11. UI/UX CONSIDERATIONS

### 11.1 Draft Screen Layout

```
┌─────────────────────────────────────────────────────────────┐
│                      CARD POOL                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ OBSIDIAN  │  │ RADIANT  │  │EMBERHEART│  │ IRONROOT │   │
│  │   VEIL    │  │ SANCTUM  │  │   PACT   │  │ BASTION  │   │
│  │ (Shadow)  │  │ (Light)  │  │  (Fire)  │  │ (Earth)  │   │
│  │  13 cards │  │ 13 cards │  │ 13 cards │  │ 13 cards │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                    ┌──────────┐                              │
│                    │ TRIBELESS│                              │
│                    │ (Mythic) │                              │
│                    │  2 cards │                              │
│                    └──────────┘                              │
├─────────────────────────────────────────────────────────────┤
│  YOUR PICKS (0/15)              OPPONENT PICKS (0/15)       │
│  ┌─┐┌─┐┌─┐┌─┐┌─┐               ┌─┐┌─┐┌─┐┌─┐┌─┐          │
│  └─┘└─┘└─┘└─┘└─┘               └─┘└─┘└─┘└─┘└─┘          │
│                                                             │
│  BANNED: ╳ ╳ ╳                  BANNED: ╳ ╳ ╳              │
├─────────────────────────────────────────────────────────────┤
│  ROUND 1 — DECLARATION         TIMER: ██████████░░ 24s     │
│  Your turn to BAN.             [Click a card to ban it]     │
└─────────────────────────────────────────────────────────────┘
```

### 11.2 Visual Feedback

| Event | Visual Effect |
|-------|--------------|
| Card picked by you | Card slides from pool to your deck area with tribal-colored border |
| Card picked by opponent | Card slides to opponent's area (face visible — open information) |
| Card banned | Card fades with red X overlay, removed from pool |
| Your turn to pick/ban | Pool cards glow, timer pulses, "YOUR PICK" / "YOUR BAN" indicator |
| Opponent's turn | Pool dims slightly, "OPPONENT THINKING..." with AI reasoning panel |
| Round transition | Dramatic overlay: "ROUND 2 — CONFRONTATION" |
| Draft complete | Both decks revealed side by side, transition to battlefield |
| Consecutive pick (your 2nd in a row) | Subtle "DOUBLE PICK" indicator — player knows they have momentum |

### 11.3 Information Display

During the draft, players can see:
- ✅ All remaining cards in pool (full stats + abilities)
- ✅ Their own picked cards (full detail)
- ✅ Opponent's picked cards (full detail — open information)
- ✅ All banned cards (visible with X overlay)
- ✅ Tribal advantage cycle reminder (always visible)
- ✅ Current round, step, and whose turn it is
- ✅ Timer + reserve time remaining
- ✅ Draft history log (scrollable list of every ban/pick)
- ✅ Energy curve graph of current deck (cost distribution)

### 11.4 Card Hover Details

Hovering over any card in the pool shows:
- Full card art
- Name, title, tribe, rarity
- Cost, ATK, HP
- Ability name, type, and full description
- Flavor quote
- **Tribal advantage indicator** vs opponent's current picks (e.g., "Strong vs 3 of opponent's cards")

---

---

## 12. THE MYTHIC METAGAME

### 12.1 The Default State

In most games, both Mythics (Vaelkor and Vaelith) are banned in Round 1. This is the expected, "correct" play. Both cards are game-warping:

- **Vaelkor (Cost 9):** Destroys ALL other cards on deploy. A board wipe that resets the entire game state.
- **Vaelith (Cost 8):** Steals a card from opponent's hand + halves their energy next turn. Devastating disruption.

Banning both removes the highest-variance cards and produces a cleaner, more skill-driven game.

### 12.2 The Deviation

The moment a player chooses NOT to ban a Mythic, the entire draft shifts:

- "He didn't ban Vaelkor. Does he want it? Is he building a stall deck that survives to turn 9?"
- "She let Vaelith through. Is she baiting me into picking a disruptive 8-cost card while she rushes me with cheap aggro?"
- "If I take the Mythic, I'm spending 1 of my 15 slots on a card I can't play until turn 8–9. Can I afford that in a 15-card deck where my curve has to be perfect?"

The deviation from the default is itself a strategic weapon. It only works BECAUSE the default exists. If Mythics were always in play, they'd just be strong cards. Because they're usually banned, their presence becomes information.

### 12.3 Future: The Third Mythic

A third Mythic card is reserved for a future expansion. Design principles:

- **Don't add it at launch.** Let the two-Mythic meta establish itself. Collect AI vs AI data. See how often Mythics get through.
- **Design it to break the calcified pattern.** If both Mythics are always banned and games become midrange grinds, the third Mythic should punish slow play. If one Mythic starts leaking through and warping games, the third should counter it.
- **Three Mythics from 6 bans creates an impossible problem:** banning all three costs 3 of your 3 bans. You'd have zero reactive bans left for Rounds 2–3. That trade-off is agonizing and strategically rich.
- **Vaelkor = Destruction. Vaelith = Disruption. Third Mythic = ?** Let the data reveal what the game needs.

---

---

## 13. FUTURE EXPANSION CONSIDERATIONS

### 13.1 New Cards
When new cards are added beyond 54:
- Draft picks per player may increase (e.g., 17–18 from a pool of 66+)
- Additional ban slots may be added
- A fourth round may be introduced (restoring the 4-round structure at a larger pool)
- The snake draft and alternating FP structure remain unchanged

### 13.2 Tournament Variants
- **Blind Ban:** Both players submit bans simultaneously (no sequential banning within a round)
- **Blitz Draft:** 10-second pick timers, no reserve time
- **No Ban:** Pure draft, no bans. 54 cards available, 30 picked, 24 unpicked. Mythics always in play.
- **Mirror Draft:** Both players draft from identical separate pools (each card exists twice). No exclusivity. Tests pure deck construction.

### 13.3 Spectator Mode
- Live draft viewing with commentary support
- Delayed pick reveal (2-second delay for broadcast tension)
- Draft prediction overlay (viewers guess picks before reveal)
- Post-draft analysis: tribal distribution, cost curves, synergy ratings, win probability

---

---

## APPENDIX: QUICK REFERENCE

```
╔══════════════════════════════════════════════════════════╗
║              THE SHATTERED DOMINION                      ║
║              CAPTAIN MODE — QUICK REFERENCE              ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  POOL: 54 cards  │  DECK: 15 each  │  BANS: 3 each     ║
║                                                          ║
║  3 ROUNDS — each round:                                  ║
║    1. Ban Phase  (1 ban each)                            ║
║    2. Pick Phase (5 picks each, snake draft)             ║
║                                                          ║
║  SNAKE PATTERN (per round, 10 picks):                    ║
║    FP → SP SP → FP FP → SP SP → FP FP → SP             ║
║                                                          ║
║  FIRST PICKER ROTATES:                                   ║
║    R1: P1  │  R2: P2  │  R3: P1                         ║
║                                                          ║
║  RULES:                                                  ║
║    • Each card picked by ONE side only                   ║
║    • Banned cards removed from pool                      ║
║    • All picks visible to both players                   ║
║    • Max 2 consecutive picks (snake)                     ║
║    • Deck shuffled after draft (random draw order)       ║
║    • Opening hand: 5 cards                               ║
║                                                          ║
║  FINAL COUNT:                                            ║
║    6 banned + 30 picked = 36 used                        ║
║    18 cards unpicked (33% of pool)                       ║
║                                                          ║
║  THREE ACTS:                                             ║
║    R1 — Declaration    (commit to a plan)                ║
║    R2 — Confrontation  (react and counter)               ║
║    R3 — Resolution     (complete the story)              ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

---

*Document version: 2.0*
*Last updated: March 2026*
*Status: Design Final — Ready for Implementation*
