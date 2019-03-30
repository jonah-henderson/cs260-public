export interface ISparringMatch
{
  contestant1Id: string,
  contestant2Id: string,
  contestant1PendingMove: Move | null,
  contestant2PendingMove: Move | null,
  contestant1NextMove: Move | null,
  contestant2NextMove: Move | null,

  contestant1Stats:
  {
    atk: number,
    def: number,
    hp:  number
  },
  contestant2Stats:
  {
    atk: number,
    def: number,
    hp:  number
  },
  status: MatchStatus,
  victor: string | null
}

export enum Move
{
  Attack = "attack",
  Ensnare = "ensnare",
  Brace = "brace",
  Heal = "heal"
}

export enum MatchStatus
{
  Pending = "pending",
  Concluded = "concluded",
  Forfeited = "forfeited"
}