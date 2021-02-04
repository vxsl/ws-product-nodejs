<template>
  <div id="app" class="bg-light">
    <div v-if="mobile" class="mobile-warning d-flex justify-content-center align-items-center">
      <img id="logo" src="@/assets/eqworks.svg"/>
      <span>Unfortunately this webapp has not yet been optimized for mobile use. Please visit again on a larger display.</span>
    </div>
    <div v-else>
      <b-navbar type="dark" variant="dark" id="nav" class="padded">
        <img id="logo" src="@/assets/eqworks.svg"/>
        <div id="logo-text" class="">
          <a href="/">Work Sample</a>
          <a id="subtitle" class="monospace" href="https://github.com/vxsl/ws-product-nodejs">@vxsl/ws-product-nodejs</a>
        </div>
        <b-navbar-nav class="ml-auto" id="nav-links">
          <b-nav-item class="px-2" href="rate-limit-test">Rate Limit Testing Module</b-nav-item>
          <b-nav-item class="px-2" href="charts">Chart Visualizations</b-nav-item>
          <b-nav-item class="px-2" href="table">Data Tables</b-nav-item>
          <b-nav-item class="px-2" href="geo">Geo</b-nav-item>
          <b-nav-item class="px-2" id="mail-link" href="mailto:hi@kylegrimsrudma.nz">
            <b-icon-envelope/>
          </b-nav-item>
        </b-navbar-nav>
      </b-navbar>
      <router-view/>
    </div>
  </div>
</template>

<script>

export default {
  name: 'App',
  computed: {
    mobile() {
      return screen.width <= 760
    },
  }
}
</script>

<style lang="scss">
@import '@/scss/custom.scss';

.mobile-warning {
  background:$dark-color;
  color:$light-color;
  flex-direction:column;
  width:100vw;
  height:100vh;
  #logo {
    width:5em;
    display:block;
    filter:invert(100%);
    margin:2em;
  }
  span {
    width:60%
  }
}

#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height:100vh;
  font-weight:300;
  font-size:1.1em;
  width:100vw;
  overflow-x:hidden;
}

#module-header {
  background:$dark-grey-color;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  max-width:100vw;
  text-align:left;
  padding-top:1em;
  padding-bottom:1em;
  position:absolute;
  top:7vh;
  p {
    color:$light-grey-color;
    font-size:0.9em;
    margin:0;
    padding-left:3em !important;
    padding-right:3em !important;
  }
}

.monospace {
  font-family:'Source Code Pro', 'Courier New', Courier, monospace
}

.padded {
  padding-left:9% !important;
  padding-right:9% !important;
}

#nav {
  font-size:0.9em;
  height:7vh;
  a {
    color:$light-color;
    &:hover {
      color:$medium-grey-color;
    }
  }
  #logo {
    padding:0.25vh;
    filter:invert(100%);
    max-height:100%;
    width:auto;
    margin-right:1em;
  }
  #logo-text {
    text-align:left;
    a {
      font-weight:300;
      display:block;
    }
    #subtitle {
      font-size:0.8em;
    }
  }
}

</style>
