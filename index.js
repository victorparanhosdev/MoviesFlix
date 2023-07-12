import { apiKey } from "./apiKey.js";


class DadosMovies {
    constructor() {
        this.load()
    }

    load() {
        this.DadosFilms = []
        this.listadefilmesFavoritados = []
        this.dadoExpandido_ID = []
     
    }

    createHTML() {
        const div = document.createElement("div");
        div.classList.add("card");
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
        </div>`;

        return div;
    }
    removeHTML() {
        document.querySelectorAll("#movies .card").forEach((card) => card.remove());
    }
    async GetDados(dados, tamanho) {
        let contador = 0;
        let ArrayListDados = []
        
        Array.from(dados).forEach(async (extrairID) => {
            const url = `https://api.themoviedb.org/3/movie/${extrairID.id}?api_key=${apiKey}&language=pt-BR`;
            const blocoDeInfo = await fetch(url).then((res) => res.json()).then(({ backdrop_path, genres, id, original_language, overview, poster_path, release_date, title, }) => {
                return ({
                    background: backdrop_path,
                    genero: genres,
                    id: id,
                    lingua: original_language,
                    descricao: overview,
                    capadofilme: poster_path,
                    datadelancamento: release_date,
                    titulo: title,
                });
            });


            ArrayListDados.push(blocoDeInfo)
            contador++
            

            if(contador == tamanho){
                this.fazeroHTML(ArrayListDados)
                
            }

        })


    }

    fazeroHTML(data){
       
        this.removeHTML();
        
  
         data.forEach(card => {

            if (data.length == 1) {
                row.querySelectorAll(".card").forEach((card) => card.classList.add("widthh"));
                }
            

            if (card.capadofilme == null) {
                return
            }
            
            function GeneneroSelected(genero) {
                const lista = Array.from(genero).map((Ongenero) => {
                    return " " + Ongenero.name;
                });
                return lista;
            }
            function converterData(valor) {
                let dateTime = valor.split("-");
                let [ano, mes, dia] = dateTime;
                let dataconvertida = `${ano}`;
                if (ano == undefined) {
                    return "";
                }
                return `${dataconvertida}`;
            }

            let row = this.createHTML();
            row.querySelector(".card:has(img) img").src = `https://image.tmdb.org/t/p/w200${card.capadofilme}`;
            row.querySelector(".card:has(img) img").alt = `Imagem do filme ${card.titulo}`;
            row.querySelector(".movie-title").textContent = card.titulo;
            row.querySelector(".movie-type").textContent = `${(GeneneroSelected(card.genero)) || "Desconhecido"}`;
            row.querySelector(".movie-release").textContent = `${converterData(card.datadelancamento)}`;
            row.querySelector(".get-id").textContent = card.id;
            row.addEventListener("click", ()=> {
                document.querySelector(".expand-card").classList.add("show");
                document.body.style.overflow = "hidden";
                this.ExpandCard(card)
            })
            document.querySelector("#movies").append(row);
        


        })
     

       

    }
    ExpandCard(card){
        console.log(card)


        function Generos() {
            const array = Array.from(card.genero).map((gen) => {
                return " " + gen.name;
            });

            return array;
        }

        function DatadeLancamento() {
            let data = card.datadelancamento.split("-");
            let [ano, mes, dia] = data;

            switch (Number(mes)) {
                case 1:
                    mes = "Janeiro";
                    break;
                case 2:
                    mes = "Fevereiro";
                    break;
                case 3:
                    mes = "Março";
                    break;
                case 4:
                    mes = "Abril";
                    break;
                case 5:
                    mes = "Maio";
                    break;
                case 6:
                    mes = "Junho";
                    break;
                case 7:
                    mes = "Julho";
                    break;
                case 8:
                    mes = "Agosto";
                    break;
                case 9:
                    mes = "Setembro";
                    break;
                case 10:
                    mes = "Outubro";
                    break;
                case 11:
                    mes = "Novembro";
                    break;
                case 12:
                    mes = "Dezembro";
                    break;
                default:
                    mes = "Mês inválido";
            }

            const dataconvertida = `Data de Lançamento: ${dia} de ${mes} de ${ano}`;
            return dataconvertida;
        }


        document.querySelector(".filme-card img").src = `https://image.tmdb.org/t/p/w500${card.background}`;
        if (card.background == null) {
            document.querySelector(".filme-card img").src = `https://image.tmdb.org/t/p/w500${card.capadofilme}`;
            const elemento = document.querySelector(".filme-card img");
            Object.assign(elemento.style, {
                maxHeight: "38rem",
            });
        }
        document.querySelector(".filme-card img").alt = `Foto do filme ${card.titulo}`;
        document.querySelector(".filme-titulo").textContent = card.titulo;
        document.querySelector(".filme-genero").textContent = `Gênero: ${Generos()}`;
        document.querySelector(".filme-lancamento").textContent = `${DatadeLancamento()}`;
        document.querySelector(".filme-descricao-span").textContent = `${card.descricao}`;
        if (card.descricao == "") {
            document.querySelector(".filme-descricao").textContent = `Sem Descrição`;
        } else {
            document.querySelector(".filme-descricao").textContent = `Descrição do Filme:`;
        }

        const btnFechar = document.querySelector(".fechar");

        btnFechar.addEventListener("click", () => {
            document.querySelector(".expand-card").classList.remove("show");
            document.body.style.overflow = "initial";
        });
   

    }

    // searchMovies(dados) {

 

    

                  
    // if (data.length == 1) {
    //     document.querySelectorAll(".card").forEach((card) => card.classList.add("widthh"));
    // }

    // if (dada.length > 1 && dados.length <= 5) {
    //     document.querySelectorAll(".card").forEach((card) => card.classList.add("width"));
    // }



    //     if (dados.length == contador) {

    //         document.querySelectorAll(".card").forEach((card) =>
    //             card.addEventListener("click", (event) => {
    //                 contador = 0;
    //                 document.querySelector(".expand-card").classList.add("show");
    //                 document.body.style.overflow = "hidden";
    //                 const idMovies = Number(event.currentTarget.querySelector(".get-id").textContent);

    //                 const newArray = ArrayListDados.filter((movie) => {
    //                     return movie.id === idMovies;
    //                 });

    //                 this.expandCard(newArray);
    //             })
    //         );
    //     }
   


    //     let contador = 0;
    //     let ArrayListDados = [];

    //         contador++;
            

    //         ArrayListDados.push(dado);
           



    // };



    

    // expandCard(dado) {

    //     let favoritoAtivo = false;



    //     btnFavoritos.addEventListener("click", (event) => {

    //         if (!favoritoAtivo) {
    //             btnFavoritos.classList.replace("fa-regular", "fa-solid");
    //             this.listadefilmesFavoritados
    //             favoritoAtivo = true;

    //         } else {
    //             btnFavoritos.classList.replace("fa-solid", "fa-regular");
    //             favoritoAtivo = false;
    //         }
    //     });

    //     btnFavoritos.addEventListener("mouseover", () => {
    //       if (!favoritoAtivo) {
    //         btnFavoritos.classList.replace("fa-regular", "fa-solid");
    //       }
    //     });

    //     btnFavoritos.addEventListener("mouseout", () => {
    //       if (!favoritoAtivo) {
    //         btnFavoritos.classList.replace("fa-solid", "fa-regular");
    //       }
    //     });

    // }

    async GetMovies(query) {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=pt-BR`;

        const dados = await fetch(url)
            .then((res) => res.json())
            .then((data) => data.results);

        if (dados.length == 0) {
            alert("Filme não encontrado");
            boxSearch.value = "";
            boxSearch.focus();
            return;
        }
        

        this.GetDados(dados, dados.length);
        boxSearch.value = "";
    }
}


const buttonSearch = document.querySelector("#button-search");
const boxSearch = document.querySelector("#query");

buttonSearch.addEventListener("click", (event) => {
    event.preventDefault();
    const { value } = boxSearch;
    const Dados = new DadosMovies();
    if (value == "") {
        alert("Por favor, preencha os dados para pesquisa");
        boxSearch.focus();
        return;
    }
    Dados.GetMovies(value);
});


