<script lang="ts">
import GAMES_DATA from './data/games.json';
import { gamesList } from '@/data/games';
import { GAME_TYPE, GAME_VIEW } from '@/helpers/constants';

import type { Game, GamesJson } from '@/types/Game';
import type { GameView, GameType } from '@/helpers/constants';

import Button from '@/components/Button.vue';
import GameGrid from '@/components/GameGrid.vue';
import GameTypeSelector from '@/components/GameTypeSelector.vue';
import CustomGamePicker from './components/CustomGamePicker.vue';

export default {
  name: 'App',
  components: {
    Button,
    GameGrid,
    GameTypeSelector,
    CustomGamePicker,
  },
  data() {
    return {
      GAME_TYPE, // for template access
      GAME_VIEW, // for template access

      gameTypeChoice: GAME_TYPE.ONLINE as GameType,
      view: GAME_VIEW.ALL as GameView,

      customGames: [] as string[], // user-selected subset
      removedGames: [] as string[], // games removed from the current selection

      displayedGames: [] as Game[],

      isPicking: false,
      chosenGameName: null as string | null,
      lastRandomGame: null as string | null,
    };
  },
  computed: {
    selectedGames(): Game[] {
      let games = gamesList || [];
      if (this.gameTypeChoice === GAME_TYPE.ONLINE) {
        games = games.filter((g) => g.online);
      }
      if (this.gameTypeChoice === GAME_TYPE.IN_PERSON) {
        games = games.filter((g) => g.inPerson);
      }
      if (this.gameTypeChoice === GAME_TYPE.CUSTOM) {
        games = games.filter((g) => this.customGames.includes(g.name));
      }
      return games.filter((g) => !this.removedGames.includes(g.name));
    },
    availableGames(): Game[] {
      let games = gamesList
        .filter((game) => !this.customGames.includes(game.name))
        .sort((a, b) => a.name.localeCompare(b.name));

      // only apply filters to the available games, not the chosen ones
      return this.filterGames(games, {
        cooperative: this.view === GAME_VIEW.COOPERATIVE ? true : null,
        competitive: this.view === GAME_VIEW.COMPETITIVE ? true : null,
        time:
          this.view === GAME_VIEW.SHORT ||
          this.view === GAME_VIEW.MEDIUM ||
          this.view === GAME_VIEW.LONG
            ? this.view
            : null,
      });
    },
  },
  watch: {
    selectedGames: {
      immediate: true,
      handler(newVal) {
        this.displayedGames = this.shuffle(newVal);
      },
    },
    customGames: {
      handler(newVal) {
        localStorage.setItem('customGames', JSON.stringify(newVal));
      },
      deep: true,
    },
    gameTypeChoice(newVal) {
      localStorage.setItem('lastGameTypeChoice', newVal);
    },
  },
  mounted() {
    const savedCustomGames = localStorage.getItem('customGames');
    if (savedCustomGames) this.customGames = JSON.parse(savedCustomGames);
    const savedChoice = localStorage.getItem('lastGameTypeChoice');
    if (savedChoice && this.isGameType(savedChoice)) {
      this.gameTypeChoice = savedChoice as GameType;
    }
  },
  methods: {
    changeGameType() {
      this.chosenGameName = null;
      this.removedGames = [];
    },
    removeGame(gameName: string) {
      if (this.gameTypeChoice === GAME_TYPE.CUSTOM) {
        const index = this.customGames.indexOf(gameName);
        if (index !== -1) {
          this.customGames.splice(index, 1);
        }
      } else {
        if (!this.removedGames.includes(gameName)) {
          this.removedGames.push(gameName);
        }
      }
    },
    addCustomGame(gameName: string) {
      if (!this.customGames.includes(gameName)) {
        this.customGames.push(gameName);
      }
      this.chosenGameName = null;
    },
    resetGames() {
      this.customGames = [];
      this.removedGames = [];
      this.chosenGameName = null;
    },
    getRandomGame(): string | null {
      if (!this.selectedGames.length) return null;

      let game: string | null;
      do {
        const randomIndex = Math.floor(
          Math.random() * this.selectedGames.length
        );
        game = this.selectedGames[randomIndex]?.name ?? null;
      } while (game === this.lastRandomGame && this.selectedGames.length > 1);
      this.lastRandomGame = game;

      return game;
    },
    async randomizeGame() {
      if (this.isPicking || !this.selectedGames.length) return;
      this.isPicking = true;

      let index = Math.floor(Math.random() * this.displayedGames.length);
      let delay = 30;
      for (let i = 0; i < 75; i++) {
        const game = this.displayedGames[index % this.displayedGames.length];
        if (!game) break;

        this.chosenGameName = game.name;
        this.lastRandomGame = game.name;

        await new Promise((resolve) => setTimeout(resolve, delay));

        if (i > 50) delay += i / 5; // gradually slow down near end
        index++;
      }

      this.isPicking = false;
    },
    filterGames(
      games: Game[],
      criteria: {
        cooperative: boolean | null;
        competitive: boolean | null;
        time: string | null;
      }
    ): Game[] {
      return games.filter((game) => {
        if (criteria.cooperative && game.cooperative !== criteria.cooperative) {
          return false;
        }
        if (criteria.competitive && game.cooperative === criteria.competitive) {
          return false;
        }
        if (criteria.time) {
          const avg = this.getAverageTime(game);
          if (criteria.time === GAME_VIEW.SHORT && avg > 30) return false;
          if (criteria.time === GAME_VIEW.MEDIUM && (avg <= 30 || avg > 45))
            return false;
          if (criteria.time === GAME_VIEW.LONG && avg <= 45) return false;
        }
        return true;
      });
    },
    getAverageTime(game: Game): number {
      return (game.time[0] + game.time[1]) / 2;
    },
    shuffle(array: Game[]): Game[] {
      const a = [...array];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp: Game = a[i]!; // ! to tell TypeScript that a[i[ is never undefined
        a[i] = a[j]!;
        a[j] = temp;
      }
      return a;
    },
    addSelectedGames() {
      const gamesToAdd = this.availableGames.map((g) => g.name);
      this.customGames.push(...gamesToAdd);
      this.chosenGameName = null;
    },
    isGameType(value: string): value is GameType {
      return Object.values(GAME_TYPE).includes(value as GameType);
    },
  },
};
</script>

