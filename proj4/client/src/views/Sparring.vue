<template>
  <div v-if="spirit.currentSpirit" id="sparring">
    <div class="box">
      <div v-if="spirit.currentSpirit.status === 'idle' && !sparring.showResult">
        <p>Look for sparring partner?</p>
        <button type="button" @click="findPartner">Yes</button>
      </div>
      <div v-else-if="sparring.showResult">
        <p v-if="sparring.matchResult === 'win'">Match won!</p>
        <p v-if="sparring.matchResult === 'draw'">Match draw!</p>
        <p v-if="sparring.matchResult === 'loss'">Match lost!</p>
        <div class="spirit"></div>
        <button type="button" @click="dismissResult">OK</button>
      </div>
      <div v-else-if="spirit.currentSpirit.status === 'looking for partner'">
        <div class="spirit"></div>
        <p>Looking for a sparring partner...</p>
        <button type="button" @click="cancelSearch">Cancel</button>
      </div>
      <div v-else-if="sparring.activeMatch">
        <div class="row">
          <sparring-summary
              :spirit="spirit.currentSpirit"
              :player="sparring.myPlayer"
              :battleStats="sparring.myBattleStats">
          </sparring-summary>
          <sparring-summary
              :spirit="sparring.opponentSpirit"
              :player="sparring.opponentPlayer"
              :battleStats="sparring.opponentBattleStats"
              :mirrored="true">
          </sparring-summary>
        </div>
        <div v-if="sparring.myMove === null">
          <sparring-actions :moves="moves" @action="sendAction"></sparring-actions>
          <p>Attack: deals damage base on your Power.</p>
          <p>Brace: negates damage up to your Endurance.</p>
          <p>Boost: add bonus damage to your next attack, based on your Skill. Stacks.</p>
          <p>Heal: regain HP based on your Life.</p>
        </div>
        <p v-else>Waiting for opponent's move...</p>
      </div>
      <div v-else>
        <p>You'll have to wait until you've finished what you're doing.</p>
        <div class="spirit"></div>
        <p>Currently {{ spirit.currentSpirit.status }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Store } from '@/store';
  import {Vue, Component} from 'vue-property-decorator';
  import { Spirit } from '@/store/spirit';
  import { Sparring } from '@/store/sparring';
  import SparringSummary from '@/components/SparringSummary.vue';
  import SparringActions from '@/components/SparringActions.vue';
  import { defaultMoves } from '../../../common/data/sparringMatch';

  @Component({
    components: { SparringSummary, SparringActions }
  })
  export default class SparringView extends Vue
  {
    spirit: Spirit;
    sparring: Sparring;
    moves = Object.values(defaultMoves);

    constructor()
    {
      super();

      this.spirit = Store.spirit;
      this.sparring = Store.sparring;
    }

    async created()
    {
      await Store.spirit.getActiveSpirit();
      Store.sparring.getActiveMatch();
    }

    findPartner()
    {
      Store.sparring.searchForPartner();
    }

    cancelSearch()
    {
      Store.sparring.cancelSearch();
    }

    sendAction(action: string)
    {
      Store.sparring.sendAction(action);
    }

    dismissResult()
    {
      Store.sparring.closeResults();
    }
  }
</script>

<style scoped>
  #sparring
  {
    background-image: url('../../public/img/purplebrick.png');
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .box
  {
    background-color: #5b3c53;
    color: white;
    box-shadow: 5px 5px rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    border: 2px solid #721d1d;
    padding: 32px;
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

  .row
  {
    display: flex;
    flex-flow: row;
    align-items: center;
    justify-content: space-evenly;
    max-width: 100%;
    width: 640px;
  }
</style>