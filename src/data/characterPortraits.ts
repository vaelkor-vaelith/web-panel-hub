// Character name → card image path mapping for inline portraits in the lorebook

// Cards directory imports
import aldricImg from "@/assets/cards/aldric-shieldborne.jpg";
import asharaImg from "@/assets/cards/ashara-flameveil.jpg";
import barricImg from "@/assets/cards/barric-ironbark.jpg";
import blazeImg from "@/assets/cards/blaze-hearthcoal.jpg";
import bramImg from "@/assets/cards/bram-crystaleye.jpg";
import brambleImg from "@/assets/cards/bramble-thickbough.jpg";
import brandImg from "@/assets/cards/brand-scorchmark.jpg";
import celestineImg from "@/assets/cards/celestine-brightvow.jpg";
import charImg from "@/assets/cards/char-duskfire.jpg";
import cinderImg from "@/assets/cards/cinder-voss.jpg";
import clayImg from "@/assets/cards/clay-mossfoot.jpg";
import crimsonImg from "@/assets/cards/crimson-morrigan.jpg";
import dorianImg from "@/assets/cards/dorian-prismblade.jpg";
import duskImg from "@/assets/cards/dusk-fadewalker.jpg";
import elaraImg from "@/assets/cards/elara-dawnpetal.jpg";
import emberImg from "@/assets/cards/ember-ashvale.jpg";
import fenricImg from "@/assets/cards/fenric-stoneclad.jpg";
import fernImg from "@/assets/cards/fern-willowbend.jpg";
import flintImg from "@/assets/cards/flint-ironblaze.jpg";
import gorathImg from "@/assets/cards/gorath-stonehide.jpg";
import gravesImg from "@/assets/cards/graves-thornwick.jpg";
import ivyImg from "@/assets/cards/ivy-luminara.jpg";
import kaelImg from "@/assets/cards/kael-nightwhisper.jpg";
import kindleImg from "@/assets/cards/kindle-wraithburn.jpg";
import lennaImg from "@/assets/cards/lenna-hallowed.jpg";
import lyraImg from "@/assets/cards/lyra-voidstep.jpg";
import miraImg from "@/assets/cards/mira-shadowlace.jpg";
import mirielImg from "@/assets/cards/miriel-sunstitch.jpg";
import mossImg from "@/assets/cards/moss-cragborn.jpg";
import nyxImg from "@/assets/cards/nyx-hollowshade.jpg";
import oakleyImg from "@/assets/cards/oakley-deepstride.jpg";
import orinImg from "@/assets/cards/orin-crystalward.jpg";
import pebbleImg from "@/assets/cards/pebble-cragson.jpg";
import petraImg from "@/assets/cards/petra-stoneweave.jpg";
import pyraxisImg from "@/assets/cards/pyraxis-unburnt.jpg";
import rivenImg from "@/assets/cards/riven-ashenmask.jpg";
import rootImg from "@/assets/cards/root-taldris.jpg";
import sableImg from "@/assets/cards/sable-driftmere.jpg";
import sageImg from "@/assets/cards/sage-mossmantle.jpg";
import scaldImg from "@/assets/cards/scald-blackthorn.jpg";
import searImg from "@/assets/cards/sear-moltenhand.jpg";
import seraImg from "@/assets/cards/sera-lightweaver.jpg";
import shadeImg from "@/assets/cards/shade-vellum.jpg";
import thaneImg from "@/assets/cards/thane-gloomveil.jpg";
import thornwallImg from "@/assets/cards/thornwall-ancient.jpg";
import tomasImg from "@/assets/cards/tomas-gleamheart.jpg";
import vaelithImg from "@/assets/cards/vaelith-shattered-memory.jpg";
import vexImg from "@/assets/cards/vex-inkfinger.jpg";
import volkarImg from "@/assets/cards/volkar-cinderfist.jpg";
import whisperImg from "@/assets/cards/whisper.jpg";
import willowImg from "@/assets/cards/willow-deeproot.jpg";

// Top-level assets
import sylasImg from "@/assets/sylas-dreadhollow.jpg";
import vaelkorImg from "@/assets/vaelkor-hollow-crown.jpg";
import aureliaImg from "@/assets/aurelia-dawnspire.jpg";

export interface CharacterPortrait {
  name: string;
  image: string;
  tribe: string;
}

