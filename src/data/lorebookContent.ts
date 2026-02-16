// Structured lorebook content for the dedicated /lore page

export interface LoreChapter {
  id: string;
  volume: string;
  volumeNum: number;
  title: string;
  content: string[]; // paragraphs
  subsections?: {
    title: string;
    content: string[];
  }[];
  quote?: string;
}

export interface GlossaryEntry {
  term: string;
  definition: string;
}

export interface TimelineEntry {
  era: string;
  duration: string;
  events: string;
}

export interface CharacterEntry {
  name: string;
  title: string;
  role: string;
}

export interface TribeRoster {
  tribe: string;
  element: string;
  color: string;
  characters: CharacterEntry[];
}

export const lorebookEpigraph = {
  quote: "Before the breaking, there was one world. One throne. One sky. Now there are four worlds, four wars, and no sky at all - just the memory of what was, burning in every heart that remembers.",
  attribution: "Fragment recovered from the Primordial Archive, author unknown",
};

export const volumes: LoreChapter[] = [
  // VOLUME I - THE WORLD BEFORE
  {
    id: "aethara-undivided",
    volume: "THE WORLD BEFORE",
    volumeNum: 1,
    title: "Aethara Undivided",
    content: [
      "In the beginning, there was Aethara.",
      "Not a kingdom. Not a civilization. A world - whole and singular, sustained by the interplay of four elemental essences that flowed through its bedrock like blood through veins. These essences were not abstract forces. They were alive. They were conscious. And they were bound to the land itself.",
      "Shadow dwelt in the deep places - the caves, the ocean trenches, the spaces between thoughts. It was the essence of concealment, intuition, and the unknowable. Shadow was not evil. It was privacy. It was the part of the mind that thinks before it speaks.",
      "Light radiated from the crystal formations that grew naturally across Aethara's surface - vast, luminous outcroppings that hummed with a frequency only the devout could hear. Light was clarity, order, and preservation. It did not create; it revealed. It did not build; it protected what was already built.",
      "Fire slept in the volcanic heart of Aethara - the molten core that kept the world warm, fed the hot springs, and drove the tectonic movements that shaped continents. Fire was transformation. It was the energy that turned ore into steel, grain into bread, and complacency into ambition. It was also hunger - an appetite that, unfed, consumed everything in reach.",
      "Earth was the body of the world itself - the stone, the soil, the roots of the great forests that covered Aethara's northern hemisphere. Earth was patience. It was the slow, grinding force that wore mountains into valleys over millennia. It asked nothing of anyone except to be left alone to grow.",
      "These four essences existed in equilibrium. Where Shadow pooled too deep, Light pushed it back. Where Fire raged too hot, Earth smothered it. Where Earth grew too thick, Fire cleared the way. Where Light burned too bright, Shadow provided rest. The cycle was natural. It was self-correcting. It had maintained itself since Aethara's creation, and it would have continued forever.",
      "If not for the Throne.",
    ],
  },
  {
    id: "primordial-throne",
    volume: "THE WORLD BEFORE",
    volumeNum: 1,
    title: "The Primordial Throne",
    content: [
      "No one knows who built the Primordial Throne. The oldest records in every culture describe it as simply being there - a structure at the geographic center of Aethara, carved from a stone that doesn't exist anywhere else in the world: a material that shifts color depending on the viewer's elemental affinity. Shadow-attuned eyes see it as polished obsidian. Light-attuned eyes see it as radiant crystal. Fire-attuned eyes see it as solidified magma. Earth-attuned eyes see it as living wood.",
      "What all agree upon is what the Throne did: it channeled Aethara's four elemental essences through the body of whoever sat upon it, allowing a single ruler to maintain the balance between them. Not to control the essences - the Throne's design made that impossible - but to mediate between them. The Throne-sitter was less a king and more a conductor, ensuring that no essence overwhelmed the others.",
      "For millennia, this system worked. The line of Throne-sitters was unbroken, passing from parent to child, each trained from birth in the art of elemental mediation. The people of Aethara lived as one civilization, undivided by element. A family might have a shadow-attuned parent, a fire-attuned child, and an earth-attuned grandparent. Attunement was personal, not tribal. It was a trait like hair color - not a cause for war.",
      "The peace held for over four thousand years. Historians call this era the Long Balance.",
      "It ended with a man named Vaelkor.",
    ],
  },
  {
    id: "last-king",
    volume: "THE WORLD BEFORE",
    volumeNum: 1,
    title: "The Last King",
    content: [
      "Vaelkor was born with an affinity for all four essences - a condition so rare it had no name. Ordinary people were attuned to one element, occasionally two. Vaelkor could feel all four simultaneously, constantly, from birth. The crystal hummed in his presence. Shadows bent toward him. Flames followed his gaze. The earth trembled when he was angry.",
      "His twin sister, Vaelith, shared this quadruple attunement. But where Vaelkor experienced it as power - a roaring symphony of elemental force coursing through his veins - Vaelith experienced it as awareness. She could feel the balance between the essences with surgical precision. She knew when one was swelling and another receding. She understood the Throne's design intuitively, as though it had been built for her mind specifically.",
      "When their father died and Vaelkor ascended to the Primordial Throne, Vaelith became his chief advisor. She was everything he was not: patient where he was impulsive, cautious where he was ambitious, quiet where he was commanding. For the first thirty years of his reign, the arrangement worked. Vaelkor sat the Throne and wielded the essences. Vaelith stood beside him and whispered when the balance began to drift.",
      "But the essences were not passive passengers. They spoke to Vaelkor through the Throne - not in words, but in feelings, urges, cravings. Shadow whispered that he could see the secrets of every mind in Aethara. Light told him he was chosen, sanctified, destined for something greater. Fire burned in him with a hunger for more - more power, more control, more of everything. Earth told him he was permanent, that his rule should last forever.",
      "Vaelith heard the same whispers. She recognized them for what they were: the essences testing their conduit, probing for weakness, searching for a crack through which one might escape and dominate the others. She warned her brother. She begged him to resist.",
      "Vaelkor listened to his sister for thirty years. Then, on the thirty-first year of his reign, he stopped listening.",
    ],
  },
  {
    id: "the-ritual",
    volume: "THE WORLD BEFORE",
    volumeNum: 1,
    title: "The Ritual",
    content: [
      "The specifics of Vaelkor's ritual are lost. What survives are fragments - accounts from scholars who glimpsed the preparations, journals from servants who were dismissed from the throne room in the final hours, and the eyewitness testimony of one person who was present when it happened: Vaelith.",
      "What is known: Vaelkor attempted to absorb all four elemental essences into himself permanently. Not to mediate them through the Throne, but to contain them - to become a living vessel for the world's fundamental forces. To become, in effect, a god.",
      "Vaelith discovered the ritual on the morning of its execution. She ran to the throne room. She found her brother at the center of a four-pointed sigil, each point aligned with one of the cardinal elements, the Throne itself shattered into pieces and reassembled into the ritual's framework. The essences were already flowing into him - four rivers of raw elemental power converging on a single human body.",
      "She tried to pull him away.",
      "She was too late.",
      "The moment all four essences occupied the same vessel, the equilibrium that had sustained Aethara for millennia collapsed. The essences did not merge. They repelled - violently, catastrophically, and instantaneously.",
      "The resulting detonation is called The Shattering.",
    ],
  },

  // VOLUME II - THE SHATTERING
  {
    id: "the-cataclysm",
    volume: "THE SHATTERING",
    volumeNum: 2,
    title: "The Cataclysm",
    content: [
      "The Shattering was not an explosion in the conventional sense. It was a separation. The four essences, forced into a single point and violently rejecting coexistence, ripped outward in four directions, taking the physical world with them.",
      "Aethara did not break like glass. It divided like a cell - pulling apart into four fragments, each one saturated with a single element. The geography of the old world was torn along elemental fault lines that had existed, invisibly, since creation. The deep places went with Shadow. The crystal formations went with Light. The volcanic heart went with Fire. The forests and stone went with Earth.",
      "Between the fragments: nothing. Not empty space - nothing. An absence that some call the Void and others call the Threshold. The four new realms float in this nothingness, separated but not entirely disconnected. The borders between them are thin in places - permeable membranes through which the determined, the desperate, or the foolish can cross.",
      "The Shattering killed millions. Entire cities were bisected by the separation - half pulled into one realm, half into another. Families were split. Rivers were severed. Mountain ranges were torn in half. The trauma of that day is woven into every culture that survived it, and the memory has not faded in over a thousand years.",
    ],
  },
  {
    id: "fate-of-twins",
    volume: "THE SHATTERING",
    volumeNum: 2,
    title: "The Fate of the Twins",
    content: [
      "Vaelkor and Vaelith were at the epicenter.",
      "The essences tore through Vaelkor's body and, failing to coexist, tore him apart - not into four pieces (the essences wanted nothing of him) but into two. His body was annihilated. His soul fractured along the only fault line it had: the division between what he felt and what he thought. His rage - his ambition, his hunger, his fury at a world that dared resist his will - condensed into a spectral figure. A hollow suit of ancient armor filled with screaming void-energy. This is the Echo called Vaelkor, the Hollow Crown.",
      "Vaelith, standing beside him, was caught in the same detonation. She did not seek power. She was trying to stop it. But the essences did not distinguish between willing and unwilling vessels. The explosion tore her apart as well - but where Vaelkor's defining trait was wrath, Vaelith's was memory. Her consciousness survived as a shimmering figure of fractured light and broken time, endlessly reliving the moment of the Shattering, endlessly trying to undo it. This is the Echo called Vaelith, the Shattered Memory.",
      "The Echoes are not alive. They are not dead. They are residue - the psychic stains left by two people who were too close to a detonation that rewrote reality. They wander the spaces between realms, drawn to conflict, unable to rest.",
      "Vaelkor screams. He roars. Occasionally, fragments of his old personality surface - a king's commanding tone, a father's grief, a madman's laughter - before dissolving back into incoherent fury. He does not fight for any side. He does not remember sides. He only knows that the world was his, and someone took it away, and for that, everything must burn.",
      "Vaelith does not want to destroy. She wants to undo - to rewind time to the moment before her brother's madness and stop him. But she can't. She is trapped in an eternal loop of grief, and every battlefield she appears on becomes another distorted echo of the original catastrophe.",
      "The common people do not know the truth about Vaelith. The popular legend says she was Vaelkor's queen - a wife sacrificed in his mad ritual. Only the oldest scholars - and the sacred trees of the Roothold that remember the world before - know that she was his twin. His advisor. His conscience. The last voice that tried to save the world, and failed.",
    ],
  },
  {
    id: "birth-of-realms",
    volume: "THE SHATTERING",
    volumeNum: 2,
    title: "The Birth of the Four Realms",
    content: [
      "The separation was instant, but the aftermath unfolded over decades. Each fragment of Aethara, saturated with a single essence, began to reshape itself. The land responded to its dominant element, warping and growing and transforming until each realm became a pure expression of its nature.",
    ],
    subsections: [
      {
        title: "The Umbral Depths - Shadow",
        content: [
          "The deep places of Aethara - the cavern networks, the underground rivers, the subterranean forests of bioluminescent fungi - pulled away from the surface world and sealed themselves beneath a permanent twilight sky. The sun does not shine in the Umbral Depths. Light exists only in controlled, artificial forms: phosphorescent lichens, alchemical lanterns, and the faint silver glow that seeps from veins of shadow-infused obsidian.",
          "The terrain is vertical. The Depths are a realm of spires - towers of black glass that jut upward from a fog-shrouded floor, connected by bridges, catwalks, and ziplines. Cities are built into the spires themselves: carved, not constructed, from the obsidian that forms naturally in massive crystalline columns. The fog that blankets the lower levels is not water vapor; it is condensed shadow-essence, and it whispers to those who walk through it.",
        ],
      },
      {
        title: "The Crystal Spires - Light",
        content: [
          "The crystal formations of old Aethara, freed from the moderating influence of the other essences, grew without restraint. What were once scattered outcroppings became towering structures - cathedrals of living crystal that float above the ground, suspended by the light that pulses through their lattices. The Crystal Spires are a realm of perpetual golden radiance. There is no night. There are no shadows.",
          "The terrain is ethereal. Islands of crystal float at varying altitudes, connected by bridges of solidified light. Waterfalls of luminous energy cascade from the highest formations, pooling in basins that serve as communal gathering places. The crystal is alive - it grows, it responds to touch, it sings when struck.",
        ],
      },
      {
        title: "The Cinderlands - Fire",
        content: [
          "The volcanic heart of Aethara, no longer tempered by earth and water, erupted permanently. The Cinderlands are a wasteland of active volcanoes, rivers of lava, and black-stone fortresses built on islands of cooled rock surrounded by molten seas. The sky is orange-gray, choked with ash and lit from below by the endless glow of magma.",
          "The terrain is hostile. Nothing grows in the Cinderlands that does not first prove it can survive being burned. Despite this - or because of it - the Cinderlands breed a fierce, resilient people. They see their environment not as a curse but as a forge. It burns away weakness. What survives is strong.",
        ],
      },
      {
        title: "The Roothold - Earth",
        content: [
          "The great northern forests of Aethara, suffused with concentrated earth-essence, became something more than trees. They became a single organism - a continent-wide network of roots, trunks, and canopies that grew into a living cathedral. The trees of the Roothold are not merely large; the oldest among them are mountains.",
          "The terrain is alive. The ground shifts. Paths that existed yesterday may be overgrown today. Rivers reroute themselves when the roots move. The stone itself is animate. The Roothold is patient. It was old when the other realms were born. It will be here when they are dust.",
        ],
      },
    ],
  },

  // VOLUME III - THE FOUR TRIBES
  {
    id: "obsidian-veil",
    volume: "THE FOUR TRIBES",
    volumeNum: 3,
    title: "The Obsidian Veil",
    content: [
      "The Obsidian Veil is not a nation in any conventional sense. It is a network - a hierarchy of cells, guilds, and operatives connected by shared allegiance to the Shadow Sovereign but otherwise autonomous. There is no capital city, though the largest spire-city, Nocturn, functions as the seat of power. There is no public government. Decisions are made in darkness, communicated through dead drops, and enforced by assassination.",
      "The current Shadow Sovereign is Sylas Dreadhollow, who rose from a nameless street urchin to the highest seat of power by killing six rivals in a single night. No one has seen his face. He wears a mask of living shadow that devours any light that touches it.",
    ],
    subsections: [
      {
        title: "Military Structure",
        content: [
          "The Veil does not maintain a standing army. Instead, it operates through specialized roles: Blades (combat operatives), Voidwalkers (shadow mages), Masks (elite assassins), Weavers (intelligence operatives), Venomists (poison specialists), Couriers (message runners), and Fingers (forgers and counterfeiters).",
          "The Veil does not conquer territory. It infiltrates, destabilizes, and profits from the chaos. Mira Shadowlace maintains embedded agents in every tribe. The information she gathers is more lethal than any blade.",
        ],
      },
      {
        title: "Culture & Philosophy",
        content: [
          "Privacy is sacred. Names are tools, not identities. Trust is earned through results, not words. Betrayal is punished with a silence so complete that the traitor's name is erased from every record, as if they never existed.",
          "Despite this cold pragmatism, the Veil has its own code: contracts are honored, debts are repaid, and the innocent are left alone. The Veil has no interest in ruling the world. It has every interest in knowing everything about it.",
        ],
      },
    ],
    quote: "Strike unseen. Strike once. That is enough.",
  },
  {
    id: "radiant-sanctum",
    volume: "THE FOUR TRIBES",
    volumeNum: 3,
    title: "The Radiant Sanctum",
    content: [
      "The Radiant Sanctum is a theocracy - a civilization where spiritual authority and political authority are one and the same. At its peak sits Aurelia Dawnspire, who has served as both queen and high priestess for three centuries, sustained by the pure light that flows through the realm's crystal veins.",
    ],
    subsections: [
      {
        title: "Military & Defense",
        content: [
          "The Sanctum's military doctrine is entirely defensive. They do not invade. They do not raid. They endure. Their fortifications are the crystal formations themselves - structures that regenerate damage, amplify light-based defenses, and can be grown to seal breaches in real time.",
          "Orin Crystalward has stood at the gates for forty years without rest, without retreat, without letting a single enemy pass. His crystal armor bears over a thousand cuts - he carved each one himself, a record of every failed assault.",
          "The Sanctum's weakness is offense. Their healing is extraordinary - Sera Lightweaver alone has saved over a thousand lives. Celestine Brightvow can even recall the dead. But turning this healing infrastructure into killing force is something the Sanctum has never mastered.",
        ],
      },
      {
        title: "Culture & Religion",
        content: [
          "The Sanctum values order, duty, and selflessness above all else. The crystal structures respond to emotional harmony - they grow brighter when the people within are at peace and dim when there is discord. Emotional regulation is not merely encouraged but architecturally enforced.",
          "The Sanctum worships Light itself - not as a deity but as a principle. They believe that before the Shattering, the world was whole because light illuminated all things equally. Shadow is not merely an element but a corruption - the willful concealment of truth.",
        ],
      },
    ],
    quote: "The patient shield outlasts the reckless blade.",
  },
  {
    id: "emberheart-pact",
    volume: "THE FOUR TRIBES",
    volumeNum: 3,
    title: "The Emberheart Pact",
    content: [
      "The Emberheart Pact is a meritocracy forged in violence. There is no hereditary leadership. Authority is earned through the Trial of the Burning Heart - a ritual where warriors walk into the Heart of the Volcano and either emerge reborn or don't emerge at all.",
      "Pyraxis the Unburnt was once a common soldier - unremarkable, unambitious, content to serve. The Trial changed him utterly. He walked into the volcano for three days. When he emerged, his skin had turned to obsidian, his veins ran with lava, and fire could no longer touch him.",
    ],
    subsections: [
      {
        title: "The Red Court",
        content: [
          "Blood magic is the Pact's darkest art and greatest weapon. The Red Court's practitioners discovered that blood carries more than life - it carries essence, the fundamental energy that separates the living from the dead. By siphoning this essence through combat itself, blood mages can heal themselves at the expense of their enemies.",
          "Crimson Morrigan is the Red Court's most powerful - and most feared - practitioner. Her blood magic is forbidden even among the Emberheart, but her results are undeniable. Kindle Wraithburn, the youngest initiate, has already pushed further into blood magic than any student his age. The red veins spreading across his skin are proof that the magic is beginning to consume him.",
        ],
      },
      {
        title: "Culture",
        content: [
          "Pain is currency in the Cinderlands. Scars are status symbols. Scald Blackthorn charges into battle wearing nothing but war paint and a grin. The Pact does not romanticize suffering; it weaponizes it.",
          "Blaze Hearthcoal is a common soldier drafted from the coal-mining communities. He doesn't fight for glory. He fights because if the army falls, the mining towns fall next, and his family lives in those towns. He is nobody special. He is just a man with a sword and a reason to swing it.",
        ],
      },
    ],
    quote: "What I take from you, I keep. What I burn, stays burned.",
  },
  {
    id: "ironroot-bastion",
    volume: "THE FOUR TRIBES",
    volumeNum: 3,
    title: "The Ironroot Bastion",
    content: [
      "The Ironroot Bastion does not have a government. It has a forest.",
      "The Roothold's oldest living inhabitant - and its de facto ruler - is Thornwall the Ancient, a sentient walking tree that has lived since before the Shattering, making him over a thousand years old. He is not a person who became a tree. He is a tree that became a person. His roots extend across the entire Roothold, and through them, he feels every footstep, every fallen leaf, every tremor in his domain.",
    ],
    subsections: [
      {
        title: "The Living Land",
        content: [
          "The Roothold is the only realm where the land itself is an active participant in warfare. Trees move to block enemy advances. Roots erupt from the ground to entangle invaders. Boulders roll uphill to form barricades. The forest does not merely shelter the Bastion - it fights for them.",
          "Willow Deeproot, the highest-ranking druid, can accelerate growth from seed to siege-weapon in seconds. The sacred groves, tended by Sage Mossmantle, contain trees so ancient they remember the world before the Shattering.",
        ],
      },
      {
        title: "Culture",
        content: [
          "The Bastion's culture revolves around patience, endurance, and communion. The people do not impose their will on the land; they listen to it.",
          "Pebble Cragson is a tiny earth spirit - a bundle of rocks, moss, and good intentions held together by nature magic, standing about three feet tall, speaking in broken sentences, and terrified of almost everything. He fights because the elder druids asked him to, and Pebble doesn't know how to say no. Every time an enemy hits him, the rocks just rearrange themselves.",
          "Oakley Deepstride spent thirty years cutting ironwood - the hardest timber in all of Aethara. When war came, he traded his logging axe for a war axe. Turns out, the swing is exactly the same.",
        ],
      },
    ],
    quote: "The mountain does not rush. The mountain does not fall.",
  },

  // VOLUME IV - THE ETERNAL WAR
  {
    id: "why-they-fight",
    volume: "THE ETERNAL WAR",
    volumeNum: 4,
    title: "Why They Fight",
    content: [
      "Every tribe believes they are the rightful successor to the Primordial Throne. Their reasons differ:",
      "The Obsidian Veil believes the Throne belonged to whoever had the skill to take it. Vaelkor's failure proved that brute force was the wrong approach. The Veil would dismantle the Throne for parts, extracting its secrets and selling the knowledge to the highest bidder.",
      "The Radiant Sanctum believes the Throne was a sacred instrument of order, and its destruction was the original sin from which all suffering flows. They seek to rebuild it and install a worthy successor to restore the Long Balance.",
      "The Emberheart Pact believes the Throne was a cage that held back the world's true potential. Vaelkor's mistake was not that he sought power but that he was too weak to hold it. A stronger vessel - tempered by fire - could succeed where he failed.",
      "The Ironroot Bastion doesn't want the Throne. They want to be left alone. But they know that if any other tribe claims it, the new ruler will reshape the world in their image, and the forests will be the first thing to burn. So the Bastion fights - not to win the Throne but to ensure nobody else does.",
    ],
  },
  {
    id: "elemental-cycle",
    volume: "THE ETERNAL WAR",
    volumeNum: 4,
    title: "The Elemental Cycle",
    content: [
      "The tribes' elemental natures create a natural cycle of advantage and vulnerability that shapes every battle. This cycle is not arbitrary - it reflects fundamental truths about how the essences interact.",
    ],
    subsections: [
      {
        title: "Shadow Smothers Fire",
        content: [
          "Fire needs fuel and air. Shadow provides neither. In the spaces between shadows, there is no oxygen, no heat, no light to sustain a flame. Shadow magic creates zones of absolute darkness that extinguish flames on contact. The Emberheart Pact's greatest fear is not being outfought but being smothered - their fire stolen through the simple, terrifying act of removing the air it needs to breathe.",
        ],
      },
      {
        title: "Fire Burns Earth",
        content: [
          "The forests burn. The stone melts. Fire is the natural destroyer of the natural world. Earth's walls, no matter how thick, are made of materials that fire can consume. Ironwood burns at extreme temperatures. Granite melts in lava. The Roothold's oldest trees bear scorch marks from Emberheart raids - blackened wounds that never fully heal.",
        ],
      },
      {
        title: "Earth Swallows Light",
        content: [
          "Crystal is a mineral. It grows in the earth, from the earth, and can be reclaimed by it. The Bastion's druids can crack crystal formations by driving roots through their lattices. More fundamentally: light cannot penetrate earth. A wall of stone blocks radiance absolutely. The Roothold doesn't fight the light. It buries it.",
        ],
      },
      {
        title: "Light Purifies Shadow",
        content: [
          "Shadow is concealment. Light is revelation. In the presence of sufficient radiance, shadows cannot exist - they are burned away as light-essence annihilates shadow-essence on contact. Every Shadow operative who has fought in the Crystal Spires reports the same sensation: the feeling of being seen - truly, completely, inescapably seen - for the first time in their lives. Most describe it as the worst experience of their careers.",
        ],
      },
    ],
  },
  {
    id: "nature-of-conflict",
    volume: "THE ETERNAL WAR",
    volumeNum: 4,
    title: "The Nature of the Conflict",
    content: [
      "The Eternal War is not a single conflict but a web of constantly shifting skirmishes, raids, sieges, and battles fought across the Threshold - the liminal spaces between realms where the borders are thin enough to cross.",
      "The tribes do not have the strength to destroy one another. The essences that saturate their realms provide a home-field advantage that makes invasion nearly impossible. Instead, the war is fought through champions - elite warriors, mages, and operatives sent to contest the border zones.",
      "The war has lasted over a thousand years. No side has ever won. No side has ever stopped trying.",
    ],
  },

  // VOLUME V - LEGENDS AND SECRETS
  {
    id: "the-echoes",
    volume: "LEGENDS AND SECRETS",
    volumeNum: 5,
    title: "The Echoes",
    content: [
      "The two Echoes of Vaelkor wander the spaces between realms, appearing on battlefields seemingly at random. No tribe controls them. No binding ritual has held them. They are drawn to conflict - to the collision of elemental forces that echoes the moment of the Shattering.",
      "Vaelkor, the Hollow Crown, is destruction without direction. When he appears, everything around him dies - friend and foe alike. His ability, Dominion's End, is a recreation of the Shattering in miniature: a blast of void-energy that annihilates every card on the field.",
      "Vaelith, the Shattered Memory, does not destroy. She unmakes. Her presence causes the battlefield to glitch - cards swap positions, abilities trigger out of order, the rules themselves bend. Her ability, Fractured Timeline, steals a random card from the opponent's hand and adds it to the player's - a reflection of her desperate, futile attempts to reach across the barrier between her and her brother.",
    ],
  },
  {
    id: "the-void",
    volume: "LEGENDS AND SECRETS",
    volumeNum: 5,
    title: "The Void Between",
    content: [
      "Between the four realms lies the Void - the absence left when Aethara was torn apart. It is not empty space. It is not darkness. It is nothing - a place where the concepts of distance, direction, and time do not apply.",
      "The Void is the battlefield's neutral ground - the place where the Threshold crossings are located, where tribal advantages cancel each other, and where the Echoes of Vaelkor wander between appearances.",
      "There are scholars who believe the Void is not nothing but something - a fifth essence, born from the Shattering itself, an essence of absence that is slowly growing. If they are right, then the spaces between realms are not static. They are expanding. And one day, the nothingness will swallow everything the Shattering did not.",
    ],
  },

  // VOLUME VI - THE LANGUAGE OF WAR
  {
    id: "how-battles-work",
    volume: "THE LANGUAGE OF WAR",
    volumeNum: 6,
    title: "How Battles Work",
    content: [
      "The battles of The Shattered Dominion are not mass engagements between armies. They are ritualized combat between champions - elite warriors selected from each tribe's roster and sent to contest the border zones between realms.",
      "Each battle is overseen by a commander - the player - who selects a deck of twenty champions. The commander does not fight. They direct. They decide who deploys, when, and against whom. They manage the flow of energy, choose targets, and time their attacks.",
      "The battlefield is a contested zone at the border between two realms. Each commander has three slots on their side of the field, and three is the maximum number of champions that can fight simultaneously. When a champion falls, their slot opens for a replacement. When all three slots are empty and the commander's health reaches zero, the battle is lost.",
      "This structure reflects the nature of the Eternal War itself. The tribes cannot sustain total war. What they can do is send their best to fight their enemies' best, over and over, in an endless cycle of skirmishes.",
      "A thousand years of this. And no one is winning.",
    ],
  },
  {
    id: "tribal-advantage-battle",
    volume: "THE LANGUAGE OF WAR",
    volumeNum: 6,
    title: "The Tribal Advantage in Battle",
    content: [
      "When Shadow champions fight Fire champions, the ambient shadow-essence in the battlefield suppresses the flames - reducing Fire's power while amplifying Shadow's. This is not metaphorical. The essences interact physically, following the cycle: Shadow suppresses Fire. Fire overwhelms Earth. Earth blocks Light. Light purifies Shadow.",
      "A champion attacking an elementally disadvantaged opponent deals fifty percent more damage. A champion attacking an elementally advantaged opponent deals twenty-five percent less. These modifiers are consistent - they are laws of elemental physics, not advantages that can be trained away.",
      "This creates the central strategic tension: a commander who commits fully to one tribe maximizes their synergy but guarantees a vulnerability. A mono-Shadow deck is devastating against Fire but helpless against Light. A mixed deck is more flexible but weaker overall. The decision of how to build one's roster is the most important choice a commander makes - and it is made before the battle even begins.",
    ],
  },
];

