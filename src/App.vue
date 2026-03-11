<script>
export default {
  name: 'GameRandomizer',
  data() {
    return {
      gamesOnline: [
        'Catan', 'Ticket to Ride: Europe', 'Codenames Duet', 'Trickster: Spades', 'Pandemic'
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
        'Sabobatage'
      ],
      chosenGame: null,
      choice: 'Online'
    };
  },
  computed: {
    games() {
      switch(this.choice) {
        case 'Online':
          return this.gamesOnline;
        case 'In Person':
          return this.gamesInPerson;
      }
      return [];
    },
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
    }
  }
}
</script>

<template>
  <div class="page">
    <h1>Board Game Randomizer</h1>
    <div class="choosing-section">
      <button @click="randomizeGame">Random Game</button>
      <p class="choosing-label">{{ chosenGame }}</p>
      <select v-model="choice" @change="chosenGame = null">
        <option value="Online">Online</option>
        <option value="In Person">In Person</option>
      </select>
    </div>
    <div class="games-list">
      <div v-for="game in sortedGames" :key="game">
        <button @click="removeGame(game)">x</button>
        {{ game }}
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .page {
    h1 {
      text-align: center;
    }

    font-family: 'Arial', sans-serif;

    .games-list {
      display: grid;
      grid-template-columns: repeat(3, 1fr); 
      gap: 0.5em;

      div {
        align-items: center;
        padding: 10px;
        text-align: center;

        button {
          font-size: 0.75em;
          border-radius: 50%;
          border: none;
          background-color: lightgrey;
          color: white;
          cursor: pointer;
          
          transition: background-color 0.5s ease, transform 0.5s ease;
          
          &:hover {
            background-color: red;
          }

        }
      }
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
        color: green;
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
        background-color: #007BFF;
        color: white;
        cursor: pointer;

        &:hover {
          background-color: #0056b3;
        }
      }
    }
  }
</style>
