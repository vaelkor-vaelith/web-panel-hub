export interface Tribe {
  id: string;
  name: string;
  symbol: string;
  element: string;
  realm: string;
  philosophy: string;
  strength: string;
  weakness: string;
  identity: string;
  lore: string;
  colorClass: string;
  glowClass: string;
}

export interface CardData {
  id: string;
  name: string;
  title: string;
  tribe: string;
  rarity: "common" | "rare" | "epic" | "legendary" | "mythic" | "token";
  cost: number;
  atk: number;
  hp: number;
  abilityName: string;
  abilityType: string;
  abilityDesc: string;
  quote: string;
  image?: string;
}

export const tribes: Tribe[] = [
  {
    id: "obsidian-veil",
    name: "Obsidian Veil",
    symbol: "shadow",
    element: "Shadow",
    realm: "The Umbral Depths",
    philosophy: "Strike unseen. Strike once. That is enough.",
    strength: "High burst damage - kill before they react",
    weakness: "Low survivability - glass cannons",
    identity: "Assassins, rogues, shadow mages, spies",
    lore: "The Obsidian Veil operates from the Umbral Depths - a realm of permanent twilight where the sun never reaches. Their society is built on secrecy, hierarchy, and precision.",
    colorClass: "text-shadow",
    glowClass: "shadow-[0_0_30px_hsl(270,60%,50%,0.4)]",
  },
  {
    id: "radiant-sanctum",
    name: "Radiant Sanctum",
    symbol: "light",
    element: "Light",
    realm: "The Crystal Spires",
    philosophy: "The patient shield outlasts the reckless blade.",
    strength: "Defense & shields - outlast, protect, endure",
    weakness: "Low offense - slow to kill",
    identity: "Paladins, healers, crystal mages, sentinels",
    lore: "The Radiant Sanctum dwells in The Crystal Spires - towering structures of living crystal that hum with holy light. Their civilization worships order, protection, and purity.",
    colorClass: "text-light",
    glowClass: "shadow-[0_0_30px_hsl(45,100%,60%,0.4)]",
  },
  {
    id: "emberheart-pact",
    name: "Emberheart Pact",
    symbol: "fire",
    element: "Fire",
    realm: "The Cinderlands",
    philosophy: "What I take from you, I keep. What I burn, stays burned.",
    strength: "Life drain & sustain - steal HP, heal through combat",
    weakness: "Self-destructive - many abilities cost own HP",
    identity: "Blood mages, berserkers, fire shamans",
    lore: "The Emberheart Pact forged their civilization in The Cinderlands - a volcanic hellscape where survival itself is a battle. They harness fire and blood magic.",
    colorClass: "text-fire",
    glowClass: "shadow-[0_0_30px_hsl(0,85%,50%,0.4)]",
  },
  {
    id: "ironroot-bastion",
    name: "Ironroot Bastion",
    symbol: "earth",
    element: "Earth",
    realm: "The Roothold",
    philosophy: "The mountain does not rush. The mountain does not fall.",
    strength: "Crowd control & tank - stun, slow, absorb, endure",
    weakness: "Slow and predictable - low damage output",
    identity: "Druids, stone golems, beast tamers, root wardens",
    lore: "The Ironroot Bastion inhabits The Roothold - an ancient primordial forest where trees grow as tall as mountains and stone itself is alive.",
    colorClass: "text-earth",
    glowClass: "shadow-[0_0_30px_hsl(140,50%,40%,0.4)]",
  },
];

export const legendaryCards: CardData[] = [
  {
    id: "OV-L-01",
    name: "Sylas Dreadhollow",
    title: "Shadow Sovereign of the Umbral Depths",
    tribe: "Obsidian Veil",
    rarity: "legendary",
    cost: 7,
    atk: 6,
    hp: 9,  // FIX 5.8: HP 8→9 (v1.1)
    abilityName: "Shadow Reign",
    abilityType: "Passive",
    abilityDesc: "All friendly Shadow cards gain +1 ATK. On kill, gains Stealth for 1 turn.",
    quote: "Every shadow in this realm answers to me. Including yours.",
  },
  {
    id: "RS-L-01",
    name: "Aurelia Dawnspire",
    title: "Archon of the Crystal Throne",
    tribe: "Radiant Sanctum",
    rarity: "legendary",
    cost: 7,
    atk: 5,
    hp: 9,
    abilityName: "Divine Aegis",
    abilityType: "On Deploy + Passive",
    abilityDesc: "Grant Shield 2 to one target friendly card. All Light cards gain +1 HP.",
    quote: "I am the last light of a broken world. And I will not be extinguished.",
  },
  {
    id: "EP-L-01",
    name: "Pyraxis the Unburnt",
    title: "Warlord of the Cinderlands",
    tribe: "Emberheart Pact",
    rarity: "legendary",
    cost: 6,
    atk: 7,
    hp: 6,
    abilityName: "Infernal Arrival + Lifesteal",
    abilityType: "On Deploy + Passive",
    abilityDesc: "Deal 3 damage to ALL enemy cards. Lifesteal on attacks.",  // FIX 5.8: 2→3 (v1.1)
    quote: "I walked through the fire and the fire learned to bow.",
  },
  {
    id: "IB-L-01",
    name: "Thornwall the Ancient",
    title: "Warden-King of the Roothold",
    tribe: "Ironroot Bastion",
    rarity: "legendary",
    cost: 7,
    atk: 5,
    hp: 9,
    abilityName: "Living Fortress",
    abilityType: "On Deploy + Passive",
    abilityDesc: "Stun 1 enemy. Taunt. All Earth cards gain +1 HP.",  // FIX 5.8: +2→+1 (v1.1)
    quote: "I was here before the throne was built. I will be here after it crumbles.",
  },
];

export const mythicCards: CardData[] = [
  {
    id: "MY-M-01",
    name: "Vaelkor, the Hollow Crown",
    title: "Echo of the Shattered King - Wrath Incarnate",
    tribe: "Tribeless",
    rarity: "mythic",
    cost: 9,
    atk: 8,
    hp: 9,
    abilityName: "Dominion's End",
    abilityType: "On Deploy",
    abilityDesc: "Destroy ALL other cards on the field - both yours and your opponent's. Enters alone. Slow.",
    quote: "I had a kingdom. I had a name. Now I have only this: the end of everything.",
  },
  {
    id: "MY-M-02",
    name: "Vaelith, the Shattered Memory",
    title: "Echo of the Lost Queen - Chaos Incarnate",
    tribe: "Tribeless",
    rarity: "mythic",
    cost: 8,
    atk: 7,
    hp: 9,
    abilityName: "Reality Fracture",
    abilityType: "On Deploy",
    abilityDesc: "Steal 1 random card from opponent's hand. Halve opponent's energy next turn.",
    quote: "He broke the world to become a god. I am what his guilt left behind.",
  },
];
