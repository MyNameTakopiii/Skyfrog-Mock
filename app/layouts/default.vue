<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navbar -->
    <Navbar />

    <!-- Main content area -->
    <main class="flex-grow">
      <slot />
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navbar from "~/components/layout/Navbar.vue";
import Footer from "~/components/layout/Footer.vue";
</script>
