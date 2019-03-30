<template>
  <div class="coming-soon">
    <img src="img/coming-soon.svg">
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Splash extends Vue
{
}
</script>

<style>
  .coming-soon
  {
    display: flex;
    flex-flow: column;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    text-align: center;
    background-image: url("../../public/img/purplebrick.png");
  }
</style>