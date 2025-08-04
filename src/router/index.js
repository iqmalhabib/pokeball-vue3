import { createRouter, createWebHistory } from 'vue-router'
import pokemon from '../views/Pokemon.vue'
import PokemonDetails from '../views/PokemonDetails.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'pokemon',
      component: pokemon,
    },
    {
      path: '/pokemon/:id',
      name: 'pokemon-details',
      component: PokemonDetails,
    },
    {
      path: '/pokemon/edit/:id',
      name: 'pokemon-edits',
      component: () => import('../views/PokemonEdits.vue'),
    },
  ],
})

export default router
