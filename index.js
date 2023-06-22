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
        Array.from(dados).forEach(async dado => {

            const options = {
                method: 'GET',
                headers: {
                  accept: 'application/json',
                  Authorization: `${apiKey.bearer}`
                }
              };

              async function IdentificadorDeLingua(valor1){
                const Lingua = await fetch('https://api.themoviedb.org/3/configuration/languages', options)
                .then(response => response.json())
                .then(response => response)
                .catch(err => console.error(err));

                const elemento = Array.from(Lingua).find(item => item.iso_639_1 == valor1);
                
                return elemento.name
    
            
            }

    
            const lingua = await IdentificadorDeLingua(dado.original_language)               

            async function IdentificadorDeGenero(valor1){
                const genre = await fetch('https://api.themoviedb.org/3/genre/movie/list?language=pt', options)
                .then(response => response.json())
                .then(response => response.genres)
                .catch(err => console.error(err));
                
                const resultado = Array.from(valor1).map(id => {
                    const elemento = Array.from(genre).find(item => item.id == id);
                    return elemento.name
                })

                return resultado
            
            }

           const genero = await IdentificadorDeGenero(dado.genre_ids)   
    
            function converterData(valor){
                let data = valor.split("-")
                let [ano, mes, dia] = data
                let dataconvertida = `${dia}/${mes}/${ano}`
                return dataconvertida

            }
          
            let row = this.createHTML()
            
            row.querySelector(".card:has(img) img").src = `https://image.tmdb.org/t/p/w300${dado.poster_path}`
            row.querySelector(".card:has(img) img").alt = `Imagem do filme ${dado.title}`
            row.querySelector(".movie-title").textContent = dado.title
            row.querySelector(".movie-type").textContent = `${genero ?? 'Desconhecido'}`
            row.querySelector(".movie-language").textContent = `${lingua ?? 'Desconhecido'}`
            row.querySelector(".movie-release").textContent = `Data de Lançamento: ${converterData(dado.release_date)}`
            row.querySelector(".movie-description").textContent = dado.overview

            document.querySelector("#movies").append(row)
            
        })
      
      
        
    }

    async GetMovies(query){
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey.key}&query=${encodeURIComponent(query)}&language=pt-BR`;
        const dados = await fetch(url).then(res => res.json()).then(data => data.results)
        this.searchMovies(dados)   
        
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