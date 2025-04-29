<template>
  <div>
    <h1>Dates Page</h1>
    <ul>
      <li v-for="date in dates" :key="date.id">
        {{ date.title }} - {{ date.date }}
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'Dates',
    data() {
      return {
        dates: []
      };
    },
    created() {
      fetch('http://localhost:3000/api/dates')
        .then(response => response.json())
        .then(data => {
          this.dates = data.dates;
        })
        .catch(error => {
          console.error('Error fetching dates:', error);
        });
    }
  };
</script>

<style scoped>
  h1 {
    color: #333;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    margin-bottom: 10px;
  }
</style>
