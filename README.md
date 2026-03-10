# Web Invisible Characters Detector

![GitHub repo size](https://img.shields.io/github/repo-size/lucasgfabris/web-invisible-characters-detector?style=for-the-badge)
![GitHub language count](https://img.shields.io/github/languages/count/lucasgfabris/web-invisible-characters-detector?style=for-the-badge)

> Extensao do Chrome que detecta e destaca visualmente mais de 100 tipos de caracteres invisiveis em paginas web, incluindo NBSP, Zero-Width Space, Hangul Fillers e muitos outros.

<img src="imagem.png" alt="Invisible Characters Detector">

## Pre-requisitos

Antes de comecar, verifique se voce atendeu aos seguintes requisitos:

- Google Chrome ou navegador compativel com Manifest V3
- Modo do desenvolvedor ativado no Chrome

## Instalando

Para instalar o Web Invisible Characters Detector, siga estas etapas:

1. Clone o repositório: `git clone https://github.com/lucasgfabris/web-invisible-characters-detector.git` e entre na pasta, ou baixe o ZIP
2. Abra o Chrome e va para `chrome://extensions/`
3. Ative o "Modo do desenvolvedor" no canto superior direito
4. Clique em "Carregar sem compactacao"
5. Selecione a pasta do projeto

## Usando

Para usar o Web Invisible Characters Detector, siga estas etapas:

1. Navegue ate qualquer pagina web
2. A extensao detectara automaticamente os caracteres invisiveis ao carregar
3. Clique no icone da extensao para ver o status
4. Use o botao "Ativar/Desativar Deteccao" para controlar a marcacao

### Visualizacao

Os caracteres invisiveis sao marcados com:
- Fundo gradiente vermelho-amarelo vibrante
- Borda vermelha pulsante com animacao
- Icone de alerta no centro
- Tooltip detalhado ao passar o mouse mostrando nome e codigo Unicode

### Caracteres Detectados

| Categoria | Exemplos |
|-----------|----------|
| Espacos Especiais | Non-Breaking Space (U+00A0), Zero Width Space (U+200B), En Space, Em Space |
| Caracteres Invisiveis | Hangul Fillers (U+1160), Soft Hyphen (U+00AD), Word Joiner (U+2060) |
| Controle | Line Separator (U+2028), Paragraph Separator (U+2029) |
| Operadores Invisiveis | Invisible Times (U+2062), Invisible Separator (U+2063) |
| Outros | Combining Marks, Variation Selectors, Tag Characters |

## Tecnologias

| Categoria | Tecnologias |
|-----------|-------------|
| Linguagem | JavaScript (Vanilla) |
| Plataforma | Chrome Extension Manifest V3 |
| Estilos | CSS3 com animacoes |
| Injecao | Content Scripts |

## Estrutura do Projeto

```
web-invisible-characters-detector/
├── manifest.json       # Configuracao da extensao
├── content.js          # Script de deteccao e marcacao
├── content.css         # Estilos para marcacao
├── popup.html          # Interface do popup
├── popup.css           # Estilos do popup
├── popup.js            # Logica do popup
└── icons/              # Icones da extensao
```

## Contribuindo

Para contribuir com Web Invisible Characters Detector, siga estas etapas:

1. Bifurque este repositorio.
2. Crie um branch: `git checkout -b <nome_branch>`.
3. Faca suas alteracoes e confirme-as: `git commit -m '<mensagem_commit>'`
4. Envie para o branch original: `git push origin <nome_branch>`
5. Crie a solicitacao de pull.

## Licenca

Esse projeto esta sob licenca MIT.