<template>
  <div :class="['page', { isPicking: isPicking }]">
    <label class="title">Board Game Randomizer</label>
    <div class="header-section">
      <label class="choosing-label">{{ chosenGameName }}</label>
      <Button
        class="random-button"
        @click="randomizeGame"
        :disabled="isPicking || selectedGames.length === 0"
      >
        Random Game
      </Button>
      <GameTypeSelector
        v-model="gameTypeChoice"
        :selectedGames="selectedGames"
        :removedGames="removedGames"
        :isPicking="isPicking"
        @change-game-type="changeGameType"
        @reset-games="resetGames"
      />
    </div>

    <GameGrid
      :gameTypeChoice="gameTypeChoice"
      :displayedGames="displayedGames"
      :chosenGameName="chosenGameName"
      :isPicking="isPicking"
      @game-clicked="removeGame"
    />

    <CustomGamePicker
      v-if="gameTypeChoice === GAME_TYPE.CUSTOM"
      v-model="view"
      :availableGames="availableGames"
      :customGames="customGames"
      :isPicking="isPicking"
      @add-custom-game="addCustomGame"
      @add-selected-games="addSelectedGames"
    />
  </div>
</template>

<style lang="scss">
@use '@/styles/variables.scss' as *;
@use '@/styles/globals.scss' as *;

.page {
  font-family: 'Arial', sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &.isPicking {
    background-color: rgb(223, 223, 223);
  }

  .title {
    font-size: clamp(1.5rem, 5vw, 3rem);
    text-align: center;
    font-weight: bold;
    margin: 20px 0;
  }
  .header-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1em;

    .choosing-label {
      height: 1.5em;
      font-size: clamp(1.2rem, 4vw, 2rem);
      text-align: center;
      color: $blue;
    }

    .random-button {
      background-color: $blue;
      color: white;
      padding: 1em 3em;

      &:hover:not(:disabled) {
        background-color: $blue;
      }
    }
  }

  /* fade on enter/leave */
  .game-enter-from,
  .game-leave-to,
  .custom-game-enter-from,
  .custom-game-leave-to {
    opacity: 0;
  }
  .game-enter-to,
  .game-leave-from,
  .custom-game-enter-to,
  .custom-game-leave-from {
    opacity: 1;
  }
  .game-enter-active,
  .game-leave-active,
  .custom-game-enter-active,
  .custom-game-leave-active {
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
    .random-button {
      width: 75%;
      max-width: 280px;
    }
  }
}
</style>
