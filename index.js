import { apiKey } from './apiKey.js'


class DadosMovies {
    createHTML() {
        const div = document.createElement('div')
        div.classList.add("card")
        div.innerHTML = `<div class="card-img">
        <img src="https://image.tmdb.org/t/p/w200/ybQSBSrINtjWsJQ6Ih8sva8HlEZ.jpg"
          alt="Imagem do filme Homem-Aranha: No Aranhaverso">
      </div>
      <div class="card-content">
        <h2 class="movie-title">Homem-Aranha: No Aranhaverso</h2>
        <div class="box-movie-legend">
          <p class="movie-details">
            <span class="movie-type">Ação, Aventura, Animação, Ficção científica</span>
            <span class="movie-release">2018</span>
          </p>
        </div>`

        return div

    }
    removeHTML() {
        document.querySelectorAll("#movies .card").forEach(card => card.remove())
    }
    searchMovies(dados) {
        this.removeHTML()
        function converterData(valor) {
            let data = valor.split("-")
            let [ano, mes, dia] = data
            let dataconvertida = `${ano}`

            if(ano == undefined){
                return ''
            }
            
            return `${dataconvertida}`
        }

        let contador = 0

        Array.from(dados).forEach(async extrairID => {
           
            const url = `https://api.themoviedb.org/3/movie/${extrairID.id}?api_key=${apiKey.key}&language=pt-BR`
            const dado = await fetch(url).then(res => res.json()).then(data => data)
            contador++
            let row = this.createHTML()

            async function GeneneroSelected(genero) {
                const lista = Array.from(genero).map(Ongenero => {
                    return ' ' + Ongenero.name
                })
                return lista
            }

            async function LinguaSelected(linguas) {
                const lista = Array.from(linguas).map(lingua => {
                    return ' ' + lingua.english_name
                })
                return lista
            }

            if(dado.poster_path == null){
              return
            }
            
            
            row.querySelector(".card:has(img) img").src = `https://image.tmdb.org/t/p/w200${dado.poster_path}`
            row.querySelector(".card:has(img) img").alt = `Imagem do filme ${dado.title}`
            row.querySelector(".movie-title").textContent = dado.title
            row.querySelector(".movie-type").textContent = `${await GeneneroSelected(dado.genres) || 'Desconhecido'}`
            row.querySelector(".movie-release").textContent = `${converterData(dado.release_date)}`
            document.querySelector("#movies").append(row)
      
            console.log(dados)
            if(dados.length <= 5){
                document.querySelectorAll(".card").forEach(card => card.classList.add("width"))
            } 

           
       
            

            if(contador == dados.length){
                this.expandCard()
        
               
            }
        
        })


    }

   

    expandCard(){
        let cards = document.querySelectorAll(".card")

                for(let card of cards) {
                    card.querySelector(".movie-description").addEventListener("click", (event)=> {
                        event.target.classList.toggle('expand')
                    })
                }
    }
    async GetMovies(query) {

       
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey.key}&query=${encodeURIComponent(query)}&language=pt-BR`;
        const dados = await fetch(url).then(res => res.json()).then(data => data.results)
   
        if(dados.length == 0){
            alert("Filme não encontrado")
            boxSearch.value = ''
            return
        }
      

        this.searchMovies(dados)
        boxSearch.value = ''
    }
}
const buttonSearch = document.querySelector("#button-search")
const boxSearch = document.querySelector("#query")

buttonSearch.addEventListener("click", (event) => {
    event.preventDefault();
    const { value } = boxSearch
    const Dados = new DadosMovies();
    if(value == ''){
        alert("Por favor, preencha os dados para pesquisa")
        return
    }
    Dados.GetMovies(value)
   
 
})
let cards = document.querySelectorAll(".card")

for(let card of cards) {
    card.querySelector(".movie-description").addEventListener("click", (event)=> {
        event.target.classList.toggle('expand')
    })
}

new DadosMovies()

