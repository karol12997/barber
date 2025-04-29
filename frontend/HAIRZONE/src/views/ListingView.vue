<template>
  <div id="app">
    <Header />
    <ServicesSection />
    <DatesList/>
    <Footer />
  </div>
</template>

<script>
  import Header from '../components/Header.vue'

  import ServicesSection from '../components/ServicesSection.vue'

  import Footer from '../components/Footer.vue'
  import DatesList from '../components/DatesList.vue'
  export default {
    name: 'App',
    components: {
      Header,
      ServicesSection,
      DatesList,
      Footer
    }
  }
</script>
<style></style>