// Map character names (as they appear in text) to their portrait data
export const characterPortraits: Record<string, CharacterPortrait> = {
  "Sylas Dreadhollow": { name: "Sylas Dreadhollow", image: sylasImg, tribe: "shadow" },
  "Lyra Voidstep": { name: "Lyra Voidstep", image: lyraImg, tribe: "shadow" },
  "Riven Ashenmask": { name: "Riven Ashenmask", image: rivenImg, tribe: "shadow" },
  "Thane Gloomveil": { name: "Thane Gloomveil", image: thaneImg, tribe: "shadow" },
  "Mira Shadowlace": { name: "Mira Shadowlace", image: miraImg, tribe: "shadow" },
  "Dusk Fadewalker": { name: "Dusk Fadewalker", image: duskImg, tribe: "shadow" },
  "Kael Nightwhisper": { name: "Kael Nightwhisper", image: kaelImg, tribe: "shadow" },
  "Nyx Hollowshade": { name: "Nyx Hollowshade", image: nyxImg, tribe: "shadow" },
  "Vex Inkfinger": { name: "Vex Inkfinger", image: vexImg, tribe: "shadow" },
  "Shade Vellum": { name: "Shade Vellum", image: shadeImg, tribe: "shadow" },
  "Graves Thornwick": { name: "Graves Thornwick", image: gravesImg, tribe: "shadow" },
  "Sable Driftmere": { name: "Sable Driftmere", image: sableImg, tribe: "shadow" },

  "Aurelia Dawnspire": { name: "Aurelia Dawnspire", image: aureliaImg, tribe: "light" },
  "Orin Crystalward": { name: "Orin Crystalward", image: orinImg, tribe: "light" },
  "Celestine Brightvow": { name: "Celestine Brightvow", image: celestineImg, tribe: "light" },
  "Aldric Shieldborne": { name: "Aldric Shieldborne", image: aldricImg, tribe: "light" },
  "Sera Lightweaver": { name: "Sera Lightweaver", image: seraImg, tribe: "light" },
  "Dorian Prismblade": { name: "Dorian Prismblade", image: dorianImg, tribe: "light" },
  "Elara Dawnpetal": { name: "Elara Dawnpetal", image: elaraImg, tribe: "light" },
  "Tomas Gleamheart": { name: "Tomas Gleamheart", image: tomasImg, tribe: "light" },
  "Miriel Sunstitch": { name: "Miriel Sunstitch", image: mirielImg, tribe: "light" },
  "Bram Crystaleye": { name: "Bram Crystaleye", image: bramImg, tribe: "light" },
  "Lenna Hallowed": { name: "Lenna Hallowed", image: lennaImg, tribe: "light" },
  "Fenric Stoneclad": { name: "Fenric Stoneclad", image: fenricImg, tribe: "light" },
  "Ivy Luminara": { name: "Ivy Luminara", image: ivyImg, tribe: "light" },

  "Pyraxis": { name: "Pyraxis the Unburnt", image: pyraxisImg, tribe: "fire" },
  "Pyraxis the Unburnt": { name: "Pyraxis the Unburnt", image: pyraxisImg, tribe: "fire" },
  "Crimson Morrigan": { name: "Crimson Morrigan", image: crimsonImg, tribe: "fire" },
  "Volkar Cinderfist": { name: "Volkar Cinderfist", image: volkarImg, tribe: "fire" },
  "Ember Ashvale": { name: "Ember Ashvale", image: emberImg, tribe: "fire" },
  "Scald Blackthorn": { name: "Scald Blackthorn", image: scaldImg, tribe: "fire" },
  "Ashara Flameveil": { name: "Ashara Flameveil", image: asharaImg, tribe: "fire" },
  "Cinder Voss": { name: "Cinder Voss", image: cinderImg, tribe: "fire" },
  "Brand Scorchmark": { name: "Brand Scorchmark", image: brandImg, tribe: "fire" },
  "Flint Ironblaze": { name: "Flint Ironblaze", image: flintImg, tribe: "fire" },
  "Sear Moltenhand": { name: "Sear Moltenhand", image: searImg, tribe: "fire" },
  "Char Duskfire": { name: "Char Duskfire", image: charImg, tribe: "fire" },
  "Kindle Wraithburn": { name: "Kindle Wraithburn", image: kindleImg, tribe: "fire" },
  "Blaze Hearthcoal": { name: "Blaze Hearthcoal", image: blazeImg, tribe: "fire" },

  "Thornwall the Ancient": { name: "Thornwall the Ancient", image: thornwallImg, tribe: "earth" },
  "Thornwall": { name: "Thornwall the Ancient", image: thornwallImg, tribe: "earth" },
  "Gorath Stonehide": { name: "Gorath Stonehide", image: gorathImg, tribe: "earth" },
  "Willow Deeproot": { name: "Willow Deeproot", image: willowImg, tribe: "earth" },
  "Barric Ironbark": { name: "Barric Ironbark", image: barricImg, tribe: "earth" },
  "Moss Cragborn": { name: "Moss Cragborn", image: mossImg, tribe: "earth" },
  "Petra Stoneweave": { name: "Petra Stoneweave", image: petraImg, tribe: "earth" },
  "Root Taldris": { name: "Root Taldris", image: rootImg, tribe: "earth" },
  "Bramble Thickbough": { name: "Bramble Thickbough", image: brambleImg, tribe: "earth" },
  "Clay Mossfoot": { name: "Clay Mossfoot", image: clayImg, tribe: "earth" },
  "Fern Willowbend": { name: "Fern Willowbend", image: fernImg, tribe: "earth" },
  "Pebble Cragson": { name: "Pebble Cragson", image: pebbleImg, tribe: "earth" },
  "Oakley Deepstride": { name: "Oakley Deepstride", image: oakleyImg, tribe: "earth" },
  "Sage Mossmantle": { name: "Sage Mossmantle", image: sageImg, tribe: "earth" },

  "Vaelkor": { name: "Vaelkor, the Hollow Crown", image: vaelkorImg, tribe: "mythic" },
  "Vaelith": { name: "Vaelith, the Shattered Memory", image: vaelithImg, tribe: "mythic" },
};

// Returns all character names found in a text paragraph, sorted by position
export function findCharacterMentions(text: string): CharacterPortrait[] {
  const found: { portrait: CharacterPortrait; index: number }[] = [];
  const seen = new Set<string>();

  for (const [name, portrait] of Object.entries(characterPortraits)) {
    const idx = text.indexOf(name);
    if (idx !== -1 && !seen.has(portrait.name)) {
      seen.add(portrait.name);
      found.push({ portrait, index: idx });
    }
  }

  found.sort((a, b) => a.index - b.index);
  return found.map((f) => f.portrait);
}
