<template>
  <TransitionGroup
    name="game-item"
    tag="div"
    :class="['game-grid', { isPicking: isPicking }]"
    :key="gameTypeChoice"
  >
    <Button
      v-for="game in displayedGames"
      :key="game.name"
      :class="{ 'game-item': true, chosen: game.name === chosenGameName }"
      @click="handleClick(game.name)"
    >
      {{ game.name }}
      <div class="x-circle">x</div>
    </Button>
  </TransitionGroup>
</template>

<script>
import Button from '@/components/Button.vue';
export default {
  name: 'GameGrid',
  components: {
    Button,
  },
  props: {
    gameTypeChoice: {
      type: String,
      required: true,
    },
    displayedGames: {
      type: Array,
      required: true,
    },
    chosenGameName: {
      type: String,
      default: '',
    },
    isPicking: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['game-clicked'],
  methods: {
    handleClick(gameName) {
      this.$emit('game-clicked', gameName);
    },
  },
};
</script>

<style lang="scss">
@use '@/styles/variables.scss' as *;
@use '@/styles/globals.scss' as *;

.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5em;
  margin-bottom: 5em;
  flex: 1;
  align-content: start;
  padding: 40px;

  &.isPicking {
    .game-item .x-circle {
      visibility: hidden;
    }
  }

  .game-item {
    position: relative; // for absolute x-button
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 58px;
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;

    &.chosen {
      font-weight: bold;
      animation: winner 0.2s ease;
      color: $blue;
    }

    .x-circle {
      position: absolute;
      top: 50%;
      right: 5px;
      transform: translateY(-50%) translateX(5px); // start slightly off
      opacity: 0;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: none;
      background-color: rgb(228, 228, 228);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9em;
      cursor: pointer;
      transition:
        opacity 0.3s ease,
        transform 0.3s ease,
        background-color 0.3s ease;

      &:hover {
        background-color: $darkred;
      }
    }

    &:hover .x-circle {
      opacity: 1;
      transform: translateY(-50%) translateX(0); // slide into view
      background-color: $darkred;
    }
  }

  // fade on enter/leave
  .game-item-enter-from,
  .game-item-leave-to {
    opacity: 0;
  }
  .game-item-enter-to,
  .game-item-leave-from {
    opacity: 1;
  }
  .game-item-enter-active,
  .game-item-leave-active {
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  }

  @keyframes winner {
    0% {
      transform: scale(1);
    }
    40% {
      transform: scale(1.1);
    }
    70% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }

  @media (max-width: 600px) {
    .middle-section {
      padding: 10px;
      gap: 0.4em;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    }
  }
}
</style>
