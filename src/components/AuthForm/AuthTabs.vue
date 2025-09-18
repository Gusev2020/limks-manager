<script setup lang="ts">
import { ref } from 'vue'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'

import LoginForm from '@/components/AuthForm/LoginForm.vue'
import RegisterForm from '@/components/AuthForm/RegisterForm.vue'
import ResetPasswordForm from './ResetPasswordForm.vue'

type Tab = 'singin' | 'singup' | 'reset'

const activeTab = ref<Tab>('singin') // singin | singup | reset
</script>

<template>
  <Tabs v-model:value="activeTab">
    <TabList>
      <Tab value="singin">Вход</Tab>
      <Tab value="singup">Регистрация</Tab>
    </TabList>
    <TabPanels>
      <TabPanel value="singin">
        <LoginForm @resetPassword="activeTab = 'reset'" />
      </TabPanel>
      <TabPanel value="singup">
        <RegisterForm />
      </TabPanel>
      <TabPanel value="reset">
        <ResetPasswordForm />
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>

<style scoped></style>
