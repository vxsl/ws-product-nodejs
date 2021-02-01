<template>
    <b-row id="outer-container" class="bg-light">
        <b-col cols="8">
            <div id='left-column'>
                <b-progress id="intensity">
                    <span v-if="selected.length == 0" class="progress-overlay"><strong>Please select endpoints to test.</strong></span>
                    <div v-else class="progress-overlay" :class="intensityClass">
                        <h1>{{ totalRequestsPerTestPeriod }}</h1>
                        <span>total requests per {{parseInt(testPeriod / 1000)}} seconds (approximate)</span>
                    </div>
                    <b-progress-bar :value="intensityValue" id="intensity-bar" :class="intensityClass">
                    </b-progress-bar>
                </b-progress>
                <div id="table-container" class="d-flex justify-content-center align-items-center">
                    <div v-if="breaking" id="table-overlay" class="monospace d-flex justify-content-center align-items-center">
                        <span>TEST COMPLETE: {{testResults}}</span>
                        <span id="overlay-subtitle">{{breakCountdown}} s until next test</span>
                    </div>
                    <b-table-simple small id="response-table" class="monospace" :class="breaking? 'break' : null">
                        <b-thead>
                            <b-tr>
                                <b-th>URI</b-th>
                                <b-th>REQUESTS</b-th>
                                <b-th>RESPONSES</b-th>
                                <b-th>200</b-th>
                                <b-th>429</b-th>
                            </b-tr>
                        </b-thead>
                        <b-tbody>
                            <b-tr v-for="(obj, uri) in activity" :key="uri">
                                <b-td>{{uri}}</b-td>
                                <b-td>{{obj.reqCount}}</b-td>
                                <b-td>{{obj.resCount}}</b-td>
                                <!-- <b-td>{{obj.req > 0? obj.res : null}}</b-td> -->
                                <!-- <b-td>{{obj.req > 0? (100 * obj.successes / obj.res).toFixed(2) + '%' : null}}</b-td> -->
                                <b-td>{{successString(obj)}}</b-td>
                                <b-td>{{rejectionString(obj)}}</b-td>
                            </b-tr>
                        </b-tbody>
                    </b-table-simple>
                </div>
                <b-progress v-show="!breaking">
                    <b-progress-bar 
                    :value="testChronoProgress" 
                    :label="testSecondsRemaining"
                    />
                </b-progress>
            </div>
        </b-col>
        <b-col id="control-box">
            <b-card id="query-options">
                <span class="control-label">Endpoints to query</span>
                <b-form-checkbox
                    class="query-checkbox" 
                    v-for="option in options" 
                    :key="option.text" 
                    v-model="option.checked" 
                    button
                >
                    {{ option.text }}
                </b-form-checkbox>
            </b-card>
            <div>
                <span class="control-label">Individual request frequency</span>
                <b-form-input 
                    v-model="requestsPerTestPeriod" 
                    type="range"
                    :min="minRequestsPerTestPeriod"
                    :max="maxRequestsPerTestPeriod"
                />
                <div class="d-block">
                    <h2 style="display:inline">{{requestsPerTestPeriod + ' '}}</h2>
                    <span class="control-detail" style="display:inline-block"> per {{parseInt(testPeriod / 1000)}} s</span>
                </div>
                <span class="control-detail">{{'[' + parseFloat(requestInterval / 1000).toFixed(2)}} s break between requests]</span>
            </div>
        </b-col>

    </b-row>
</template>

<script>
// eslint-disable-next-line
const axios = require('axios')
//const apiBase = 'https://api.kylegrimsrudma.nz'
// eslint-disable-next-line
const apiBase = 'http://localhost:5555'

