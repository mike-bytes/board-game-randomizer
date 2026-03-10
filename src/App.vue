<script>
export default {
  name: 'GameRandomizer',
  data() {
    return {
      // games: [
      //   'Catan', 'Ticket to Ride: Europe', 'Codenames Duet', 'Trickster: Spades', 'Pandemic'
      // ],
      games: [
        '7 Wonders Duel',
        'Spirit Island + Horizons of Spirit Island',
        'Bomb Busters',
        'Cascadia',
        'Quest for El Dorado',
        'Sky Team',
        'Mission Deep Sea',
        'Clank',
        'Harmonies',
        'Ticket to Ride',
        'Critter Kitchen',
        'Flamecraft',
        'Res Arcana',
        'Vale of Eternity',
        'Quacks Deluxe',
        'Everdell',
        'Wingspan + Oceania',
        'Azul',
        'Flip 7',
        'Summer Camp',
        'Parks',
        'Mysterium',
        'Catan',
        'Machi Koro Bright Lights',
        'Takenoko',
        'Sabobatage',
        'Dutch Blitz',
        'Happy Dim Sum'
      ],
      chosenGame: null,
      labelClasses: ['chosen']
    };
  },
  computed: {
    sortedGames() {
      return [...this.games].sort((a, b) => a.localeCompare(b));
    }
  },
  methods: {
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
      for (let i=0; i<100; i++) {
        setTimeout(() => {
          this.chosenGame = this.getRandomGame();
        }, i * 10);
      }
      // setTimeout(() => {
      //   if (!this.labelClasses.includes('chosen')) {
      //     this.labelClasses.push('chosen');
      //   }
      // }, 1000);
    }
  }
}
</script>

<template>
  <h1>Board Game Randomizer</h1>
  <p>
    <ul>
      <div v-for="game in sortedGames" :key="game">
        <button @click="removeGame(game)">x</button>
        {{ game }}
      </div>
    </ul>
    <button @click="randomizeGame">Random Game</button>
    <p v-if="chosenGame">Chosen Game: <label :class="labelClasses">{{ chosenGame }}</label></p>
  </p>
</template>

<style>
  #app {
    font: Avenir, Helvetica, Arial, sans-serif;
    font-size: 1.2em;
  }
  .chosen {
    font-size: 2em;
    color: green;
  }
</style>
