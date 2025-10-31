// Detecta e marca caracteres invisíveis na página
(function() {
  'use strict';

  let isHighlighting = false;
  let originalContent = new Map();

  // Mapa completo de caracteres invisíveis Unicode com descrições
  const INVISIBLE_CHARS_MAP = new Map([
    // === ESPAÇOS ESPECIAIS ===
    [0x00A0, 'Non-Breaking Space (NBSP)'],
    [0x1680, 'Ogham Space Mark'],
    [0x180E, 'Mongolian Vowel Separator'],
    [0x2000, 'En Quad'],
    [0x2001, 'Em Quad'],
    [0x2002, 'En Space'],
    [0x2003, 'Em Space'],
    [0x2004, 'Three-Per-Em Space'],
    [0x2005, 'Four-Per-Em Space'],
    [0x2006, 'Six-Per-Em Space'],
    [0x2007, 'Figure Space'],
    [0x2008, 'Punctuation Space'],
    [0x2009, 'Thin Space'],
    [0x200A, 'Hair Space'],
    [0x202F, 'Narrow No-Break Space'],
    [0x205F, 'Medium Mathematical Space'],
    [0x3000, 'Ideographic Space'],
    
    // === ZERO-WIDTH CHARACTERS ===
    [0x200B, 'Zero Width Space (ZWSP)'],
    [0x200C, 'Zero Width Non-Joiner (ZWNJ)'],
    [0x200D, 'Zero Width Joiner (ZWJ)'],
    [0x2060, 'Word Joiner'],
    [0xFEFF, 'Zero Width No-Break Space (BOM)'],
    
    // === CARACTERES DE CONTROLE ===
    [0x00AD, 'Soft Hyphen'],
    [0x034F, 'Combining Grapheme Joiner'],
    [0x061C, 'Arabic Letter Mark'],
    [0x070F, 'Syriac Abbreviation Mark'],
    [0x180B, 'Mongolian Free Variation Selector 1'],
    [0x180C, 'Mongolian Free Variation Selector 2'],
    [0x180D, 'Mongolian Free Variation Selector 3'],
    [0x2028, 'Line Separator'],
    [0x2029, 'Paragraph Separator'],
    
    // === FORMATAÇÃO BIDIRECIONAL ===
    [0x202A, 'Left-To-Right Embedding'],
    [0x202B, 'Right-To-Left Embedding'],
    [0x202C, 'Pop Directional Formatting'],
    [0x202D, 'Left-To-Right Override'],
    [0x202E, 'Right-To-Left Override'],
    [0x2066, 'Left-To-Right Isolate'],
    [0x2067, 'Right-To-Left Isolate'],
    [0x2068, 'First Strong Isolate'],
    [0x2069, 'Pop Directional Isolate'],
    
    // === OPERADORES INVISÍVEIS ===
    [0x2061, 'Function Application'],
    [0x2062, 'Invisible Times'],
    [0x2063, 'Invisible Separator'],
    [0x2064, 'Invisible Plus'],
    
    // === CARACTERES DE FORMATAÇÃO ===
    [0x206A, 'Inhibit Symmetric Swapping'],
    [0x206B, 'Activate Symmetric Swapping'],
    [0x206C, 'Inhibit Arabic Form Shaping'],
    [0x206D, 'Activate Arabic Form Shaping'],
    [0x206E, 'National Digit Shapes'],
    [0x206F, 'Nominal Digit Shapes'],
    
    // === HANGUL FILLERS (como ㅤ) ===
    [0x115F, 'Hangul Choseong Filler'],
    [0x1160, 'Hangul Jungseong Filler (ㅤ)'],
    [0x3164, 'Hangul Filler'],
    
    // === OUTROS INVISÍVEIS ===
    [0x17B4, 'Khmer Vowel Inherent Aq'],
    [0x17B5, 'Khmer Vowel Inherent Aa'],
    [0x3164, 'Hangul Filler'],
    
    // === VARIATION SELECTORS ===
    [0xFE00, 'Variation Selector-1'], [0xFE01, 'Variation Selector-2'],
    [0xFE02, 'Variation Selector-3'], [0xFE03, 'Variation Selector-4'],
    [0xFE04, 'Variation Selector-5'], [0xFE05, 'Variation Selector-6'],
    [0xFE06, 'Variation Selector-7'], [0xFE07, 'Variation Selector-8'],
    [0xFE08, 'Variation Selector-9'], [0xFE09, 'Variation Selector-10'],
    [0xFE0A, 'Variation Selector-11'], [0xFE0B, 'Variation Selector-12'],
    [0xFE0C, 'Variation Selector-13'], [0xFE0D, 'Variation Selector-14'],
    [0xFE0E, 'Variation Selector-15'], [0xFE0F, 'Variation Selector-16'],
    
    // === ANNOTATION CHARACTERS ===
    [0xFFF9, 'Interlinear Annotation Anchor'],
    [0xFFFA, 'Interlinear Annotation Separator'],
    [0xFFFB, 'Interlinear Annotation Terminator'],
    
    // === COMBINING MARKS (invisíveis quando sozinhos) ===
    [0x0300, 'Combining Grave Accent'],
    [0x0301, 'Combining Acute Accent'],
    [0x0302, 'Combining Circumflex Accent'],
    [0x0303, 'Combining Tilde'],
    [0x0304, 'Combining Macron'],
    [0x0305, 'Combining Overline'],
    [0x0306, 'Combining Breve'],
    [0x0307, 'Combining Dot Above'],
    [0x0308, 'Combining Diaeresis'],
    [0x0309, 'Combining Hook Above'],
    [0x030A, 'Combining Ring Above'],
    [0x030B, 'Combining Double Acute Accent'],
    [0x030C, 'Combining Caron'],
    [0x030D, 'Combining Vertical Line Above'],
    [0x030E, 'Combining Double Vertical Line Above'],
    [0x030F, 'Combining Double Grave Accent'],
    [0x0310, 'Combining Candrabindu'],
  ]);

  // Função criteriosa para verificar se um caractere é invisível
  function isInvisibleChar(charCode, char) {
    // 1. Verifica no mapa de caracteres conhecidos
    if (INVISIBLE_CHARS_MAP.has(charCode)) {
      return true;
    }
    
    // 2. Caracteres de controle C0 e C1 (exceto espaço normal e tab/newline úteis)
    if ((charCode >= 0x0000 && charCode <= 0x001F && charCode !== 0x0009 && charCode !== 0x000A && charCode !== 0x000D) ||
        (charCode >= 0x007F && charCode <= 0x009F)) {
      return true;
    }
    
    // 3. Variation Selectors estendidos (U+E0100 a U+E01EF)
    if (charCode >= 0xE0100 && charCode <= 0xE01EF) {
      return true;
    }
    
    // 4. Tags (U+E0000 a U+E007F)
    if (charCode >= 0xE0000 && charCode <= 0xE007F) {
      return true;
    }
    
    // 5. Combining marks quando sozinhos (U+0300 a U+036F)
    if (charCode >= 0x0300 && charCode <= 0x036F) {
      return true;
    }
    
    // 6. Combining marks estendidos
    if ((charCode >= 0x1AB0 && charCode <= 0x1AFF) ||
        (charCode >= 0x1DC0 && charCode <= 0x1DFF) ||
        (charCode >= 0x20D0 && charCode <= 0x20FF) ||
        (charCode >= 0xFE20 && charCode <= 0xFE2F)) {
      return true;
    }
    
    // 7. Formato especial e invisíveis diversos
    if ((charCode >= 0x2060 && charCode <= 0x206F) ||
        (charCode >= 0xFFF0 && charCode <= 0xFFFB)) {
      return true;
    }
    
    // 8. Verifica se o caractere parece visível mas é tecnicamente "em branco"
    // usando regex para detectar caracteres que são apenas whitespace
    if (char && /^\s$/.test(char) && charCode !== 0x0020) { // não é espaço normal
      return true;
    }
    
    return false;
  }

  // Função para obter o nome do caractere invisível
  function getInvisibleCharName(charCode) {
    if (INVISIBLE_CHARS_MAP.has(charCode)) {
      return INVISIBLE_CHARS_MAP.get(charCode);
    }
    
    // Categorias genéricas
    if (charCode >= 0x0000 && charCode <= 0x001F) return 'Caractere de Controle C0';
    if (charCode >= 0x007F && charCode <= 0x009F) return 'Caractere de Controle C1';
    if (charCode >= 0x0300 && charCode <= 0x036F) return 'Combining Diacritical Mark';
    if (charCode >= 0xE0100 && charCode <= 0xE01EF) return 'Variation Selector Supplement';
    if (charCode >= 0xE0000 && charCode <= 0xE007F) return 'Tag Character';
    
    return `Caractere Invisível`;
  }

  // Função para encontrar e marcar caracteres invisíveis em um nó de texto
  function highlightNbspInTextNode(textNode) {
    const text = textNode.textContent;
    
    // Se o texto está vazio, ignora
    if (!text || text.length === 0) {
      return false;
    }
    
    let hasInvisible = false;
    
    // Verifica se há entidades HTML literais (não convertidas)
    const hasHtmlEntity = /&(?:nbsp|#160|#xA0);/.test(text);
    
    // Verifica se há algum caractere invisível (pré-verificação rápida)
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const char = text[i];
      if (isInvisibleChar(charCode, char)) {
        hasInvisible = true;
        break;
      }
    }
    
    if (!hasInvisible && !hasHtmlEntity) {
      return false;
    }
    
    const parent = textNode.parentNode;
    
    // Ignora se o parent já foi processado ou é nossa própria marcação
    if (!parent || 
        (parent.classList && parent.classList.contains('no-nbsp-processed')) ||
        (parent.classList && parent.classList.contains('no-nbsp-highlight'))) {
      return false;
    }
    
    // Salva o conteúdo original
    if (!originalContent.has(parent)) {
      originalContent.set(parent, parent.innerHTML);
    }
    
    // Cria um span wrapper para o texto marcado
    const span = document.createElement('span');
    span.className = 'no-nbsp-processed';
    
    // Processa cada caractere (incluindo pares surrogate e entidades HTML)
    let i = 0;
    while (i < text.length) {
      const char = text[i];
      const charCode = text.charCodeAt(i);
      
      // Verifica se começa uma entidade HTML literal (ex: &nbsp;, &#160;, &#xA0;)
      if (char === '&') {
        const remainingText = text.substring(i);
        const entityMatch = remainingText.match(/^&(?:nbsp|#160|#xA0|#x00A0);/);
        
        if (entityMatch) {
          // Encontrou entidade HTML literal - marcar como invisível
          const entityText = entityMatch[0];
          const marker = document.createElement('span');
          marker.className = 'no-nbsp-highlight';
          marker.textContent = entityText;
          marker.setAttribute('data-char-code', '160');
          marker.setAttribute('data-char-hex', 'U+00A0');
          marker.title = `Entidade HTML literal: ${entityText}\n(representa Non-Breaking Space - U+00A0)`;
          span.appendChild(marker);
          i += entityText.length;
          continue;
        }
      }
      
      // Verifica se é parte de um par surrogate (caracteres Unicode > U+FFFF)
      let fullChar = char;
      let fullCharCode = charCode;
      
      if (charCode >= 0xD800 && charCode <= 0xDBFF && i + 1 < text.length) {
        // High surrogate, verifica se tem low surrogate
        const nextCharCode = text.charCodeAt(i + 1);
        if (nextCharCode >= 0xDC00 && nextCharCode <= 0xDFFF) {
          // Par surrogate completo
          fullChar = char + text[i + 1];
          fullCharCode = ((charCode - 0xD800) * 0x400) + (nextCharCode - 0xDC00) + 0x10000;
          i++; // Pula o próximo caractere pois já processamos
        }
      }
      
      // Verifica se é um caractere invisível
      if (isInvisibleChar(fullCharCode, fullChar)) {
        const marker = document.createElement('span');
        marker.className = 'no-nbsp-highlight';
        marker.textContent = fullChar; // Mantém o caractere original
        marker.setAttribute('data-char-code', fullCharCode);
        marker.setAttribute('data-char-hex', 'U+' + fullCharCode.toString(16).toUpperCase().padStart(4, '0'));
        marker.title = `${getInvisibleCharName(fullCharCode)}\nU+${fullCharCode.toString(16).toUpperCase().padStart(4, '0')} (Dec: ${fullCharCode})`;
        span.appendChild(marker);
      } else {
        // Adiciona texto normal
        if (span.lastChild && span.lastChild.nodeType === Node.TEXT_NODE) {
          span.lastChild.textContent += fullChar;
        } else {
          span.appendChild(document.createTextNode(fullChar));
        }
      }
      
      i++;
    }
    
    // Só substitui se realmente encontrou algo
    if (span.querySelector('.no-nbsp-highlight')) {
      parent.replaceChild(span, textNode);
      return true;
    }
    
    return false;
  }

  // Função recursiva para percorrer todos os nós de texto
  function walkTextNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      highlightNbspInTextNode(node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Ignora scripts, styles e a própria marcação
      if (node.tagName !== 'SCRIPT' && 
          node.tagName !== 'STYLE' && 
          !node.classList.contains('no-nbsp-highlight')) {
        
        // Cria uma cópia do array de nós filhos para evitar problemas com modificações
        const children = Array.from(node.childNodes);
        children.forEach(child => walkTextNodes(child));
      }
    }
  }

  // Função para ativar o highlight
  function enableHighlight() {
    if (isHighlighting) return;
    
    isHighlighting = true;
    originalContent.clear();
    
    walkTextNodes(document.body);
    
    // Inicia o observer se ainda não estiver rodando
    startObserving();
    
    // Salva o estado
    chrome.storage.local.set({ isActive: true });
    
    // Adiciona contador no canto da tela
    const count = document.querySelectorAll('.no-nbsp-highlight').length;
    showNotification(`${count} caractere${count !== 1 ? 's' : ''} invisível${count !== 1 ? 'eis' : ''} encontrado${count !== 1 ? 's' : ''}`);
  }

  // Função para desativar o highlight
  function disableHighlight() {
    if (!isHighlighting) return;
    
    isHighlighting = false;
    
    // Para o observer
    stopObserving();
    
    // Remove todos os wrappers processados
    document.querySelectorAll('.no-nbsp-processed').forEach(wrapper => {
      const textContent = wrapper.textContent;
      wrapper.replaceWith(document.createTextNode(textContent));
    });
    
    originalContent.clear();
    removeNotification();
    
    // Salva o estado
    chrome.storage.local.set({ isActive: false });
  }

  // Função para alternar o highlight
  function toggleHighlight() {
    if (isHighlighting) {
      disableHighlight();
    } else {
      enableHighlight();
    }
  }

  // Mostra notificação com contagem
  function showNotification(message) {
    removeNotification();
    
    const notification = document.createElement('div');
    notification.id = 'no-nbsp-notification';
    notification.className = 'no-nbsp-notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove após 3 segundos
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => removeNotification(), 300);
    }, 3000);
  }

  function removeNotification() {
    const existing = document.getElementById('no-nbsp-notification');
    if (existing) {
      existing.remove();
    }
  }

  // Escuta mensagens do popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggle') {
      toggleHighlight();
      sendResponse({ active: isHighlighting });
    } else if (request.action === 'getStatus') {
      sendResponse({ active: isHighlighting });
    }
    return true;
  });

  // Observer para detectar mudanças dinâmicas no DOM
  let observer = null;

  function startObserving() {
    if (observer) return;
    
    observer = new MutationObserver((mutations) => {
      if (!isHighlighting) return;
      
      mutations.forEach((mutation) => {
        // Processa novos nós adicionados
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            walkTextNodes(node);
          } else if (node.nodeType === Node.TEXT_NODE) {
            highlightNbspInTextNode(node);
          }
        });
        
        // Processa mudanças de texto
        if (mutation.type === 'characterData') {
          highlightNbspInTextNode(mutation.target);
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      characterDataOldValue: false
    });
  }

  function stopObserving() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  // Carrega o estado salvo e ativa/desativa conforme necessário
  function initializeFromStorage() {
    chrome.storage.local.get(['isActive'], (result) => {
      // Por padrão, ativa na primeira vez (se nunca foi definido)
      const shouldActivate = result.isActive !== undefined ? result.isActive : true;
      
      if (shouldActivate) {
        enableHighlight();
      }
    });
  }

  // Inicializa ao carregar a página
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFromStorage);
  } else {
    initializeFromStorage();
  }
})();

