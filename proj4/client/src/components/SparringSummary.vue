<template>
  <div>
    <div :class="{mirrored}">
      <div class="spirit"></div>
    </div>
    <p>{{ spirit.name }}</p>
    <p>{{ player.displayName }}</p>
    <p>HP</p>
    <progress-bar class="hpBar" :current="battleStats.hp" :max="spirit.stats.life" :colour="colour"></progress-bar>

  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { ISpirit } from '../../../common/data/spirit';
  import { BattleStats } from '../../../common/data/sparringMatch';
  import { IPlayer } from '../../../common/data/player';
  import ProgressBar from '@/components/ProgressBar.vue';

  @Component({
    components: {ProgressBar}
  })
  export default class SparringSummary extends Vue
  {
    @Prop()
    spirit!: ISpirit;

    @Prop()
    battleStats!: BattleStats;

    @Prop()
    player!: IPlayer;

    @Prop({default: false})
    mirrored!: boolean;

    get colour()
    {
      let ratio = this.battleStats.hp / this.spirit.stats.life;

      if (ratio > 0.5)
        return "green";

      if (ratio > 0.25)
        return "yellow";

      return "red";
    }
  }

</script>

<style scoped>
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

  .mirrored
  {
    transform: scaleX(-1);
  }

  .hpBar
  {
    width: 128px;
    height: 16px;
  }
</style>