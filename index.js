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

        Array.from(dados).forEach(dado => {

            function VerificarIdioma(valor){

                switch (valor) {
                    case 'en':
                      return "Ingles";
                    case 'pt':
                      return "Portugues";
                    default:
                      return "Idioma não Identificado";
                  }
            }
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
            row.querySelector(".movie-type").textContent = `${IdentificadorDeGenero(dado.genre_ids)}`
            row.querySelector(".movie-language").textContent = `${VerificarIdioma(dado.original_language)}`
            row.querySelector(".movie-release").textContent = `Data de Lançamento: ${converterData(dado.release_date)}`
            row.querySelector(".movie-description").textContent = dado.overview

            document.querySelector("#movies").append(row)
            
        })
      
      
        
    }

    async GetMovies(query){
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=pt-BR`;
        console.log(url)

        const dados = await fetch(url).then(res => res.json()).then(data => data.results)
        console.log(dados)
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

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNGYwMDY5ZGRhMDg0OWI3ZDNiODg5MTg5NTY2ZWQ4MiIsInN1YiI6IjY0OTFmZjVjYzNjODkxMDBhZTUyYmQ2OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.V0rnkuKqr86IOKVuI8g8ee5OMOdKVw-R_Izg7npBiRk'
    }
  };

async function IdentificadorDeGenero(gen){
    const genre = await fetch('https://api.themoviedb.org/3/genre/movie/list?language=pt', options)
    .then(response => response.json())
    .then(response => response.genres)
    .catch(err => console.error(err));


 const user = Array.from(gen).forEach(dado => {

     switch (dado) {
         case 28:
             return "Ação"
         case 12:
             return "Aventura"
         case 16:
             return "Animação"
         case 35:
             return "Comédia"
         case 80:
             return "Crime"
         case 99:
             return "Documentário"
         case 18:
             return "Drama"
         case 10751:
             return "Família"
         case 14:
             return "Fantasia"
         case 36:
             return "História"
         case 27:
             return "Terror"
         case 10402:
             return "Música"
         case 9648:
             return "Mistério"
         case 10749:
             return "Romance"
         case 878:
             return "Ficção científica"
         case 10770:
             return "Cinema TV"
         case 53:
             return "Thriller"
         case 10752:
             return "Guerra"
         case 37:
             return "Faroeste"
         default:
             return "Desconhecido"
     }
   })
   
   console.log(user)

}
  
  





new DadosMovies()