<template>
    <b-row id="outer-container" class="bg-light">
        <b-col cols="8">
            <div id='left-column'>
                <b-progress id="intensity">
                    <span v-if="selected.length == 0" class="select-endpoint-prompt"><strong>Please select endpoints to test.</strong></span>
                    <b-progress-bar  v-else :value="intensityValue" id="intensity-bar" :class="intensityClass">
                        <div id="intensity-label">
                        <h1>{{ requestInterval * selected.length }}</h1>
                        <span>requests per second</span>
                        </div>
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
                                <b-th>SUCCESSES</b-th>
                                <b-th>REJECTIONS</b-th>
                            </b-tr>
                        </b-thead>
                        <b-tbody>
                            <b-tr v-for="(obj, uri) in activity" :key="uri">
                                <b-td>{{uri}}</b-td>
                                <b-td>{{obj.req}}</b-td>
                                <!-- <b-td>{{obj.req > 0? obj.res : null}}</b-td> -->
                                <b-td>{{obj.req > 0? (100 * obj.successes / obj.res).toFixed(2) + '%' : null}}</b-td>
                                <b-td>{{obj.req > 0? ((100 * (obj.res - obj.successes) / obj.req).toFixed(2) + '%') : null}}</b-td>
                            </b-tr>
                        </b-tbody>
                    </b-table-simple>
                </div>
            </div>
        </b-col>
        <b-col id="control-box">
            <div id="query-options">
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
            </div>
            <div>
                <span class="control-label">Time between requests</span>
                <b-form-input 
                    v-model="requestInterval" 
                    type="range"
                    :min="minRequestInterval"
                    :max="maxRequestInterval"
                />
                <div style="display:block">
                    <h1 style="display:inline">{{requestInterval}}</h1>
                    <h4 style="display:inline-block">ms </h4>
                </div>
                <span class="control-detail">??? requests per endpoint per second</span>
            </div>
        </b-col>

    </b-row>
</template>

<script>
const axios = require('axios')
const apiBase = 'https://api.kylegrimsrudma.nz/'

export default {    
    name:'RateLimitTester',
    data() {
        return {
            breaking:false,
            breakCountdown:Number,
            testLength:5000,
            breakLength:7000,
            requestInterval:300,
            maxRequestInterval:1000,
            minRequestInterval:100,
            /* maxRequests:250,
            minRequests:1, */
            options: [
                { text: 'POI', value: 'poi', checked:false },
                { text: 'Hourly Events', value: 'events/hourly', checked:true },
                { text: 'Daily Events', value: 'events/daily', checked:false },
                { text: 'Hourly Statistics', value: 'stats/hourly', checked:true },
                { text: 'Daily Statistics', value: 'stats/daily', checked:false }
            ],
            activity: {
                'poi':{
                    req:0,
                    res:0,
                    successes:0,
                },
                'events/hourly':{
                    req:0,
                    res:0,
                    successes:0,
                },
                'events/daily':{
                    req:0,
                    res:0,
                    successes:0,
                },
                'stats/hourly':{
                    req:0,
                    res:0,
                    successes:0,
                },
                'stats/daily':{
                    req:0,
                    res:0,
                    successes:0,
                }
            }
        }
    },
    computed: {
        testResults() {
            let result = 'in ' + parseInt(this.testLength / 1000) + ' seconds, ' 
            let blockedSum = 0
            let reqSum = 0
            for (let uri in this.activity) {
                reqSum += this.activity[uri].req
                blockedSum += (this.activity[uri].res - this.activity[uri].successes)
            }
            result += reqSum + ' requests made and '
            result += blockedSum + ' blocked (' + parseInt(blockedSum / reqSum) + '%)' 
            return result
        },
        requestFrequency() {
            return this.requestInterval
        },
        selected() {
            return this.options.filter((obj) => obj.checked)
        },  
        intensityValue() {
            return 100 * (this.requestInterval / this.maxRequests) * this.selected.length / this.options.length
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
        this.testing = true
        this.doTest()
    },
    methods: {/* 
        rejectionString(obj) {
            result = ''
            result += obj.res - obj.successes + ' (' 
            if obj.req > 0:
            result += (obj.res - obj.successes) / obj.req + '%)'
        }, */
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
                }, this.testLength)
                while(testing) {
                    for (let i in this.selected) {
                        let uri = this.selected[i].value
                        this.makeRequest(uri)
                        //this.activity.find((data) => data.uri == uri)
                    }
                    await this.sleep(this.requestInterval)
                }
                await this.doBreak()
                this.clearActivity()
                testing = true
            }
        },
        clearActivity() {
            for (let key in this.activity) {
                this.activity[key] = {
                    req:0,
                    res:0,
                    successes:0
                }
            }
        },
        makeRequest(uri) {
            this.activity[uri].req++
            axios.get(apiBase + uri).then((r) => {
                let stats = this.activity[uri]
                stats.res++
                r.status == 200? stats.successes++ : null
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
        background-color:theme-color('secondary');
        color:theme-color('light');
        border-radius:0.3em;
        padding:0.5em;
        display:inline-block;
        text-align:left;
        font-size:0.9em;
        font-weight:bold;
        margin-bottom:1em;
    }
    text-align:right;
    .control-detail {
        font-size:0.8em;
        font-style:italic;
    }
}

#query-options {
    margin-bottom:3em;
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
    .select-endpoint-prompt {
        min-width:100%;
        text-align:center;
    }
    /* #intensity-bar {
        height:100%;
        transition:background 0.5s, width 1s;
        &.high {
            background:theme-color('danger');
        }
        &.medium-high {
            background:theme-color('warning');
        }
        &.medium {
            background:theme-color('primary');
        }
        &.medium-light {
            background:theme-color('info');
        }
        &.light {
            background:theme-color('success');
        }
    } */
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