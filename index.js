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
            <span class="get-id">2018</span>
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
        let ArrayListDados = []
        Array.from(dados).forEach(async extrairID => {
           
            const url = `https://api.themoviedb.org/3/movie/${extrairID.id}?api_key=${apiKey.key}&language=pt-BR`
            const dado = await fetch(url).then(res => res.json()).then(data => data)
           
            let row = this.createHTML()
            contador++
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
          
            ArrayListDados.push(dado)
            
            row.querySelector(".card:has(img) img").src = `https://image.tmdb.org/t/p/w200${dado.poster_path}`
            row.querySelector(".card:has(img) img").alt = `Imagem do filme ${dado.title}`
            row.querySelector(".movie-title").textContent = dado.title
            row.querySelector(".movie-type").textContent = `${await GeneneroSelected(dado.genres) || 'Desconhecido'}`
            row.querySelector(".movie-release").textContent = `${converterData(dado.release_date)}`
            row.querySelector(".get-id").textContent = dado.id
            document.querySelector("#movies").append(row)
      
         
            if(dados.length <= 5){
                document.querySelectorAll(".card").forEach(card => card.classList.add("width"))
            } 

            if(dados.length == contador){
          

                document.querySelectorAll(".card").forEach(card=> card.addEventListener("click", (event)=> {
                    document.querySelector(".expand-card").classList.add("show")
                    document.querySelector("#movies").style.overflow = "hidden"
                    const idMovies = event.currentTarget.querySelector(".get-id").textContent                    
                    const newArray = ArrayListDados.filter((movie) => {
                        return movie.id === Number(idMovies);
                      });
                    
                   this.expandCard(newArray)
                }))


            }
            
            
        
        })
        


    }


    expandCard(dados){

       console.log(dados)

    }

    CreatedexpandHTML(){

       
    }


    async GetMovies(query) {

       
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey.key}&query=${encodeURIComponent(query)}&language=pt-BR`;
        const dados = await fetch(url).then(res => res.json()).then(data => data.results)
   
        if(dados.length == 0){
            alert("Filme não encontrado")
            boxSearch.value = ''
            boxSearch.focus()
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
        boxSearch.focus()
        return
    }
    Dados.GetMovies(value)
   
 
})

document.querySelector(".fechar").addEventListener("click", ()=> {
    document.querySelector(".expand-card").classList.remove("show")
    document.querySelector("#movies").style.overflow = "initial"
})

const heartOff = document.querySelector(".fav-OFF")
const heartOn = document.querySelector(".fav-ON")

heartOff.addEventListener("click", ()=> {
    heartOn.style.display = 'block'
   heartOff.style.display = 'none'
   
})
heartOn.addEventListener("click", ()=> {
    heartOff.style.display = 'block'
    heartOn.style.display = 'none'
})


new DadosMovies()