export default {    
    name:'RateLimitTester',
    data() {
        return {
            breaking:false,
            breakCountdown:Number,
            testPeriod:30000,
            testStartedAt:Number,
            testChronoProgress:0,
            breakLength:7000,
            requestsPerTestPeriod:10,
            minRequestsPerTestPeriod:1,
            maxRequestsPerTestPeriod:150,
            options: [
                { text: 'Dummy', value: '/', checked:true },
                { text: 'POI', value: '/poi', checked:false },
                { text: 'Hourly Events', value: '/events/hourly', checked:false },
                { text: 'Daily Events', value: '/events/daily', checked:false },
                { text: 'Hourly Statistics', value: '/stats/hourly', checked:false },
                { text: 'Daily Statistics', value: '/stats/daily', checked:false }
            ],
            activity: {
                '/':{
                    reqCount:0,
                    resCount:0,
                    successes:0,
                    rejections:0
                },
                '/poi':{
                    reqCount:0,
                    resCount:0,
                    successes:0,
                    rejections:0
                },
                '/events/hourly':{
                    reqCount:0,
                    resCount:0,
                    successes:0,
                    rejections:0
                },
                '/events/daily':{
                    reqCount:0,
                    resCount:0,
                    successes:0,
                    rejections:0
                },
                '/stats/hourly':{
                    reqCount:0,
                    resCount:0,
                    successes:0,
                    rejections:0
                },
                '/stats/daily':{
                    reqCount:0,
                    resCount:0,
                    successes:0,
                    rejections:0
                }
            }
        }
    },
    computed: {
        testSecondsRemaining() {
            let result = parseInt(this.testPeriod * (1 - (0.01 * this.testChronoProgress)) / 1000)
            if (result < 10) {
                result = '0' + result
            }
            result = '00:' + result + ' remaining'
            return result
        },
        testResults() {
            let result = 'in ' + parseInt(this.testPeriod / 1000) + ' seconds, ' 
            let blockedSum = 0
            let reqSum = 0
            for (let uri in this.activity) {
                reqSum += this.activity[uri].reqCount
                blockedSum += this.activity[uri].rejections
            }
            result += reqSum + ' requests made and '
            result += parseInt(100 * blockedSum / reqSum) + '% rejected'
            return result
        },
        requestFrequency() {
            return this.requestInterval
        },
        requestInterval() {
            return parseInt(this.testPeriod / this.requestsPerTestPeriod)
        },
        selected() {
            return this.options.filter((obj) => obj.checked)
        },  
        totalRequestsPerTestPeriod() {
            return parseInt(this.requestsPerTestPeriod * this.selected.length)
        },
        intensityValue() {
            return 100 * (this.requestsPerTestPeriod * this.selected.length) / (this.maxRequestsPerTestPeriod * this.options.length)
            //return 1000 / this.minRequestsPerTestPeriod * this.requestsPerTestPeriod / this.options.length
        },
        intensityClass() {
            if (this.intensityValue > 80) {
                return 'high'                
            }
            else if (this.intensityValue > 60) {
                return 'medium-high'                
            }
            else if (this.intensityValue > 40) {
                return 'medium'                
            }
            else if (this.intensityValue > 20) {
                return 'medium-light'                
            }
            else return 'light'
        }
    },
    async mounted() {
        setInterval(this.updateTime.bind(this), 1000)
        this.testing = true
        this.doTest()
    },
    methods: {
        successString(obj) {
            if (obj.reqCount > 0) {
                if (obj.resCount > 0) {
                    return obj.successes + ' (' + parseInt(100 * obj.successes / obj.reqCount) + '%)'
                }
                else return '0'
            }
            else return null
        },
        rejectionString(obj) {
            if (obj.reqCount > 0) {
                if (obj.resCount > 0) {
                    return obj.rejections + ' (' + parseInt(100 * obj.rejections / obj.reqCount) + '%)'
                }
                else return '0'
            }
            else return null
        },
        updateTime() {
            let now = Date.now()
            if (!this.breaking) {
                this.testChronoProgress = 100 * (now - this.testStartedAt) / this.testPeriod 
            }
        },
        async doBreak() {
            this.breaking = true
            let inBreak = true
            setTimeout(function() {
                inBreak = false
            }, this.breakLength)
            this.breakCountdown = parseInt(this.breakLength / 1000)
            while (inBreak) {
                this.breakCountdown--
                await this.sleep(1000) 
            }
            this.breaking = false
        },
        async doTest() {
            let testing = true
            for (;;) {
                setTimeout(function() {
                    testing = false
                }, this.testPeriod)
                this.testStartedAt = Date.now()
                while(testing) {
                    for (let i in this.selected) {
                        let uri = this.selected[i].value
                        this.makeRequest(uri)
                    }
                    await this.sleep(this.requestInterval)
                }
                if (this.selected.length > 0) {
                    await this.doBreak()
                }
                this.clearActivity()
                testing = true
            }
        },
        clearActivity() {
            for (let key in this.activity) {
                this.activity[key] = {
                    reqCount:0,
                    resCount:0,
                    successes:0,
                    rejections:0
                }
            }
        },
        makeRequest(uri) {
            let obj = this.activity[uri]
            obj.reqCount++
            axios.get(apiBase + uri).then((r) => {
                obj.resCount++
                r.status == 200? obj.successes++ : null
            }).catch((err) => {
                obj.resCount++
                obj.rejections++
                console.log(err)
            })
        },
        async sleep(ms) {
            await new Promise(r => setTimeout(r, ms));
        }
    }
}

</script>

<style lang="scss">

@import '@/scss/custom.scss';

#outer-container {
    padding:2em;
    border-radius:2em;

    #left-column {
        display:flex;
        flex-direction: column;
        min-height:100%;
        #table-container {
            font-size:0.8em;
            height:100%;
            position:relative;
            #table-overlay {
                position:absolute;
                width:60%;
                min-height:100%;
                font-size:1.15em;
                flex-wrap:wrap;
                #overlay-subtitle {
                    font-size:0.9em;
                    font-style:italic;
                }
            }
            
            #response-table {
                &.break {
                    transition:filter 0.4s;
                    filter:blur(0.4em);
                }
            }
        }
    }
}

#control-box {
    .control-label {
        width:100%;
        color:theme-color('dark');
        border-radius:0.3em;
        padding:0.5em;
        display:inline-block;
        text-align:left;
        font-size:0.9em;
        font-weight:bold;
    }
    text-align:right;
    .control-detail {
        font-size:0.8em;
    }
}

#query-options {
    margin-bottom:3em;
    background:theme-color("light-grey");
    .query-checkbox {
        display:block !important; 
        margin:1em;   
        label {
            font-size:0.8em;
            width:100%;
            background:theme-color('light');
            color:theme-color('dark');
            &.active {
                border:none;
                background:theme-color('primary');
                color:theme-color('light');
            }
        }
    }
}

#intensity {
    flex:1;
    margin-bottom:2em;
    display:flex;
    align-items:center;
    .progress-overlay {
        position:absolute;
        min-width:100%;
        text-align:center;
        transition:color 0.5s;
        &.medium-high, &.high {
            color:theme-color('light') !important;
        }
    }
    #intensity-bar {
        height:100%;
        transition:background 0.5s;
        &.high {
            background:$gray-800;
        }
        &.medium-high {
            background:$gray-600;
        }
        &.medium {
            background:$gray-500;
        }
        &.medium-light {
            background:$gray-300;
        }
        &.light {
            background:$gray-200;
        }
    }
}



</style>