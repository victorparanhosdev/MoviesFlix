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

            if (ano == undefined) {
                return ''
            }

            return `${dataconvertida}`
        }

        let contador = 0
        let ArrayListDados = []
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

            if (dado.poster_path == null) {
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

            if (dados.length <= 5) {
                document.querySelectorAll(".card").forEach(card => card.classList.add("width"))
               
            }
            
            if (dados.length == contador) {

                document.querySelectorAll(".card").forEach(card => card.addEventListener("click", (event) => {
                    contador = 0
                    document.querySelector(".expand-card").classList.add("show")
                    document.body.style.overflow = 'hidden'
                    const idMovies = event.currentTarget.querySelector(".get-id").textContent
                    const newArray = ArrayListDados.filter((movie) => {
                        return movie.id === Number(idMovies);
                    });

                    this.expandCard(newArray)
                }))
            }
        })

    }

    expandCard(dados) {
        function Generos() {
            const array = Array.from(dados[0].genres).map(gen => {
                return " " + gen.name
            })
            return array
        }
        function DatadeLancamento() {

            let data = dados[0].release_date.split("-")
            let [ano, mes, dia] = data

            switch (Number(mes)) {
                case 1:
                    mes = "Janeiro";
                    break
                case 2:
                    mes = "Fevereiro";
                    break
                case 3:
                    mes = "Março";
                    break
                case 4:
                    mes = "Abril";
                    break
                case 5:
                    mes = "Maio";
                    break
                case 6:
                    mes = "Junho";
                    break
                case 7:
                    mes = "Julho";
                    break
                case 8:
                    mes = "Agosto";
                    break
                case 9:
                    mes = "Setembro";
                    break
                case 10:
                    mes = "Outubro";
                    break
                case 11:
                    mes = "Novembro";
                    break
                case 12:
                    mes = "Dezembro";
                    break
                default:
                    mes = "Mês inválido";
            }

            const dataconvertida = `Data de Lançamento: ${dia} de ${mes} de ${ano}`

            return dataconvertida
        }
        document.querySelector(".filme-card img").src = `https://image.tmdb.org/t/p/w500${dados[0].backdrop_path}`
        if (dados[0].backdrop_path == null) {
            document.querySelector(".filme-card img").src = `https://image.tmdb.org/t/p/w500${dados[0].poster_path}`
            const elemento = document.querySelector(".filme-card img")
            Object.assign(elemento.style, {
                maxHeight: '38rem',
              });
        }

        document.querySelector(".filme-card img").alt = `Foto do filme ${dados[0].title}`
        document.querySelector(".filme-titulo").textContent = dados[0].title
        document.querySelector(".filme-genero").textContent = `Gênero: ${Generos()}`
        document.querySelector(".filme-lancamento").textContent = `${DatadeLancamento()}`
        document.querySelector(".filme-descricao-span").textContent = `${dados[0].overview}`
        if (dados[0].overview == "") {
            document.querySelector(".filme-descricao").textContent = `Sem Descrição`

        }else{
            document.querySelector(".filme-descricao").textContent = `Descrição do Filme:`
        }


    }


    async GetMovies(query) {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey.key}&query=${encodeURIComponent(query)}&language=pt-BR`;
        const dados = await fetch(url).then(res => res.json()).then(data => data.results)
        if (dados.length == 0) {
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
    if (value == '') {
        alert("Por favor, preencha os dados para pesquisa")
        boxSearch.focus()
        return
    }
    Dados.GetMovies(value)
})

document.querySelector(".fechar").addEventListener("click", () => {
    document.querySelector(".expand-card").classList.remove("show")
    document.body.style.overflow = 'initial'
})


document.querySelector("#btn-fav").addEventListener("mouseover", ()=> {
    document.querySelector("#btn-fav").classList.remove('fa-regular')
    document.querySelector("#btn-fav").classList.add('fa-solid')
    
})

document.querySelector("#btn-fav").addEventListener("mouseout", ()=> {
    document.querySelector("#btn-fav").classList.remove('fa-solid')
    document.querySelector("#btn-fav").classList.add('fa-regular')
})



new DadosMovies()

