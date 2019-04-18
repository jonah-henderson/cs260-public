import { Auth } from '@/store/auth';
import { Spirit } from '@/store/spirit';
import { Sparring } from '@/store/sparring';

export class Store
{
  private static store =
  {
    auth: new Auth(),
    spirit: new Spirit(),
    sparring: new Sparring()
  };

  static get auth()
  {
    return this.store.auth.store;
  }

  static get spirit()
  {
    return this.store.spirit;
  }

  static get sparring()
  {
    return this.store.sparring;
  }

  static reset()
  {
    this.auth.reset();
    this.spirit.reset();
    this.sparring.reset();
  }

  static setupSockets()
  {
    this.spirit.setupSocket();
    this.sparring.setupSocket();
  }
}