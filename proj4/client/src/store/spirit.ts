import axios from 'axios';
import { ISpirit } from '../../../common/data/spirit';
import { Store } from '@/store/index';

export class Spirit
{
  currentSpirit: ISpirit | null = null;

  async createSpirit(name: string)
  {
    let res = await axios.post('spirits', {name});
    this.currentSpirit = res.data;
  }

  async getActiveSpirit(force = false)
  {
    if (this.currentSpirit === null || force)
    {
      let res = await axios.get('spirits/active');
      this.currentSpirit = res.data;
    }
  }

  async train(trainingId: string)
  {
    let res = await axios.get('spirits/active/train', {params: {
      id: trainingId
    }});

    if (res.status === 200)
    {
      return true;
    }
    else
    {
      console.log(res.data);
      return false;
    }
  }

  async rest()
  {
    let res = await axios.get('spirits/active/rest');

    if (res.status === 200)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  async startSparring()
  {
    try
    {
      let res = await axios.get('spirits/active/startSparring');

      this.currentSpirit = res.data;
      return true;
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
      return false;
    }
  }

  async findSparringPartner(level: number)
  {
    try
    {
      let res = await axios.get('spirits/active/findSparringPartner', {params:
          {
            level
          }});

      if (this.currentSpirit)
      {
        this.currentSpirit.status = 'sparring';
        Store.sparringMatch.getActiveMatch(this.currentSpirit._id);
      }
      return true;
    }
    catch (err)
    {
      if (err.statusCode && err.data)
      {
        if (err.statusCode !== 404)
        {
          window.alert(err.data.err);
        }
      }
      return false;
    }
  }

  async cancelSparring()
  {
    try
    {
      let res = await axios.get('spirits/active/cancelSparring');

      if (this.currentSpirit)
        this.currentSpirit.status = "idle";
    }
    catch (err)
    {
      if (err.statusCode && err.data)
      {
        window.alert(err.data.err);
      }
      else
      {
        console.log(err)
      }
    }
  }

  reset()
  {
    this.currentSpirit = null;
  }
}