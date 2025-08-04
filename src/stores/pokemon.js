import { defineStore } from 'pinia'

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    pokemon: null,
  }),
  actions: {
    setPokemon(pokemon) {
      this.pokemon = pokemon
    },
  },
})
