<template>
  <div id="app" class="bg-light">
    <b-navbar type="dark" variant="dark" id="nav" class="padded">
      <img id="logo" src="@/assets/eqworks.svg"/>
      <div id="logo-text" class="">
        <a href="/">Work Sample</a>
        <a id="subtitle" class="monospace" href="https://github.com/vxsl/ws-product-nodejs">@vxsl/ws-product-nodejs</a>
      </div>
      <b-navbar-nav class="ml-auto">
        <b-nav-item href="/rate-limit-test">Rate Limit Testing Module</b-nav-item>
        <b-nav-item href="/charts">Charts</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App'
}
</script>

<style lang="scss">
@import '@/scss/custom.scss';

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

.monospace {
  font-family:'Source Code Pro', 'Courier New', Courier, monospace
}

.padded {
  padding-left:9% !important;
  padding-right:9% !important;
}

#nav {
  height:7vh;
  #logo {
    padding:0.25vh;
    filter:invert(100%);
    max-height:100%;
    width:auto;
    margin-right:1em;
  }
  #logo-text {
    font-size:0.9em;
    text-align:left;
    a {
      font-weight:300;
      display:block;
      color:$light-color
    }
    #subtitle {
      font-size:0.8em;
    }
  }
}

</style>
