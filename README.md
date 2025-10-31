# Invisible Characters Detector 🔍

Uma extensão do Chrome que detecta e destaca visualmente **TODOS** os caracteres invisíveis presentes em páginas web.

## 🌟 Funcionalidades

- ✨ **Detecção Completa**: Detecta 100+ tipos de caracteres invisíveis
- 🎯 **Detecção Automática**: Ativa automaticamente ao carregar a página
- 📊 **Contador Detalhado**: Mostra quantos caracteres invisíveis foram encontrados
- 🔍 **Tooltip Informativo**: Mostra o nome e código Unicode de cada caractere
- 🎨 **Interface Moderna**: Popup bonito e intuitivo
- ⚡ **Performance**: Processamento eficiente mesmo em páginas grandes
- 🌐 **Suporte Unicode Completo**: Incluindo pares surrogate (caracteres > U+FFFF)

## 🎯 Caracteres Detectados

### Espaços Especiais
- Non-Breaking Space (U+00A0) - o famoso `&nbsp;`
- Zero Width Space (U+200B)
- Zero Width Non-Joiner (U+200C)
- Zero Width Joiner (U+200D)
- En Space, Em Space, Thin Space, Hair Space
- Ideographic Space (U+3000)
- E muitos outros...

### Caracteres Invisíveis Especiais
- **Hangul Fillers** (U+1160 - ㅤ) - o caractere invisível coreano
- Soft Hyphen (U+00AD)
- Word Joiner (U+2060)
- Zero Width No-Break Space (U+FEFF)

### Caracteres de Controle
- Line Separator (U+2028)
- Paragraph Separator (U+2029)
- Caracteres de controle C0 e C1
- Formatação bidirecional (LTR/RTL)

### Operadores Invisíveis
- Invisible Times (U+2062)
- Invisible Separator (U+2063)
- Invisible Plus (U+2064)

### Outros
- Combining Marks (quando sozinhos)
- Variation Selectors
- Tag Characters
- E mais 100+ caracteres!

## 📦 Instalação

1. Clone ou baixe este repositório
2. Abra o Chrome e vá para `chrome://extensions/`
3. Ative o "Modo do desenvolvedor" no canto superior direito
4. Clique em "Carregar sem compactação"
5. Selecione a pasta do projeto `no-nbsp`

## 🚀 Como Usar

1. Navegue até qualquer página web
2. A extensão detectará automaticamente os `&nbsp;` ao carregar
3. Clique no ícone da extensão para ver o status
4. Use o botão "Ativar/Desativar Detecção" para controlar a marcação

## 🎨 Visualização

Os caracteres invisíveis são marcados com:
- Fundo gradiente vermelho-amarelo vibrante
- Borda vermelha pulsante com animação
- Ícone de alerta (⚠) no centro
- Tooltip detalhado ao passar o mouse mostrando:
  - Nome do caractere
  - Código Unicode (U+XXXX)
  - Código decimal

## 🛠️ Tecnologias

- JavaScript (Vanilla)
- Chrome Extension Manifest V3
- CSS3 com animações
- Content Scripts

## 📝 Estrutura do Projeto

```
no-nbsp/
├── manifest.json       # Configuração da extensão
├── content.js          # Script de detecção e marcação
├── content.css         # Estilos para marcação
├── popup.html          # Interface do popup
├── popup.css           # Estilos do popup
├── popup.js            # Lógica do popup
├── icons/              # Ícones da extensão
└── README.md           # Este arquivo
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📄 Licença

MIT License - sinta-se livre para usar e modificar!

