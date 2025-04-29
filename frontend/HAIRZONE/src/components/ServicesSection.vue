<template>
  <section class="services">
    <h2>Popular Services</h2>
    <div class="services-list">
      <div class="service-card" v-for="service in services" :key="service.id">

        <h3>{{ service.name }}</h3>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ServicesSection',
  data() {
    return {
      services: [
        { id: 1, name: 'Haircut' },
        { id: 2, name: 'Massage'},
        { id: 3, name: 'Nails' }
      ]
    }
  }
}
</script>

<style scoped>
    .services {
      text-align: center;
    }
    .services-list {
      display: flex;
      justify-content: center;
      gap: 30px;
    }
    .service-card {
      text-align: center;
    }

</style>
