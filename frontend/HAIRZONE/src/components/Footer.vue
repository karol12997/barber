<template>
  <footer class="footer">
    <div class="social-links">
      <a href="#" target="_blank">Facebook</a>
      <a href="#" target="_blank">Twitter</a>
      <a href="#" target="_blank">Instagram</a>
    </div>
    <div class="footer-links">
      <a href="#">Terms & Conditions</a>
      <a href="#">Privacy Policy</a>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
  .footer {
    background-color: #A08963;
    width: 100%;
    color: white;
    padding: 20px;
    text-align: center;
    position: fixed;
    bottom: 0;
  }

  .social-links a, .footer-links a {
    color: white;
    margin: 0 10px;
    text-decoration: none;
  }
</style>