export const epilogue = [
  "A thousand years after the Shattering, the four realms persist in uneasy equilibrium. The Obsidian Veil gathers secrets. The Radiant Sanctum tends its light. The Emberheart Pact feeds its flames. The Ironroot Bastion grows, and endures, and waits.",
  "The Eternal War continues. Champions fight and fall and are replaced by new champions - younger, hungrier, but fighting the same war over the same borders for the same reasons their grandparents did. The Echoes of Vaelkor still wander, drawn to conflict, unable to rest. The Void between realms still watches. The sacred trees of the Roothold still remember the world before.",
  "And somewhere, in the ruins at the center of what used to be Aethara, in the nothing-space where four realms meet and no essence holds dominion, the shattered fragments of the Primordial Throne lie scattered across a floor that doesn't exist.",
  "Waiting.",
  "For what, no one knows.",
  "But Vaelith reaches for them, in her loop, in her grief, in her endless attempt to undo what cannot be undone. And sometimes - just sometimes - the fragments glow.",
];

export const timelineAppendix: TimelineEntry[] = [
  { era: "The Formation", duration: "Unknown", events: "Aethara comes into existence. The four essences reach natural equilibrium. The Primordial Throne appears (origin unknown)." },
  { era: "The Long Balance", duration: "~4,000 years", events: "Unbroken line of Throne-sitters maintains elemental balance. Aethara is one unified civilization. Attunement is personal, not tribal." },
  { era: "The Reign of Vaelkor", duration: "31 years", events: "Vaelkor and Vaelith ascend to power. 30 years of stable rule. On the 31st year, Vaelkor attempts the ritual." },
  { era: "The Shattering", duration: "Instantaneous", events: "The ritual fails. Aethara splits into four realms. Millions die. Vaelkor and Vaelith are torn into Echoes." },
  { era: "The Fragmentation", duration: "~50 years", events: "Survivors reorganize. The four tribes form around their dominant essences. Borders crystallize. First skirmishes begin." },
  { era: "The Eternal War", duration: "~1,000 years", events: "Ongoing. No tribe has won. No tribe has stopped fighting. The Echoes wander. The Threshold remains crossable." },
  { era: "The Present Day", duration: "Now", events: "Commanders select champions and fight for control of border zones. The cycle continues." },
];

