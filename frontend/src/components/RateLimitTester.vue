<template>
    <div id="outer-container">
        <b-col cols="8">
            <div id='left-column'>
                <b-progress id="intensity">
                    <span 
                    v-if="selectedEndpoints.length == 0" 
                    class="progress-overlay"
                    >
                        <strong>Please select endpoints to test.</strong>
                    </span>

                    <div 
                    v-else 
                    class="progress-overlay" 
                    :class="intensityClass"
                    >
                        <h1>{{ totalRequestsPerTestPeriod }}</h1>
                        <span>total requests per {{parseInt(testPeriod / 1000)}} seconds (approximate)</span>
                    </div>

                    <b-progress-bar 
                    :value="intensityValue" 
                    id="intensity-bar" 
                    :class="intensityClass"
                    />
                </b-progress>
                <b-card 
                id="table-container" 
                class="d-flex justify-content-center align-items-center"
                >
                    <div 
                    v-if="paused" 
                    id="table-overlay" 
                    class="monospace d-flex justify-content-center align-items-center"
                    >
                        <span id="test-results"><strong>TEST COMPLETE.</strong>{{'\n' + testResults}}</span>
                    </div>

                    <b-table-simple 
                    fixed 
                    small 
                    striped
                    hover
                    id="response-table" 
                    class="monospace" 
                    :class="paused? 'break' : null"
                    >
                        <b-thead>
                            <b-tr id="table-header">
                                <b-th>URI</b-th>
                                <b-th>REQS</b-th>
                                <b-th>RESPONSES</b-th>
                                <b-th>200 (OK)</b-th>
                                <b-th>429 (DISCRETE)</b-th>
                                <b-th>429 (GLOBAL)</b-th>
                                <!-- <b-th>OTHER</b-th> -->
                            </b-tr>
                        </b-thead>
                        <b-tbody>
                            <b-tr v-for="(obj, uri) in activityRecords" :key="uri">
                                <b-td>{{uri}}</b-td>
                                <b-td>{{obj.reqCount}}</b-td>
                                <b-td>{{obj.resCount}}</b-td>
                                <b-td>{{successString(obj)}}</b-td>
                                <b-td>{{rejectionString(obj)}}</b-td>
                                <b-td>{{globalRejectionString(obj)}}</b-td>
                                <!-- <b-td>{{obj.otherCount}}</b-td> -->
                            </b-tr>
                        </b-tbody>
                    </b-table-simple>
                </b-card>
                <b-progress id="test-progress-bar">
                    <b-progress-bar 
                    :value="testChronoProgress"
                    :label="paused? breakCountdown + ' s until next test' : testSecondsRemaining" 
                    />
                </b-progress>
            </div>
        </b-col>
        <b-col id="control-box">
             <b-card id="query-options">
                <span class="control-label">Endpoints to query</span>
                <b-form-checkbox
                    class="btn" 
                    v-for="option in options" 
                    :key="option.title" 
                    v-model="option.checked" 
                    button
                >
                    {{ option.title }}
                </b-form-checkbox>
            </b-card>
            <b-card id="frequency-slider">
                <span class="control-label">Individual request frequency</span>
                <b-form-input 
                    v-model="requestsPerThrottleWindow" 
                    type="range"
                    :min="minRequestsPerThrottleWindow"
                    :max="maxRequestsPerThrottleWindow"
                />
                <div class="d-block">
                    <h2 style="display:inline">{{requestsPerThrottleWindow + ' '}}</h2>
                    <span class="control-detail"> per {{parseInt(throttleWindow / 1000)}} s</span>
                </div>
                <span class="control-detail">{{'[' + parseFloat(requestInterval / 1000).toFixed(2)}} s break between requests]</span>
            </b-card>
        </b-col>

    </div>
</template>

<script>
const axios = require('axios')

