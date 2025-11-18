<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50"
  >
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        <!-- Logo and main navigation -->
        <div class="flex items-center gap-12">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-2 group">
            <span
              class="font-bold bg-gradient-to-br from-[#3ECC82] to-[#A6F4C5] bg-clip-text text-transparent text-xl"
            >
              MockShop
            </span>
          </NuxtLink>

          <!-- Desktop navigation links -->
          <div class="hidden lg:flex items-center gap-1">
            <NuxtLink
              to="/"
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-all duration-200"
            >
              Products
            </NuxtLink>
            <ClientOnly>
              <NuxtLink
                v-if="isAuthenticated"
                to="/admin"
                class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-all duration-200"
              >
                Admin
              </NuxtLink>
            </ClientOnly>
          </div>
        </div>

        <!-- Desktop auth buttons -->
        <div class="hidden lg:flex items-center gap-3">
          <ClientOnly>
            <template v-if="isAuthenticated">
              <div
                class="flex items-center gap-3 px-4 py-2 bg-gray-50/80 rounded-full"
              >
                <div
                  class="w-8 h-8 bg-gradient-to-br from-[#3ECC82] to-[#2DAF6B] rounded-full flex items-center justify-center shadow-sm shadow-green-500/20"
                >
                  <span class="text-xs font-semibold text-white">
                    {{ user?.firstName?.charAt(0).toUpperCase() }}
                  </span>
                </div>

                <span class="text-sm font-medium text-gray-700">
                  {{ user?.firstName }}
                </span>
              </div>
              <button
                :disabled="isLoggingOut"
                @click="handleLogout"
                class="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-full transition-all duration-200 disabled:opacity-50"
              >
                {{ isLoggingOut ? "Logging out..." : "Logout" }}
              </button>
            </template>
            <template v-else>
              <NuxtLink
                to="/auth/login"
                class="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-full transition-all duration-200"
              >
                Login
              </NuxtLink>
              <NuxtLink
                to="/auth/register"
                class="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#3ECC82] to-[#2DAF6B] hover:from-[#36b975] hover:to-[#259a5c] rounded-full shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-200"
              >
                Get Started
              </NuxtLink>
            </template>
          </ClientOnly>
        </div>

        <!-- Mobile menu button -->
        <div class="lg:hidden">
          <button
            type="button"
            class="inline-flex items-center justify-center p-2.5 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 transition-all duration-200"
            @click="toggleMobileMenu"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              v-if="!isMobileMenuOpen"
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              v-else
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isMobileMenuOpen"
        class="lg:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-xl"
      >
        <div class="px-4 pt-4 pb-6 space-y-2">
          <NuxtLink
            to="/"
            class="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 transition-all duration-200"
            @click="closeMobileMenu"
          >
            Products
          </NuxtLink>
          <ClientOnly>
            <NuxtLink
              v-if="isAuthenticated"
              to="/admin"
              class="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 transition-all duration-200"
              @click="closeMobileMenu"
            >
              Admin
            </NuxtLink>
          </ClientOnly>
        </div>

        <!-- Mobile auth section -->
        <div class="px-4 pb-6 pt-4 border-t border-gray-200/50">
          <ClientOnly>
            <template v-if="isAuthenticated">
              <div
                class="flex items-center gap-3 px-4 py-3 mb-3 bg-gray-50/80 rounded-xl"
              >
                <div
                  class="w-10 h-10 from-[#3ECC82] to-[#2DAF6B] rounded-full flex items-center justify-center shadow-md shadow-green-500/20"
                >
                  <span class="text-sm font-semibold text-white">
                    {{ user?.firstName?.charAt(0).toUpperCase() }}
                  </span>
                </div>

                <div>
                  <div class="text-sm font-medium text-gray-900">
                    {{ user?.firstName }}
                  </div>
                  <div class="text-xs text-gray-500">{{ user?.email }}</div>
                </div>
              </div>
              <button
                :disabled="isLoggingOut"
                @click="handleLogout"
                class="w-full px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-100/60 rounded-xl border border-gray-200/50 transition-all duration-200 disabled:opacity-50"
              >
                {{ isLoggingOut ? "Logging out..." : "Logout" }}
              </button>
            </template>
            <template v-else>
              <div class="space-y-2">
                <NuxtLink
                  to="/auth/login"
                  class="block w-full px-4 py-3 text-base font-medium text-center text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-100/60 rounded-xl border border-gray-200/50 transition-all duration-200"
                  @click="closeMobileMenu"
                >
                  Login
                </NuxtLink>
                <NuxtLink
                  to="/auth/register"
                  class="block w-full px-4 py-3 text-base font-medium text-center text-white bg-gradient-to-r from-[#3ECC82] to-[#2DAF6B] hover:from-[#36b975] hover:to-[#259a5c] rounded-xl shadow-lg shadow-green-500/25 transition-all duration-200"
                  @click="closeMobileMenu"
                >
                  Get Started
                </NuxtLink>
              </div>
            </template>
          </ClientOnly>
        </div>
      </div>
    </transition>
  </nav>

  <!-- Spacer to prevent content from going under fixed navbar -->
  <div class="h-20"></div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useCustomAuth } from "~/composables/useAuth";

const isMobileMenuOpen = ref(false);

const auth = useCustomAuth();
const isAuthenticated = auth.isAuthenticated;
const user = auth.user;
const isLoggingOut = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const handleLogout = async () => {
  isLoggingOut.value = true;
  try {
    auth.logout();
    closeMobileMenu();
    await navigateTo("/");
  } finally {
    isLoggingOut.value = false;
  }
};
</script>
