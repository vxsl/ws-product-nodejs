<template>
    <b-row id="outer-container" class="bg-light">
        <b-col cols="8">
            <b-progress id="intensity" height="100%" >
                <span v-if="selected.length == 0" class="select-endpoint-prompt"><strong>Please select endpoints to test.</strong></span>
                <b-progress-bar  v-else :value="intensityValue" id="intensity-bar" :class="intensityClass">
                    <div id="intensity-label">
                    <h1>{{ requestsPerSecond * selected.length }}</h1>
                    <span>requests per second</span>
                    </div>
                </b-progress-bar>
            </b-progress>
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
                <span class="control-label">Request frequency</span>
                <b-form-input 
                    v-model="requestsPerSecond" 
                    type="range"
                    :min="minRequests"
                    :max="maxRequests"
                    @input="$emit('update:intensityValue', intensityValue)"
                />
                <span class="control-detail">{{requestsPerSecond}} requests per endpoint per second</span>
            </div>
        </b-col>

    </b-row>
</template>

<script>
const axios = require('axios')

export default {    
    name:'RateLimitTester',
    data() {
        return {
            requestsPerSecond:215,
            maxRequests:250,
            minRequests:1,
            options: [
                { text: 'POI', value: 'poi', checked:false },
                { text: 'Hourly Events', value: 'events/hourly', checked:true },
                { text: 'Daily Events', value: 'events/daily', checked:false },
                { text: 'Hourly Statistics', value: 'stats/hourly', checked:true },
                { text: 'Daily Statistics', value: 'stats/daily', checked:false }
            ]
        }
    },
    computed: {
        selected() {
            return this.options.filter((obj) => obj.checked)
        },  
        intensityValue() {
            return 100 * (this.requestsPerSecond / this.maxRequests) * this.selected.length / this.options.length
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
        for (;;) {
            await this.sleep(1000)
        }
    },
    methods: {
        makeRequest() {
            axios.get()
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