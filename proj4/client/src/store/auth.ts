import axios from 'axios';
import { Store } from '@/store/index';

export class Auth
{
  store =
    {
      token: false,
      login: async (username: string, password: string) =>
      {
        try
        {
          await axios.post(`tokens`,
          {
            username,
            password
          });

          Store.setupSockets();
          this.store.token = true;
          return true;
        }
        catch (err)
        {
          if (!err.response)
          {
            console.log(err);
          }

          return false;
        }
      },
      signup: async (username: string, password: string) =>
      {

        let res = await axios.post(`players`,
          {
            username,
            password
          });

        if (res.status == 200)
        {
          return await this.store.login(username, password);
        }

        return false;
      },
      logout: async () =>
      {
        try
        {
          await axios.delete(`tokens`);

          return true;
        }
        catch
        {
          return false;
        }
      },
      reset: async() =>
      {

      }
    };

  constructor ()
  {
    this.store.token = /token/.test(document.cookie);
  }


}