import {apiKey} from './apiKey.js'


class DadosMovies {
  
    createHTML(){
        const div = document.createElement('div')
        div.classList.add("card")
        div.innerHTML = ` <img src="imagem_do_filme.jpg" alt="Imagem do Filme">
        <div class="card-content">
          <h2 class="movie-title">Título do Filme</h2>
          <p class="movie-details"><span class="movie-type">Terror</span> | <span class="movie-language">Português</span> | <span class="movie-release">Data de Lançamento: 01/01/2023</span></p>
          <p class="movie-description">Descrição do filme Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>`

       return div
    
    }
    removeHTML(){
        document.querySelectorAll("#movies .card").forEach(card => card.remove())
    }

  

    searchMovies(dados){

        this.removeHTML()  


        function converterData(valor){
            let data = valor.split("-")
            let [ano, mes, dia] = data
            let dataconvertida = `${dia}/${mes}/${ano}`
            return dataconvertida

        }

   
          
            let row = this.createHTML()
            
            row.querySelector(".card:has(img) img").src = `https://image.tmdb.org/t/p/w200${dados.poster_path}`
            row.querySelector(".card:has(img) img").alt = `Imagem do filme ${dados.title}`
            row.querySelector(".movie-title").textContent = dados.title
            row.querySelector(".movie-type").textContent = `Genero`
            row.querySelector(".movie-language").textContent = `Lingua`
            row.querySelector(".movie-release").textContent = `Data de Lançamento: ${converterData(dados.release_date)}`
            row.querySelector(".movie-description").textContent = dados.overview
            document.querySelector("#movies").append(row)
            
        
      
      
        
    }

    async GetMovies(query){
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey.key}&query=${encodeURIComponent(query)}&language=pt-BR`;
        const dados = await fetch(url).then(res => res.json()).then(data => data.results)

      
        this.GetID(dados)
    }

    async GetID(id){

        Array.from(id).forEach(async extrairID => {
        
            const url = `https://api.themoviedb.org/3/movie/${extrairID.id}?api_key=${apiKey.key}`
            const dados = await fetch(url).then(res => res.json()).then(data => data)

            this.searchMovies(dados)
        })
       
       
     
    }



}

const buttonSearch = document.querySelector("#button-search")
const boxSearch = document.querySelector("#query")

buttonSearch.addEventListener("click", (event)=> {
    event.preventDefault();
    const {value} = boxSearch
    const Dados = new DadosMovies();
    Dados.GetMovies(value)


})

new DadosMovies()