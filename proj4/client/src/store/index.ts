import { Auth } from '@/store/auth';
import { Spirit } from '@/store/spirit';
import { SparringMatch } from '@/store/sparringMatch';

export class Store
{
  private static store =
  {
    auth: new Auth(),
    spirit: new Spirit(),
    sparringMatch: new SparringMatch()
  };

  static get auth()
  {
    return this.store.auth.store;
  }

  static get spirit()
  {
    return this.store.spirit;
  }

  static get sparringMatch()
  {
    return this.store.sparringMatch;
  }

  static reset()
  {
    this.auth.reset();
    this.spirit.reset();
    this.sparringMatch.reset();
  }
}