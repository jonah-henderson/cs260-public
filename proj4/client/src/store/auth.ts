import axios from 'axios';

export class Auth
{
  store =
    {
      token: '',
      login: async (username: string, password: string) =>
      {
        try
        {
          let res = await axios.post(`tokens`,
            {
              username,
              password
            });

          this.store.token = res.data;
          axios.defaults.headers.common = {'Authorization': `Bearer: ${this.store.token}`};
          localStorage.setItem('token', this.store.token);
          return true;
        } catch (err)
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
        let res = await axios.delete(`tokens/${this.store.token}`);

        if (res.status === 200)
        {
          this.store.token = '';
          localStorage.removeItem('token');
          return true;
        }

        return false;
      },
      reset: async() =>
      {

      }
    };

  constructor ()
  {
    this.store.token = localStorage.getItem('token') || '';

    if (this.store.token !== '')
    {
      axios.defaults.headers.common = {'Authorization': `Bearer: ${this.store.token}`};
    }
  }


}