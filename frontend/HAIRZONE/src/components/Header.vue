<template>
  <header class="header">
    <div class="logo"><img alt="Vue logo" class="logo" src="@/assets/logoHairZone.png" width="125" height="125" /></div>
    <div class="search-container">
      <input type="text" placeholder="Search for services..." />
      <button>Search</button>
    </div>
    <nav class="navbar">

      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">Services</a></li>
        <li><a href="#">Pricing</a></li>
        <li><a href="#">Login</a></li>
      </ul>
    </nav>

  </header>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style scoped>
  .header {
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
  }

  .navbar ul {
    width:100%;
    display: inline-flex;
    list-style: none;
  }

  .navbar li {
    margin: 0 15px;
  }
  .search-container{
    display:flex;
  }
  .search-container input {
    padding: 10px;
    border-radius: 5px;
  }

  .search-container button {
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
  }
</style>
