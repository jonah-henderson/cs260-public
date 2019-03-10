<template>
  <div id="app">
    <header>
      <h1>Geddamilgol</h1>
      <h2 v-if="timeComplete === null">get a million gold</h2>
      <h2 v-if="timeComplete !== null">Finished in {{ timeComplete }}</h2>
    </header>
    <div id="game">
      <div id="bank">
        <h1>Resources</h1>
        <template v-for="(qty, id) of ownedResources">
          <div>
            <p>{{ id }}: {{ qty }}</p>
          </div>
        </template>
      </div>
      <div id="upgradesOwned">
        <h1>Upgrades</h1>
        <template v-for="(owned, id) of ownedUpgrades">
          <div>
            <p>{{ upgradeDefs[id].description.purchased }}</p>
          </div>
        </template>
      </div>
      <div id="actions">
        <h1>Actions</h1>
        <template v-for="action of actionDefs">
          <Action v-if="unlockedStuff[action.id]" :definition="action"></Action>
        </template>
      </div>
      <div id="items">
        <h1>Assets</h1>
        <template v-for="item of itemDefs">
          <Item v-if="unlockedStuff[item.id] === true" :definition="item" :ownedQty="ownedItems[item.id]"></Item>
        </template>
      </div>
      <div id="upgradesAvailable">
        <h1>Research</h1>
        <template v-for="upgrade of upgradeDefs">
          <Upgrade v-if="unlockedStuff[upgrade.id] === true && !ownedUpgrades[upgrade.id]" :definition="upgrade"></Upgrade>
        </template>
      </div>
    </div>
    <footer>
      <p>code on <a href="https://github.com/jsh229/cs260-public/tree/master/proj3">github</a></p>
    </footer>
  </div>
</template>

<script lang="ts">
declare let luxon: any;

import { Component, Vue } from 'vue-property-decorator';
import Item from './components/Item.vue';
import {store} from "./store";
import Action from '@/components/Action.vue';

import items from "./data/items.json";
import actions from "./data/actions.json";
import upgrades from "./data/upgrades.json";
import Upgrade from '@/components/Upgrade.vue';



export interface Prereqs {
  items?: {[key: string]: number},
  resources?: {[key: string]: number},
  upgrades?: string[]
}

export interface Cost {
  [key: string]: number
}

export interface ResourceGain {
  [key: string]: number
}

export interface ResourceGainChance {
  [key: string]: number
}

export interface Description {
  name: string,
  detail?: string,
  effect?: string,
  purchased?: string
}

export interface Effect {
  gainResource?: ResourceGain
  gainResourceChance?: ResourceGainChance
}

export interface UpgradeEffects {
  [key: string]: {
    multiplyOutput?: number,
    multiplyOutputChance?: number,
    addOutput?: number,
    changeCost?: Cost,
    changeRunningCost?: Cost,
    changeCostFactor?: number
  }
}

export interface ItemDef
{
  id: string,
  description: Description,
  type?: string,
  cost: Cost,
  costFactor: number,
  prereqs?: Prereqs,
  effect: Effect
  runningCost?: Cost
}

export interface ActionDef
{
  id: string,
  description: Description,
  effect: Effect
  prereqs?: Prereqs
  cost?: Cost
}

export interface UpgradeDef
{
  id: string,
  description: Description,
  prereqs?: Prereqs,
  cost: Cost,
  effects?: UpgradeEffects
}

@Component({
  components: {
    Item,
    Action,
    Upgrade
  }
})
export default class App extends Vue
{
  itemDefs: {[key: string]: ItemDef} = items;
  actionDefs: {[key: string]: ActionDef} = actions;
  upgradeDefs: {[key: string]: UpgradeDef} = upgrades;

  ownedResources: {[key: string]: number};
  ownedItems: {[key: string]: number};
  ownedUpgrades: {[key: string]: boolean};
  unlockedStuff: {[key: string]: boolean};

  tickIntervalHandle: any;

  start = luxon.DateTime.local();
  msgShown = false;
  timeComplete: string | null = null;

  constructor()
  {
    super();

    this.ownedResources = store.resources;
    this.ownedItems = store.items;
    this.ownedUpgrades = store.upgrades;
    this.unlockedStuff = store.unlocked;

    for (let [itemId, def] of Object.entries(this.itemDefs))
      if (def.prereqs)
        store.registerPrereqs(itemId, def.prereqs);

    for (let [actionId, def] of Object.entries(this.actionDefs))
      if (def.prereqs)
        store.registerPrereqs(actionId, def.prereqs);

    for (let [upgradeId, def] of Object.entries(this.upgradeDefs))
      if (def.prereqs)
        store.registerPrereqs(upgradeId, def.prereqs);

    this.tickIntervalHandle = window.setInterval(this.tick, 1000);
  }

  tick()
  {
    if (!this.msgShown && this.ownedResources["gold"] >= 1000000)
    {
      let now = luxon.DateTime.local();

      let diff = now.diff(this.start, ['hours', 'minutes', 'seconds']);
      let diffObj = diff.toObject();

      let msg = [];

      for (let [timePeriod, amount] of Object.entries(diffObj))
        if (amount > 0)
          msg.push(`${Math.floor(amount as number)} ${timePeriod}`);

      let msgStr = msg.join(', ');

      window.alert(`You won!\nIt took you ${msg}`);

      this.msgShown = true;
      this.timeComplete = msgStr;
    }
    store.handleItemEffects();
  }

  beforeDestroy()
  {
    window.clearInterval(this.tickIntervalHandle);
  }
}
</script>

<style>
  * {
    margin: 0;
    padding: 0;
  }

  html {
    height: 100%;
  }

  body {
    background-color: #101010;
    height: 100%;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    display: flex;
    flex-flow: column;
    height: 100%;
  }

  #game {
    display: flex;
    flex-flow: row;
    flex-wrap: wrap;
    flex: 8 8 0;
  }

  #game > div {
    display: flex;
    flex-flow: column;
    flex: 1 1 0;
    align-items: center;
    justify-content: flex-start;
    margin: 16px;
  }

  #bank div, #upgradesOwned div {
    background-color: #fcea8f;
    margin-bottom: 16px;
    border-radius: 8px;
    width: 100%;
  }

  #upgradesOwned div {
    background-color: #79e0a0;
  }

  #bank p, #upgradesOwned p {
    color: #222;
    margin: 8px;
  }

  #bank p {
    font-weight: bold;
  }

  h1 {
    color: white;
    margin-bottom: 16px;
  }

  header {
    background-color: #222;
    color: white;
    flex: 1 1 0;
    padding: 16px;
    box-shadow: 0px 4px 8px rgba(252, 234, 153, 0.8);
    margin-bottom: 16px;
  }

  header h1 {
    font-size: 64px;
    letter-spacing: 0.2em;
    margin-bottom: 8px;
  }

  header h2 {
    font-size: small;
    font-style: italic;
    font-weight: normal;
    margin-bottom: 16px;
  }

  footer {
    color: white;
    flex: 1 1 0;
  }

  footer a {
    color: #fcea8f;
  }

  footer a:hover {
    color: orange;
  }

  @media only screen and (max-width: 600px)
  {
    header h1 {
      font-size: 20px;
    }
  }

  /*
    purple: rgba(84, 13, 110, 1);
    salmon: rgba(238, 66, 102, 1);
    gold: rgba(255, 210, 63, 1);
    green: rgba(124, 234, 156, 1);
    light: rgba(243, 252, 240, 1);
    dark: rgba(31, 39, 27, 1);
   */
</style>
