<template>
  <div class="status" v-if="spirit.currentSpirit">
    <div class="box">
      <div class="spirit"></div>
      <h1>{{ spirit.currentSpirit.name }}</h1>
      <p class="summary">Level {{ spirit.currentSpirit.level }} Spirit | Currently {{ spirit.currentSpirit.status }}</p>
      <div class="stats">
        <div class="stat">
          <span>Power:</span>
          <span class="spacer"></span>
          <span>{{ spirit.currentSpirit.stats.power }}</span>
        </div>
        <div class="stat">
          <span>Skill:</span>
          <span class="spacer"></span>
          <span>{{ spirit.currentSpirit.stats.skill }}</span>
        </div>
        <div class="stat">
          <span>Endurance:</span>
          <span class="spacer"></span>
          <span>{{ spirit.currentSpirit.stats.endurance }}</span>
        </div>
        <div class="stat">
          <span>Life:</span>
          <span class="spacer"></span>
          <span>{{ spirit.currentSpirit.stats.life }}</span>
        </div>
      </div>
      <div class="energy">
        <span>Energy</span>
        <ProgressBar
            id="energyBar"
            :current="spirit.currentSpirit.energy"
            :max="spirit.currentSpirit.stats.endurance"
            :colour="'green'">
        </ProgressBar>
      </div>
      <div class="sparring">
        <p>Sparring wins: {{ spirit.currentSpirit.sparring.wins }} |</p>
        <p>Sparring draws: {{ spirit.currentSpirit.sparring.draws }} |</p>
        <p>Sparring losses: {{ spirit.currentSpirit.sparring.losses }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import { Store } from '@/store';
  import { Spirit } from '@/store/spirit';
  import ProgressBar from '@/components/ProgressBar.vue';
  @Component({
    components: {ProgressBar}
  })
  export default class Status extends Vue
  {
    spirit: Spirit;

    constructor()
    {
      super();

      this.spirit = Store.spirit;
      Store.spirit.getActiveSpirit();
    }
  }

</script>

<style>

  .status
  {
    background-image: url('../../public/img/purplebrick.png');
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
  }

  h1
  {
    margin-bottom: 8px;
  }

  .summary
  {
    margin-top: 0;
    font-weight: bold;
  }

  .spirit
  {
    margin-left: auto;
    margin-right: auto;
    background: url("../../public/img/spirit-default.png") center;
    background-size: cover;
    width: 128px;
    height: 128px;
    align-self: center;

    image-rendering: optimizeSpeed;
    animation: bob 1s infinite alternate;
  }

  @keyframes bob
  {
    0%
    {
      transform: translateY(0px);
    }

    100%
    {
      transform: translateY(-4px);
    }
  }

  .box
  {
    background-color: #5b3c53;
    color: white;
    box-shadow: 5px 5px rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    border: 2px solid #721d1d;
    width: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: column;
    /*min-width: 600px;*/
    /*min-height: 200px;*/
    max-width: 100%;
    max-height: 100%;
    padding: 32px;
  }

  #energyBar
  {
    width: 100%;
    height: 16px;
  }

  .stats
  {
    display: flex;
    flex-flow: column;
    justify-content: center;
  }

  .stat
  {
    width: 128px;
    display: flex;
    flex-flow: row;
  }

  .stat span
  {
    display: inline-block;
    justify-content: space-evenly;
  }

  .spacer
  {
    flex: 1 1 auto;
  }

  .energy
  {
    margin-top: 16px;
    display: flex;
    flex-flow: column;
    width: 128px;
  }

  .sparring
  {
    display: flex;
    flex-flow: row;
    flex-wrap: wrap;
  }

  .sparring p
  {
    margin-right: 8px;
  }

  @media only screen and (max-width: 900px)
  {
    .box
    {
      background-color: rgba(0, 0, 0, 0);
      border: none;
      box-shadow: none;
      padding: 0;
      margin: 0;
      width: unset;
    }
  }
</style>
