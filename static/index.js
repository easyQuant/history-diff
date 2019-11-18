new Vue({
    el: '#app',
    data: {
        colors: ['#ff4d4f', '#40a9ff', '#9254de', '#f759ab', '#73d13d', '#ffc53d', '#36cfc9', '#eb2f96'],
        labelPosition: 'left',
        date: '',
        stockList: [
            {
                code: ''
            },

            {
                code: ''
            }
        ],
        stocks: '',
        chart: {}
    },

    created: function () {
        console.log('created')
    },

    mounted: function () {
        // this.restaurants = this.loadAll();
        this.loadAll()
        this.chart = new G2.Chart({
            container: 'mountNode',
            forceFit: true,
            height: window.innerHeight - 130,
            padding: [40, 40]
        });
    },

    methods: {

        // 兼容聚宽股票代码
        parseStockCode (code) {
            // const regXSHE = /^(002|000|300|1599|1610)/;
            // const regXSHG = /^(600|601|603|51)/;

            // if (regXSHE.test(code)) {
            //     return code.split('.')[0]
            // }

            // else if (regXSHG.test(code)) {
            //     return code.split('.')
            // }
            return code.split('.')[0]
        },

        handleSelect (item) {
            console.log(item)
        },

        querySearch(queryString, cb) {
            var restaurants = this.restaurants;
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },

        createFilter(queryString) {
            return (restaurant) => {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },

        loadAll() {
            axios.get('/get_stocks')
            .then((res) => {
                let stocks = res.data.stocks
                let names = res.data.names
                this.restaurants = stocks.map((item, index) => {
                    return {
                        value: this.parseStockCode(item),
                        address: names[index]
                    }
                })
            })
        },

        add () {
            this.stockList.push({
                code: ''
            })
        },

        submit () {
            // let stocks = []
            let date = window.moment(this.date).format('YYYY-MM-DD')
            // console.log('this.stockList => ', this.stockList)
            
            // stocks = this.stockList.map(item => {
                
            //     if (item.code) {
            //         return item.code
            //     }
            // })
            // debugger
            this.renderChart(this.stocks, date)
        },

        renderChart (stocks, date) {
            let _chart = this.chart
            axios.get('/get_bars', {
                params: {
                    // stocks: stocks.join(','),
                    stocks: stocks.replace(/[\'|\s]/g,''),
                    date: date
                }
            })
            .then((res) => {
                let stocks = res.data.stocks
                console.log('res => ', res.list)
                let source = {}
                _chart.axis('index', {
                    label: {
                        textStyle: {
                            fill: '#aaaaaa'
                        }
                    }
                });
              
                _chart.tooltip({
                    crosshairs: false
                });
                _chart.legend({
                    position: 'top-center'
                });
        
                stocks.map(item => {
                    source[item] = {
                        min: -10,
                        max: 10
                    }
                })

                _chart.source(res.data.list, source)
                
                stocks.map((item, index) => {
                    _chart.line().position('index*' + item).color(this.colors[index])
                })
                
                // chart.line().position('index*002786').color('#FB4044');
                _chart.render();
            });
        }
    }
})