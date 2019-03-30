import axios from 'axios';
import { ISparringMatch } from '../../../common/data/sparringMatch';

export class SparringMatch
{
  activeMatch: ISparringMatch | null = null;

  async getActiveMatch(spiritId: string)
  {
    try
    {
      let res = await axios.get('/sparringMatches/active', {params: {forSpirit: spiritId}});

      this.activeMatch = res.data;
    }
    catch (err)
    {
      if (err.statusCode && err.data)
      {
        window.alert(err.data.err);
      }
      else
      {
        console.log(err);
      }
    }
  }

  async updateActiveMatch()
  {
    if (!this.activeMatch)
      return false;

    try
    {
      let res = await axios.get(`/sparringMatches/${this.activeMatch._id}`);

      this.activeMatch = res.data;
    }
    catch (err)
    {
      if (err.statusCode && err.data)
      {
        window.alert(err);
      }
      else
      {
        console.log(err);
      }
    }
  }

  reset()
  {

  }
}