/* Serengeti trip birds, in the order seen.
   Each bird: [common name, scientific name, family, eBird species code, day seen, optional note]
   (names/codes checked against the eBird taxonomy)

   Optional extras by common name, in BIRD_EXTRAS below:
     photo   : "img/birds/silverbird.jpg"   (your own photo; shown first in the carousel)
     credit  : "Photo: Bruno"               (shown under your photo)
     seen    : "Sep 16, near the lodge"     (overrides the default "Sep 16 · Serengeti")
*/
const PLACE = "Serengeti";
const YEAR = 2026;
const RAW_BIRDS = [
  // ---- Sep 16 ----
  ["African Gray Hornbill", "Lophoceros nasutus", "Hornbills", "afghor1", "Sep 16"],
  ["Silverbird", "Empidornis semipartitus", "Old World Flycatchers", "silver1", "Sep 16"],
  ["Red-cheeked Cordonbleu", "Uraeginthus bengalus", "Waxbills and Allies", "reccor", "Sep 16"],
  ["Amethyst Sunbird", "Chalcomitra amethystina", "Sunbirds and Spiderhunters", "amesun2", "Sep 16"],
  ["Kori Bustard", "Ardeotis kori", "Bustards", "korbus1", "Sep 16"],
  ["Dark Chanting-Goshawk", "Melierax metabates", "Hawks, Eagles, and Kites", "dacgos1", "Sep 16"],
  ["Magpie Shrike", "Urolestes melanoleucus", "Shrikes", "magshr1", "Sep 16"],
  // ---- Sep 17 ----
  ["Lappet-faced Vulture", "Torgos tracheliotos", "Hawks, Eagles, and Kites", "lafvul1", "Sep 17"],
  ["Gray-backed Fiscal", "Lanius excubitoroides", "Shrikes", "gybfis1", "Sep 17"],
  ["White-bellied Bustard", "Eupodotis senegalensis", "Bustards", "whbbus2", "Sep 17"],
  ["Red-and-yellow Barbet", "Trachyphonus erythrocephalus", "African Barbets", "raybar1", "Sep 17"],
  ["D'Arnaud's Barbet", "Trachyphonus darnaudii", "African Barbets", "darbar1", "Sep 17"],
  ["Spotted Eagle-Owl", "Bubo africanus", "Owls", "spoeao2", "Sep 17"],
  ["Fork-tailed Drongo", "Dicrurus adsimilis", "Drongos", "fotdro5", "Sep 17"],
  ["White-browed Coucal", "Centropus superciliosus", "Cuckoos", "whbcou2", "Sep 17"],
  ["Rufous-tailed Weaver", "Histurgops ruficauda", "Weavers and Allies", "rutwea1", "Sep 17"],
  ["African Gray Flycatcher", "Bradornis microrhynchus", "Old World Flycatchers", "afgfly1", "Sep 17"],
  ["Speckled Mousebird", "Colius striatus", "Mousebirds", "spemou2", "Sep 17"],
  ["White-browed Scrub-Robin", "Cercotrichas leucophrys", "Old World Flycatchers", "rbsrob1", "Sep 17"],
  ["Saddle-billed Stork", "Ephippiorhynchus senegalensis", "Storks", "sabsto1", "Sep 17"],
  ["Yellow-billed Stork", "Mycteria ibis", "Storks", "yebsto1", "Sep 17"],
  ["African Sacred Ibis", "Threskiornis aethiopicus", "Ibises and Spoonbills", "sacibi2", "Sep 17"],
  ["Fischer's Lovebird", "Agapornis fischeri", "Old World Parrots", "fislov1", "Sep 17"],
  ["Rüppell's Griffon", "Gyps rueppelli", "Hawks, Eagles, and Kites", "ruegri1", "Sep 17"],
  ["Lesser Flamingo", "Phoeniconaias minor", "Flamingos", "lesfla1", "Sep 17"],
  ["Greater Flamingo", "Phoenicopterus roseus", "Flamingos", "grefla3", "Sep 17"],
  ["Black-headed Heron", "Ardea melanocephala", "Herons, Egrets, and Bitterns", "blhher1", "Sep 17"],
  ["Red-billed Teal", "Anas erythrorhyncha", "Ducks, Geese, and Waterfowl", "rebduc1", "Sep 17", "Listed as Red-billed Duck in older guides."],
];

const BIRD_EXTRAS = {
  // "Silverbird": { photo: "img/birds/silverbird.jpg", credit: "Photo: Bruno" },
};

const BIRDS = RAW_BIRDS.map(([name, sci, family, code, day, note], i) => ({
  id: i + 1, name, sci, family, code, note: note || "", seen: `${day}, ${YEAR} \u00b7 ${PLACE}`,
  ...(BIRD_EXTRAS[name] || {}),
}));
