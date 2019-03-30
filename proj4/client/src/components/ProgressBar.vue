<template>
  <div class="progressBar">
    <div class="currentProgress" :style="{width: progressBarWidth, backgroundColor: colour}"></div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

  @Component
  export default class ProgressBar extends Vue
  {
    @Prop({default: 67})
    current!: number;

    @Prop({default: 100})
    max!: number;

    @Prop({default: 'blue'})
    colour!: string;

    get progressBarWidth()
    {
      let percentage = Math.floor((this.current / this.max) * 100);

      return `${percentage}%`;
    }
  }
</script>

<style>
  .progressBar
  {
    background-color: black;
  }

  .currentProgress
  {
    height: 100%;
  }
</style>