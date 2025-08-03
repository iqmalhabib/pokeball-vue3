<template>
  <div class="d-flex justify-content-center">
    <LoadingSpinner v-if="loading" />

    <div v-if="error" class="alert alert-danger mt-4" role="alert">
      Sorry, we couldn't fetch the Pokémon details. Please try again later.
    </div>

    <div class="container mt-4 mb-4" v-if="pokemon && !loading && !error">
      <div class="card">
        <div class="row g-0">
          <div class="col-md-4">
            <img :src="getPokemonImage(pokemon.id)" class="img-fluid rounded-start pokemon-image" :alt="pokemon.name" />
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title text-capitalize">{{ pokemon.name }}</h5>
              <p class="card-text">Height: {{ pokemon.height }}</p>
              <p class="card-text">Weight: {{ pokemon.weight }}</p>
              <p class="card-text">Base Experience: {{ pokemon.base_experience }}</p>
              <p class="card-text" v-for="(ability, index) in pokemon.abilities" :key="index">
                Ability {{ index + 1 }}: {{ ability.ability.name }}
              </p>
              <p class="card-text" v-for="(type, index) in pokemon.types" :key="index">
                Type {{ index + 1 }}: {{ type.type.name }}
              </p>
              <hr>
              <h6>Stats:</h6>
              <ul>
                <li v-for="(stat, index) in pokemon.stats" :key="index">
                  {{ stat.stat.name }}: {{ stat.base_stat }}
                </li>
              </ul>
              <hr>
              <h6>Moves:</h6>
              <ul>
                <li v-for="(move, index) in pokemon.moves.slice(0, 5)" :key="index">
                  {{ move.move.name }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingSpinner from '@/components/LoadingSpinner.vue';

export default {
  components: {
    LoadingSpinner,
  },
  data() {
    return {
      pokemon: null,
      loading: true,
      error: null,
    }
  },
  async mounted() {
    const pokemonId = this.$route.params.id;
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;

    const fetchPokemon = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        this.pokemon = await response.json();
      } catch (err) {
        this.error = err;
        console.error('Error fetching Pokémon details:', err);
      }
    };

    const minLoadingTime = new Promise(resolve => setTimeout(resolve, 1000));

    // We run the fetch and the timer concurrently
    await Promise.all([fetchPokemon(), minLoadingTime]);
    
    // We always stop loading, regardless of whether the fetch succeeded or failed.
    // The template will then decide whether to show the content or an error message.
    this.loading = false;
  },
  methods: {
    getPokemonImage(id) {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    }
  }
}
</script>

<style scoped>
.pokemon-image {
  max-width: 100%;
  height: auto;
}
</style>
