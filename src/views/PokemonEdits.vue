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
              <div class="mb-3">
                <label for="pokemonName" class="form-label">Name</label>
                <input type="text" class="form-control" id="pokemonName" v-model="pokemon.name">
              </div>
              <div class="mb-3">
                <label for="pokemonHeight" class="form-label">Height</label>
                <input type="number" class="form-control" id="pokemonHeight" v-model="pokemon.height">
              </div>
              <div class="mb-3">
                <label for="pokemonWeight" class="form-label">Weight</label>
                <input type="number" class="form-control" id="pokemonWeight" v-model="pokemon.weight">
              </div>
              <div class="mb-3">
                <label for="pokemonBaseExperience" class="form-label">Base Experience</label>
                <input type="number" class="form-control" id="pokemonBaseExperience" v-model="pokemon.base_experience">
              </div>
              <button @click="saveChanges" class="btn btn-primary">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { usePokemonStore } from '@/stores/pokemon';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

export default {
  components: {
    LoadingSpinner,
  },
  setup() {
    const pokemonStore = usePokemonStore();
    return { pokemonStore };
  },
  data() {
    return {
      loading: true,
      error: null,
    }
  },
  computed: {
    pokemon() {
      return this.pokemonStore.pokemon;
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
        const pokemonData = await response.json();
        this.pokemonStore.setPokemon(pokemonData);
      } catch (err) {
        this.error = err;
        console.error('Error fetching Pokémon details:', err);
      }
    };

    const minLoadingTime = new Promise(resolve => setTimeout(resolve, 1000));

    await Promise.all([fetchPokemon(), minLoadingTime]);
    
    this.loading = false;
  },
  methods: {
    getPokemonImage(id) {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    },
    saveChanges() {
      // Here you would typically dispatch an action to your Pinia store to save the changes
      // For this example, we'll just log the updated pokemon object
      console.log('Updated Pokemon:', this.pokemon);
      this.$router.push(`/pokemon/${this.pokemon.id}`);
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
