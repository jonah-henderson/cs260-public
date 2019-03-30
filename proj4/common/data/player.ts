export interface IPlayer
{
  username: string,
  displayName: string,
  pwHash: string, // not available on the client
  tokens: string[]  // not available on the client
}