<script lang="ts">
import { defineComponent } from 'vue'
import { Autofill, AutofillStatus } from '../gofakeit/index'
import Sidebar from './Sidebar.vue'
import Context from './sections/Context.vue'
import Categories from './sections/Categories.vue'
import DateTimeInputs from './sections/DateTimeInputs.vue'
import NumberInputs from './sections/NumberInputs.vue'
import Pattern from './sections/Pattern.vue'
import CustomFunctions from './sections/CustomFunctions.vue'
import DataGofakeitTrue from './sections/DataGofakeitTrue.vue'
import NoSearchInputs from './sections/NoSearchInputs.vue'
import ExcludedFields from './sections/ExcludedFields.vue'
import ErrorDemonstration from './sections/ErrorDemonstration.vue'
import BadgePositioningTests from './sections/BadgePositioningTests.vue'

export default defineComponent({
  name: 'GofakeitDocsApp',
  components: {
    Sidebar,
    Context,
    Categories,
    DateTimeInputs,
    NumberInputs,
    Pattern,
    CustomFunctions,
    DataGofakeitTrue,
    NoSearchInputs,
    ExcludedFields,
    ErrorDemonstration,
    BadgePositioningTests,
  },
  data() {
    return {
      debug: false as boolean,
      mode: 'auto' as 'auto' | 'manual',
      stagger: 50 as number,
      badges: 3000 as number,
      status: 'Ready' as string,
      sidebarOpen: false as boolean,
      isLight: false as boolean,
    }
  },
  mounted() {
    const stored = localStorage.getItem('theme')
    const attr = document.documentElement.getAttribute('data-theme')
    const lightActive = stored === 'light' || attr === 'light'
    if (lightActive) {
      document.documentElement.setAttribute('data-theme', 'light')
      this.isLight = true
    } else {
      document.documentElement.removeAttribute('data-theme')
      this.isLight = false
    }
  },
  methods: {
    setStatus(message: string, type: 'success' | 'error' | 'info' = 'info') {
      this.status = message
      console.log(`[status:${type}]`, message)
    },
    handleStatus(status: AutofillStatus) {
      this.status = status
    },
    scrollToElement(element: Element | null) {
      if (!element) return
      const isMobile = window.innerWidth <= 768
      if (isMobile) {
        const headerOffset = 60 + 16
        const original = (element as HTMLElement).style.scrollMarginTop
        ;(element as HTMLElement).style.scrollMarginTop = headerOffset + 'px'
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        setTimeout(() => {
          ;(element as HTMLElement).style.scrollMarginTop = original
        }, 500)
      } else {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },
    async autofill(target?: string | Element) {
      try {
        // Default to .sections container when no target specified (Fill All)
        if (!target || target === '') {
          target = document.querySelector('.sections') as Element
        }

        // Always create a fresh Autofill instance to avoid settings pollution
        const manager = new Autofill({
          debug: this.debug,
          mode: this.mode,
          stagger: this.stagger,
          badges: this.badges,
          onStatusChange: this.handleStatus,
        })
        await manager.fill(target as any)
        this.setStatus('✅ Filled successfully!', 'success')
      } catch (e: any) {
        this.setStatus(`❌ ${e?.message || 'Fill failed'}`, 'error')
      }
    },
    async autofillSection(selector: string) {
      const el = document.querySelector(selector)
      this.scrollToElement(el)
      setTimeout(() => this.autofill(selector), 500)
    },
    async autofillCategory(categoryId: string) {
      const container = document.getElementById(categoryId)
      if (!container) {
        this.setStatus('❌ Category container not found!', 'error')
        return
      }
      this.scrollToElement(container)
      setTimeout(() => this.autofill(container), 500)
    },
    clearAll() {
      const mainContent = document.querySelector('.sections')
      if (!mainContent) return
      const inputs = mainContent.querySelectorAll('input, textarea, select')
      inputs.forEach(input => {
        if (input instanceof HTMLInputElement) {
          if (input.type === 'checkbox' || input.type === 'radio') {
            input.checked = false
          } else {
            input.value = ''
          }
        } else if (input instanceof HTMLTextAreaElement) {
          input.value = ''
        } else if (input instanceof HTMLSelectElement) {
          input.selectedIndex = -1
        }
      })
      this.setStatus('🧹 All fields cleared!', 'success')
    },
    toggleTheme() {
      const isLight =
        document.documentElement.getAttribute('data-theme') === 'light'
      if (isLight) {
        document.documentElement.removeAttribute('data-theme')
        localStorage.setItem('theme', 'dark')
        this.isLight = false
      } else {
        document.documentElement.setAttribute('data-theme', 'light')
        localStorage.setItem('theme', 'light')
        this.isLight = true
      }
    },
  },
})
</script>

<template>
  <header>
    <button
      class="hamburger"
      aria-label="Toggle sidebar"
      @click="sidebarOpen = !sidebarOpen"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
    <h1 class="title">Gofakeit Autofill</h1>
    <button class="theme-btn" title="Toggle theme" @click="toggleTheme">
      <span v-if="isLight">🌙</span>
      <span v-else>🌞</span>
    </button>
  </header>

  <div class="container">
    <div class="sections">
      <Context />
      <Categories />
      <DateTimeInputs />
      <NumberInputs />
      <Pattern />
      <CustomFunctions />
      <DataGofakeitTrue />
      <NoSearchInputs />
      <ExcludedFields />
      <ErrorDemonstration />
      <BadgePositioningTests />
    </div>

    <Sidebar
      :status="status"
      :mode="mode"
      :stagger="stagger"
      :badges="badges"
      :debug="debug"
      :open="sidebarOpen"
      @update:open="sidebarOpen = $event"
      @update:mode="mode = $event"
      @update:stagger="stagger = $event"
      @update:badges="badges = $event"
      @update:debug="debug = $event"
      @autofill="autofill()"
      @autofill-section="autofillSection"
      @autofill-category="autofillCategory"
      @clear-all="clearAll"
      @toggle-theme="toggleTheme"
    />
  </div>
</template>
