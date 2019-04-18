<template>
  <div class="home">
    <img src="img/logo.svg">
    <Login @loginSuccess="redirectToHome" @signupSuccess="redirectToTutorial"></Login>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Login from '@/components/Login.vue';

@Component({
  components: {Login}
})
export default class Splash extends Vue
{
  redirectToHome()
  {
    this.$router.replace("/status");
  }

  redirectToTutorial()
  {
    this.$router.replace("/tutorial")
  }

}
</script>

<style>
  .home
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