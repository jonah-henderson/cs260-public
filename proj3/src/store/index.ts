import Vue from 'vue';
import { ActionDef, Cost, Effect, ItemDef, Prereqs, ResourceGain, UpgradeDef, UpgradeEffects } from '@/App.vue';
import items from "@/data/items.json";
import upgrades from "@/data/upgrades.json";
import actions from "@/data/actions.json";

const actionDefs: {[key: string]: ActionDef} = actions;
const itemDefs: {[key: string]: ItemDef} = items;
const upgradeDefs: {[key: string]: UpgradeDef} = upgrades;

interface IStore
{
  resources: { [key: string]: number},
  items: { [key: string]: number},
  upgrades: {[key: string]: boolean},
  unlocked: {[key: string]: boolean}
}

class Store
{
  store: IStore = { resources: {copper: 0}, items: {}, upgrades: {}, unlocked: {"mine": true}};

  private prereqs: {[key: string]: Prereqs} = {};

  get resources()
  {
    return this.store.resources;
  }

  get items()
  {
    return this.store.items;
  }

  get upgrades()
  {
    return this.store.upgrades;
  }

  get unlocked()
  {
    return this.store.unlocked;
  }

  public purchaseItem(item: string, cost: Cost)
  {
    if (this.canAffordCost(cost))
    {
      this.subtractCost(cost);

      if (this.store.items[item] === undefined)
      {
        Vue.set(this.store.items, item, 0);
      }

      this.store.items[item] += 1;

      this.checkPrereqs();
    }
  }

  public sellItem(item: string, cost: Cost)
  {
    for (let [resource, amount] of Object.entries(cost))
    {
      this.store.resources[resource] += amount;
    }

    this.store.items[item] -= 1;
  }

  public purchaseUpgrade(upgrade: string, cost: Cost)
  {
    if (this.canAffordCost(cost))
    {
      this.subtractCost(cost);

      Vue.set(this.store.upgrades, upgrade, true);

      let def = upgradeDefs[upgrade]

      if (def && def.effects)
      {
        for (let [target, effect] of Object.entries(def.effects))
        {
          let targetDef = itemDefs[target] || actionDefs[target];

          if (effect.multiplyOutput && targetDef.effect.gainResource)
            for (let [key, val] of Object.entries(targetDef.effect.gainResource))
              targetDef.effect.gainResource[key] = val * effect.multiplyOutput;

          if (effect.addOutput && targetDef.effect.gainResource)
            for (let [key, val] of Object.entries(targetDef.effect.gainResource))
              targetDef.effect.gainResource[key] = val + effect.addOutput;

          if (effect.changeCost)
            targetDef.cost = effect.changeCost;

          if (effect.changeCostFactor)
            targetDef.costFactor = effect.changeCostFactor;

          if (effect.changeRunningCost)
            targetDef.runningCost = effect.changeRunningCost;

          if (effect.multiplyOutputChance && targetDef.effect.gainResourceChance)
            for (let [key, val] of Object.entries(targetDef.effect.gainResourceChance))
              targetDef.effect.gainResourceChance[key] = val * effect.multiplyOutputChance;
        }
      }
    }

    this.checkPrereqs();
  }

  public handleAction(action: ActionDef)
  {
    if (action.cost) {
      if (!this.canAffordCost(action.cost))
        return;
      else
        this.subtractCost(action.cost);
    }

    this.handleEffect(action.effect);

    this.checkPrereqs();
  }

  public handleItemEffects()
  {
    for (let [itemId, qty] of Object.entries(this.store.items))
    {
      let def = itemDefs[itemId];

      if (def.runningCost)
      {
        if (!this.canAffordCost(def.runningCost, qty))
          continue;
        else
          this.subtractCost(def.runningCost, qty);
      }

      this.handleEffect(def.effect, qty);
    }

    this.checkPrereqs();
  }

  private handleEffect(effect: Effect, qty = 1)
  {
    if (effect.gainResource)
      this.gainResource(effect.gainResource, qty);

    if (effect.gainResourceChance)
    {
      for (let [resource, chance] of Object.entries(effect.gainResourceChance))
      {

        for (let i = 0; i < qty; i++)
        {
          let pick = Math.random();

          if (pick <= chance)
            this.gainResource({[resource]: 1});
        }
      }
    }
  }

  private checkPrereq(id: string, prereqs: Prereqs)
  {
    if (this.store.unlocked[id] === undefined)
      Vue.set(this.store.unlocked, id, false);

    if (prereqs.resources)
      for (let [resource, amount] of Object.entries(prereqs.resources))
        if (this.store.resources[resource] === undefined || this.store.resources[resource] < amount)
          return false;

    if (prereqs.items)
      for (let [item, amount] of Object.entries(prereqs.items))
        if (this.store.items[item] === undefined || this.store.items[item] < amount)
          return false;

    if (prereqs.upgrades)
      for (let upgradeId of prereqs.upgrades)
        if (!this.store.upgrades[upgradeId])
          return false;

    this.store.unlocked[id] = true;

    return true;
  }

  public checkPrereqs()
  {
    for (let [id, prereqs] of Object.entries(this.prereqs))
    {
      let success = this.checkPrereq(id, prereqs);

      if (success)
        delete this.prereqs[id];
    }
  }

  public registerPrereqs(id: string, prereqs: Prereqs)
  {
    this.prereqs[id] = prereqs;
  }

  private canAffordCost(cost: Cost, qty = 1)
  {
    for (let [resource, amount] of Object.entries(cost))
    {
      if (this.store.resources[resource] < amount * qty)
        return false;
    }

    return true;
  }

  private subtractCost(cost: Cost, qty = 1)
  {
    for (let [resource, amount] of Object.entries(cost))
      this.store.resources[resource] -= amount * qty;
  }

  private gainResource(gainAmount: ResourceGain, qty = 1)
  {
    for (let [resource, amount] of Object.entries(gainAmount))
    {
      if (this.store.resources[resource] === undefined)
        Vue.set(this.store.resources, resource,0);

      this.store.resources[resource] += amount * qty;
    }
  }
}

export const store = new Store();