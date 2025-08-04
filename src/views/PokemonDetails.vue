<template>
  <div class="d-flex justify-content-center">
    <LoadingSpinner v-if="loading" />

    <div v-if="error" class="alert alert-danger mt-4" role="alert">
      Sorry, we couldn't fetch the Pokémon details. Please try again later.
    </div>

    <div class="container mt-4 mb-4" v-if="pokemon && !loading && !error">
      <div class="toast-container position-fixed top-0 end-0 p-3">
        <div id="liveToast" class="toast" :class="{ 'show': notification }" role="alert" aria-live="assertive"
          aria-atomic="true">
          <div class="toast-header">
            <strong class="me-auto">Notification</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div class="toast-body">
            {{ notification }}
          </div>
        </div>
      </div>
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
              <router-link :to="'/pokemon/edit/' + pokemon.id" class="btn btn-primary mt-3">Edit</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { usePokemonStore } from '@/stores/pokemon'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { Toast } from 'bootstrap'

export default {
  components: {
    LoadingSpinner,
  },
  setup() {
    const pokemonStore = usePokemonStore()
    return { pokemonStore }
  },
  data() {
    return {
      loading: true,
      error: null,
    }
  },
  computed: {
    pokemon() {
      return this.pokemonStore.pokemon
    },
    notification() {
      return this.pokemonStore.notification
    }
  },
  watch: {
    notification(newValue) {
      if (newValue) {
        // Use nextTick to ensure DOM is updated
        this.$nextTick(() => {
          const toastElement = document.getElementById('liveToast')
          if (toastElement) {
            const toast = new Toast(toastElement)
            toast.show()
            setTimeout(() => {
              toast.hide()
              this.pokemonStore.clearNotification()
            }, 3000)
          }
        })
      }
    }
  },
  async mounted() {
    const pokemonId = this.$route.params.id
    if (this.pokemon && this.pokemon.id == pokemonId) {
      this.loading = false
      // Check for notification after component is mounted
      this.checkAndShowNotification()
      return
    }
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`

    const fetchPokemon = async () => {
      try {
        const response = await fetch(apiUrl)
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const pokemonData = await response.json()
        this.pokemonStore.setPokemon(pokemonData)
      } catch (err) {
        this.error = err
        console.error('Error fetching Pokémon details:', err)
      }
    }

    const minLoadingTime = new Promise(resolve => setTimeout(resolve, 1000))

    await Promise.all([fetchPokemon(), minLoadingTime])
    this.loading = false

    // Check for notification after loading is complete
    this.checkAndShowNotification()
  },
  methods: {
    getPokemonImage(id) {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
    },
    checkAndShowNotification() {
      // Check if there's a notification to show when component is ready
      if (this.notification) {
        this.$nextTick(() => {
          const toastElement = document.getElementById('liveToast')
          if (toastElement) {
            const toast = new Toast(toastElement)
            toast.show()
            setTimeout(() => {
              toast.hide()
              this.pokemonStore.clearNotification()
            }, 3000)
          }
        })
      }
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