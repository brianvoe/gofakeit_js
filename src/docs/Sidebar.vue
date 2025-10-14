<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Sidebar',
  props: {
    status: { type: String, required: true },
    mode: { type: String as () => 'auto' | 'manual', required: true },
    stagger: { type: Number, required: true },
    badges: { type: Number, required: true },
    debug: { type: Boolean, required: true },
    open: { type: Boolean, default: false },
  },
  emits: [
    'update:mode',
    'update:stagger',
    'update:badges',
    'update:debug',
    'update:open',
    'autofill',
    'autofillCategory',
    'autofillSection',
    'clearAll',
  ],
  data() {
    return {
      isOpen: this.open as boolean,
    }
  },
  mounted() {
    document.addEventListener('keydown', this.handleKeydown)
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeydown)
  },
  watch: {
    open(newVal: boolean) {
      this.isOpen = newVal
      document.body.style.overflow = newVal ? 'hidden' : ''
    },
  },
  methods: {
    isMobile(): boolean {
      return window.innerWidth <= 768
    },
    onMenuClick(callback: () => void) {
      callback()
      if (this.isMobile()) this.closeSidebar()
    },
    onCategoryChange(event: Event) {
      const target = event.target as HTMLSelectElement
      const value = target.value
      if (!value) return
      this.$emit('autofillCategory', value)
      target.value = ''
      if (this.isMobile()) this.closeSidebar()
    },
    openSidebar() {
      this.isOpen = true
      document.body.style.overflow = 'hidden'
    },
    closeSidebar() {
      this.isOpen = false
      this.$emit('update:open', false)
      document.body.style.overflow = ''
    },
    toggleSidebar() {
      this.isOpen ? this.closeSidebar() : this.openSidebar()
      this.$emit('update:open', this.isOpen)
    },
    handleKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape' && this.isOpen) this.closeSidebar()
    },
  },
})
</script>

<style lang="scss">
.sidebar {
  /* Desktop sidebar */
  flex: 1 1 auto;
  width: 300px;
  min-width: 300px;
  background: var(--bg-container);
  padding: var(--spacing-lg);
  position: sticky;
  top: var(--spacing-lg);
  height: calc(100vh - 60px - var(--spacing-lg));
  margin: 0;
  overflow-x: hidden;
  overflow-y: auto;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  box-sizing: border-box;

  @media (max-width: 768px) {
    position: fixed;
    top: 60px;
    right: -100%;
    margin: 0;
    height: calc(100vh - 60px);
    width: 100%;
    transform: translateX(0);
    transition: transform var(--timing) ease;
    z-index: 1000;

    &.open {
      transform: translateX(-100%);
    }
  }

  /* Controls wrapper */
  .controls {
    text-align: center;
    padding: var(--spacing-lg);
    background: var(--bg-light);
    border-radius: var(--radius-lg);
    transition: background-color var(--timing) ease;

    .controls-title {
      margin-top: 0;
      color: var(--text-primary);
    }

    /* Status banner */
    .status {
      position: relative;
      margin-top: var(--spacing-md);
      margin-bottom: var(--spacing-md);
      padding: 10px var(--spacing-lg);
      border-radius: var(--radius-sm);
      color: white;
      font-weight: 500;
      font-size: 14px;
      transition: all var(--timing) ease;
      display: block;

      &.starting,
      &.found,
      &.determined {
        background: var(--info-color);
      }
      &.generated,
      &.set {
        background: var(--warning-color);
      }
      &.completed,
      &.success {
        background: var(--success-color);
      }
      &.error {
        background: var(--danger-color);
      }
    }

    /* Settings */
    .settings-section {
      margin-top: var(--spacing-lg);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
      padding-top: var(--spacing-lg);
      border-top: 1px solid var(--border-color);

      h4 {
        margin: 0 0 var(--spacing-md) 0;
        color: var(--text-primary);
        font-size: var(--font-base);
        font-weight: 600;
      }

      .setting-item {
        background: var(--bg-light);
        padding: var(--spacing-sm);
        border-radius: var(--radius-sm);
        border: 1px solid var(--border-color);
        margin-bottom: var(--spacing-sm);

        &:last-child {
          margin-bottom: 0;
        }

        .mode-toggle {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-xs);

          .mode-label {
            color: white;
            font-weight: 600;
            text-align: center;
          }

          .toggle {
            margin: 0 auto;
          }
        }

        .setting-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--spacing-sm);
          cursor: pointer;
          font-weight: 500;

          .setting-text {
            flex: 1;
            font-size: var(--font-base);
            font-weight: 500;
            color: var(--text-primary);
          }
        }

        .setting-slider-container {
          margin-top: 2px;
          padding: 2px 0;

          .setting-range {
            margin: 0;
            padding: 0;
            height: 20px;
            width: 150px;
          }
        }

        .setting-description {
          color: var(--text-secondary);
          font-size: var(--font-sm);
          margin-top: var(--spacing-xs);
        }
      }
    }
  }
}
</style>

