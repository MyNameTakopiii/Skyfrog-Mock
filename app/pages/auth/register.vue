<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
  >
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-[#A6F4C5] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
      />
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-[#3ECC82] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"
      />
      <div
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#2DAF6B] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"
      />
    </div>

    <div class="max-w-lg w-full relative z-10">
      <!-- Card Container -->
      <div
        class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-500/10 p-8 sm:p-10 space-y-8 border border-white/20"
      >
        <!-- Header -->
        <div class="text-center">
          <div
            class="mx-auto h-16 w-16 bg-gradient-to-br from-[#3ECC82] to-[#2DAF6B] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/30 transform hover:scale-105 transition-transform duration-200"
          >
            <svg
              class="h-9 w-9 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>

          <h2
            class="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
          >
            Create Account
          </h2>
          <p class="mt-3 text-sm text-gray-600 font-medium">
            Join ShopHub and start selling today
          </p>
        </div>

        <!-- Registration Form -->
        <form class="space-y-5" @submit.prevent="handleSubmit">
          <!-- Name Fields Row -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- First Name -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2"
                >First Name</label
              >
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                >
                  <svg
                    class="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  v-model="formData.firstName"
                  type="text"
                  placeholder="John"
                  :disabled="isLoading"
                  class="w-full pl-12 pr-4 py-3.5 bg-white/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  :class="{
                    'border-red-300 focus:border-red-500 focus:ring-red-500/20':
                      errors.firstName,
                  }"
                />
              </div>
              <p
                v-if="errors.firstName"
                class="mt-2 text-sm text-red-600 font-medium"
              >
                {{ errors.firstName }}
              </p>
            </div>

            <!-- Last Name -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2"
                >Last Name</label
              >
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                >
                  <svg
                    class="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  v-model="formData.lastName"
                  type="text"
                  placeholder="Doe"
                  :disabled="isLoading"
                  class="w-full pl-12 pr-4 py-3.5 bg-white/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  :class="{
                    'border-red-300 focus:border-red-500 focus:ring-red-500/20':
                      errors.lastName,
                  }"
                />
              </div>
              <p
                v-if="errors.lastName"
                class="mt-2 text-sm text-red-600 font-medium"
              >
                {{ errors.lastName }}
              </p>
            </div>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2"
              >Email Address</label
            >
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
              >
                <svg
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <input
                v-model="formData.email"
                type="email"
                placeholder="you@example.com"
                :disabled="isLoading"
                class="w-full pl-12 pr-4 py-3.5 bg-white/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                :class="{
                  'border-red-300 focus:border-red-500 focus:ring-red-500/20':
                    errors.email,
                }"
              />
            </div>
            <p
              v-if="errors.email"
              class="mt-2 text-sm text-red-600 font-medium"
            >
              {{ errors.email }}
            </p>
          </div>

          <!-- Phone Number -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2"
              >Phone Number (PromptPay)</label
            >
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
              >
                <svg
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <input
                v-model="formData.phone"
                type="tel"
                placeholder="0812345678"
                maxlength="10"
                :disabled="isLoading"
                class="w-full pl-12 pr-4 py-3.5 bg-white/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                :class="{
                  'border-red-300 focus:border-red-500 focus:ring-red-500/20':
                    errors.phone,
                }"
              />
            </div>
            <p
              v-if="errors.phone"
              class="mt-2 text-sm text-red-600 font-medium"
            >
              {{ errors.phone }}
            </p>
            <p class="mt-2 text-xs text-gray-500">
              เบอร์โทรศัพท์สำหรับรับเงินผ่าน PromptPay (10 หลัก)
            </p>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2"
              >Password</label
            >
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
              >
                <svg
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <input
                v-model="formData.password"
                type="password"
                placeholder="Min 8 characters"
                :disabled="isLoading"
                class="w-full pl-12 pr-4 py-3.5 bg-white/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                :class="{
                  'border-red-300 focus:border-red-500 focus:ring-red-500/20':
                    errors.password,
                }"
              />
            </div>
            <p
              v-if="errors.password"
              class="mt-2 text-sm text-red-600 font-medium"
            >
              {{ errors.password }}
            </p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2"
              >Confirm Password</label
            >
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
              >
                <svg
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <input
                v-model="formData.confirmPassword"
                type="password"
                placeholder="Re-enter password"
                :disabled="isLoading"
                class="w-full pl-12 pr-4 py-3.5 bg-white/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                :class="{
                  'border-red-300 focus:border-red-500 focus:ring-red-500/20':
                    errors.confirmPassword,
                }"
              />
            </div>
            <p
              v-if="errors.confirmPassword"
              class="mt-2 text-sm text-red-600 font-medium"
            >
              {{ errors.confirmPassword }}
            </p>
          </div>

          <!-- Error Message -->
          <div
            v-if="errorMessage"
            class="rounded-xl bg-red-50/80 backdrop-blur-sm border border-red-200/50 p-4"
          >
            <div class="flex">
              <div class="flex-shrink-0">
                <svg
                  class="h-5 w-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-semibold text-red-800">
                  {{ errorMessage }}
                </p>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3.5 px-4 bg-gradient-to-r from-[#3ECC82] to-[#2DAF6B] hover:from-[#36b975] hover:to-[#259a5c] text-white font-semibold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 focus:outline-none focus:ring-2 focus:ring-[#3ECC82] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>{{
              isLoading ? "Creating account..." : "Create Account"
            }}</span>
            <svg
              v-if="!isLoading"
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
            <svg
              v-else
              class="animate-spin h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </button>

          <!-- Divider -->
          <div class="relative py-4">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span
                class="px-4 bg-white/80 backdrop-blur-sm text-gray-500 font-medium rounded-full"
                >Already have an account?</span
              >
            </div>
          </div>

          <!-- Login Link -->
          <div class="text-center">
            <NuxtLink
              to="/auth/login"
              class="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-purple-600 transition-colors duration-200"
            >
              <span>Sign in instead</span>
              <svg
                class="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </NuxtLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { RegisterUserDTO } from "../../../types";
import { validateRegistrationForm } from "~/utils/validation";
import { useCustomAuth } from "~/composables/useAuth";

definePageMeta({
  layout: "default",
});

const auth = useCustomAuth();
const router = useRouter();

const formData = reactive<RegisterUserDTO & { confirmPassword: string }>({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
});

const isLoading = ref(false);
const errorMessage = ref("");
const errors = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
});

const validateForm = (): boolean => {
  errorMessage.value = "";
  const validation = validateRegistrationForm(formData);
  errors.firstName = validation.errors.firstName;
  errors.lastName = validation.errors.lastName;
  errors.email = validation.errors.email;
  errors.phone = validation.errors.phone;
  errors.password = validation.errors.password;
  errors.confirmPassword = validation.errors.confirmPassword;
  return validation.isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  isLoading.value = true;
  errorMessage.value = "";

  try {
    const registrationData: RegisterUserDTO = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      password: formData.password,
    };

    const result = await auth.register(registrationData);

    if (result.success) {
      await router.push("/auth/login");
    } else {
      errorMessage.value =
        result.error || "Registration failed. Please try again.";
    }
  } catch (error) {
    console.error("Registration error:", error);
    errorMessage.value = "An unexpected error occurred. Please try again.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }

  33% {
    transform: translate(30px, -50px) scale(1.1);
  }

  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }

  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
