import mongoose from 'mongoose';

const charSchema = mongoose.Schema({
 name:{
    type: String,
    required: true
 },
 raceType: {
   type: String,
   required: true
 },
 classType: {
   type: String,
   required: true
 },
 level: {
   type: Number,
   max: 20,
   required: true
 },
 proficiencyBonus: {
   type: Number,
   required: true
 },
 healthPoints: {
   type: Number,
   required: false
 },
 speed: {
   type: Number,
   required: false
 },
 armourClass: {
   type: Number,
   required: false
 },
 alignment: {
   type: String,
   required: false
 },
 background: {
   type: String,
   required: false
 },
 languages: {
   type: [String],
   required: false
 },
abilityScores: {
  strength: {
    type: Number,
    max: 20
  },
  dexterity: {
    type: Number,
    max: 20
  },
  constitution: {
    type: Number,
    max: 20
  },
  intelligence: {
    type: Number,
    max: 20
  },
  wisdom: {
    type: Number,
    max: 20
  },
  charisma: {
    type: Number,
    max: 20
  }
},
skillScores: {
  Athletics: {
    type: Number,
    max: 20
  },
  Acrobatics: {
    type: Number,
    max: 20
  },
  SleightofHand: {
    type: Number,
    max: 20
  },
  Stealth: {
    type: Number,
    max: 20
  },
  Perception: {
    type: Number,
    max: 20
  },
  Insight: {
    type: Number,
    max: 20
  },
  Investigation: {
    type: Number,
    max: 20
  },
  Medicine: {
    type: Number,
    max: 20
  },
  AnimalHandling: {
    type: Number,
    max: 20
  },
  Deception: {
    type: Number,
    max: 20
  },
  Intimidation: {
    type: Number,
    max: 20
  },
  Performance: {
    type: Number,
    max: 20
  },
  Persuasion: {
    type: Number,
    max: 20
  },
  History: {
    type: Number,
    max: 20
  },
  Arcana: {
    type: Number,
    max: 20
  },
  Religion: {
    type: Number,
    max: 20
  },
  Survival: {
    type: Number,
    max: 20
  },
  Nature: {
    type: Number,
    max: 20
  }
},
});

charSchema.set('timestamps', true);

export const charSheet = mongoose.model('CharSheet', charSchema);