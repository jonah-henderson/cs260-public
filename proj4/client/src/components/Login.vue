<template>
  <div id="login">
    <div class="inner">
      <div class="inputGroup">
        <label for="username">Username</label>
        <input id="username" type="text" v-model="username">
      </div>
      <div class="inputGroup">
        <label for="password">Password</label>
        <input id="password" type="password" v-model="password">
      </div>
      <p>Passwords are transmitted insecurely! Don't reuse one that matters to you.</p>
      <div class="inputGroup">
        <button type="button" @click="login">Login</button>
        <button type="button" @click="signup">Sign up</button>
      </div>
      <p class="error" v-if="loginSuccess === false">Incorrect username/password</p>
      <p class="error" v-if="signupSuccess === false">Error signing up -- please try again later</p>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { Store } from '@/store'; // @ is an alias to /src

  @Component
  export default class Login extends Vue
  {
    username: string = '';
    password: string = '';
    loginSuccess: boolean | null = null;
    signupSuccess: boolean | null = null;

    async login ()
    {
      this.loginSuccess = null;
      this.signupSuccess = null;
      this.loginSuccess = await Store.auth.login(this.username, this.password);

      if (this.loginSuccess)
        this.$emit("loginSuccess");
    }

    async signup ()
    {
      this.loginSuccess = null;
      this.signupSuccess = null;
      this.signupSuccess = await Store.auth.signup(this.username, this.password);

      if (this.signupSuccess)
        this.$emit("signupSuccess");
    }
  }
</script>

<style lang="scss">
  #login {
    margin-top: 32px;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    z-index: 1001;
    background-color: #5b3c53;
    color: white;
    box-shadow: 5px 5px rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    border: 2px solid #721d1d;
  }

  .inputGroup
  {
    display: flex;
    flex-flow: row;
    justify-content: space-around;
  }

  .inputGroup *
  {
    flex: 1 1 auto;
  }

  label
  {
    text-align: center;
    align-self: center;
    flex: 1;
    max-width: 100px;
    font-weight: bold;
  }

  .inner
  {
    margin: 16px;
  }

  .error
  {
    color: red;
  }
</style>