export const glossary: GlossaryEntry[] = [
  { term: "Aethara", definition: "The original, unified world that existed before the Shattering" },
  { term: "The Shattering", definition: "The cataclysm caused by Vaelkor's failed ritual that split Aethara into four elemental realms" },
  { term: "The Primordial Throne", definition: "The ancient structure that channeled and mediated the four elemental essences; origin unknown; now shattered" },
  { term: "The Long Balance", definition: "The ~4,000-year era of peace and unity under the Throne-sitters" },
  { term: "Essence", definition: "One of the four fundamental elemental forces: Shadow, Light, Fire, Earth" },
  { term: "Attunement", definition: "A person's natural affinity for one (rarely two or more) elemental essences" },
  { term: "The Threshold", definition: "The border zones between realms where the elemental barriers are thin enough to cross" },
  { term: "The Void", definition: "The nothingness between the four realms; may be a fifth essence or something else entirely" },
  { term: "Echo", definition: "A psychic remnant of a person destroyed at the Shattering's epicenter; specifically, Vaelkor and Vaelith" },
  { term: "The Umbral Depths", definition: "Shadow realm - eternal twilight, black glass spires, whispering fog" },
  { term: "The Crystal Spires", definition: "Light realm - perpetual golden radiance, floating crystal cathedrals" },
  { term: "The Cinderlands", definition: "Fire realm - volcanic wasteland, lava rivers, obsidian fortresses" },
  { term: "The Roothold", definition: "Earth realm - primordial forest, mountain-sized trees, living stone" },
  { term: "The Obsidian Veil", definition: "Shadow tribe - assassins, spies, shadow mages" },
  { term: "The Radiant Sanctum", definition: "Light tribe - paladins, healers, crystal mages" },
  { term: "The Emberheart Pact", definition: "Fire tribe - blood mages, berserkers, fire shamans" },
  { term: "The Ironroot Bastion", definition: "Earth tribe - druids, stone golems, root wardens" },
  { term: "Nocturn", definition: "Largest spire-city of the Umbral Depths; de facto capital of the Obsidian Veil" },
  { term: "The Trial of the Burning Heart", definition: "Volcanic ritual of the Emberheart Pact; survivors are reborn with fire immunity" },
  { term: "The Red Court", definition: "The Emberheart Pact's controversial institution of blood magic practitioners" },
  { term: "The Eternal Pyres", definition: "Sacred fires in the Cinderlands that have burned continuously since the Shattering" },
  { term: "Ironwood", definition: "The hardest timber in Aethara; found exclusively in the Roothold" },
  { term: "Champion", definition: "An elite warrior selected by a commander to fight in border-zone engagements" },
  { term: "Commander", definition: "The player; directs champions in battle but does not fight personally" },
];

