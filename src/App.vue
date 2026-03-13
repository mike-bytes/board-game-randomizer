<script>
export default {
  name: 'GameRandomizer',
  data() {
    return {
      gamesData: {
        Catan: {
          online: true,
          inPerson: true,
          cooperative: false,
          time: [60, 120],
        },
        'Ticket to Ride: Europe': {
          online: true,
          inPerson: true,
          cooperative: false,
          time: [30, 60],
        },
        'Codenames Duet': {
          online: true,
          inPerson: false,
          cooperative: true,
          time: [15, 30],
        },
        'Trickster: Spades': {
          online: true,
          inPerson: false,
          cooperative: true,
          time: [20, 30],
        },
        Pandemic: {
          online: true,
          inPerson: false,
          cooperative: true,
          time: [45, 60],
        },
        'Spirit Island': {
          online: true,
          inPerson: true,
          cooperative: true,
          time: [90, 120],
        },
        'Set with Friends': {
          online: true,
          inPerson: false,
          cooperative: false,
          time: [20, 30],
        },
        '7 Wonders Duel': {
          online: false,
          inPerson: true,
          cooperative: false,
          time: [30, 30],
        },
        'Bomb Busters': {
          online: false,
          inPerson: true,
          cooperative: true,
          time: [30, 30],
        },
        Cascadia: {
          online: false,
          inPerson: true,
          cooperative: false,
          time: [30, 45],
        },
        'Quest for El Dorado': {
          online: false,
          inPerson: true,
          cooperative: false,
          time: [30, 60],
        },
        'Sky Team': {
          online: false,
          inPerson: true,
          cooperative: true,
          time: [20, 30],
        },
        'The Crew: Mission Deep Sea': {
          online: false,
          inPerson: true,
          cooperative: true,
          time: [20, 30],
        },
        'Clank!': {
          online: false,
          inPerson: true,
          cooperative: false,
          time: [30, 60],
        },
        Harmonies: {
          online: false,
          inPerson: true,
          cooperative: false,
          time: [30, 45],
        },
        'Ticket to Ride': {
          online: false,
          inPerson: true,
          cooperative: false,
          time: [30, 60],
        },
        'Critter Kitchen': {
          online: false,
          inPerson: true,
          cooperative: false,
          time: [60, 60],
        },
        Flamecraft: {
          online: false,
          inPerson: true,
          cooperative: false,
          time: [30, 45],
        },
        'Res Arcana': {
          online: false,
          inPerson: true,
          cooperative: false,
          time: [30, 60],
        },
        'Vale of Eternity': {
          online: false,
          inPerson: true,
          cooperative: false,
          time: [30, 45],
        },
        Quacks: {
          online: false,
          inPerson: true,
          cooperative: false,
          time: [30, 60],
        },
        Everdell: {
          online: false,
          inPerson: true,
          cooperative: false,
          time: [40, 80],
        },
        'Wingspan / Oceania': {
          online: false,
          inPerson: true,
          cooperative: false,
          time: [40, 70],
        },
        Azul: {
          online: false,
          inPerson: true,
          cooperative: false,
          time: [30, 45],
        },
        'Flip 7': {
          online: false,
          inPerson: true,
          cooperative: false,
          time: [15, 30],
        },
        'Summer Camp': {
          online: false,
          inPerson: true,
          cooperative: false,
          time: [30, 45],
        },
        Parks: {
          online: false,
          inPerson: true,
          cooperative: false,
          time: [30, 60],
        },
        Mysterium: {
          online: false,
          inPerson: true,
          cooperative: false,
          time: [40, 45],
        },
        'Machi Koro Bright Lights': {
          online: false,
          inPerson: true,
          cooperative: false,
          time: [30, 45],
        },
        Takenoko: {
          online: false,
          inPerson: true,
          cooperative: false,
          time: [45, 45],
        },
        Sabobatage: {
          online: false,
          inPerson: true,
          cooperative: false,
          time: [10, 30],
        },
        'Happy Dim Sum': {
          online: false,
          inPerson: true,
          cooperative: false,
          time: [15, 30],
        },
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

      // only apply filters to the available games, not the chosen ones
      switch (this.view) {
        case 'Cooperative': {
          games = games.filter((game) => this.gamesData[game].cooperative);
          break;
        }
        case 'Competitive': {
          games = games.filter((game) => !this.gamesData[game].cooperative);
          break;
        }
        case 'Short <30min': {
          games = games.filter((game) => {
            const averageTime =
              (this.gamesData[game].time[0] + this.gamesData[game].time[1]) / 2;
            return averageTime <= 30;
          });
          break;
        }
        case 'Medium 30-45min': {
          games = games.filter((game) => {
            const averageTime =
              (this.gamesData[game].time[0] + this.gamesData[game].time[1]) / 2;
            return averageTime > 30 && averageTime <= 45;
          });
          break;
        }
        case 'Long >45min': {
          games = games.filter((game) => {
            const averageTime =
              (this.gamesData[game].time[0] + this.gamesData[game].time[1]) / 2;
            return averageTime > 45;
          });
          break;
        }
        default: {
          break;
        }
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

      if (this.games.length === 1) {
        this.chosenGame = this.getRandomGame();
        return;
      }

      this.picking = true;

      for (let i = 0; i < 125; i++) {
        this.chosenGame = this.getRandomGame();
        await new Promise((resolve) => setTimeout(resolve, 5));
      }

      for (let i = 0; i < 25; i++) {
        this.chosenGame = this.getRandomGame();
        const delay = i * i;
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
        v-for="game in sortedGames"
        :key="game"
        :class="gameItemClasses(game)"
        @click="removeGame(game)"
      >
        {{ game }}
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

      <TransitionGroup class="games-custom-picker" tag="div" name="custom-game">
        <button
          class="custom-game-item"
          v-for="game in sortedAvailableGames"
          :key="game"
          @click="addCustomGame(game)"
        >
          <label :class="customGameClasses(game)">
            {{ game }}
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

      &:hover {
        background-color: #f5f5f5;
      }

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
      opacity 0.2s ease,
      transform 0.2s ease;
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
