<script>
import GAMES_DATA from '../data/games.json';
import Button from '@/components/Button.vue';
import { GAME_TYPE, GAME_VIEW } from '@/helpers/constants';

export default {
  name: 'GameRandomizer',
  components: {
    Button,
  },
  data() {
    return {
      GAME_TYPE, // for template access
      GAME_VIEW, // for template access

      gamesList: null, // all the games from the json

      gameTypeChoice: GAME_TYPE.ONLINE,
      view: GAME_VIEW.ALL,

      customGames: [], // user-selected subset
      removedGames: [], // games removed from the current selection

      displayedGames: null,

      isPicking: false,
      chosenGameName: null,
      lastRandomGame: null,

      isFooterHidden: false,
    };
  },
  computed: {
    selectedGames() {
      let games = this.gamesList || [];
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
    availableGames() {
      let games = this.gamesList
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
  created() {
    this.gamesList = Object.entries(GAMES_DATA).map(([name, data]) => ({
      name,
      ...data,
    }));
  },
  mounted() {
    const savedCustomGames = localStorage.getItem('customGames');
    if (savedCustomGames) this.customGames = JSON.parse(savedCustomGames);
    const savedChoice = localStorage.getItem('lastGameTypeChoice');
    if (savedChoice) this.gameTypeChoice = savedChoice;
  },
  methods: {
    changeGameType() {
      this.chosenGameName = null;
      this.removedGames = [];
    },
    removeGame(gameName) {
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
    addCustomGame(gameName) {
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
    getRandomGame() {
      if (!this.selectedGames.length) return null;

      let game;
      do {
        const randomIndex = Math.floor(
          Math.random() * this.selectedGames.length
        );
        game = this.selectedGames[randomIndex].name;
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

        this.chosenGameName = game.name;
        this.lastRandomGame = game.name;

        await new Promise((resolve) => setTimeout(resolve, delay));

        if (i > 50) delay += i / 5; // gradually slow down near end
        index++;
      }

      this.isPicking = false;
    },
    filterGames(games, criteria) {
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
    getAverageTime(game) {
      return (game.time[0] + game.time[1]) / 2;
    },
    shuffle(array) {
      const a = [...array];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    addSelectedGames() {
      const gamesToAdd = this.availableGames.map((g) => g.name);
      this.customGames.push(...gamesToAdd);
      this.chosenGameName = null;
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
        :disabled="isPicking || this.selectedGames.length === 0"
      >
        Random Game
      </Button>
      <div class="game-type-wrapper">
        <label class="game-type-label"> Game Type: </label>
        <select v-model="gameTypeChoice" @change="changeGameType">
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
            (gameTypeChoice === GAME_TYPE.CUSTOM && selectedGames.length > 0)
          "
          class="reset-button"
          @click="resetGames"
          :disabled="isPicking || !selectedGames.length"
        >
          Reset
        </Button>
      </div>
    </div>

    <TransitionGroup
      name="game"
      tag="div"
      :class="['middle-section', { isPicking: isPicking }]"
      :key="gameTypeChoice"
    >
      <Button
        v-for="game in displayedGames"
        :key="game.name"
        :class="{ 'game-item': true, chosen: game.name === chosenGameName }"
        @click="removeGame(game.name)"
      >
        {{ game.name }}
        <div class="x-circle">x</div>
      </Button>
    </TransitionGroup>

    <div
      v-if="gameTypeChoice === GAME_TYPE.CUSTOM"
      :class="['footer-section', { hidden: isFooterHidden }]"
    >
      <div class="custom-selection-wrapper">
        <Button @click="isFooterHidden = !isFooterHidden">{{
          isFooterHidden ? 'Show Footer' : 'Hide Footer'
        }}</Button>
        <div v-if="!isFooterHidden">
          <div>
            <label class="filter-label">Filter:</label>
            <select v-model="view">
              <option
                v-for="filter in Object.values(GAME_VIEW)"
                :key="filter"
                :value="filter"
              >
                {{ filter }}
              </option>
            </select>
          </div>
          <Button
            @click="addSelectedGames"
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
        :key="view"
      >
        <Button
          v-for="game in availableGames"
          :key="game.name"
          @click="addCustomGame(game.name)"
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
  </div>
</template>

<style lang="scss">
$blue: #007bff;
$darkred: #dc3545;

*,
*::before,
*::after {
  box-sizing: border-box;
}
body {
  margin: 0;
  padding: 0;
}
select {
  min-width: 160px;
  max-width: 100%;
  font-size: 1.05em;
  cursor: pointer;
  touch-action: manipulation;
}
label {
  font-weight: bold;
}
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

    .random-button {
      background-color: $blue;
      color: white;
      padding: 1em 3em;

      &:hover:not(:disabled) {
        background-color: $blue;
      }
    }
  }

  .middle-section {
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
        background-color 0.5s ease,
        transform 0.5s ease;

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
  }

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
      opacity 2s ease,
      transform 2s ease;
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
    .random-button {
      width: 75%;
      max-width: 280px;
    }
  }
}
</style>
