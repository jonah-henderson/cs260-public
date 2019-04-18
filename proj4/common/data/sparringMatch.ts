export interface ISparringMatch
{
  _id: any,
  contestant1Id: string,
  contestant2Id: string,
  contestant1PendingMove: string | null,
  contestant2PendingMove: string | null,
  contestant1Stats: BattleStats,
  contestant2Stats: BattleStats,
  status: MatchStatus,
  victor: string | null
}

export interface BattleStats
{
  atk: number,
  def: number,
  hp:  number,
  skill: number
}

export interface Move
{
  id: string,
  display: string,
  type: MoveType
}

export enum MoveType
{
  Attack = "attack",
  Boost = "boost",
  Brace = "brace",
  Heal = "heal"
}

export enum MatchStatus
{
  Pending = "pending",
  Concluded = "concluded",
  Forfeited = "forfeited"
}

export const defaultMoves: {[key: string]: Move} =
{
  "attack": {id: "attack", display: "Attack", type: MoveType.Attack},
  "brace": {id: "brace", display: "Brace", type: MoveType.Brace},
  "boost": {id: "boost", display: "Boost", type: MoveType.Boost},
  "heal": {id: "heal", display: "Heal", type: MoveType.Heal}
};

export const advancedMoves =
{
};