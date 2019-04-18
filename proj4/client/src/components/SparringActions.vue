<template>
  <div>
    <template v-for="move in moves">
      <button type="button" class="action" @click="onAction(move.id)">
        {{ move.display }}
      </button>
    </template>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { Move } from '../../../common/data/sparringMatch';
  import ProgressBar from '@/components/ProgressBar.vue';

  @Component({
    components: {ProgressBar}
  })
  export default class SparringSummary extends Vue
  {
    @Prop()
    moves!: Move[];

    onAction(action: string)
    {
      this.$emit('action', action);
    }
  }

</script>

<style scoped>
  .action
  {
    width: 128px;

  }
</style>