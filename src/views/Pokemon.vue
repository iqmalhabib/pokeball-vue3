<template>
    <div class="container mt-1 mb-4 flex-grow-1 d-flex flex-column justify-content-center">
        <div class="mb-2">
            <input type="text" class="form-control" v-model="searchQuery" placeholder="Search Pokémon by name">
        </div>
        <div class="row row-cols-1 row-cols-md-4 g-4">
            <div class="col" v-for="pokemon in paginatedPokemons" :key="pokemon.name" @click="goToDetails(pokemon.id)">
                <div class="card">
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
        <div class="d-flex justify-content-center mt-4">
            <button class="btn btn-primary me-2" @click="prevPage" :disabled="currentPage === 1">Previous</button>
            <button class="btn btn-primary" @click="nextPage" :disabled="currentPage >= totalPages">Next</button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            allPokemons: [], // Store the full list of pokemons
            searchQuery: '',
            currentPage: 1,
            limit: 8,
        }
    },
    async mounted() {
        this.fetchAllPokemons()
    },
    computed: {
        filteredPokemons() {
            if (!this.searchQuery) {
                return this.allPokemons
            }
            return this.allPokemons.filter(pokemon =>
                pokemon.name.toLowerCase().includes(this.searchQuery.toLowerCase())
            )
        },
        totalPages() {
            return Math.ceil(this.filteredPokemons.length / this.limit)
        },
        paginatedPokemons() {
            const start = (this.currentPage - 1) * this.limit
            const end = start + this.limit
            return this.filteredPokemons.slice(start, end)
        }
    },
    methods: {
        async fetchAllPokemons() {
            // Fetching a large list of Pokémon.
            const apiUrl = `${import.meta.env.VITE_API_URL}pokemon?limit=1000`
            try {
                const response = await fetch(apiUrl)
                const data = await response.json()

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

                this.allPokemons = detailedData
            } catch (error) {
                console.error('Error fetching Pokémon details:', error)
            }
        },
        getPokemonImage(id) {
            return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
        },
        goToDetails(id) {
            this.$router.push({ name: 'pokemon-details', params: { id } })
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--
            }
        }
    },
    watch: {
        searchQuery() {
            // Reset to the first page whenever the search query changes
            this.currentPage = 1
        }
    }
}
</script>
<style scoped>
.card-img-top {
    height: 100px;
    object-fit: contain;
}

.card-title {
    font-size: 1rem;
}

.card-text {
    font-size: 0.8rem;
}
</style>
