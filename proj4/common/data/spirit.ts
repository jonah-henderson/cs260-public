export enum Element
{
  Neutral,
  Light,
  Fire,
  Water,
  Wind,
  Dark
}

export enum Class
{
  Power = "Power",
  Skill = "Skill",
  Endurance = "Endurance",
  Life = "Life"
}

export enum Stat
{
  Power = "power",
  Skill = "skill",
  Endurance = "endurance",
  Life = "life"
}

export interface ISpirit
{
  _id: any,
  name: string,
  created: Date,
  stats: {
    power: number,
    skill: number,
    endurance: number,
    life: number
  },
  player: any,
  level: number,
  element: Element,
  class: Class[],
  energy: number,
  status: string,
  active: boolean
  sparring: {
    wins: number,
    draws: number,
    losses: number
  }
}

export const classNames =
{

  // Tier 1
  "Power":      "Fighter",
  "Skill":      "Invoker",
  "Endurance":  "Defender",
  "Life":       "Healer",

  // Tier 2
  "PowerPower":     "Champion",
  "PowerSkill":     "Spellsword",
  "PowerEndurance": "Juggernaut",
  "PowerLife":      "Retaliator",

  "SkillSkill":     "Sorcerer",
  "SkillEndurance": "Sieger",
  "SkillLife":      "Joker",

  "EnduranceEndurance": "Adamant",
  "EnduranceLife":      "Guardian",

  "LifeLife": "Renewer",

  // Tier 3
  "PowerPowerPower":          "Reaper",
  "PowerPowerSkill":          "Fellblade",
  "PowerPowerEndurance":      "Vanguard",
  "PowerPowerLife":           "Avenger",
  "PowerSkillSkill":          "Condemner",
  "PowerSkillEndurance":      "General",
  "PowerSkillLife":           "Wyrd",
  "PowerEnduranceEndurance":  "Dreadnought",
  "PowerEnduranceLife":       "Phalanx",
  "PowerLifeLife":            "Inevitable",

  "SkillSkillSkill":          "Archmage",
  "SkillSkillEndurance":      "Nullifier",
  "SkillSkillLife":           "Nightmare",
  "SkillEnduranceEndurance":  "Debilitator",
  "SkillEnduranceLife":       "Jester",
  "SkillLifeLife":            "Dispiriter",

  "EnduranceEnduranceEndurance":  "Invincible",
  "EnduranceEnduranceLife":       "Rectifier",
  "EnduranceLifeLife":            "Venerated",

  "LifeLifeLife": "Resurrector"
};