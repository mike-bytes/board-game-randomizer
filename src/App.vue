<script>
export default {
  name: 'GameRandomizer',
  data() {
    return {
      gamesOnline: [
        'Catan',
        'Ticket to Ride: Europe',
        'Codenames Duet',
        'Trickster: Spades',
        'Pandemic',
        'Spirit Island',
        'Set with Friends',
      ],
      gamesInPerson: [
        '7 Wonders Duel',
        'Spirit Island',
        'Bomb Busters',
        'Cascadia',
        'Quest for El Dorado',
        'Sky Team',
        'The Crew: Mission Deep Sea',
        'Clank!',
        'Harmonies',
        'Ticket to Ride',
        'Critter Kitchen',
        'Flamecraft',
        'Res Arcana',
        'Vale of Eternity',
        'Quacks',
        'Everdell',
        'Wingspan / Oceania',
        'Azul',
        'Flip 7',
        'Summer Camp',
        'Parks',
        'Mysterium',
        'Catan',
        'Machi Koro Bright Lights',
        'Takenoko',
        'Sabobatage',
      ],
      chosenGame: null,
      choice: 'Online',
      picking: false,
      customGames: [], // user-selected subset
    };
  },
  computed: {
    games() {
      switch (this.choice) {
        case 'Online':
          return this.gamesOnline;
        case 'In Person':
          return this.gamesInPerson;
        case 'Custom':
          return this.customGames;
      }
      return [];
    },
    sortedGames() {
      return [...this.games].sort((a, b) => a.localeCompare(b));
    },
    sortedGamesInPerson() {
      return [...this.gamesInPerson].sort((a, b) => a.localeCompare(b));
    },
  },
  watch: {
    customGames: {
      handler(newVal) {
        localStorage.setItem('customGames', JSON.stringify(newVal));
      },
      deep: true,
    },
    choice(newVal) {
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
      this.choice = savedChoice;
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
    getRandomGame() {
      const randomIndex = Math.floor(Math.random() * this.games.length);
      return this.games[randomIndex];
    },
    removeGame(game) {
      if (this.games.includes(game)) {
        this.games.splice(this.games.indexOf(game), 1);
      }
    },
    async randomizeGame() {
      if (this.picking) return;
      this.picking = true;

      const PICKS = 100;
      const DELAY = 10;

      for (let i = 0; i < PICKS; i++) {
        this.chosenGame = this.getRandomGame();
        await new Promise((resolve) => setTimeout(resolve, DELAY));
      }
      this.picking = false;
    },
    toggleCustomGame(game) {
      const index = this.customGames.indexOf(game);
      if (index === -1) {
        this.customGames.push(game);
      } else {
        this.customGames.splice(index, 1);
      }
    },
    customGameClasses(game) {
      const classes = [];
      if (this.customGames.includes(game)) {
        classes.push('chosen');
      }
      return classes;
    },
  },
};
</script>

<template>
  <div class="page">
    <h1>Board Game Randomizer</h1>
    <div class="choosing-section">
      <button :disabled="picking || !games.length" @click="randomizeGame">
        Random Game
      </button>
      <p class="choosing-label">{{ chosenGame }}</p>
      <select v-model="choice" @change="chosenGame = null">
        <option value="Online">Online</option>
        <option value="In Person">In Person</option>
        <option value="Custom">Custom</option>
      </select>
    </div>

    <div v-if="choice === 'Custom'" class="custom-selection">
      <p class="custom-selection-label">Choose games to include:</p>
      <div class="games-custom-picker">
        <div
          class="custom-games"
          v-for="game in sortedGamesInPerson"
          :key="game"
        >
          <label :class="customGameClasses(game)">
            {{ game }}
          </label>
          <button @click="toggleCustomGame(game)">
            {{ customGames.includes(game) ? '−' : '+' }}
          </button>
        </div>
      </div>
    </div>

    <TransitionGroup name="game" tag="div" class="games-list" :key="choice">
      <div
        v-for="game in sortedGames"
        :key="game"
        :class="gameItemClasses(game)"
      >
        <button @click="removeGame(game)">x</button>
        {{ game }}
      </div>
    </TransitionGroup>
  </div>
</template>

<style lang="scss">
$chosen-colour: #007bff;

.page {
  h1 {
    text-align: center;
  }

  font-family: 'Arial', sans-serif;

  .custom-selection {
    background-color: lightgray;
    padding: 20px;
    margin-bottom: 2em;

    .custom-selection-label {
      margin-bottom: 1.5em;
      display: flex;
      justify-content: center;
    }
    .games-custom-picker {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.5em;

      .custom-games {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5em;
      }
      .chosen {
        color: $chosen-colour;
        // font-weight: bold;
        font-size: 1.1em;
      }
    }
  }

  .games-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5em;
    margin-bottom: 5em;

    .game-item {
      display: flex;
      position: relative;
      align-items: center;
      justify-content: center;
      gap: 0.5em;
      padding: 5px;
      height: 30px;

      &.chosen {
        color: $chosen-colour;
        font-weight: bold;
        font-size: 1.2em;
        animation: winner 0.3s ease;
      }

      button {
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
    transition: all 0.2s ease;
  }

  .choosing-section {
    margin-bottom: 2em;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1em;

    .choosing-label {
      font-size: 2em;
      height: 1em;
      color: $chosen-colour;
      font-weight: bold;
    }

    select {
      padding: 0.5em;
      border-radius: 5px;
      border: 1px solid #ccc;
    }

    button {
      font-size: 1.25em;
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
  @keyframes winner {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(1);
    }
  }
}
</style>
