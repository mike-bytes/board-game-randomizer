<template>
  <div :class="['footer-section', { hidden: isFooterHidden }]">
    <div class="custom-selection-wrapper">
      <Button @click="isFooterHidden = !isFooterHidden">{{
        isFooterHidden ? 'Show Footer' : 'Hide Footer'
      }}</Button>
      <div v-if="!isFooterHidden">
        <div>
          <label class="filter-label">Filter:</label>
          <select
            :value="modelValue"
            @change="$emit('update:modelValue', $event.target.value)"
          >
            <option v-for="filter in filters" :key="filter" :value="filter">
              {{ filter }}
            </option>
          </select>
        </div>
        <Button
          @click="$emit('add-selected-games')"
          :disabled="availableGames.length === 0"
          >Add Set</Button
        >
      </div>
    </div>

    <TransitionGroup
      v-if="!isFooterHidden"
      class="games-custom-picker"
      tag="div"
      name="custom-game"
      :key="modelValue"
    >
      <Button
        v-for="game in availableGames"
        :key="game.name"
        @click="$emit('add-custom-game', game.name)"
        :class="[
          'custom-game-item',
          { chosen: customGames.includes(game.name) },
        ]"
      >
        {{ game.name }}
        <div class="plus-circle">+</div>
      </Button>
    </TransitionGroup>
  </div>
</template>

<script>
import { GAME_VIEW } from '@/helpers/constants';
import Button from '@/components/Button.vue';

export default {
  name: 'CustomGamePicker',
  components: {
    Button,
  },
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    availableGames: {
      type: Array,
      required: true,
    },
    customGames: {
      type: Array,
      required: true,
    },
    isPicking: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'add-custom-game', 'add-selected-games'],
  data() {
    return {
      isFooterHidden: false,
      filters: Object.values(GAME_VIEW),
    };
  },
};
</script>

<style lang="scss">
@use '@/styles/variables.scss' as *;
@use '@/styles/globals.scss' as *;

.footer-section {
  position: sticky;
  bottom: 0;
  background-color: #d3d3d3;
  padding: 15px;
  min-height: 33vh;
  overflow-y: auto;
  padding-bottom: 3em;
  border-top: 1px solid darkgrey;

  &.hidden {
    max-height: 50px;
    overflow-y: hidden;
    min-height: unset;
  }

  .games-custom-picker {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.5em;

    .custom-game-item {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
      justify-content: center;
      gap: 0.5em;
      text-align: center;
      font-weight: normal;
      min-height: 58px;
      color: rgb(65, 65, 65);
      transition:
        background-color 0.3s ease,
        transform 0.3s ease;
    }
  }

  .custom-selection-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    gap: 0.5em;
    margin-bottom: 1em;

    div {
      display: flex;
      align-items: center;
      gap: 0.5em;
    }
    select {
      padding: 0.5em;
      border-radius: 5px;
      border: 1px solid #ccc;
    }
  }

  @media (max-width: 600px) {
    .footer-section {
      max-height: 40vh;
      padding-left: 12px;
      padding-right: 12px;
      padding-top: 12px;

      .custom-selection-wrapper {
        flex-direction: column;
        align-items: center;
      }
      .games-custom-picker {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      }
    }
  }
}
</style>
