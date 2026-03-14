<template>
  <div class="game-type-wrapper">
    <label class="game-type-label"> Game Type: </label>
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option
        :key="gameType"
        :value="gameType"
        v-for="gameType in Object.values(GAME_TYPE)"
      >
        {{ gameType }}
      </option>
    </select>
    <Button
      v-if="
        removedGames.length > 0 ||
        (modelValue === GAME_TYPE.CUSTOM && selectedGames.length > 0)
      "
      class="reset-button"
      @click="$emit('reset-games')"
      :disabled="isPicking || !selectedGames.length"
    >
      Reset
    </Button>
  </div>
</template>

<script>
import Button from '@/components/Button.vue';
import { GAME_TYPE } from '@/helpers/constants';

export default {
  name: 'GameTypeSelector',
  components: {
    Button,
  },
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    selectedGames: {
      type: Array,
      required: true,
    },
    removedGames: {
      type: Array,
      required: true,
    },
    isPicking: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'reset-games'],
  data() {
    return {
      GAME_TYPE,
    };
  },
};
</script>

<style lang="scss">
@use '@/styles/variables.scss' as *;
@use '@/styles/globals.scss' as *;

.game-type-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5em;
  flex-wrap: wrap;
  justify-content: center;

  select {
    padding: 0.5em;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  .reset-button {
    padding: 0.25em 0.5em;
    background-color: $darkred;
    color: white;

    &:hover:not(:disabled) {
      background-color: $darkred;
    }
  }
}
</style>
