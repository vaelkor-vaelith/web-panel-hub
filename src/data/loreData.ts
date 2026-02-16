import realmUmbral from "@/assets/realm-umbral.jpg";
import realmCrystal from "@/assets/realm-crystal.jpg";
import realmCinder from "@/assets/realm-cinder.jpg";
import realmRoothold from "@/assets/realm-roothold.jpg";

export interface TimelineEvent {
  era: string;
  title: string;
  text: string;
  marker: string;
}

export interface RealmData {
  name: string;
  tribe: string;
  tagline: string;
  desc: string;
  image: string;
  color: string;
  cssColor: string;
}

export const timeline: TimelineEvent[] = [
  {
    era: "THE FORMATION",
    title: "AETHARA UNDIVIDED",
    text: "A single, whole world sustained by four elemental essences - Shadow, Light, Fire, and Earth - flowing through its bedrock like blood through veins. They existed in equilibrium: where Shadow pooled too deep, Light pushed it back. Where Fire raged too hot, Earth smothered it. The cycle was natural, self-correcting, and eternal.",
    marker: "◆",
  },
  {
    era: "THE LONG BALANCE",
    title: "THE PRIMORDIAL THRONE",
    text: "At Aethara's center stood the Throne - a structure of unknown origin that channeled the four essences through whoever sat upon it. Not to control them, but to mediate. For over four thousand years, an unbroken line of Throne-sitters maintained the balance. Attunement was personal, not tribal. A family might have a shadow-attuned parent and a fire-attuned child. There was no war. There was only the Long Balance.",
    marker: "⬡",
  },
  {
    era: "THE 31ST YEAR",
    title: "THE LAST KING",
    text: "Vaelkor was born attuned to all four essences - a condition so rare it had no name. His twin sister Vaelith shared this gift. For thirty years he ruled wisely, with Vaelith as his conscience. But the essences whispered through the Throne: Shadow promised secrets, Light told him he was chosen, Fire burned with hunger for more, and Earth said his rule should last forever. On the thirty-first year, he stopped listening to his sister.",
    marker: "♛",
  },
  {
    era: "THE CATACLYSM",
    title: "THE SHATTERING",
    text: "Vaelkor attempted to absorb all four essences - to become a god. Vaelith discovered the ritual and ran to stop him. She was too late. The essences did not merge. They repelled - violently, catastrophically, instantaneously. Aethara did not break like glass. It divided like a cell, pulling apart into four fragments. Millions died. Cities were bisected. Families were split. The world ended in a single heartbeat.",
    marker: "✦",
  },
  {
    era: "THE AFTERMATH",
    title: "THE ECHOES",
    text: "Vaelkor's soul fractured into wrath - a hollow suit of screaming armor that remembers only that the world was his and someone took it. Vaelith, who only tried to save him, was torn into grief - a shimmering figure of broken time, endlessly reliving the Shattering, endlessly reaching for a brother who is no longer a man. The common people believe she was his queen. Only the sacred trees of the Roothold remember the truth: she was his twin. His conscience. The last voice that tried to save the world.",
    marker: "◈",
  },
  {
    era: "THE PRESENT",
    title: "THE ETERNAL WAR",
    text: "A thousand years later, four tribes wage war over the shattered Throne. The Veil would dismantle it for secrets. The Sanctum would rebuild it to restore order. The Pact believes a stronger vessel could succeed where Vaelkor failed. The Bastion doesn't want the Throne - they just can't let anyone else have it. No side has ever won. No side has ever stopped trying. And somewhere in the nothing-space where four realms meet, the fragments of the Throne still glow.",
    marker: "X",
  },
];

export const twinsStory = {
  intro: "Before the breaking, they were two halves of one whole. He felt the essences as power - a roaring symphony. She felt them as awareness - surgical precision. He sat the Throne. She stood beside him and whispered when the balance began to drift.",
  vaelkor: {
    name: "Vaelkor, the Hollow Crown",
    subtitle: "Echo of Wrath",
    desc: "His rage - his ambition, his hunger, his fury at a world that dared resist his will - condensed into a spectral figure. A hollow suit of ancient armor filled with screaming void-energy. He does not fight for any side. He does not remember sides. He only knows that the world was his, and someone took it away, and for that, everything must burn.",
    quote: "I had a kingdom. I had a name. Now I have only this: the end of everything.",
  },
  vaelith: {
    name: "Vaelith, the Shattered Memory",
    subtitle: "Echo of Grief",
    desc: "Her consciousness survived as a shimmering figure of fractured light and broken time, endlessly reliving the moment of the Shattering, endlessly trying to undo it. She does not speak coherently. She apologizes, over and over, for something no one else can see. She reaches for her brother - and her hands pass through him every time.",
    quote: "He broke the world to become a god. I am what his guilt left behind.",
  },
  closing: "The popular legend says she was his queen - a wife sacrificed in his mad ritual. Only the oldest scholars know the truth. She was his twin. His advisor. His conscience. The last voice that tried to save the world, and failed.",
};

export const realms: RealmData[] = [
  {
    name: "The Umbral Depths",
    tribe: "Obsidian Veil",
    tagline: "Eternal twilight. Black glass spires. Whispering fog.",
    desc: "A realm of permanent twilight where the sun never reaches. The terrain is vertical - towers of black glass jut upward from fog-shrouded depths, connected by bridges and catwalks. Cities are carved into obsidian spires. The fog that blankets the lower levels is condensed shadow-essence, and it whispers to those who walk through it. Privacy is sacred. Names are tools, not identities. Trust is earned through results, not words.",
    image: realmUmbral,
    color: "shadow",
    cssColor: "hsl(270, 40%, 50%)",
  },
  {
    name: "The Crystal Spires",
    tribe: "Radiant Sanctum",
    tagline: "Perpetual golden radiance. Floating crystal cathedrals.",
    desc: "Crystal formations grew without restraint into towering cathedrals that float above the ground, suspended by light. There is no night. Waterfalls of luminous energy cascade from the highest formations. The crystal is alive - it grows, responds to touch, and sings when struck. The structures respond to emotional harmony, growing brighter when the people within are at peace. Order, duty, and selflessness are not merely values - they are architecturally enforced.",
    image: realmCrystal,
    color: "light",
    cssColor: "hsl(45, 50%, 60%)",
  },
  {
    name: "The Cinderlands",
    tribe: "Emberheart Pact",
    tagline: "Volcanic wasteland. Lava rivers. Obsidian fortresses.",
    desc: "A wasteland of active volcanoes, rivers of lava, and black-stone fortresses on islands of cooled rock surrounded by molten seas. The sky is orange-gray, choked with ash. Nothing grows here that does not first prove it can survive being burned. Pain is currency. Scars are status symbols. The Cinderlands breed a fierce, resilient people who see their environment not as a curse but as a forge. It burns away weakness. What survives is strong.",
    image: realmCinder,
    color: "fire",
    cssColor: "hsl(10, 55%, 50%)",
  },
  {
    name: "The Roothold",
    tribe: "Ironroot Bastion",
    tagline: "Mountain-sized trees. Living stone. Primordial patience.",
    desc: "The great forests became a single organism - a continent-wide network of roots, trunks, and canopies that grew into a living cathedral. The oldest trees are mountains. The ground shifts. Paths that existed yesterday may be overgrown today. Rivers reroute when the roots move. Stone itself is animate. The Roothold does not have a government - it has a forest. It was old when the other realms were born. It will be here when they are dust.",
    image: realmRoothold,
    color: "earth",
    cssColor: "hsl(140, 35%, 42%)",
  },
];