export const tribeRosters: TribeRoster[] = [
  {
    tribe: "Obsidian Veil",
    element: "Shadow",
    color: "shadow",
    characters: [
      { name: "Sylas Dreadhollow", title: "Shadow Sovereign", role: "Current ruler. Rose from street urchin through assassination." },
      { name: "Lyra Voidstep", title: "Archmage of the Unseen", role: "Only mage to travel the Void and return sane." },
      { name: "Riven Ashenmask", title: "The Whispering Death", role: "Most decorated assassin. Disappeared for 3 years. Returned changed." },
      { name: "Thane Gloomveil", title: "Poison Master", role: "Cultivates living poisons in underground fungi caverns." },
      { name: "Mira Shadowlace", title: "Spymaster's Right Hand", role: "Runs the field intelligence network with agents in all tribes." },
      { name: "Dusk Fadewalker", title: "Border Patrol", role: "Body fading from years walking between Shadow and hostile lands." },
      { name: "Kael Nightwhisper", title: "Shadow Blade", role: "Orphan raised by the intelligence network. Voice damaged by an attack." },
      { name: "Nyx Hollowshade", title: "Forward Scout", role: "Born in deepest level of the Depths. Perfect dark vision." },
      { name: "Vex Inkfinger", title: "Forger", role: "Supplies the front lines with forged documents and stolen blueprints." },
      { name: "Shade Vellum", title: "Shadow Mage Student", role: "Young, talented, crude but effective shadow manipulation." },
      { name: "Whisper", title: "Informant (Title)", role: "Not one person - a shared identity passed between informants." },
      { name: "Graves Thornwick", title: "Mercenary", role: "Fights for money. Missing two fingers and half an ear." },
      { name: "Sable Driftmere", title: "Courier", role: "Carries messages through hostile territories at extreme risk." },
    ],
  },
  {
    tribe: "Radiant Sanctum",
    element: "Light",
    color: "light",
    characters: [
      { name: "Aurelia Dawnspire", title: "Archon of the Crystal Throne", role: "Queen and high priestess for 300 years. Living shard of old radiance." },
      { name: "Orin Crystalward", title: "Grand Sentinel", role: "40 years guarding the gates. 1,000+ scars carved into armor." },
      { name: "Celestine Brightvow", title: "High Priestess", role: "Can resurrect the fallen through concentrated radiance." },
      { name: "Aldric Shieldborne", title: "Knight-Artificer", role: "Blacksmith's son who forged his own crystal armor from sacred quarry." },
      { name: "Sera Lightweaver", title: "Luminarch Mender", role: "Saved 1,000+ lives. Weaves solidified light into wounds." },
      { name: "Dorian Prismblade", title: "Knight-Commander", role: "Leads the Refracted Order. Wields a blade of refracted light." },
      { name: "Elara Dawnpetal", title: "Youngest Acolyte", role: "Entered priesthood at 14. Tends the sacred light-gardens." },
      { name: "Tomas Gleamheart", title: "Crystal Guardsman", role: "Not strong, fast, or smart. Just always there when it matters." },
      { name: "Miriel Sunstitch", title: "Field Medic", role: "Carries light-infused bandages. Heals under fire." },
      { name: "Bram Crystaleye", title: "Watcher", role: "Enhanced sight sees threats days before arrival. Often ignored." },
      { name: "Lenna Hallowed", title: "Candle Bearer", role: "Carries the Hallowed Candle - a spark of undivided light from before the Shattering." },
      { name: "Fenric Stoneclad", title: "Wall Guard", role: "Not clever or flashy. Just stands at the wall and doesn't break." },
      { name: "Ivy Luminara", title: "Archivist", role: "Records all history in crystal tablets. Joined battle to document, not fight." },
    ],
  },
  {
    tribe: "Emberheart Pact",
    element: "Fire",
    color: "fire",
    characters: [
      { name: "Pyraxis the Unburnt", title: "Warlord", role: "Common soldier transformed by the Trial of the Burning Heart." },
      { name: "Crimson Morrigan", title: "Blood Witch", role: "Most powerful (and feared) blood magic practitioner in the Pact." },
      { name: "Volkar Cinderfist", title: "Pit Champion", role: "Undefeated in 200 lava-pit fights. Pain is his weapon." },
      { name: "Ember Ashvale", title: "Pyromancer Adept", role: "Precision fire-shaper. Surgical burns, not wild fireballs." },
      { name: "Scald Blackthorn", title: "Berserker", role: "Fights in war paint and fury. Gets stronger the more you hurt him." },
      { name: "Ashara Flameveil", title: "Fire Shaman", role: "Communes with ancient fire spirits. Believes death is transformation." },
      { name: "Cinder Voss", title: "Flame Acolyte", role: "Accidentally discovered pyromantic abilities. Still learning control." },
      { name: "Brand Scorchmark", title: "Ember Scout", role: "Runs ahead of the army setting fires. Has died twice." },
      { name: "Flint Ironblaze", title: "Pyre Keeper", role: "Maintains the Eternal Pyres. Quiet, methodical, devoted." },
      { name: "Sear Moltenhand", title: "Raider", role: "Hands permanently superheated from 20 years of mining volcanic ore." },
      { name: "Char Duskfire", title: "Ashwalker", role: "Body permanently radiates heat. Lonely off the battlefield." },
      { name: "Kindle Wraithburn", title: "Blood Initiate", role: "Youngest Red Court student. Red veins spreading across his skin." },
      { name: "Blaze Hearthcoal", title: "Militia", role: "Common soldier. Fights for his family, not the Pact." },
    ],
  },
  {
    tribe: "Ironroot Bastion",
    element: "Earth",
    color: "earth",
    characters: [
      { name: "Thornwall the Ancient", title: "Warden-King", role: "Sentient tree, 1,000+ years old. Pre-dates the Shattering." },
      { name: "Gorath Stonehide", title: "The Immovable", role: "Stone golem. Doesn't eat, sleep, speak, or think. Just endures." },
      { name: "Willow Deeproot", title: "Archdruid", role: "Highest-ranking druid. The forest fights for her." },
      { name: "Barric Ironbark", title: "Root Warden Commander", role: "Ironwood bark armor. 20 years, no position lost." },
      { name: "Moss Cragborn", title: "Beast Tamer", role: "Raised among megafauna. Communicates better with animals than people." },
      { name: "Petra Stoneweave", title: "Stone-Shaper", role: "Molds granite with bare hands. Taught by the mountain itself." },
      { name: "Root Taldris", title: "Seedling Guard", role: "Part human, part plant. Stands in the way. That's the point." },
      { name: "Bramble Thickbough", title: "Thorn Militia", role: "Wears living thornbush armor. Regrets volunteering." },
      { name: "Clay Mossfoot", title: "Forager", role: "Knows every root, herb, and path. Fights to defend the forest." },
      { name: "Fern Willowbend", title: "Apprentice Druid", role: "Connection to earth is genuine but weak. Shows up anyway." },
      { name: "Pebble Cragson", title: "Earth Spirit", role: "Tiny bundle of rocks and good intentions. Scared but brave." },
      { name: "Oakley Deepstride", title: "Ironwood Logger", role: "30 years cutting the hardest timber in Aethara. Same swing, new targets." },
      { name: "Sage Mossmantle", title: "Grove Keeper", role: "Tends trees that remember the world before the Shattering." },
    ],
  },
  {
    tribe: "Echoes of Vaelkor",
    element: "Mythic",
    color: "mythic",
    characters: [
      { name: "Vaelkor, the Hollow Crown", title: "Echo of Wrath", role: "Remnant of the king's rage. Destroys everything." },
      { name: "Vaelith, the Shattered Memory", title: "Echo of Grief", role: "Remnant of the twin sister. Disrupts reality. Tries endlessly to undo the Shattering." },
    ],
  },
];
