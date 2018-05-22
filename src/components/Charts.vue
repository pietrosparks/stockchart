<template>
  <div >
    <div v-if="loaded==true"  class="bg">
      <div class="container">
        <highstock class="stock" :options="chartOptions"></highstock>

        <div class="columns is-multiline">
          <div class="column is-one-third" v-for="(stock, index) in stockOptions">
            <div class="card" id="stock">
              <div class="card-content">
                <div class="content">
                    <button class="delete is-pulled-right " @click="removeStock(stock, index)"></button>
                  <p class="title is-4">{{stock["2. Symbol"].toUpperCase()}}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="column is-one-third">
            <div class="card" id="addStock">
              <div class="card-content">
                <input type="text" v-model="addStock" placeholder="Add a stock">
                <a class="button is-success" @click="searchAndAdd" :class="{'is-loading':isLoading}">Search</a>
              </div>
            </div>

          </div>
        </div>
      </div>
      <footer class="footer">
          <div class="container">
            <div class="content has-text-centered">
              <p>
                Created by <a href="https://twitter.com/txheo">txheo</a>
              </p>
            </div>
          </div>
        </footer>
    </div>

    <div v-else>

      <swapping-squares-spinner :animation-duration="2000" :size="150" :color="'#ff1d5e'" />
      <h1 class='is-size-3'>Loading...</h1>
    </div>

  </div>

</template>

<script>
  import {
    SwappingSquaresSpinner
  } from 'epic-spinners'
  export default {
    name: 'chart-home',
    data() {
      return {
        addStock: '',
        isLoading: false,
        loaded: false,
        stockOptions: [],
        addedStocks:null,
        chartOptions: {

          rangeSelector: {
            enabled: true,
            selected: 1
          },

          chart: {
            backgroundColor: '#9E9E9E',
            style: {
              fontFamily: 'Poppins',
            },
          },
          title: {
            text: 'Stock Market Chart'
          },
          series: []
        },
        initChartOption: 'GOOG',
        chartApiKey: 'LK2PC2263NHFXF5V'
      }
    },
    methods: {
      transformAndAdd(resp) {

        const dataObject = resp.data['Time Series (Daily)'];
        const metaObject = resp.data['Meta Data'];
        this.stockOptions.push(metaObject);
        let array = [];
        const objKeys = Object.keys(dataObject);

        objKeys.forEach(obj => {
          let initArr = []
          let newObj = obj.replace(/-/gi, '.')
          let pretime = parseInt((new Date(newObj).getTime()).toFixed(0))
          initArr.push(pretime, Number(dataObject[obj]['4. close']));
          array.push(initArr);
        })

        this.chartOptions.series.push({
          name: metaObject["2. Symbol"].toUpperCase(),
          data: array.reverse(),
          color: this.randomColor(),
          tooltip: {
            valueDecimals: 2
          },
        })
        
        if(this.chartOptions.series.length == this.addedStocks.length){
          return this.loaded = true;
        }
        else if(!this.chartOptions.series.length){
          return this.loaded = true
        }
      },
      randomColor() {
        const r = () => Math.floor(256 * Math.random());
        return `rgb(${r()}, ${r()}, ${r()})`;
      },
      initChart(args) {
          this.$axios.get(
            `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&outputsize=full&symbol=${args}&apikey=${this.chartApiKey}`
          )
          .then(resp => {
            this.transformAndAdd(resp);
          }).catch(err => {
            console.log(err);
          })
      },

      searchAndAdd() {
        this.isLoading = true;
        this.$axios.get(
            `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&outputsize=full&symbol=${this.addStock}&apikey=${this.chartApiKey}`
          )
          .then(resp => {
            
            if (resp.data['Time Series (Daily)']) {
              this.transformAndAdd(resp);
              this.stockStorageAdd(this.addStock)
              this.isLoading = false;
              this.addStock = ''
            } else {
              alert('Not a valid stock')
            }
          })
      },
      removeStock(stock, index){
        this.stockOptions.splice(index,1);
        this.chartOptions.series.splice(index,1)
        this.stockStorageRemove(stock['2. Symbol']);
      },
      loadStoredStock(){
        if(localStorage.getItem('addedStock')){
          let addedStocks = JSON.parse(localStorage.getItem('addedStock'))
          this.addedStocks = addedStocks
        }
        else{
          let stockArray = []
          localStorage.setItem('addedStock',JSON.stringify(stockArray));
          this.addedStocks = stockArray
        }
      },

      stockStorageAdd(args){
        this.loadStoredStock();
        this.addedStocks.push(args.toUpperCase());
        let addedStocks = JSON.stringify(this.addedStocks)
        localStorage.setItem('addedStock', addedStocks);
      },

      stockStorageRemove(args){
        this.loadStoredStock();
        this.addedStocks = this.addedStocks.filter(stock=>stock.toUpperCase() !==args);
        let addedStocks = JSON.stringify(this.addedStocks)
        localStorage.setItem('addedStock',addedStocks);

      },
      initAddedStocksChart(){
        this.addedStocks.forEach(stock=>this.initChart(stock));
      }
    },

    beforeMount() {
      this.loadStoredStock();
      this.initAddedStocksChart();
      
      
      
    },

    components: {
      SwappingSquaresSpinner
    }
  }

</script>

<style scoped>
  .card {
    min-height: 100px;
    border-left:5px solid grey;
    margin-bottom:10px
  }

  .card:hover{
    border-left: 5px solid teal;
  }

  #stock{
    padding: 10px;
  }

  #addStock{
    padding-top:10px;
  }

  .bg{
    background-color: #212121;
    height:100%;
  }

  .stock {
    margin-top: 0px;
    margin-bottom: 30px;
    margin-left: auto;
    margin-right: auto;
    padding-top: 5%;

  }

  input[type='text'] {
    height: 35px;
    padding: 10px;
    border-radius: 5px;
  }

  .swapping-squares-spinner {

    margin: 15% auto;

  }

  .footer{
    padding: 20px;
    color: black;
    background-color: teal;
    margin-top:20px;
    
  }

</style>
