# Visualizador de Diálogos em Japonês

Este projeto é um visualizador de diálogos em japonês, ideal para estudantes da língua japonesa. Ele permite navegar por diferentes diálogos, visualizar o texto em kanji, hiragana/kana, romaji e tradução em português, além de exibir uma imagem ilustrativa para cada diálogo.

## Como funciona
- O front-end é totalmente estático (HTML, CSS, JS) e pode ser hospedado facilmente em serviços como Netlify.
- Os dados dos diálogos são carregados dinamicamente a partir de uma API REST hospedada no Azure.
- O usuário pode alternar entre os diferentes modos de exibição do texto japonês (kanji, hiragana/kana, romaji) e a tradução.
- A navegação é feita por miniaturas das imagens dos diálogos.

## Estrutura do Projeto
```
dialogos_japones/
├── dialogos/           # (Apenas exemplo, não usado no deploy atual)
├── index.html          # Página principal
├── script.js           # Lógica do front-end
├── style.css           # Estilos
├── README.md           # Este arquivo
```

## Como rodar localmente
1. Clone o repositório:
   ```sh
   git clone <url-do-repositorio>
   cd dialogos_japones
   ```
2. Abra o arquivo `index.html` no seu navegador.
   - **Atenção:** Para funcionar corretamente, o navegador precisa permitir requisições para a API (CORS). Se for testar localmente, pode ser necessário rodar um servidor local simples, como:
     ```sh
     npx serve .
     # ou
     python -m http.server
     ```

## Como funciona o deploy no Netlify
- Basta conectar o repositório ao Netlify e publicar.
- Não é necessário nenhum comando de build, pois o site é estático.
- O arquivo `script.js` já contém a URL da API diretamente no código.
- O diretório de publicação deve ser a raiz do projeto (`.`).

## Sobre a API
- A API deve retornar um array de objetos JSON, cada um representando um diálogo, com os seguintes campos:
  - `nome`: Nome do diálogo
  - `url_Img`: URL da imagem ilustrativa
  - `traducao`: Tradução em português
  - `japones`: Texto em japonês (kanji)
  - `japones_Sem_Kanji`: Texto em hiragana/kana
  - `romaji`: Texto em romaji

## Personalização
- Para adicionar novos diálogos, basta inserir os dados no banco de dados da API.
- Para alterar a URL da API, edite diretamente no `script.js`.

## Licença
Este projeto está sob a licença MIT.

---
Dúvidas ou sugestões? Abra uma issue ou entre em contato! 