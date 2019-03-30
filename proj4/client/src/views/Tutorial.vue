<template>
  <div class="tutorial">
    <div class="box">
<!--      <div class="inner">-->
        <div v-if="page === 1">
          <p>This world is old.</p>
          <p>No one knows exactly how old. Some think it's about to end.</p>
          <p>Some think it's already ended.</p>
        </div>
        <div v-if="page === 2">
          <p>Whatever the answer may be, it's not the only mystery.</p>
          <p>This land is full of beings called <em>spirits</em>.</p>
          <p>No one knows where they came from. They take many forms and have many different motives.</p>
        </div>
        <div v-if="page === 3">
          <p>Most keep to themselves.</p>
          <p>Some help us to survive.</p>
          <p>Others are... dangerous.</p>
        </div>
        <div v-if="page === 4">
          <div class="spirit"></div>
          <p>This one has been following you for the last few weeks.</p>
          <p>It seems friendly. What will you call it?</p>
          <input type="text" v-model="spiritName"/>
        </div>
        <div v-if="page === 5">
          <div class="spirit"></div>
          <p>{{ spiritName }}.</p>
          <p>It seems to like it.</p>
        </div>
        <div v-if="page === 6">
          <p>You heard a rumour a little a while ago about a mine with some valuable relics.</p>
          <p>It's too dangerous to go alone, but with {{ spiritName }}, it might be worth investigating.</p>
          <p>Of course, it will need some training before it can help you confront the perils within.</p>
        </div>
        <div v-if="page === 7">
          <p>Training {{ spiritName }}'s <span class="power">Power</span> will help it become more capable of defending
             itself and you</p>
          <p>Training its <span class="skill">Skill</span> will help it learn how to overcome challenges, as well as
             baffle and outmanoeuvre foes.</p>
          <p>Training its <span class="endurance">Endurance</span> will allow it to reduce damage to itself and to
             travel further before needing a rest.</p>
          <p>Training its <span class="life">Life</span> increases the amount of punishment it can take before it is
             defeated and must reform.</p>
        </div>
        <div v-if="page === 8">
          <div class="spirit"></div>
          <p>
            You and {{ spiritName }} return to your makeshift shelter, ready to begin a new adventure...
          </p>
        </div>
        <a v-if="!last && nameGiven" href="javascript:void(0)" @click="nextPage">next ></a>
        <a v-if="last" href="javascript:void(0)" @click="begin">exit</a>
<!--      </div>-->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Login from '@/components/Login.vue';
import { Store } from '@/store';

@Component
export default class Tutorial extends Vue
{
  page = 1;
  spiritName = "";

  nextPage()
  {
    this.page++;
  }

  get nameGiven()
  {
    if (this.page < 4)
      return true;

    return /[a-zA-Z]+/.test(this.spiritName);
  }

  get last()
  {
    return this.page === 8;
  }

  begin()
  {
    Store.spirit.createSpirit(this.spiritName);
    this.$router.replace("/status");
  }
}
</script>

<style>
  .tutorial
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

  em
  {
    font-style: normal;
    color: #5773FF;
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

  .box
  {
    background-color: #5b3c53;
    color: white;
    box-shadow: 5px 5px rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    border: 2px solid #721d1d;
    /*width: 600px;*/
    /*height: 200px;*/
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: column;
    min-width: 600px;
    min-height: 200px;
    padding: 32px;
  }

  .inner a
  {
    margin-top: 16px;
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
  }
</style>