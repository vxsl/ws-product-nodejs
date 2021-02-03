<template>
  <div class="home">
    <b-jumbotron id="jumbo">
      <span id="header">Hello, hiring manager!</span>
      <span class="lead">
        My name is Kyle Grimsrud-Manz - welcome to my work sample for EQ Works.
      </span>
      <hr>
      <div id="buttons">
        <b-button class="btn monospace" href="/rate-limit-test">1. Server-side rate limit testing and visualization</b-button>
        <b-button class="btn monospace" href="/charts">2a(A). Client-side general chart visualizations</b-button>
        <b-button class="btn monospace" href="/table">2a(B). Client-side data table</b-button>
        <b-button class="btn monospace" href="/geo">2a(C). Client-side geo visualizations</b-button>
      </div>
      <hr>
      <a id="mail-link" href="mailto:hi@kylegrimsrudma.nz">
        <b-icon-envelope/>
      </a>
    </b-jumbotron>
  </div>
</template>

<script>

export default {
  name: 'Home',
}
</script>

<style lang="scss">
@import '@/scss/custom.scss';

#jumbo {
  min-height:93vh;
  margin:0;
  display:flex;
  flex-direction: column;
  justify-content:center;
  padding-left:20%;
  padding-right:20%;
  #mail-link {
    font-size:3em;
  }
  #header {
    font-size:4em;
  }
  #buttons {
    align-self: center;
    width:50%;
    display:flex;
    flex-direction:column;
    .btn {
      background:$medium-grey-color;
      color:$dark-grey-color;
      border:none;
      margin:0.5em;
    }
  }
}

</style>
