<template>
    <div class="container mt-4 mb-4">
        <div class="row row-cols-1 row-cols-md-3 g-4">
            <div class="col" v-for="pokemon in pokemons" :key="pokemon.name" @click="goToDetails(pokemon.id)">
                <div class="card h-100">
                    <img :src="getPokemonImage(pokemon.id)" class="card-img-top" :alt="pokemon.name" />
                    <div class="card-body">
                        <h5 class="card-title text-capitalize">{{ pokemon.name }}</h5>
                        <p class="card-text" v-for="(ability, index) in pokemon.abilities" :key="index">
                            Ability {{ index + 1 }}: {{ ability.ability.name }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            pokemons: []
        }
    },
    async mounted() {
        const apiUrl = import.meta.env.VITE_API_URL + 'pokemon?limit=15'
        try {
            const response = await fetch(apiUrl)
            const data = await response.json()

            // Fetch each Pokémon's full details to get abilities
            const detailedData = await Promise.all(
                data.results.map(async (pokemon) => {
                    const res = await fetch(pokemon.url)
                    const details = await res.json()
                    return {
                        name: details.name,
                        id: details.id,
                        abilities: details.abilities
                    }
                })
            )

            this.pokemons = detailedData
        } catch (error) {
            console.error('Error fetching Pokémon details:', error)
        }
    },
    methods: {
        getPokemonImage(id) {
            return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
        },
        goToDetails(id) {
            this.$router.push({ name: 'pokemon-details', params: { id } })
        }
    }
}
</script>
