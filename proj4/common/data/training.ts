import { Stat } from './spirit';

export interface ITraining
{
  id: string,
  display: string
  stat: Stat,
  baseAmount: number
  baseTime: number
  baseCost: number
}

export const trainings: { [id: string]: ITraining } =
{
  basicPower:
  {
    id: 'basicPower',
    display: 'Strike Drill',
    stat: Stat.Power,
    baseAmount: 5,
    baseTime: 60,
    baseCost: 1
  },

  basicSkill:
  {
    id: 'basicSkill',
    display: 'Meditate',
    stat: Stat.Skill,
    baseAmount: 5,
    baseTime: 60,
    baseCost: 1,
  },

  basicEndurance:
  {
    id: 'basicEndurance',
    display: 'Rock Lift',
    stat: Stat.Endurance,
    baseAmount: 5,
    baseTime: 60,
    baseCost: 1
  },

  basicLife:
  {
    id: 'basicLife',
    display: 'Forage',
    stat: Stat.Life,
    baseAmount: 5,
    baseTime: 60,
    baseCost: 1
  }
};
