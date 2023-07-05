import { apiKey } from './apiKey.js'


class DadosMovies {
    createHTML() {
        const div = document.createElement('div')
        div.classList.add("card")
        div.innerHTML = `<div class="card-img">
        <img src="https://image.tmdb.org/t/p/w300/AfwqKLQwjgPu8bIL1mqhHTlnQv0.jpg" alt="Imagem do Filme">
      </div>
      
      <div class="card-content">
        <h2 class="movie-title">Título do Filme</h2>
        <div class="box-movie-legend">
        <p class="movie-details"><span class="movie-type">Terror</span> | <span class="movie-language">Português</span> | <span class="movie-release">Data de Lançamento: 01/01/2023</span></p>
        <p class="movie-description"> Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam earum odio tempora maiores, neque exercitationem quos impedit ratione magni! Dolorum itaque in eligendi autem amet est officia, architecto culpa necessitatibus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse odit optio itaque officia aspernatur enim animi quos nulla aperiam cum quasi reiciendis voluptas explicabo atque, voluptatem amet repellat incidunt sapiente. Descrição do filme Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
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
            let dataconvertida = `${dia}/${mes}/${ano}`

            if((ano || mes || dia) == undefined){
                dataconvertida = 'Sem Data'
            }
            
            return dataconvertida
        }

    

        Array.from(dados).forEach(async extrairID => {
     
            const url = `https://api.themoviedb.org/3/movie/${extrairID.id}?api_key=${apiKey.key}&language=pt-BR`
            const dado = await fetch(url).then(res => res.json()).then(data => data)

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

            if(dado.poster_path == undefined || (dado.overview == '' || undefined )){
                return
            }
            

            row.querySelector(".card:has(img) img").src = `https://image.tmdb.org/t/p/w200${dado.poster_path}`
            row.querySelector(".card:has(img) img").alt = `Imagem do filme ${dado.title}`
            row.querySelector(".movie-title").textContent = dado.title
            row.querySelector(".movie-type").textContent = `${await GeneneroSelected(dado.genres) || 'Desconhecido'}`
            row.querySelector(".movie-language").textContent = `${await LinguaSelected(dado.spoken_languages) || 'Desconhecido'}`
            row.querySelector(".movie-release").textContent = `Data de Lançamento: ${converterData(dado.release_date)}`
            row.querySelector(".movie-description").textContent = dado.overview
            document.querySelector("#movies").append(row)
   
            
            if(dados.length < 3){
                document.querySelector(".card").classList.add("width")
            }   
        })
       

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


new DadosMovies()

