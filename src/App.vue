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
    };
  },
  computed: {
    games() {
      switch (this.choice) {
        case 'Online':
          return this.gamesOnline;
        case 'In Person':
          return this.gamesInPerson;
      }
      return [];
    },
    sortedGames() {
      return [...this.games].sort((a, b) => a.localeCompare(b));
    },
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
  },
};
</script>

<template>
  <div class="page">
    <h1>Board Game Randomizer</h1>
    <div class="choosing-section">
      <button :disabled="picking" @click="randomizeGame">Random Game</button>
      <p class="choosing-label">{{ chosenGame }}</p>
      <select v-model="choice" @change="chosenGame = null">
        <option value="Online">Online</option>
        <option value="In Person">In Person</option>
      </select>
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
    transition: all 0.5s ease;
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
