<template>
  <div id="training">
    <div class="container">
      <div class="training" @click="rest">
      <p>Rest</p>
      </div>
      <template v-for="training in trainings">
        <div class="training" @click="train(training)">
          <div>{{ training.display }}</div>
          <div :class="[training.stat, 'strong']">{{ getAbbrev( training.stat ) }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
  import { Stat } from '../../../common/data/spirit';
  import {Component, Vue} from 'vue-property-decorator';
  import { ITraining, trainings } from '../../../common/data/training';
  import { Store } from '@/store';

  @Component
  export default class Training extends Vue
  {
    trainings = trainings;

    getAbbrev(stat: Stat)
    {
      switch (stat)
      {
        case Stat.Power:
          return "POW";

        case Stat.Skill:
          return "SKL";

        case Stat.Endurance:
          return "END";

        case Stat.Life:
          return "LIF";

        default:
          return "???";
      }
    }

    async train(training: ITraining)
    {
      let success = await Store.spirit.train(training.id);

      if (success)
      {
        let handle = window.setInterval(async () =>
        {
          await Store.spirit.getActiveSpirit(true);
          if (Store.spirit.currentSpirit !== null && Store.spirit.currentSpirit.status === "idle")
          {
            window.clearInterval(handle);
          }
        }, 1000);

        if (Store.spirit.currentSpirit)
          Store.spirit.currentSpirit.status = `training (${training.display})`;

        this.$router.push('/status');
      }

    }

    async rest()
    {
      let success = await Store.spirit.rest();

      if (success)
      {
        if (Store.spirit.currentSpirit)
          Store.spirit.currentSpirit.status = "resting";

        let handle = window.setInterval(async () =>
        {
          await Store.spirit.getActiveSpirit(true);
          if (Store.spirit.currentSpirit && Store.spirit.currentSpirit.status === "idle")
          {
            window.clearInterval(handle);
          }
        }, 10 * 1000);

        this.$router.push('/status');
      }
    }
  }

</script>

<style scoped>
  #training
  {
    width: 100%;
    background-image: url('../../public/img/purplebrick.png');
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
  }

  .container
  {
    display: flex;
    flex-flow: row;
    flex-wrap: wrap;
  }

  .training
  {
    background-color: #5b3c53;
    color: white;
    box-shadow: 5px 5px rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    border: 2px solid #721d1d;
    width: 128px;
    height: 128px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: column;
    margin-right: 8px;
    font-size: larger;
    cursor: pointer;
  }

  .training:hover
  {
    background-color: #b275a2;
  }

  .power
  {
    color: #ff3838;
  }

  .skill
  {
    color: #5773FF
  }

  .endurance
  {
    color: #ffef7c;
  }

  .life
  {
    color: #52f995;
  }

  .strong
  {
    font-weight: bold;
  }

</style>