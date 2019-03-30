<template>
  <div v-if="spirit.currentSpirit" id="sparring">
    <div class="box">
      <div v-if="spirit.currentSpirit.status === 'idle'">
        <p>Look for sparring partner?</p>
        <button type="button" @click="startSparring">Yes</button>
      </div>
      <div v-else-if="spirit.currentSpirit.status === 'looking for partner'">
        <div class="spirit"></div>
        <p>Looking for a sparring partner...</p>
        <button type="button" @click="cancelSearch">Cancel</button>
      </div>
      <div v-else-if="spirit.currentSpirit.status === 'sparring'">
        <p>holy moly let's do some actual sparring!</p>
        <p>This is unimplemented, but your opponent would have been</p>
        <button type="button" @click="resetSparring">Click to reset</button>
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

  @Component
  export default class Sparring extends Vue
  {
    spirit: Spirit;
    sparringSearchIntervalHandle: any;

    constructor()
    {
      super();

      this.spirit = Store.spirit;
      Store.spirit.getActiveSpirit();
    }

    startSparring()
    {
      if (Store.spirit.startSparring())
      {
        this.sparringSearchIntervalHandle = window.setInterval(this.findPartner, 1000);
      }
    }

    async findPartner()
    {
      if (this.spirit.currentSpirit)
      {
        if (await Store.spirit.findSparringPartner(this.spirit.currentSpirit.level))
        {
          window.clearInterval(this.sparringSearchIntervalHandle);
        }
      }
    }

    cancelSearch()
    {
      Store.spirit.cancelSparring();
      window.clearInterval(this.sparringSearchIntervalHandle);
    }

    async resetSparring()
    {
      Store.spirit.cancelSparring();
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
</style>