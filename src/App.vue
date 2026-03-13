<script>
export default {
  name: 'GameRandomizer',
  data() {
    return {
      gamesData: {
        Catan: { online: true, inPerson: true, cooperative: false },
        'Ticket to Ride: Europe': {
          online: true,
          inPerson: true,
          cooperative: false,
        },
        'Codenames Duet': { online: true, inPerson: false, cooperative: true },
        'Trickster: Spades': {
          online: true,
          inPerson: false,
          cooperative: true,
        },
        Pandemic: { online: true, inPerson: false, cooperative: true },
        'Spirit Island': { online: true, inPerson: true, cooperative: true },
        'Set with Friends': {
          online: true,
          inPerson: false,
          cooperative: false,
        },
        '7 Wonders Duel': { online: false, inPerson: true, cooperative: false },
        'Bomb Busters': { online: false, inPerson: true, cooperative: true },
        Cascadia: { online: false, inPerson: true, cooperative: false },
        'Quest for El Dorado': {
          online: false,
          inPerson: true,
          cooperative: false,
        },
        'Sky Team': { online: false, inPerson: true, cooperative: true },
        'The Crew: Mission Deep Sea': {
          online: false,
          inPerson: true,
          cooperative: true,
        },
        'Clank!': { online: false, inPerson: true, cooperative: false },
        Harmonies: { online: false, inPerson: true, cooperative: false },
        'Ticket to Ride': { online: false, inPerson: true, cooperative: false },
        'Critter Kitchen': {
          online: false,
          inPerson: true,
          cooperative: false,
        },
        Flamecraft: { online: false, inPerson: true, cooperative: false },
        'Res Arcana': { online: false, inPerson: true, cooperative: false },
        'Vale of Eternity': {
          online: false,
          inPerson: true,
          cooperative: false,
        },
        Quacks: { online: false, inPerson: true, cooperative: false },
        Everdell: { online: false, inPerson: true, cooperative: false },
        'Wingspan / Oceania': {
          online: false,
          inPerson: true,
          cooperative: false,
        },
        Azul: { online: false, inPerson: true, cooperative: false },
        'Flip 7': { online: false, inPerson: true, cooperative: false },
        'Summer Camp': { online: false, inPerson: true, cooperative: false },
        Parks: { online: false, inPerson: true, cooperative: false },
        Mysterium: { online: false, inPerson: true, cooperative: false },
        'Machi Koro Bright Lights': {
          online: false,
          inPerson: true,
          cooperative: false,
        },
        Takenoko: { online: false, inPerson: true, cooperative: false },
        Sabobatage: { online: false, inPerson: true, cooperative: false },
      },
      chosenGame: null,
      gameTypeChoice: 'Online',
      picking: false,
      customGames: [], // user-selected subset
      view: 'All',
      removedGames: [], // games removed from the current selection
    };
  },
  computed: {
    gamesOnline() {
      return Object.keys(this.gamesData).filter(
        (game) => this.gamesData[game].online
      );
    },
    gamesInPerson() {
      return Object.keys(this.gamesData).filter(
        (game) => this.gamesData[game].inPerson
      );
    },
    gamesCooperative() {
      return Object.keys(this.gamesData).filter(
        (game) => this.gamesData[game].cooperative
      );
    },
    games() {
      let games = Object.keys(this.gamesData).filter(
        (game) => !this.removedGames.includes(game)
      );

      switch (this.gameTypeChoice) {
        case 'Online':
          games = games.filter((game) => this.gamesData[game].online);
          break;
        case 'In Person':
          games = games.filter((game) => this.gamesData[game].inPerson);
          break;
        case 'Custom':
          games = this.customGames.filter(
            (game) => !this.removedGames.includes(game)
          );
          break;
        default:
          break;
      }

      if (this.view === 'Cooperative') {
        games = games.filter((game) => this.gamesData[game].cooperative);
      }

      if (this.view === 'Competitive') {
        games = games.filter((game) => !this.gamesData[game].cooperative);
      }
      return games;
    },
    sortedGames() {
      return [...this.games].sort((a, b) => a.localeCompare(b));
    },
    sortedGamesInPerson() {
      return [...this.gamesInPerson].sort((a, b) => a.localeCompare(b));
    },
    sortedAvailableGames() {
      let games = Object.keys(this.gamesData)
        .filter((game) => !this.customGames.includes(game))
        .sort((a, b) => a.localeCompare(b));

      if (this.view === 'Cooperative') {
        games = games.filter((game) => this.gamesData[game].cooperative);
      } else if (this.view === 'Competitive') {
        games = games.filter((game) => !this.gamesData[game].cooperative);
      }

      return games;
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
  },
  mounted() {
    const savedCustomGames = localStorage.getItem('customGames');
    if (savedCustomGames) {
      this.customGames = JSON.parse(savedCustomGames);
    }

    const savedChoice = localStorage.getItem('lastChoice');
    if (savedChoice) {
      this.gameTypeChoice = savedChoice;
    }
  },
  methods: {
    gameItemClasses(game) {
      const classes = ['game-item'];
      if (game === this.chosenGame) {
        classes.push('chosen');
      }
      return classes;
    },
    changeGameType() {
      this.chosenGame = null;
      this.removedGames = [];
    },
    getRandomGame() {
      const randomIndex = Math.floor(Math.random() * this.games.length);
      return this.games[randomIndex];
    },
    removeGame(game) {
      if (this.gameTypeChoice === 'Custom') {
        const index = this.customGames.indexOf(game);
        if (index !== -1) {
          this.customGames.splice(index, 1);
        }
      } else {
        if (!this.removedGames.includes(game)) {
          this.removedGames.push(game);
        }
      }
    },
    async randomizeGame() {
      if (this.picking) return;
      this.picking = true;

      const PICKS = 25;

      for (let i = 0; i < PICKS; i++) {
        this.chosenGame = this.getRandomGame();
        const delay = 10 + i * 5; // gradually slows down
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      this.picking = false;
    },
    customGameClasses(game) {
      const classes = [];
      if (this.customGames.includes(game)) {
        classes.push('chosen');
      }
      return classes;
    },
    addCustomGame(game) {
      if (!this.customGames.includes(game)) {
        this.customGames.push(game);
      }
      this.chosenGame = null;
    },
    resetGames() {
      this.customGames = [];
      this.removedGames = [];
      this.chosenGame = null;
    },
  },
};
</script>

<template>
  <div class="page">
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
      :class="['middle-section', { spinning: picking }]"
      :key="gameTypeChoice"
    >
      <div
        v-for="game in sortedGames"
        :key="game"
        :class="gameItemClasses(game)"
      >
        {{ game }}
        <button @click="removeGame(game)">x</button>
      </div>
    </TransitionGroup>

    <div v-if="gameTypeChoice === 'Custom'" class="footer-section">
      <div class="custom-selection-wrapper">
        <div>
          <p class="custom-selection-label">Add choices:</p>
        </div>
        <div>
          <label class="filter-label">Filter:</label>
          <select v-model="view">
            <option value="All">All</option>
            <option value="Cooperative">Cooperative</option>
            <option value="Competitive">Competitive</option>
          </select>
        </div>
      </div>

      <div class="games-custom-picker">
        <div
          class="custom-game-item"
          v-for="game in sortedAvailableGames"
          :key="game"
        >
          <label :class="customGameClasses(game)">
            {{ game }}
          </label>
          <button @click="addCustomGame(game)">
            {{ customGames.includes(game) ? '−' : '+' }}
          </button>
        </div>
      </div>
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
}
.page {
  font-family: 'Arial', sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh;

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

        &:disabled {
          opacity: 0.5;
          background-color: lightgray;
          cursor: default;
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

      &:disabled {
        opacity: 0.5;
        background-color: lightgray;
        cursor: default;
      }
    }
  }

  .middle-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.5em;
    margin-bottom: 5em;
    flex: 1;
    align-content: start;
    padding: 20px;

    &.spinning {
      .game-item:not(.chosen) {
        animation: slot-flicker 0.15s linear infinite;
        filter: blur(0.5px);
        opacity: 0.85;
      }
    }

    .game-item {
      display: grid;
      grid-template-columns: 1fr auto;
      position: relative;
      align-items: center;
      justify-content: center;
      gap: 0.5em;
      padding: 4px 10px;
      min-height: 22px;
      text-align: center;

      &.chosen {
        color: $chosen-colour;
        font-weight: bold;
        animation: winner 0.3s ease;
      }

      button {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: none;
        background-color: rgb(228, 228, 228);
        color: white;
        cursor: pointer;
        transition:
          background-color 0.5s ease,
          transform 0.5s ease;

        &:hover {
          background-color: red;
        }
      }
    }
  }

  .footer-section {
    position: sticky;
    bottom: 0;
    background-color: #d3d3d3;
    padding: 20px;
    max-height: 33vh;
    overflow-y: auto;
    padding-bottom: 3em;

    .games-custom-picker {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 0.5em;

      .custom-game-item {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        justify-content: center;
        gap: 0.5em;
        text-align: center;
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
      .custom-selection-label {
        display: flex;
        justify-content: center;
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
  .game-leave-to {
    opacity: 0;
  }
  .game-enter-to,
  .game-leave-from {
    opacity: 1;
  }
  .game-enter-active,
  .game-leave-active {
    transition:
      opacity 0.2s ease,
      transform 0.2s ease;
  }

  @keyframes winner {
    0% {
      transform: scale(1);
    }
    40% {
      transform: scale(1.25);
    }
    70% {
      transform: scale(1.15);
    }
    100% {
      transform: scale(1);
    }
  }
  @media (max-width: 600px) {
    .middle-section {
      padding: 10px;
      gap: 0.4em;
    }
    .footer-section {
      max-height: 40vh;
      padding-left: 12px;
      padding-right: 12px;
      padding-top: 12px;
    }
    .custom-selection-wrapper {
      flex-direction: column;
      align-items: center;
    }
    .game-item,
    .custom-game-item {
      font-size: 0.9em;
    }
    .random-button {
      width: 75%;
      max-width: 280px;
    }
  }

  @keyframes slot-flicker {
    0% {
      transform: scale(0.99);
    }
    50% {
      transform: scale(1);
    }
    100% {
      transform: scale(0.99);
    }
  }
}
</style>
