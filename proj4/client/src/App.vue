<template>
  <div id="app">
    <div id="content">
      <div id="nav" v-if="auth.token && !inTutorial">
        <img src="img/logo.svg">
        <router-link to="/status">Status</router-link>
        <router-link to="/sparring">Sparring</router-link>
        <router-link to="/training">Training</router-link>
        <router-link to="/coming-soon">Exploration</router-link>
        <a href="javascript:void(0)" @click="logout">Logout</a>
      </div>
      <router-view/>
    </div>
    <footer>
      <p>code on <a target="_blank" href="https://github.com/jsh229/cs260-public/tree/master/proj4">github</a></p>
    </footer>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator';
  import { Store } from '@/store';
  import axios from 'axios';
  import { Route } from 'vue-router';
  import * as socketIo from 'socket.io-client';

  @Component
  export default class App extends Vue
  {
    private auth = Store.auth;
    private inTutorial = false;
    private socket?: SocketIOClient.Socket;

    constructor()
    {
      super();
      axios.defaults.baseURL = `http://192.168.1.191:3000/nocturne-spirit/api/`;
      axios.defaults.withCredentials = true;
    }

    created()
    {
      if (!this.auth.token)
      {
        this.$router.replace("/");
      }
      else
      {
        Store.setupSockets();
      }
    }

    logout()
    {
      Store.auth.logout();
      Store.reset();
      this.$router.replace("/");
    }

    @Watch('$route')
    beforeRouteUpdate(to: Route)
    {
      if (to.name === 'tutorial')
        this.inTutorial = true;
      else
        this.inTutorial = false;
    }
  }
</script>

<style lang="scss">

  html, body
  {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  #app {
    font-family: monospace, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column;
    background-image: url('../public/img/purplebrick.png');

  }

  footer
  {
    background-color: rgba(0, 0, 0, 0.6);
    text-align: center;
    color: white;
  }

  #content
  {
    display: flex;
    flex-flow: row;
    height: 100%;
  }

  #nav {
    min-width: 200px;
    display: flex;
    flex-flow: column;
    background-color: #5b3c53;
    border-right: 2px solid #721d1d;
    box-shadow: 0px 4px 6px black;
    align-items: center;

    a {
      display: inline-block;
      width: 64px;
      margin-bottom: 16px;
      text-align: left;
      font-weight: bold;

      &.router-link-exact-active {
        color: #42b983;
      }
    }

    img
    {
      margin-top: 64px;
      width: 150px;
      margin-bottom: 32px;
    }
  }

  a
  {
    color: #d1caa1;
    text-decoration: none;
  }

  a:hover
  {
    text-decoration: underline;
  }
</style>
