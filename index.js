import { apiKey } from "./apiKey.js";

const buttonSearch = document.querySelector("#button-search");
const boxSearch = document.querySelector("#query");

buttonSearch.addEventListener("click", (event) => {
    event.preventDefault();
    const { value } = boxSearch;
    if (value == "") {
        alert("Por favor, preencha os dados para pesquisa");
        boxSearch.focus();
        return;
    }
    Dados.GetMovies(value);
});

class DadosMovies {
    constructor() {
        this.load()
        this.expandFavoritados()
    }
    load() {
        this.listadefilmesFavoritados = JSON.parse(localStorage.getItem('@favoritos:')) || []
        if (this.listadefilmesFavoritados.length > 0) {
            document.querySelector(".favoritados").classList.add("show")
        } else {
            document.querySelector(".favoritados").classList.remove("show")
        }
    }
    setItemFav() {
        localStorage.setItem('@favoritos:', JSON.stringify(this.listadefilmesFavoritados))
    }
    async GetMovies(query) {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=pt-BR`;
        const loadingSpinner = document.querySelector(".box-loading");
        try {
            const response = await fetch(url);
            const data = await response.json();
            const movies = data.results;
            if (movies.length === 0) {
                alert("Filme não encontrado");
                boxSearch.value = "";
                boxSearch.focus();
                return;
            }

            this.removeHTML()
            // Show loading spinner
            loadingSpinner.style.display = "flex";
            await this.GetDados(movies, movies.length);
            boxSearch.value = "";
        } catch (error) {
            console.error("Error fetching movies:", error);
            alert("Ocorreu um erro ao buscar os filmes. Por favor, tente novamente mais tarde.");
        } finally {
            // Hide loading spinner
            loadingSpinner.style.display = "none";
        }
    }
    async GetDados(dados, tamanho) {
        let contador = 0;
        let ArrayListDados = []
        for (let extrairID of dados) {
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

            if (contador == tamanho) {
                this.fazeroHTML(ArrayListDados)
            }
        }
    }
    createHTML() {
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `    <div class="card-img">
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
        </div>
      </div>`;

        return div;
    }
    fazeroHTML(DadosFilms) {
        DadosFilms.forEach(card => {
            let row = this.createHTML();

            if (card.capadofilme == null) {
                return
            }
            if (DadosFilms.length == 1) {
                row.classList.add("widthh");
            }

            if (DadosFilms.length > 1 && DadosFilms.length <= 5) {
                row.classList.add("width");
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

            row.querySelector(".card:has(img) img").src = `https://image.tmdb.org/t/p/w200${card.capadofilme}`;
            row.querySelector(".card:has(img) img").alt = `Imagem do filme ${card.titulo}`;
            row.querySelector(".movie-title").textContent = card.titulo;
            row.querySelector(".movie-type").textContent = `${(GeneneroSelected(card.genero)) || "Desconhecido"}`;
            row.querySelector(".movie-release").textContent = `${converterData(card.datadelancamento)}`;
            row.addEventListener("click", () => {
                document.querySelector(".expand-card").classList.add("show");
                document.body.style.overflow = "hidden";
                this.ExpandCard(card)
            })
            document.querySelector("#movies").append(row);

        })
    }
    createExpandHTML() {
        let div = document.createElement("div")
        div.classList.add("filme-card")
        div.innerHTML = `
        <div class="botoes">
          <i class="fa-sharp fa-regular fa-heart btn-fav-off"></i>
          <i class="fa-sharp fa-solid fa-heart btn-fav-on hidden"></i>
          <i class="fa-solid fa-xmark fechar"></i>
        </div>
        <img src="" alt="foto do filme">
        <div class="container-info">
          <h2 class="filme-titulo">Título do Filme</h2>
          <p class="filme-genero">Gênero: Ação, Aventura</p>
          <p class="filme-lancamento">Data de Lançamento: 25 de dezembro de 2022</p>
          <p class="filme-descricao">Descrição do Filme:</p>
          <span class="filme-descricao-span">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odit rem fugit
            accusantium quis voluptatem, quae obcaecati consectetur accusamus, voluptas eius, mollitia architecto deleniti
            ipsa fuga? Quaerat beatae praesentium quod vero.</span>
        </div>`

        return div
    }
    ExpandCard(card) {
        let rower = this.createExpandHTML()
        const btnFechar = rower.querySelector("i.fechar");
        const btnFavOff = rower.querySelector("i.btn-fav-off");
        const btnFavOn = rower.querySelector("i.btn-fav-on");

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

            let dataconvertida = `Data de Lançamento: ${dia} de ${mes} de ${ano}`;
            if (mes == "Mês inválido") {
                dataconvertida = `Data de Lançamento: Invalida`;
            }
            return dataconvertida;
        }

        if (this.listadefilmesFavoritados.findIndex(fav => fav.id === card.id) !== -1) {
            btnFavOff.classList.add("hidden");
            btnFavOn.classList.remove("hidden");
        } else {
            btnFavOff.classList.remove("hidden");
            btnFavOn.classList.add("hidden");
        }

        rower.querySelector(".filme-card img").src = `https://image.tmdb.org/t/p/w500${card.background}`;
        if (card.background == null) {
            rower.querySelector(".filme-card img").src = `https://image.tmdb.org/t/p/w500${card.capadofilme}`;
            const elemento = rower.querySelector(".filme-card img");
            Object.assign(elemento.style, {
                maxHeight: "38rem",
            });
        }
        rower.querySelector(".filme-card img").alt = `Foto do filme ${card.titulo}`;
        rower.querySelector(".filme-titulo").textContent = card.titulo;
        rower.querySelector(".filme-genero").textContent = `Gênero: ${Generos()}`;
        rower.querySelector(".filme-lancamento").textContent = `${DatadeLancamento()}`;
        rower.querySelector(".filme-descricao-span").textContent = `${card.descricao}`;
        if (card.descricao == "") {
            rower.querySelector(".filme-descricao").textContent = `Sem Descrição`;
        } else {
            rower.querySelector(".filme-descricao").textContent = `Descrição do Filme:`;
        }

        btnFechar.addEventListener("click", () => {
            rower.parentElement.classList.remove("show")
            document.body.style.overflow = "initial";
            this.removeExpandHTML()

        });

        btnFavOff.addEventListener("click", () => {
            if (this.listadefilmesFavoritados.findIndex(fav => fav.id === card.id) === -1) {
                this.listadefilmesFavoritados.push(card);
                this.setItemFav()
                this.load()
                btnFavOff.classList.add("hidden");
                btnFavOn.classList.remove("hidden");

            }

        });
        btnFavOn.addEventListener("click", () => {
            const index = this.listadefilmesFavoritados.findIndex(fav => fav.id === card.id);
            if (index !== -1) {
                this.listadefilmesFavoritados.splice(index, 1);
                this.setItemFav();
                this.load();
                btnFavOff.classList.remove("hidden");
                btnFavOn.classList.add("hidden");
            }
        });
        document.querySelector(".expand-card").append(rower)
    }
    removeHTML() {
        document.querySelectorAll("#movies .card").forEach((card) => card.remove());
    }
    removeExpandHTML() {
        document.querySelectorAll("#expand-card .filme-card").forEach(filme => filme.remove())
    }
    expandFavoritados() {
        document.querySelector("i.favoritados").addEventListener("click", () => {
            this.load()
            this.removeHTML()

            this.listadefilmesFavoritados.forEach(card => {
                let row = this.createHTML();

                if (card.capadofilme == null) {
                    return
                }
                if (this.listadefilmesFavoritados.length == 1) {
                    row.classList.add("widthh");
                }

                if (this.listadefilmesFavoritados.length > 1 && this.listadefilmesFavoritados.length <= 5) {
                    row.classList.add("width");
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

                row.querySelector(".card:has(img) img").src = `https://image.tmdb.org/t/p/w200${card.capadofilme}`;
                row.querySelector(".card:has(img) img").alt = `Imagem do filme ${card.titulo}`;
                row.querySelector(".movie-title").textContent = card.titulo;
                row.querySelector(".movie-type").textContent = `${(GeneneroSelected(card.genero)) || "Desconhecido"}`;
                row.querySelector(".movie-release").textContent = `${converterData(card.datadelancamento)}`;
                row.addEventListener("click", () => {
                    document.querySelector(".expand-card").classList.add("show");
                    document.body.style.overflow = "hidden";
                    this.ExpandCard2Favoritos(card)


                })
                document.querySelector("#movies").append(row);



            })



        })


    }
    ExpandCard2Favoritos(card) {
        let dataFavoritos = this.ExpandHTMLFavoritos()
        const botaofechar = dataFavoritos.querySelector("i.fechando");
        const botaoOF = dataFavoritos.querySelector("i.botaoOF");
        const botaoON = dataFavoritos.querySelector("i.botaoON");
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

            let dataconvertida = `Data de Lançamento: ${dia} de ${mes} de ${ano}`;
            if (mes == "Mês inválido") {
                dataconvertida = `Data de Lançamento: Invalida`;
            }
            return dataconvertida;
        }

        if (this.listadefilmesFavoritados.findIndex(fav => fav.id === card.id) !== -1) {
            botaoOF.classList.add("hidden");
            botaoON.classList.remove("hidden");
        } else {
            botaoOF.classList.remove("hidden");
            botaoON.classList.add("hidden");
        }

        dataFavoritos.querySelector(".filme-card img").src = `https://image.tmdb.org/t/p/w500${card.background}`;
        if (card.background == null) {
            dataFavoritos.querySelector(".filme-card img").src = `https://image.tmdb.org/t/p/w500${card.capadofilme}`;
            const elemento = dataFavoritos.querySelector(".filme-card img");
            Object.assign(elemento.style, {
                maxHeight: "38rem",
            });
        }
        dataFavoritos.querySelector(".filme-card img").alt = `Foto do filme ${card.titulo}`;
        dataFavoritos.querySelector(".filme-titulo").textContent = card.titulo;
        dataFavoritos.querySelector(".filme-genero").textContent = `Gênero: ${Generos()}`;
        dataFavoritos.querySelector(".filme-lancamento").textContent = `${DatadeLancamento()}`;
        dataFavoritos.querySelector(".filme-descricao-span").textContent = `${card.descricao}`;
        if (card.descricao == "") {
            dataFavoritos.querySelector(".filme-descricao").textContent = `Sem Descrição`;
        } else {
            dataFavoritos.querySelector(".filme-descricao").textContent = `Descrição do Filme:`;
        }


        botaofechar.addEventListener("click", () => {
            dataFavoritos.parentElement.classList.remove("show")
            document.body.style.overflow = "initial";
            this.removeExpandHTML()
            this.removeHTML()
            this.load()
            this.removeHTML()

            this.listadefilmesFavoritados.forEach(card => {
                let row = this.createHTML();

                if (card.capadofilme == null) {
                    return
                }
                if (this.listadefilmesFavoritados.length == 1) {
                    row.classList.add("widthh");
                }

                if (this.listadefilmesFavoritados.length > 1 && this.listadefilmesFavoritados.length <= 5) {
                    row.classList.add("width");
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

                row.querySelector(".card:has(img) img").src = `https://image.tmdb.org/t/p/w200${card.capadofilme}`;
                row.querySelector(".card:has(img) img").alt = `Imagem do filme ${card.titulo}`;
                row.querySelector(".movie-title").textContent = card.titulo;
                row.querySelector(".movie-type").textContent = `${(GeneneroSelected(card.genero)) || "Desconhecido"}`;
                row.querySelector(".movie-release").textContent = `${converterData(card.datadelancamento)}`;
                row.addEventListener("click", () => {
                    document.querySelector(".expand-card").classList.add("show");
                    document.body.style.overflow = "hidden";
                    this.ExpandCard2Favoritos(card)
                })
                document.querySelector("#movies").append(row);

            })





        });



        botaoOF.addEventListener("click", () => {
            if (this.listadefilmesFavoritados.findIndex(fav => fav.id === card.id) === -1) {
                this.listadefilmesFavoritados.push(card);
                this.setItemFav()
                this.load()
                botaoOF.classList.add("hidden");
                botaoON.classList.remove("hidden");

            }

        });

        botaoON.addEventListener("click", () => {
            const index = this.listadefilmesFavoritados.findIndex(fav => fav.id === card.id);
            if (index !== -1) {
                this.listadefilmesFavoritados.splice(index, 1);
                this.setItemFav();
                this.load();
                botaoOF.classList.remove("hidden");
                botaoON.classList.add("hidden");


            }


        });


        document.querySelector(".expand-card").append(dataFavoritos)



    }
    ExpandHTMLFavoritos() {
        let div = document.createElement("div")
        div.classList.add("filme-card")
        div.innerHTML = `
        <div class="botoes">
          <i class="fa-sharp fa-regular fa-heart botaoOF"></i>
          <i class="fa-sharp fa-solid fa-heart botaoON hidden"></i>
          <i class="fa-solid fa-xmark fechando"></i>
        </div>
        <img src="" alt="foto do filme">
        <div class="container-info">
          <h2 class="filme-titulo">Título do Filme</h2>
          <p class="filme-genero">Gênero: Ação, Aventura</p>
          <p class="filme-lancamento">Data de Lançamento: 25 de dezembro de 2022</p>
          <p class="filme-descricao">Descrição do Filme:</p>
          <span class="filme-descricao-span">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odit rem fugit
            accusantium quis voluptatem, quae obcaecati consectetur accusamus, voluptas eius, mollitia architecto deleniti
            ipsa fuga? Quaerat beatae praesentium quod vero.</span>
        </div>`

        return div
    }
}
const Dados = new DadosMovies();