<template>
  <aside class="sidebar" :class="{ open: isOpen }">
    <div class="controls">
      <h3 class="controls-title">🎮 Controls</h3>

      <div id="status" class="status">{{ status }}</div>

      <button class="btn" @click="onMenuClick(() => $emit('autofill'))">
        🚀 Fill All Fields
      </button>
      <button
        class="btn btn-secondary"
        @click="onMenuClick(() => $emit('autofillSection', '#rich-context'))"
      >
        📝 Rich Context
      </button>
      <button
        class="btn btn-secondary"
        @click="onMenuClick(() => $emit('autofillSection', '#medium-context'))"
      >
        📋 Medium Context
      </button>
      <button
        class="btn btn-secondary"
        @click="onMenuClick(() => $emit('autofillSection', '#sparse-context'))"
      >
        🔍 Sparse Context
      </button>
      <button
        class="btn btn-secondary"
        @click="onMenuClick(() => $emit('autofillSection', '#categories'))"
      >
        🏷️ All Categories
      </button>

      <select class="btn btn-secondary" @change="onCategoryChange">
        <option value="">🎯 Select Category...</option>
        <option value="person-category">👤 Person Category</option>
        <option value="address-category">🏠 Address Category</option>
        <option value="company-category">🏢 Company Category</option>
        <option value="payment-category">💳 Payment Category</option>
        <option value="internet-category">🌐 Internet Category</option>
        <option value="time-category">⏰ Time Category</option>
        <option value="language-category">🗣️ Language Category</option>
        <option value="word-category">📝 Word Category</option>
        <option value="color-category">🎨 Color Category</option>
        <option value="animal-category">🐾 Animal Category</option>
        <option value="food-category">🍕 Food Category</option>
        <option value="car-category">🚗 Car Category</option>
        <option value="product-category">📦 Product Category</option>
        <option value="game-category">🎮 Game Category</option>
        <option value="misc-category">🎲 Misc Category</option>
      </select>

      <button
        class="btn btn-secondary"
        @click="
          onMenuClick(() => $emit('autofillSection', '#date-time-inputs'))
        "
      >
        📅 Date & Time
      </button>
      <button
        class="btn btn-secondary"
        @click="onMenuClick(() => $emit('autofillSection', '#number-inputs'))"
      >
        🔢 Number Inputs
      </button>
      <button
        class="btn btn-secondary"
        @click="onMenuClick(() => $emit('autofillSection', '#pattern-inputs'))"
      >
        🔣 Pattern Inputs
      </button>
      <button
        class="btn btn-secondary"
        @click="
          onMenuClick(() => $emit('autofillSection', '#custom-functions'))
        "
      >
        🎯 Custom Functions
      </button>
      <button
        class="btn btn-secondary"
        @click="
          onMenuClick(() => $emit('autofillSection', '#data-gofakeit-true'))
        "
      >
        ✅ Data-gofakeit="true"
      </button>
      <button
        class="btn btn-secondary"
        @click="
          onMenuClick(() => $emit('autofillSection', '#no-search-inputs'))
        "
      >
        🚫 No Search Inputs
      </button>
      <button
        class="btn btn-secondary"
        @click="
          onMenuClick(() => $emit('autofillSection', '#error-demonstration'))
        "
      >
        ⚠️ Error Demonstration
      </button>
      <button
        class="btn btn-secondary"
        @click="
          onMenuClick(() =>
            $emit('autofillSection', '#badge-positioning-tests')
          )
        "
      >
        🎯 Badge Tests
      </button>
      <button
        class="btn btn-success"
        @click="onMenuClick(() => $emit('clearAll'))"
      >
        🧹 Clear All
      </button>

      <div class="settings-section">
        <h4>🔧 Settings</h4>

        <div class="setting-item">
          <div class="mode-toggle">
            <span class="mode-label">Mode:</span>
            <div class="toggle">
              <label class="option">
                <input
                  type="radio"
                  name="mode"
                  value="auto"
                  :checked="mode === 'auto'"
                  @change="$emit('update:mode', 'auto')"
                />
                Auto
              </label>
              <label class="option">
                <input
                  type="radio"
                  name="mode"
                  value="manual"
                  :checked="mode === 'manual'"
                  @change="$emit('update:mode', 'manual')"
                />
                Manual
              </label>
            </div>
          </div>
          <div class="setting-description">
            Auto: Fill all fields | Manual: Only marked fields
          </div>
        </div>

        <div class="setting-item">
          <div class="setting-label">
            <span class="setting-text"
              >Stagger: <span class="setting-value">{{ stagger }}ms</span></span
            >
          </div>
          <div class="setting-slider-container">
            <input
              class="setting-range"
              type="range"
              min="0"
              max="300"
              :value="stagger"
              @input="
                $emit(
                  'update:stagger',
                  Number(($event.target as HTMLInputElement).value)
                )
              "
            />
          </div>
          <div class="setting-description">
            0ms = immediate, 50ms+ = staggered delays between fills
          </div>
        </div>

        <div class="setting-item">
          <div class="setting-label">
            <span class="setting-text"
              >Badges: <span class="setting-value">{{ badges }}ms</span></span
            >
          </div>
          <div class="setting-slider-container">
            <input
              class="setting-range"
              type="range"
              min="0"
              max="10000"
              :value="badges"
              @input="
                $emit(
                  'update:badges',
                  Number(($event.target as HTMLInputElement).value)
                )
              "
            />
          </div>
          <div class="setting-description">
            0ms = no badges, 1000ms+ = badges stay visible for this duration
          </div>
        </div>

        <div class="setting-item">
          <div class="setting-label">
            <span class="setting-text">Debug:</span>
            <label class="toggle-option">
              <input
                type="checkbox"
                :checked="debug"
                @change="
                  $emit(
                    'update:debug',
                    ($event.target as HTMLInputElement).checked
                  )
                "
              />
              {{ debug ? 'ON' : 'OFF' }}
            </label>
          </div>
          <div class="setting-description">
            Show detailed console logs for debugging
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>
