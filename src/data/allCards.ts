import type { CardData } from "./gameData";

export const allCards: CardData[] = [
  // ♠ OBSIDIAN VEIL - Shadow Tribe (13 Cards)
  {
    id: "OV-L-01", name: "Sylas Dreadhollow", title: "Shadow Sovereign of the Umbral Depths",
    tribe: "Obsidian Veil", rarity: "legendary", cost: 7, atk: 6, hp: 9,  // FIX 2.1: HP 8→9
    abilityName: "Shadow Reign", abilityType: "Passive",
    abilityDesc: "All friendly Shadow cards gain +1 ATK. On kill, gains Stealth for 1 turn.",
    quote: "Every shadow in this realm answers to me. Including yours.",
  },
  {
    id: "OV-E-01", name: "Lyra Voidstep", title: "Archmage of the Unseen",
    tribe: "Obsidian Veil", rarity: "epic", cost: 5, atk: 4, hp: 5,
    abilityName: "Void Rift", abilityType: "On Deploy",
    abilityDesc: "Deal 3 damage to a target enemy. Draw 1 if kill.",
    quote: "There is a space between every shadow. I live there.",
  },
  {
    id: "OV-E-02", name: "Riven Ashenmask", title: "The Whispering Death",
    tribe: "Obsidian Veil", rarity: "epic", cost: 4, atk: 5, hp: 4,
    abilityName: "Backstab", abilityType: "Passive",
    abilityDesc: "+3 bonus damage to already-damaged enemies.",  // FIX 2.2: +2→+3
    quote: "I don't give warnings. I give funerals.",
  },
  {
    id: "OV-R-01", name: "Thane Gloomveil", title: "Poison Master of the Lower Depths",
    tribe: "Obsidian Veil", rarity: "rare", cost: 3, atk: 3, hp: 3,
    abilityName: "Crippling Toxin", abilityType: "On Deploy",  // FIX 2.3: Envenom→Crippling Toxin
    abilityDesc: "Deal 1 damage to target enemy + apply Wound (halve healing for 2 turns).",  // FIX 2.3
    quote: "One drop. That's all it takes.",
  },
  {
    id: "OV-R-02", name: "Mira Shadowlace", title: "Spymaster's Right Hand",
    tribe: "Obsidian Veil", rarity: "rare", cost: 2, atk: 2, hp: 4,
    abilityName: "Shadow Mark", abilityType: "On Deploy",  // v1.2
    abilityDesc: "Mark 1 enemy card for 2 turns. Marked target takes +1 damage from ALL sources.",
    quote: "I already know your next move. And the one after that.",
  },
  {
    id: "OV-R-03", name: "Dusk Fadewalker", title: "Nightstalker of the Outer Rim",
    tribe: "Obsidian Veil", rarity: "rare", cost: 3, atk: 3, hp: 4,
    abilityName: "Shadowcloak", abilityType: "On Deploy",
    abilityDesc: "Gains Stealth for 1 turn. Cannot be targeted. Breaks on attack.",
    quote: "If you could see me, you'd already be dead.",
  },
  {
    id: "OV-C-01", name: "Kael Nightwhisper", title: "Shadow Blade Initiate",
    tribe: "Obsidian Veil", rarity: "common", cost: 1, atk: 2, hp: 1,
    abilityName: "Quick Strike", abilityType: "On Deploy",
    abilityDesc: "Deal 1 damage to a target enemy card.",
    quote: "By the time you hear me, I'm already behind you.",
  },
  {
    id: "OV-C-02", name: "Nyx Hollowshade", title: "Shadow Scout",
    tribe: "Obsidian Veil", rarity: "common", cost: 1, atk: 1, hp: 2,
    abilityName: "Fade", abilityType: "Passive",
    abilityDesc: "Takes 1 less damage from the first attack each turn.",
    quote: "Darkness isn't the absence of light. It's the presence of safety.",
  },
  {
    id: "OV-C-03", name: "Vex Inkfinger", title: "Forger of the Black Market",
    tribe: "Obsidian Veil", rarity: "common", cost: 1, atk: 1, hp: 3,
    abilityName: "Sabotage", abilityType: "On Death",  // v1.2
    abilityDesc: "On Death: Reduce a random enemy card's ATK by 1 for 2 turns (minimum 1 ATK).",
    quote: "Identity is just ink on paper. And I have a lot of ink.",
  },
  {
    id: "OV-C-04", name: "Shade Vellum", title: "Apprentice Shadowmancer",
    tribe: "Obsidian Veil", rarity: "common", cost: 2, atk: 2, hp: 2,
    abilityName: "Shadow Bolt", abilityType: "On Deploy",
    abilityDesc: "Deal 1 damage to a target enemy card.",
    quote: "I'm still learning. My enemies aren't surviving the lessons.",
  },
  {
    id: "OV-C-05", name: "Whisper", title: "Street Informant",
    tribe: "Obsidian Veil", rarity: "common", cost: 1, atk: 1, hp: 2,
    abilityName: "Hush", abilityType: "On Deploy",  // v1.2
    abilityDesc: "Choose 1 enemy card. That card's PASSIVE abilities are disabled until end of your NEXT turn (~1.5 turns).",
    quote: "Psst. I've got something you need to hear.",
  },
  {
    id: "OV-C-06", name: "Graves Thornwick", title: "Sellsword of the Deep Streets",
    tribe: "Obsidian Veil", rarity: "common", cost: 2, atk: 3, hp: 1,
    abilityName: "Desperate Strike", abilityType: "Passive",
    abilityDesc: "+1 ATK while at 1 HP (max). Effectively 4 ATK but fragile.",
    quote: "You can't afford what I charge. Lucky for you, your boss already paid.",
  },
  {
    id: "OV-C-07", name: "Sable Driftmere", title: "Umbral Courier",
    tribe: "Obsidian Veil", rarity: "common", cost: 2, atk: 2, hp: 2,
    abilityName: "Swift", abilityType: "Passive",
    abilityDesc: "If destroys an enemy, may attack a second time this turn.",
    quote: "Catch me? You can't even see me leave.",
  },

  // ♦ RADIANT SANCTUM - Light Tribe (13 Cards)
  {
    id: "RS-L-01", name: "Aurelia Dawnspire", title: "Archon of the Crystal Throne",
    tribe: "Radiant Sanctum", rarity: "legendary", cost: 7, atk: 5, hp: 9,
    abilityName: "Divine Aegis", abilityType: "On Deploy + Passive",
    abilityDesc: "Grant Shield 2 to one target friendly card. All Light cards gain +1 HP.",
    quote: "I am the last light of a broken world. And I will not be extinguished.",
  },
  {
    id: "RS-E-01", name: "Orin Crystalward", title: "Grand Sentinel of the Spires",
    tribe: "Radiant Sanctum", rarity: "epic", cost: 5, atk: 3, hp: 7,
    abilityName: "Stalwart Bulwark", abilityType: "Passive",
    abilityDesc: "Taunt. All friendly cards take -1 damage from attacks.",
    quote: "You will not pass. Not today. Not ever.",
  },
  {
    id: "RS-E-02", name: "Celestine Brightvow", title: "High Priestess of the Eternal Light",
    tribe: "Radiant Sanctum", rarity: "epic", cost: 4, atk: 3, hp: 6,
    abilityName: "Resurrect", abilityType: "On Deploy",
    abilityDesc: "Return 1 card from your Graveyard to your hand.",
    quote: "Death is just darkness. And I carry the dawn.",
  },
  {
    id: "RS-R-01", name: "Aldric Shieldborne", title: "Crystal Paladin",
    tribe: "Radiant Sanctum", rarity: "rare", cost: 3, atk: 2, hp: 5,
    abilityName: "Crystal Shield", abilityType: "On Deploy",
    abilityDesc: "Grant a target friendly card Shield 2.",
    quote: "My shield is my oath. My oath is unbreakable.",
  },
  {
    id: "RS-R-02", name: "Sera Lightweaver", title: "Luminarch Mender",
    tribe: "Radiant Sanctum", rarity: "rare", cost: 3, atk: 2, hp: 4,
    abilityName: "Mending Light", abilityType: "Active",
    abilityDesc: "Restore 2 HP to a friendly card or Player HP. 1 energy, once/turn.",  // FIX 2.4: 3→2
    quote: "Hold still. The light knows where you're broken.",
  },
  {
    id: "RS-R-03", name: "Dorian Prismblade", title: "Knight of the Refracted Order",
    tribe: "Radiant Sanctum", rarity: "rare", cost: 2, atk: 3, hp: 3,
    abilityName: "Radiant Presence", abilityType: "Passive",
    abilityDesc: "All other friendly cards gain +1 HP while on field.",
    quote: "One light, many blades. One purpose, no mercy.",
  },
  {
    id: "RS-C-01", name: "Elara Dawnpetal", title: "Acolyte of the First Light",
    tribe: "Radiant Sanctum", rarity: "common", cost: 1, atk: 1, hp: 3,
    abilityName: "Minor Heal", abilityType: "On Deploy",
    abilityDesc: "Restore 1 HP to a friendly card or Player HP.",
    quote: "Even the smallest light pushes back the dark.",
  },
  {
    id: "RS-C-02", name: "Tomas Gleamheart", title: "Crystal Guard Recruit",
    tribe: "Radiant Sanctum", rarity: "common", cost: 1, atk: 1, hp: 2,
    abilityName: "Stand Firm", abilityType: "Passive",
    abilityDesc: "Takes 1 less damage from the first attack each turn.",
    quote: "I don't need to be strong. I just need to be here.",
  },
  {
    id: "RS-C-03", name: "Miriel Sunstitch", title: "Field Medic of the Sanctum",
    tribe: "Radiant Sanctum", rarity: "common", cost: 2, atk: 1, hp: 3,
    abilityName: "Patch Up", abilityType: "On Deploy",
    abilityDesc: "Restore 2 HP to a target friendly card.",
    quote: "War makes wounds. I unmake them.",
  },
  {
    id: "RS-C-04", name: "Bram Crystaleye", title: "Watchtower Lookout",
    tribe: "Radiant Sanctum", rarity: "common", cost: 1, atk: 2, hp: 1,
    abilityName: "Farsight", abilityType: "On Deploy",  // v1.2
    abilityDesc: "Choose 1 enemy card. That card's next Battle Phase attack deals -1 damage. Consumed after one attack.",
    quote: "I see them coming. Three days before they arrive.",
  },
  {
    id: "RS-C-05", name: "Lenna Hallowed", title: "Candle Bearer",
    tribe: "Radiant Sanctum", rarity: "common", cost: 1, atk: 1, hp: 2,
    abilityName: "Guiding Light", abilityType: "On Deploy",  // v1.2
    abilityDesc: "Give target friendly card +1 HP (permanent). Increases both max and current HP. This is a buff, NOT healing (unaffected by Wound).",
    quote: "I carry the light so others can find their courage.",
  },
  {
    id: "RS-C-06", name: "Fenric Stoneclad", title: "Sanctum Wall Guard",
    tribe: "Radiant Sanctum", rarity: "common", cost: 2, atk: 1, hp: 3,
    abilityName: "Taunt", abilityType: "Passive",
    abilityDesc: "Enemies must attack this card first.",
    quote: "The wall doesn't break because I don't break.",
  },
  {
    id: "RS-C-07", name: "Ivy Luminara", title: "Sanctum Scribe",
    tribe: "Radiant Sanctum", rarity: "common", cost: 2, atk: 2, hp: 2,
    abilityName: "Crystal Record", abilityType: "On Death",  // v1.2
    abilityDesc: "On Death: Grant Shield 1 to a random friendly card on the field. Fizzles if no allies exist.",
    quote: "Every victory starts as words on a page. I write the first words.",
  },

  // ♥ EMBERHEART PACT - Fire Tribe (13 Cards)
  {
    id: "EP-L-01", name: "Pyraxis the Unburnt", title: "Warlord of the Cinderlands",
    tribe: "Emberheart Pact", rarity: "legendary", cost: 6, atk: 7, hp: 6,
    abilityName: "Infernal Arrival + Lifesteal", abilityType: "On Deploy + Passive",
    abilityDesc: "Deal 3 damage to ALL enemy cards. Lifesteal on attacks.",  // FIX 2.5: 2→3
    quote: "I walked through the fire and the fire learned to bow.",
  },
  {
    id: "EP-E-01", name: "Crimson Morrigan", title: "Blood Witch of the Red Court",
    tribe: "Emberheart Pact", rarity: "epic", cost: 5, atk: 4, hp: 6,
    abilityName: "Blood Siphon", abilityType: "Passive",
    abilityDesc: "Lifesteal - heal Player HP by damage dealt to enemies.",
    quote: "Your blood sings to me. Let me listen closer.",
  },
  {
    id: "EP-E-02", name: "Volkar Cinderfist", title: "Champion of the Pit",
    tribe: "Emberheart Pact", rarity: "epic", cost: 4, atk: 5, hp: 4,
    abilityName: "Blood Price", abilityType: "Active",
    abilityDesc: "Sacrifice 2 Player HP → +2 ATK this turn. 0 energy, once/turn.",  // FIX 2.6: 3→2
    quote: "Pain is my currency. And I'm the richest man in the Cinderlands.",
  },
  {
    id: "EP-R-01", name: "Ember Ashvale", title: "Pyromancer Adept",
    tribe: "Emberheart Pact", rarity: "rare", cost: 3, atk: 3, hp: 4,
    abilityName: "Scorch", abilityType: "On Deploy",
    abilityDesc: "Apply Burn: 1 damage/turn for 2 turns.",
    quote: "Fire doesn't discriminate. But I do.",
  },
  {
    id: "EP-R-02", name: "Scald Blackthorn", title: "Berserker of the Outer Fires",
    tribe: "Emberheart Pact", rarity: "rare", cost: 2, atk: 3, hp: 3,
    abilityName: "Rage", abilityType: "Passive",
    abilityDesc: "+1 ATK each time this card takes damage. Stacks permanently.",
    quote: "HIT ME AGAIN.",
  },
  {
    id: "EP-R-03", name: "Ashara Flameveil", title: "Fire Shaman of the Sacred Pyre",
    tribe: "Emberheart Pact", rarity: "rare", cost: 3, atk: 2, hp: 4,
    abilityName: "Phoenix Rise", abilityType: "On Death",
    abilityDesc: "Restore 4 HP to your Player HP.",
    quote: "From my ashes, you will burn brighter.",
  },
  {
    id: "EP-C-01", name: "Cinder Voss", title: "Flame Acolyte",
    tribe: "Emberheart Pact", rarity: "common", cost: 1, atk: 2, hp: 2,
    abilityName: "Spark", abilityType: "On Deploy",
    abilityDesc: "Deal 1 damage to a target enemy card.",
    quote: "Oops. I did it again. On purpose, this time.",
  },
  {
    id: "EP-C-02", name: "Brand Scorchmark", title: "Ember Scout",
    tribe: "Emberheart Pact", rarity: "common", cost: 1, atk: 2, hp: 1,
    abilityName: "Flameburst", abilityType: "On Death",
    abilityDesc: "Deal 1 damage to a random enemy card.",
    quote: "If I don't come back, follow the smoke.",
  },
  {
    id: "EP-C-03", name: "Flint Ironblaze", title: "Pyre Keeper",
    tribe: "Emberheart Pact", rarity: "common", cost: 2, atk: 2, hp: 2,
    abilityName: "Fuel the Flame", abilityType: "On Death",
    abilityDesc: "Grant +2 ATK to a random friendly card until end of turn.",
    quote: "Everything burns eventually. The question is: what does your fire feed?",
  },
  {
    id: "EP-C-04", name: "Sear Moltenhand", title: "Cinderlands Raider",
    tribe: "Emberheart Pact", rarity: "common", cost: 1, atk: 1, hp: 2,
    abilityName: "Burn Touch", abilityType: "On Deploy",
    abilityDesc: "Apply Burn: 1 damage at end of next turn.",
    quote: "Don't worry, the burning stops after a while. Or it doesn't.",
  },
  {
    id: "EP-C-05", name: "Char Duskfire", title: "Ashwalker Grunt",
    tribe: "Emberheart Pact", rarity: "common", cost: 1, atk: 1, hp: 3,
    abilityName: "Smolder", abilityType: "Passive",
    abilityDesc: "Deals 1 damage to any card that attacks this card.",
    quote: "Touch me. I dare you.",
  },
  {
    id: "EP-C-06", name: "Kindle Wraithburn", title: "Blood Initiate",
    tribe: "Emberheart Pact", rarity: "common", cost: 2, atk: 3, hp: 1,
    abilityName: "Minor Blood Price", abilityType: "Active",
    abilityDesc: "Sacrifice 1 Player HP → +1 ATK this turn. 0 energy, once/turn.",
    quote: "It's just a little blood. I've got plenty.",
  },
  {
    id: "EP-C-07", name: "Blaze Hearthcoal", title: "Cinderlands Militia",
    tribe: "Emberheart Pact", rarity: "common", cost: 2, atk: 2, hp: 2,
    abilityName: "Minor Lifesteal", abilityType: "Passive",
    abilityDesc: "Heal Player HP by 1 when dealing damage to enemies.",
    quote: "I don't fight for the Pact. I fight for the people the Pact forgot.",
  },

  // ♣ IRONROOT BASTION - Earth Tribe (13 Cards)
  {
    id: "IB-L-01", name: "Thornwall the Ancient", title: "Warden-King of the Roothold",
    tribe: "Ironroot Bastion", rarity: "legendary", cost: 7, atk: 5, hp: 9,
    abilityName: "Living Fortress", abilityType: "On Deploy + Passive",
    abilityDesc: "Stun 1 enemy. Taunt. All Earth cards gain +1 HP.",  // FIX 2.7: +2→+1
    quote: "I was here before the throne was built. I will be here after it crumbles.",
  },
  {
    id: "IB-E-01", name: "Gorath Stonehide", title: "The Immovable",
    tribe: "Ironroot Bastion", rarity: "epic", cost: 5, atk: 3, hp: 7,
    abilityName: "Unbreakable Wall", abilityType: "Passive",
    abilityDesc: "Taunt. Attackers have ATK reduced by 1 for that attack.",
    quote: "...",
  },
  {
    id: "IB-E-02", name: "Willow Deeproot", title: "Archdruid of the Living Grove",
    tribe: "Ironroot Bastion", rarity: "epic", cost: 4, atk: 3, hp: 6,
    abilityName: "Overgrowth + Fortify", abilityType: "On Death + Active",
    abilityDesc: "On Death: summon 2/2 Seedling. Active: +2 HP to ally (1 energy).",
    quote: "The forest remembers every axe. And it holds grudges.",
  },
  {
    id: "TK-SEEDLING", name: "Seedling", title: "Summoned Token - Willow Deeproot",
    tribe: "Ironroot Bastion", rarity: "token", cost: 0, atk: 2, hp: 2,
    abilityName: "None", abilityType: "Passive",
    abilityDesc: "A seedling sprouted from Willow Deeproot's final breath.",
    quote: "From death, the forest always answers.",
  },
  {
    id: "IB-R-01", name: "Barric Ironbark", title: "Root Warden Captain",
    tribe: "Ironroot Bastion", rarity: "rare", cost: 3, atk: 2, hp: 5,
    abilityName: "Ironbark Shield", abilityType: "Passive + Active",
    abilityDesc: "Taunt. Active: +1 HP to ally (1 energy, once/turn).",
    quote: "Behind me is home. I don't retreat from home.",
  },
  {
    id: "IB-R-02", name: "Moss Cragborn", title: "Beast Tamer of the Wild Reaches",
    tribe: "Ironroot Bastion", rarity: "rare", cost: 3, atk: 3, hp: 4,
    abilityName: "Call of the Wild", abilityType: "On Deploy",
    abilityDesc: "Summon a 1/1 Beast token in an empty field slot.",
    quote: "I don't command the wild. I just introduce it to my enemies.",
  },
  {
    id: "TK-BEAST", name: "Beast", title: "Summoned Token - Moss Cragborn",
    tribe: "Ironroot Bastion", rarity: "token", cost: 0, atk: 1, hp: 1,
    abilityName: "None", abilityType: "Passive",
    abilityDesc: "A wild beast summoned by Moss Cragborn.",
    quote: "It doesn't need a name. It needs teeth.",
  },
  {
    id: "IB-R-03", name: "Petra Stoneweave", title: "Earth Shaper",
    tribe: "Ironroot Bastion", rarity: "rare", cost: 2, atk: 2, hp: 4,
    abilityName: "Petrify", abilityType: "On Deploy",
    abilityDesc: "Stun a target enemy: cannot attack on owner's next turn.",
    quote: "The earth listens to me. You should too.",
  },
  {
    id: "IB-C-01", name: "Root Taldris", title: "Seedling Guard",
    tribe: "Ironroot Bastion", rarity: "common", cost: 1, atk: 1, hp: 3,
    abilityName: "Taunt", abilityType: "Passive",
    abilityDesc: "Enemies must attack this card first.",
    quote: "You'll have to go through me. That's the point.",
  },
  {
    id: "IB-C-02", name: "Bramble Thickbough", title: "Thornwall Militia",
    tribe: "Ironroot Bastion", rarity: "common", cost: 1, atk: 1, hp: 2,
    abilityName: "Thorns", abilityType: "Passive",
    abilityDesc: "Deal 1 damage to any card that attacks this card.",
    quote: "Go ahead, hit me. See what happens.",
  },
  {
    id: "IB-C-03", name: "Clay Mossfoot", title: "Roothold Forager",
    tribe: "Ironroot Bastion", rarity: "common", cost: 1, atk: 2, hp: 2,
    abilityName: "Harvest", abilityType: "On Death",
    abilityDesc: "Restore 2 HP to your Player HP.",
    quote: "The forest feeds us. Time to feed the forest.",
  },
  {
    id: "IB-C-04", name: "Fern Willowbend", title: "Young Druid",
    tribe: "Ironroot Bastion", rarity: "common", cost: 2, atk: 1, hp: 3,
    abilityName: "Mend", abilityType: "Active",
    abilityDesc: "Restore 1 HP to a friendly card. 0 energy, once/turn.",
    quote: "I can't stop the war. But I can stop the bleeding.",
  },
  {
    id: "IB-C-05", name: "Pebble Cragson", title: "Stone Sprite",
    tribe: "Ironroot Bastion", rarity: "common", cost: 1, atk: 1, hp: 2,
    abilityName: "Harden", abilityType: "On Deploy",
    abilityDesc: "Gains +1 HP on deploy (enters with 3 HP).",
    quote: "Pebble strong! Pebble not break! ...Pebble scared though.",
  },
  {
    id: "IB-C-06", name: "Oakley Deepstride", title: "Ironwood Logger",
    tribe: "Ironroot Bastion", rarity: "common", cost: 2, atk: 2, hp: 2,
    abilityName: "Shieldbreaker", abilityType: "Passive",
    abilityDesc: "Deals +1 damage to cards that have Shield.",
    quote: "I've been breaking tough things my whole life. You're not that tough.",
  },
  {
    id: "IB-C-07", name: "Sage Mossmantle", title: "Grove Keeper Apprentice",
    tribe: "Ironroot Bastion", rarity: "common", cost: 2, atk: 2, hp: 2,
    abilityName: "Nature's Gift", abilityType: "On Deploy",
    abilityDesc: "Grant a target friendly card +1 HP.",
    quote: "The grove taught me patience. The war taught me urgency.",
  },

  // MYTHIC - Tribeless (2 Cards)
  {
    id: "MY-M-01", name: "Vaelkor, the Hollow Crown", title: "Echo of the Shattered King - Wrath Incarnate",
    tribe: "Tribeless", rarity: "mythic", cost: 9, atk: 8, hp: 9,
    abilityName: "Dominion's End", abilityType: "On Deploy",
    abilityDesc: "Destroy ALL other cards on the field - both sides. Enters alone. Slow.",
    quote: "I had a kingdom. I had a name. Now I have only this: the end of everything.",
  },
  {
    id: "MY-M-02", name: "Vaelith, the Shattered Memory", title: "Echo of the Lost Queen - Chaos Incarnate",
    tribe: "Tribeless", rarity: "mythic", cost: 8, atk: 7, hp: 9,
    abilityName: "Reality Fracture", abilityType: "On Deploy",
    abilityDesc: "Steal 1 random card from opponent's hand. Halve opponent's energy next turn.",
    quote: "He broke the world to become a god. I am what his guilt left behind.",
  },
];
