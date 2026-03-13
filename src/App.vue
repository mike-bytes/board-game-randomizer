<script>
import GAMES_DATA from '../data/games.json';

export default {
  name: 'GameRandomizer',
  data() {
    return {
      chosenGame: null,
      gameTypeChoice: 'Online',
      picking: false,
      customGames: [], // user-selected subset
      view: 'All',
      removedGames: [], // games removed from the current selection
      lastRandomGame: null,
      gamesList: null, // all the games from the json
      displayedGames: null,
    };
  },
  computed: {
    games() {
      let games = this.gamesList || [];
      if (this.gameTypeChoice === 'Online') {
        games = games.filter((g) => g.online);
      }
      if (this.gameTypeChoice === 'In Person') {
        games = games.filter((g) => g.inPerson);
      }
      if (this.gameTypeChoice === 'Custom') {
        games = games.filter((g) => this.customGames.includes(g.name));
      }
      return games.filter((g) => !this.removedGames.includes(g.name));
    },
    sortedGames() {
      return [...this.games].sort((a, b) => a.name.localeCompare(b.name));
    },
    sortedAvailableGames() {
      let games = this.gamesList
        .filter((game) => !this.customGames.includes(game.name))
        .sort((a, b) => a.name.localeCompare(b.name));

      // only apply filters to the available games, not the chosen ones
      return this.filterGames(games, {
        cooperative: this.view === 'Cooperative' ? true : null,
        competitive: this.view === 'Competitive' ? true : null,
        time:
          this.view === 'Short <30min'
            ? 'Short'
            : this.view === 'Medium 30-45min'
              ? 'Medium'
              : this.view === 'Long >45min'
                ? 'Long'
                : null,
      });
    },
  },
  watch: {
    customGames: {
      handler(newVal) {
        localStorage.setItem('customGames', JSON.stringify(newVal));
      },
      deep: true,
    },
    gameTypeChoice(newVal) {
      localStorage.setItem('lastChoice', newVal);
    },
    games: {
      immediate: true,
      handler(newVal) {
        this.displayedGames = this.shuffle(newVal);
      },
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
    const savedChoice = localStorage.getItem('lastChoice');
    if (savedChoice) this.gameTypeChoice = savedChoice;
  },
  methods: {
    changeGameType() {
      this.chosenGame = null;
      this.removedGames = [];
    },
    removeGame(gameName) {
      if (this.gameTypeChoice === 'Custom') {
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
      this.chosenGame = null;
    },
    resetGames() {
      this.customGames = [];
      this.removedGames = [];
      this.chosenGame = null;
    },
    getRandomGame() {
      if (!this.games.length) return null;

      let game;
      do {
        const randomIndex = Math.floor(Math.random() * this.games.length);
        game = this.games[randomIndex].name;
      } while (game === this.lastRandomGame && this.games.length > 1);
      this.lastRandomGame = game;

      return game;
    },
    async randomizeGame() {
      if (this.picking || !this.games.length) return;
      this.picking = true;

      let index = Math.floor(Math.random() * this.displayedGames.length);
      let delay = 30;
      for (let i = 0; i < 75; i++) {
        const game = this.displayedGames[index % this.displayedGames.length];

        this.chosenGame = game.name;
        this.lastRandomGame = game.name;

        await new Promise((resolve) => setTimeout(resolve, delay));

        if (i > 50) delay += i / 5; // gradually slow down near end
        index++;
      }

      this.picking = false;
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
          if (criteria.time === 'Short' && avg > 30) return false;
          if (criteria.time === 'Medium' && (avg <= 30 || avg > 45))
            return false;
          if (criteria.time === 'Long' && avg <= 45) return false;
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
  },
};
</script>

<template>
  <div :class="['page', { picking: picking }]">
    <label class="title">Board Game Randomizer</label>
    <div class="header-section">
      <label class="choosing-label">{{ chosenGame }}</label>
      <button
        class="random-button"
        @click="randomizeGame"
        :disabled="picking || !games.length"
      >
        Random Game
      </button>
      <div class="game-type-wrapper">
        <label class="game-type-label"> Game Type: </label>
        <select v-model="gameTypeChoice" @change="changeGameType">
          <option value="Online">Online</option>
          <option value="In Person">In Person</option>
          <option value="Custom">Custom</option>
        </select>
        <button
          v-if="
            removedGames.length > 0 ||
            (gameTypeChoice === 'Custom' && games.length > 0)
          "
          class="reset-button"
          @click="resetGames"
          :disabled="picking || !games.length"
        >
          Reset
        </button>
      </div>
    </div>

    <TransitionGroup
      name="game"
      tag="div"
      :class="['middle-section', { picking: picking }]"
      :key="gameTypeChoice"
    >
      <button
        v-for="game in displayedGames"
        :key="game.name"
        :class="{ 'game-item': true, chosen: game.name === chosenGame }"
        @click="removeGame(game.name)"
      >
        {{ game.name }}
        <div class="x-circle">x</div>
      </button>
    </TransitionGroup>

    <div v-if="gameTypeChoice === 'Custom'" class="footer-section">
      <div class="custom-selection-wrapper">
        <div>
          <label class="filter-label">Filter:</label>
          <select v-model="view">
            <option value="All">All</option>
            <option value="Cooperative">Cooperative</option>
            <option value="Competitive">Competitive</option>
            <option value="Short <30min">Short &lt;30min</option>
            <option value="Medium 30-45min">Medium 30-45min</option>
            <option value="Long >45min">Long &gt;45min</option>
          </select>
        </div>
      </div>

      <TransitionGroup
        class="games-custom-picker"
        tag="div"
        name="custom-game"
        :key="view"
      >
        <button
          class="custom-game-item"
          v-for="game in sortedAvailableGames"
          :key="game.name"
          @click="addCustomGame(game.name)"
        >
          <label :class="{ chosen: customGames.includes(game.name) }">
            {{ game.name }}
          </label>
          <div class="plus-circle">+</div>
        </button>
      </TransitionGroup>
    </div>
  </div>
</template>

<style lang="scss">
$chosen-colour: #007bff;
*,
*::before,
*::after {
  box-sizing: border-box;
}
body {
  margin: 0;
  padding: 0;
}
button {
  min-height: 36px;
  min-width: 36px;
  padding: 6px 12px;
  touch-action: manipulation;
  font-size: 1.1em;
  border-radius: 5px;

  &:hover {
    background-color: white;
  }
}
select {
  min-width: 160px;
  max-width: 100%;
  font-size: 1.05em;
  cursor: pointer;
  touch-action: manipulation;
}
.page {
  font-family: 'Arial', sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &.picking {
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
      font-weight: bold;
      font-size: clamp(1.2rem, 4vw, 2rem);
      text-align: center;
      color: $chosen-colour;
    }
    .game-type-wrapper {
      display: flex;
      align-items: center;
      gap: 0.5em;
      flex-wrap: wrap;
      justify-content: center;

      .game-type-label {
        font-weight: bold;
      }
      select {
        padding: 0.5em;
        border-radius: 5px;
        border: 1px solid #ccc;
      }
      .reset-button {
        font-size: 0.9em;
        padding: 0.25em 0.5em;
        border-radius: 5px;
        border: none;
        background-color: #dc3545;
        color: white;
        cursor: pointer;

        &:hover:not(:disabled) {
          background-color: #dc3545;
        }
      }
    }

    .random-button {
      font-size: 1em;
      padding: 0.5em 1em;
      border-radius: 5px;
      border: none;
      background-color: #007bff;
      color: white;
      cursor: pointer;

      &:hover:not(:disabled) {
        background-color: #0056b3;
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

    &.picking {
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
        color: $chosen-colour;
        font-weight: bold;
        animation: winner 0.3s ease;
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
          background-color: #dc3545;
        }
      }

      &:hover .x-circle {
        opacity: 1;
        transform: translateY(-50%) translateX(0); // slide into view
        background-color: #dc3545;
      }
    }
  }

  .footer-section {
    position: sticky;
    bottom: 0;
    background-color: #d3d3d3;
    padding: 20px;
    min-height: 33vh;
    overflow-y: auto;
    padding-bottom: 3em;
    border-top: 1px solid darkgrey;

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
        min-height: 58px;
        transition:
          background-color 0.3s ease,
          transform 0.3s ease;
      }
    }

    .custom-selection-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-around;
      flex-direction: row;
      gap: 0.5em;
      margin-bottom: 1em;

      div {
        display: flex;
        align-items: center;
        gap: 0.5em;
      }
      .filter-label {
        font-weight: bold;
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
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 3s ease;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
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
