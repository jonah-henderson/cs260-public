<template>
  <div class="portfolio">
    <h1>Portfolio</h1>
    <div class="stockCards">
      <div class="cardContainer" v-for="symbol in symbols" :key="symbol" v-if="portfolio[symbol] != null && portfolio[symbol].qty != null">
        <StockCard :symbol="symbol"></StockCard>
        <BuySellWidget :symbol="symbol" :mode="BuySellWidgetMode.SELL"></BuySellWidget>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator';
  import Store from '@/auxiliary/store';
  import StockCard from '../components/StockCard.vue';
  import BuySellWidget, {BuySellWidgetMode} from '@/components/BuySellWidget.vue'; // @ is an alias to /src

  @Component({
    components: {
      BuySellWidget,
      StockCard,
    },
  })
  export default class Portfolio extends Vue {
    portfolio = Store.portfolio;
    BuySellWidgetMode = BuySellWidgetMode;

    get symbols()
    {
      return Object.keys(this.portfolio);
    }

    @Watch('portfolio')
    onPortfolioChange()
    {
      console.log(this.portfolio);
      this.$forceUpdate();
    }
  }

</script>

<style scoped>
  .stockCards
  {
    display: flex;
    flex-flow: row wrap;
  }
  .cardContainer
  {
    max-width: 400px;
    padding: 8px;
    box-shadow: 4px 4px 1px rgba(0, 0, 0, 0.6);
    /*margin: 8px;*/
    margin-right: 16px;
    margin-bottom: 16px;
    background-color: #4c5454;
    flex: 0 1 auto;
  }
</style>