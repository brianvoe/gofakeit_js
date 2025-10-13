<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({ name: 'BadgePositioningTests' });
</script>

<template>
  <div id="badge-positioning-tests" class="section">
    <h3>🎯 Badge Positioning Tests</h3>
    <p>
      This section tests various badge positioning scenarios including
      subscrolling containers, complex layouts, and viewport visibility to
      ensure badges work correctly in all situations.
    </p>

    <div class="form-group">
      <h4>📜 Subscrolling Container Test</h4>
      <p>
        Scroll within this container to test badge positioning with
        subscrolling:
      </p>
      <div
        style="
          height: 200px;
          overflow-y: auto;
          border: 2px solid var(--border-color);
          padding: 16px;
          border-radius: 8px;
          background: var(--bg-light);
        "
      >
        <div
          style="
            height: 400px;
            display: flex;
            flex-direction: column;
            gap: 16px;
          "
        >
          <div class="form-group">
            <label for="scrollTest1">Input 1 (Top of scroll area)</label>
            <input
              id="scrollTest1"
              type="text"
              placeholder="This should show badge above"
            />
          </div>
          <div class="form-group">
            <label for="scrollTest2">Input 2 (Middle of scroll area)</label>
            <input
              id="scrollTest2"
              type="text"
              placeholder="This should show badge above"
            />
          </div>
          <div class="form-group">
            <label for="scrollTest3">Input 3 (Middle of scroll area)</label>
            <input
              id="scrollTest3"
              type="text"
              placeholder="This should show badge above"
            />
          </div>
          <div class="form-group">
            <label for="scrollTest4">Input 4 (Bottom of scroll area)</label>
            <input
              id="scrollTest4"
              type="text"
              placeholder="This should show badge above"
            />
          </div>
          <div class="form-group">
            <label for="scrollTest5">Input 5 (Very bottom)</label>
            <input
              id="scrollTest5"
              type="text"
              placeholder="This should show badge above"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="form-group">
      <h4>🔄 Multiple Subscrolling Containers</h4>
      <p>Test badges in multiple nested scrollable containers:</p>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px">
        <div
          style="
            height: 150px;
            overflow-y: auto;
            border: 2px solid var(--border-color);
            padding: 12px;
            border-radius: 8px;
            background: var(--bg-light);
          "
        >
          <div
            style="
              height: 300px;
              display: flex;
              flex-direction: column;
              gap: 12px;
            "
          >
            <div class="form-group">
              <label for="multiScroll1">Left Container Input 1</label
              ><input
                id="multiScroll1"
                type="text"
                placeholder="Left scroll test"
              />
            </div>
            <div class="form-group">
              <label for="multiScroll2">Left Container Input 2</label
              ><input
                id="multiScroll2"
                type="text"
                placeholder="Left scroll test"
              />
            </div>
            <div class="form-group">
              <label for="multiScroll3">Left Container Input 3</label
              ><input
                id="multiScroll3"
                type="text"
                placeholder="Left scroll test"
              />
            </div>
          </div>
        </div>
        <div
          style="
            height: 150px;
            overflow-y: auto;
            border: 2px solid var(--border-color);
            padding: 12px;
            border-radius: 8px;
            background: var(--bg-light);
          "
        >
          <div
            style="
              height: 300px;
              display: flex;
              flex-direction: column;
              gap: 12px;
            "
          >
            <div class="form-group">
              <label for="multiScroll4">Right Container Input 1</label
              ><input
                id="multiScroll4"
                type="text"
                placeholder="Right scroll test"
              />
            </div>
            <div class="form-group">
              <label for="multiScroll5">Right Container Input 2</label
              ><input
                id="multiScroll5"
                type="text"
                placeholder="Right scroll test"
              />
            </div>
            <div class="form-group">
              <label for="multiScroll6">Right Container Input 3</label
              ><input
                id="multiScroll6"
                type="text"
                placeholder="Right scroll test"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="form-group">
      <h4>👁️ Viewport Visibility Test</h4>
      <p>Test that badges disappear when elements are out of viewport:</p>
      <div
        style="
          height: 100px;
          background: var(--bg-light);
          border: 2px solid var(--border-color);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
        "
      >
        <div class="form-group">
          <label for="viewportTest1">Input Above Viewport</label
          ><input
            id="viewportTest1"
            type="text"
            placeholder="Scroll up to hide this"
          />
        </div>
      </div>
      <div
        style="
          height: 100px;
          background: var(--bg-light);
          border: 2px solid var(--border-color);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
        "
      >
        <div class="form-group">
          <label for="viewportTest2">Input In Viewport</label
          ><input
            id="viewportTest2"
            type="text"
            placeholder="This should show badge"
          />
        </div>
      </div>
      <div
        style="
          height: 100px;
          background: var(--bg-light);
          border: 2px solid var(--border-color);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
        "
      >
        <div class="form-group">
          <label for="viewportTest3">Input Below Viewport</label
          ><input
            id="viewportTest3"
            type="text"
            placeholder="Scroll down to hide this"
          />
        </div>
      </div>
    </div>

    <div class="form-group">
      <h4>🎭 Mixed Element Types in Complex Layout</h4>
      <p>
        Test badges with different element types in a complex nested layout:
      </p>
      <div
        style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          background: var(--bg-light);
          padding: 16px;
          border-radius: 8px;
          border: 2px solid var(--border-color);
        "
      >
        <div style="display: flex; flex-direction: column; gap: 12px">
          <div class="form-group">
            <label for="complexTest1">Text Input</label
            ><input
              id="complexTest1"
              type="text"
              placeholder="Text input test"
            />
          </div>
          <div class="form-group">
            <label for="complexTest2">Email Input</label
            ><input
              id="complexTest2"
              type="email"
              placeholder="Email input test"
            />
          </div>
          <div class="form-group">
            <label for="complexTest3">Select Dropdown</label>
            <select id="complexTest3">
              <option value="">Choose option</option>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px">
          <div class="form-group">
            <label>Radio Group</label>
            <div class="radio-group">
              <div class="radio-item">
                <input
                  id="complexRadio1"
                  type="radio"
                  name="complexRadio"
                  value="option1"
                /><label for="complexRadio1">Option 1</label>
              </div>
              <div class="radio-item">
                <input
                  id="complexRadio2"
                  type="radio"
                  name="complexRadio"
                  value="option2"
                /><label for="complexRadio2">Option 2</label>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label>Checkbox Group</label>
            <div class="checkbox-group">
              <div class="checkbox-item">
                <input
                  id="complexCheck1"
                  type="checkbox"
                  value="check1"
                /><label for="complexCheck1">Check 1</label>
              </div>
              <div class="checkbox-item">
                <input
                  id="complexCheck2"
                  type="checkbox"
                  value="check2"
                /><label for="complexCheck2">Check 2</label>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="complexTest4">Textarea</label>
            <textarea id="complexTest4" rows="2" placeholder="Textarea test" />
          </div>
        </div>
      </div>
    </div>

    <div class="form-group">
      <h4>↔️ Horizontal Scrolling Test</h4>
      <p>Test badges in a horizontally scrollable container:</p>
      <div
        style="
          width: 100%;
          overflow-x: auto;
          border: 2px solid var(--border-color);
          border-radius: 8px;
          background: var(--bg-light);
        "
      >
        <div style="width: 800px; display: flex; gap: 16px; padding: 16px">
          <div class="form-group" style="min-width: 200px">
            <label for="horizontalTest1">Input 1 (Left)</label
            ><input id="horizontalTest1" type="text" placeholder="Left side" />
          </div>
          <div class="form-group" style="min-width: 200px">
            <label for="horizontalTest2">Input 2 (Center-Left)</label
            ><input
              id="horizontalTest2"
              type="text"
              placeholder="Center-left"
            />
          </div>
          <div class="form-group" style="min-width: 200px">
            <label for="horizontalTest3">Input 3 (Center-Right)</label
            ><input
              id="horizontalTest3"
              type="text"
              placeholder="Center-right"
            />
          </div>
          <div class="form-group" style="min-width: 200px">
            <label for="horizontalTest4">Input 4 (Right)</label
            ><input id="horizontalTest4" type="text" placeholder="Right side" />
          </div>
        </div>
      </div>
    </div>

    <div class="form-group">
      <h4>🪆 Nested Scrollable Containers</h4>
      <p>Test badges in deeply nested scrollable containers:</p>
      <div
        style="
          height: 200px;
          overflow-y: auto;
          border: 2px solid var(--border-color);
          padding: 16px;
          border-radius: 8px;
          background: var(--bg-light);
        "
      >
        <div
          style="
            height: 400px;
            display: flex;
            flex-direction: column;
            gap: 16px;
          "
        >
          <div class="form-group">
            <label for="nestedTest1">Outer Container Input 1</label
            ><input
              id="nestedTest1"
              type="text"
              placeholder="Outer container"
            />
          </div>
          <div
            style="
              height: 150px;
              overflow-y: auto;
              border: 1px solid var(--border-color);
              padding: 12px;
              border-radius: 4px;
              background: var(--bg-container);
            "
          >
            <div
              style="
                height: 300px;
                display: flex;
                flex-direction: column;
                gap: 12px;
              "
            >
              <div class="form-group">
                <label for="nestedTest2">Inner Container Input 1</label
                ><input
                  id="nestedTest2"
                  type="text"
                  placeholder="Inner container"
                />
              </div>
              <div class="form-group">
                <label for="nestedTest3">Inner Container Input 2</label
                ><input
                  id="nestedTest3"
                  type="text"
                  placeholder="Inner container"
                />
              </div>
              <div class="form-group">
                <label for="nestedTest4">Inner Container Input 3</label
                ><input
                  id="nestedTest4"
                  type="text"
                  placeholder="Inner container"
                />
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="nestedTest5">Outer Container Input 2</label
            ><input
              id="nestedTest5"
              type="text"
              placeholder="Outer container"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="form-group">
      <h4>🔄 Transform and Position Test</h4>
      <p>Test badges with elements that have CSS transforms and positioning:</p>
      <div
        style="
          position: relative;
          height: 200px;
          background: var(--bg-light);
          border: 2px solid var(--border-color);
          border-radius: 8px;
          padding: 16px;
        "
      >
        <div
          style="
            position: absolute;
            top: 20px;
            left: 20px;
            transform: rotate(5deg);
          "
        >
          <div class="form-group">
            <label for="transformTest1">Rotated Input</label
            ><input
              id="transformTest1"
              type="text"
              placeholder="Rotated element"
            />
          </div>
        </div>
        <div
          style="
            position: absolute;
            top: 20px;
            right: 20px;
            transform: scale(1.1);
          "
        >
          <div class="form-group">
            <label for="transformTest2">Scaled Input</label
            ><input
              id="transformTest2"
              type="text"
              placeholder="Scaled element"
            />
          </div>
        </div>
        <div
          style="
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
          "
        >
          <div class="form-group">
            <label for="transformTest3">Centered Input</label
            ><input
              id="transformTest3"
              type="text"
              placeholder="Centered element"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="form-group">
      <h4>📚 Z-Index and Overlay Test</h4>
      <p>Test badges with elements that have different z-index values:</p>
      <div
        style="
          position: relative;
          height: 150px;
          background: var(--bg-light);
          border: 2px solid var(--border-color);
          border-radius: 8px;
          padding: 16px;
        "
      >
        <div
          style="
            position: absolute;
            top: 20px;
            left: 20px;
            z-index: 1;
            background: var(--bg-container);
            padding: 8px;
            border-radius: 4px;
          "
        >
          <div class="form-group">
            <label for="zindexTest1">Z-Index 1</label
            ><input id="zindexTest1" type="text" placeholder="Z-index 1" />
          </div>
        </div>
        <div
          style="
            position: absolute;
            top: 40px;
            left: 40px;
            z-index: 2;
            background: var(--bg-container);
            padding: 8px;
            border-radius: 4px;
          "
        >
          <div class="form-group">
            <label for="zindexTest2">Z-Index 2</label
            ><input id="zindexTest2" type="text" placeholder="Z-index 2" />
          </div>
        </div>
        <div
          style="
            position: absolute;
            top: 60px;
            left: 60px;
            z-index: 3;
            background: var(--bg-container);
            padding: 8px;
            border-radius: 4px;
          "
        >
          <div class="form-group">
            <label for="zindexTest3">Z-Index 3</label
            ><input id="zindexTest3" type="text" placeholder="Z-index 3" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