export default {    
    name:'RateLimitTester',
    props: {
        endpoints:Array
    },
    data() {
        return {
            paused:false,
            breakCountdown:Number,
            testPeriod:20000,
            testStartedAt:Number,
            testChronoProgress:0,
            breakLength:7000,
            throttleWindow:5000,
            requestsPerThrottleWindow:6,
            minRequestsPerThrottleWindow:1,
            maxRequestsPerThrottleWindow:10,
            options:this.endpoints.reduce((result, obj) => {
                let el = {...obj}
                if (obj.uri =='/poi'
                || obj.uri == '/events/hourly' 
                || obj.uri =='/stats/daily') {
                    el.checked = true
                }
                else {
                    el.checked = false
                }
                result.push(el)
                return result
            }, []),
            activityRecords:this.initializeActivityRecords()
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
            let result = 'Within a period of ' + parseInt(this.testPeriod / 1000) + ' seconds:\n\n' 
            let attributes = ['reqCount', 'resCount', 'successes', 'rejections', 'globalRejections']
            let sums = attributes.reduce((sum,name)=> (sum[name]='',sum),{});
            for (let i = 0; i < attributes.length; i++) {
                sums[attributes[i]] = (Object.values(this.activityRecords).map(obj => obj[attributes[i]]).reduce((sum, obj) => sum + obj))
            }
            result += '- ' + sums['reqCount'] + ' requests, ' + sums['resCount'] + ' responses\n'
            result += '- ' + sums['successes'] +' accepted, ' + parseInt(sums['rejections'] + sums['globalRejections']) + ' rejected\n'
            result += '- ' + sums['rejections'] + ' rejected due to per-endpoint rate limit\n'
            result += '- ' + sums['globalRejections'] + ' rejected due to overall rate limit'
            return result
        },
        requestInterval() {
            return parseInt(this.throttleWindow / this.requestsPerThrottleWindow)
        },
        selectedEndpoints() {
            return this.options.filter((obj) => obj.checked)
        },  
        totalRequestsPerTestPeriod() {
            return parseInt(this.testPeriod / this.throttleWindow * this.requestsPerThrottleWindow * this.selectedEndpoints.length)
        },
        intensityValue() {
            let max = this.testPeriod / this.throttleWindow  * this.maxRequestsPerThrottleWindow * this.options.length
            return 100 * this.totalRequestsPerTestPeriod / max
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
        let testing = true
        for (;;) {
            setTimeout(function() {
                testing = false
            }, this.testPeriod)
            this.testStartedAt = Date.now()
            while(testing) {
                for (let i in this.selectedEndpoints) {
                    let uri = this.selectedEndpoints[i].uri
                    this.makeRequest(uri)
                }
                await this.sleep(this.requestInterval)
            }
            if (this.selectedEndpoints.length > 0) {
                await this.pause()
            }
            this.resetActivityRecords()
            testing = true
        }
    },
    methods: {
        initializeActivityRecords() {
            let result = {}
            for (let uri of this.endpoints.map(obj => obj.uri)) {
                result[uri] = {
                    reqCount:0,
                    resCount:0,
                    successes:0,
                    rejections:0,
                    globalRejections:0,
                    otherCount:0
                }
            }
            return result
        },
        makeRequest(uri) {
            let obj = this.activityRecords[uri]
            obj.reqCount++
            axios.get(uri + '?limit=1').then((r) => { // by default, the server does not limit requests from localhost.
                obj.resCount++
                r.status == 200? obj.successes++ : null
            }).catch((err) => {
                obj.resCount++
                if (err.response.data.includes('Overall')) {
                    obj.rejections++
                }
                else if (err.response.data.includes('endpoint')) {
                    obj.globalRejections++
                }
                else {
                    obj.otherCount++
                }
            })
        },
        resetActivityRecords() {
            for (let key in this.activityRecords) {
                this.activityRecords[key] = {
                    reqCount:0,
                    resCount:0,
                    successes:0,
                    rejections:0,
                    globalRejections:0,
                    otherCount:0
                }
            }
        },
        async pause() {
            // the redundancy here is due to a quirk in Vue wherein the value of the member attribute cannot be changed in the block
            // will attempt to address later
            this.paused = true
            let stayPaused = true
            setTimeout(function() {
                stayPaused = false
            }, this.breakLength)
            this.breakCountdown = parseInt(this.breakLength / 1000)
            while (stayPaused) {
                this.breakCountdown--
                await this.sleep(1000) 
            }
            this.paused = false
        },
        async sleep(ms) {
            await new Promise(r => setTimeout(r, ms));
        },
        updateTime() {
            let now = Date.now()
            if (!this.paused) {
                this.testChronoProgress = 100 * (now - this.testStartedAt) / this.testPeriod
            }
        },
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
        globalRejectionString(obj) {
            if (obj.reqCount > 0) {
                if (obj.resCount > 0) {
                    return obj.globalRejections + ' (' + parseInt(100 * obj.globalRejections / obj.reqCount) + '%)'
                }
                else return '0'
            }
            else return null
        },
    }
}

</script>

<style lang="scss">

@import '@/scss/custom.scss';

#outer-container {
    display:flex;
    padding:2em;
    border-radius:2em;
    height:100%;
    #left-column {
        display:flex;
        flex-direction: column;
        min-height:100%;
        #test-progress-bar {
            height:3em;
        }
        #table-container {
            border-radius:1em;
            border-bottom-right-radius:0;
            border-bottom-left-radius:0;
            .card-body {
                padding:0 !important;
            }
            flex:1;
            font-size:0.8em;
            height:100%;
            position:relative;
            #table-overlay {
                position:absolute;
                width:60%;
                min-height:100%;
                flex-wrap:wrap;
                #test-results {
                    white-space:pre-line;
                    display:block;
                    text-align:left
                }
            }
            
            #response-table {
                border-radius:1em;
                height:100% !important;
                margin-bottom:0;
                &.break {
                    transition:filter 0.4s;
                    filter:blur(0.4em);
                }
                #table-header {
                    th {
                        border-top:none;
                        vertical-align:middle;
                    }
                }
            }
        }
    }
}

#control-box {
    min-height:100%;
    display:flex;
    flex-direction:column;
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


#query-options, #frequency-slider {
    flex:1;
    background:theme-color("light-grey");
    border-top-right-radius:2em;
    border-bottom-right-radius:2em;
    .card-body {
        display:flex;      
        flex-direction:column;
        justify-content:center;
        width:100%;
    }
}

#query-options {
    flex-basis:60%;
    margin-bottom:1em;
    width:100%;
    .btn {
        width:100%;
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
    display:flex;
    margin-bottom:2em;
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
        min-height:10vh;
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