import { defineStore } from 'pinia'

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    pokemon: null,
    notification: null,
  }),
  actions: {
    setPokemon(pokemon) {
      this.pokemon = pokemon
    },
    setNotification(message) {
      this.notification = message;
    },
    clearNotification() {
      this.notification = null;
    }
  },
})
