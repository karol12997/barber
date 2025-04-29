<template>
  <div id="app">
    <Header />
    <ServicesSection />
    <Footer />
  </div>
</template>

<script>
  import Header from '../components/Header.vue'

  import ServicesSection from '../components/ServicesSection.vue'

  import Footer from '../components/Footer.vue'

  export default {
    name: 'App',
    components: {
      Header,
      ServicesSection,
      Footer
    }
  }
</script>

<style>

  body {
    background-color: #C9B194;
    width: 100%;
  }


</style>
