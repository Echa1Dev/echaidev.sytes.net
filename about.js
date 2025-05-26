// Funcionalidad específica para la página about
document.addEventListener('DOMContentLoaded', function() {
  // Verificar si estamos entrando desde otra página con transición
  const transition = window.TransitionManager ? window.TransitionManager.checkTransition() : null;
  
  if (transition) {
    console.log(`Entrando con transición desde: ${transition.fromPage}`);
    
    // Mostrar efecto de entrada (aclarado)
    const fadeIn = document.createElement('div');
    fadeIn.className = 'screen-fade-in';
    document.body.appendChild(fadeIn);
    
    // Remover el efecto después de completarse
    setTimeout(() => {
      document.body.removeChild(fadeIn);
    }, 800);
  }
  
  // Actualizar el nivel del jugador con la edad real
  const playerLevel = document.getElementById('player-level');
  if (playerLevel && window.calculateAge) {
    playerLevel.textContent = window.calculateAge();
  }
  
  // Funcionalidad de los modales
  const modalButtons = document.querySelectorAll('.menu-button');
  const modals = document.querySelectorAll('.modal');
  const closeButtons = document.querySelectorAll('.modal-close');
  
  // Abrir modal correspondiente
  modalButtons.forEach(button => {
    button.addEventListener('click', function() {
      const modalType = this.getAttribute('data-modal');
      const modal = document.getElementById(`${modalType}Modal`);
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });
  
  // Cerrar modales
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const modal = this.closest('.modal');
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  });
  
  // Cerrar modal al hacer clic fuera
  modals.forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        this.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  });
  
  // Evitar que al hacer clic en el contenido del modal se cierre
  const modalContents = document.querySelectorAll('.modal-content');
  modalContents.forEach(content => {
    content.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  });
  
  // Funcionalidad de pestañas
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Desactivar todas las pestañas
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Ocultar todos los contenidos
      tabContents.forEach(content => {
        content.classList.remove('active');
      });
      
      // Activar la pestaña seleccionada
      this.classList.add('active');
      
      // Mostrar el contenido correspondiente
      const tabId = this.getAttribute('data-tab');
      document.getElementById(`${tabId}-tab-content`).classList.add('active');
      
      // Animar los nodos del árbol de habilidades si es esa pestaña
      if (tabId === 'skill-tree') {
        animateSkillNodes();
      }
    });
  });
  
  // Animación para el árbol de habilidades profesional
  function animateSkillNodes() {
    // Primero, animamos las secciones
    const sections = document.querySelectorAll('.skill-section');
    sections.forEach((section, sectionIndex) => {
      // Restablecer estilos
      section.style.opacity = '0';
      section.style.transform = 'translateY(20px)';
      section.style.transition = 'none';
      void section.offsetWidth; // Forzar reflow
      
      // Animar secciones secuencialmente
      setTimeout(() => {
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        // Animar nodos dentro de cada sección
        const nodes = section.querySelectorAll('.skill-node');
        nodes.forEach((node, nodeIndex) => {
          // Restablecer estilos
          node.style.opacity = '0';
          node.style.transform = 'translateX(-20px)';
          node.style.transition = 'none';
          node.style.setProperty('--shine-delay', nodeIndex);
          void node.offsetWidth; // Forzar reflow
          
          // Animar nodos secuencialmente
          setTimeout(() => {
            node.style.opacity = '1';
            node.style.transform = 'translateX(0)';
            node.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            // Animar barras de nivel después de aparecer el nodo
            setTimeout(() => {
              const levelBar = node.querySelector('.skill-level-fill');
              if (levelBar) {
                const level = node.getAttribute('data-level') || '0';
                levelBar.style.width = `${level}%`;
              }
            }, 300);
          }, 100 * nodeIndex + 200);
        });
      }, 300 * sectionIndex);
    });
  }
  
  // Animación inicial si estamos en la pestaña de skill-tree
  if (document.querySelector('.tab-button[data-tab="skill-tree"].active')) {
    animateSkillNodes();
  }
  
  // Funcionalidad para la pestaña "About Me"
  // Referencias a elementos DOM para la pestaña About Me
  const aboutTab = document.querySelector('.tab-button[data-tab="about-me"]');
  const characterTab = document.querySelector('.tab-button[data-tab="character"]');
  const sidebarItems = document.querySelectorAll('.sidebar-item');
  const windowSections = document.querySelectorAll('.window-section');
  const windowControls = document.querySelectorAll('.window-control');
  const osWindowContainer = document.querySelector('.os-window-container');
  const osWindow = document.querySelector('.os-window');
  const loadingOverlay = document.querySelector('.window-loading-overlay');
  
  // Si la pestaña About Me existe
  if (aboutTab) {
    // Estado de la ventana
    let isWindowMinimized = false;
    let isWindowMaximized = false;
    let originalWindowSize = {
      width: '',
      height: '',
      position: '',
      top: '',
      left: '',
      right: '',
      bottom: '',
      maxWidth: ''
    };
    
    // Guardar dimensiones originales para restaurar después
    function saveWindowDimensions() {
      originalWindowSize = {
        width: osWindow.style.width || '',
        height: osWindow.style.height || '',
        position: osWindow.style.position || '',
        top: osWindow.style.top || '',
        left: osWindow.style.left || '',
        right: osWindow.style.right || '',
        bottom: osWindow.style.bottom || '',
        maxWidth: osWindow.style.maxWidth || ''
      };
    }
    
    // Restaurar dimensiones originales
    function restoreWindowDimensions() {
      Object.keys(originalWindowSize).forEach(prop => {
        osWindow.style[prop] = originalWindowSize[prop];
      });
    }
    
    // Event listener para la pestaña About Me
    aboutTab.addEventListener('click', function() {
      // Si la ventana estaba minimizada, mostrar animación de carga
      if (isWindowMinimized) {
        // Mostrar secuencia de carga
        loadingOverlay.style.display = 'flex';
        
        // Animar líneas del terminal secuencialmente
        const terminalLines = loadingOverlay.querySelectorAll('.terminal-line');
        terminalLines.forEach((line, index) => {
          setTimeout(() => {
            line.classList.add('active');
          }, 500 * (index + 1));
        });
        
        // Tras la "carga", mostrar ventana
        setTimeout(() => {
          loadingOverlay.style.display = 'none';
          osWindowContainer.style.display = 'flex';
          
          // Reset de las líneas de terminal para próxima carga
          terminalLines.forEach(line => line.classList.remove('active'));
          
          // Animación de apertura
          osWindow.style.transform = 'scale(0.95)';
          osWindow.style.opacity = '0';
          
          setTimeout(() => {
            osWindow.classList.add('window-opening');
            osWindow.style.transform = 'scale(1)';
            osWindow.style.opacity = '1';
            
            setTimeout(() => {
              osWindow.classList.remove('window-opening');
              isWindowMinimized = false;
            }, 500);
          }, 100);
        }, 2500);
      }
    });
    
    // Activar secciones cuando se hace clic en elementos de la barra lateral
    sidebarItems.forEach(item => {
      item.addEventListener('click', function() {
        const sectionName = this.getAttribute('data-section');
        
        // Desactivar todos los elementos de la barra lateral y secciones
        sidebarItems.forEach(si => si.classList.remove('active'));
        windowSections.forEach(ws => ws.classList.remove('active'));
        
        // Activar el elemento de la barra lateral seleccionado y la sección correspondiente
        this.classList.add('active');
        
        // Añadir efecto de carga a la sección
        const targetSection = document.getElementById(`${sectionName}-section`);
        
        // Efecto de "digitalización"
        const scanLine = document.createElement('div');
        scanLine.className = 'section-scan-line';
        targetSection.appendChild(scanLine);
        
        // Mostrar sección con animación después de un breve retraso
        setTimeout(() => {
          targetSection.classList.add('active');
          
          // Eliminar línea de escaneo después de la animación
          setTimeout(() => {
            if (scanLine.parentNode === targetSection) {
              targetSection.removeChild(scanLine);
            }
          }, 2000);
        }, 100);
      });
    });
    
    // Funcionalidad de los botones de control de ventana
    windowControls.forEach(control => {
      control.addEventListener('click', function() {
        // Determinar qué botón se ha pulsado
        const action = this.classList.contains('close') ? 'close' : 
                      this.classList.contains('maximize') ? 'maximize' : 'minimize';
        
        // Ejecutar la acción correspondiente
        switch(action) {
          case 'close':
            // Añadir clase para animación de cierre
            osWindow.classList.add('window-closing');
            
            // Esperar a que termine la animación antes de ocultar
            setTimeout(() => {
              // Ocultar la ventana
              osWindowContainer.style.display = 'none';
              osWindow.classList.remove('window-closing');
              isWindowMinimized = true;
              
              // Cambiar a la pestaña "Character Profile"
              characterTab.click();
            }, 400);
            break;
            
          case 'maximize':
            if (!isWindowMaximized) {
              // Guardar estado actual para poder restaurar después
              saveWindowDimensions();
              
              // Añadir clase para animación
              osWindow.classList.add('window-maximizing');
              
              // Obtener dimensiones del header y footer
              const headerHeight = document.querySelector('header')?.offsetHeight || 60;
              const footerHeight = document.querySelector('footer')?.offsetHeight || 60;
              
              // Aplicar estilo maximizado después de un pequeño retraso para la animación
              setTimeout(() => {
                osWindow.style.position = 'fixed';
                osWindow.style.top = `${headerHeight}px`;
                osWindow.style.left = '0';
                osWindow.style.right = '0';
                osWindow.style.bottom = `${footerHeight}px`;
                osWindow.style.width = '100%';
                osWindow.style.height = `calc(100vh - ${headerHeight + footerHeight}px)`;
                osWindow.style.maxWidth = 'none';
                osWindow.style.zIndex = '50';
                osWindow.style.borderRadius = '0';
                osWindow.classList.add('maximized');
                
                // Remover clase de animación
                setTimeout(() => {
                  osWindow.classList.remove('window-maximizing');
                  isWindowMaximized = true;
                }, 300);
              }, 100);
            } else {
              // Restaurar a tamaño original
              osWindow.classList.add('window-restoring');
              
              setTimeout(() => {
                // Restaurar propiedades originales
                restoreWindowDimensions();
                
                // Quitar clase de maximizado
                osWindow.classList.remove('maximized');
                
                // Quitar clase de animación después de completada
                setTimeout(() => {
                  osWindow.classList.remove('window-restoring');
                  isWindowMaximized = false;
                }, 300);
              }, 100);
            }
            break;
            
          case 'minimize':
            // Añadir clase para animación de minimización
            osWindow.classList.add('window-minimizing');
            
            // Ocultar ventana después de completar animación
            setTimeout(() => {
              osWindowContainer.style.display = 'none';
              osWindow.classList.remove('window-minimizing');
              isWindowMinimized = true;
            }, 400);
            break;
        }
      });
    });
    
    // Ajuste de efectos visuales en función del tamaño de pantalla
    function adjustWindowEffects() {
      if (window.innerWidth <= 768 && osWindow) {
        // Ajustes para móviles
        if (isWindowMaximized) {
          const headerHeight = document.querySelector('header')?.offsetHeight || 50;
          const footerHeight = document.querySelector('footer')?.offsetHeight || 50;
          
          osWindow.style.top = `${headerHeight}px`;
          osWindow.style.bottom = `${footerHeight}px`;
          osWindow.style.height = `calc(100vh - ${headerHeight + footerHeight}px)`;
        }
      }
    }
    
    // Registrar evento de resize para ajustes responsivos
    window.addEventListener('resize', adjustWindowEffects);
    
    // Inicializar efectos visuales
    adjustWindowEffects();
  }
  
  // Animación de fondo con dígitos binarios
  function createBinaryBackground() {
    const binaryBackground = document.getElementById('binaryBackground');
    if (!binaryBackground) return;
    
    // Configuración
    const maxDigits = Math.floor(window.innerWidth * window.innerHeight / 10000); // Densidad adaptativa
    const minSize = 10; // Tamaño mínimo de fuente
    const maxSize = 18; // Tamaño máximo de fuente
    
    // Función para crear un nuevo dígito binario
    function createBinaryDigit() {
      if (document.hidden) return; // No crear cuando la página no está visible
      
      const digit = document.createElement('div');
      digit.className = 'binary-digit';
      digit.textContent = Math.random() > 0.5 ? '0' : '1';
      
      // Posición aleatoria
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      digit.style.left = `${x}%`;
      digit.style.top = `${y}%`;
      
      // Tamaño aleatorio
      const size = Math.floor(Math.random() * (maxSize - minSize) + minSize);
      digit.style.fontSize = `${size}px`;
      
      // Opacidad aleatoria máxima
      const maxOpacity = Math.random() * 0.3 + 0.1;
      digit.style.setProperty('--max-opacity', maxOpacity.toString());
      
      // Añadir al fondo
      binaryBackground.appendChild(digit);
      
      // Remover después de la animación
      setTimeout(() => {
        if (digit && digit.parentNode) {
          digit.parentNode.removeChild(digit);
        }
      }, 3000);
    }
    
    // Crear dígitos iniciales
    for (let i = 0; i < maxDigits / 3; i++) {
      setTimeout(() => createBinaryDigit(), Math.random() * 2000);
    }
    
    // Continuar creando a intervalos aleatorios
    setInterval(() => {
      if (binaryBackground.childElementCount < maxDigits) {
        createBinaryDigit();
      }
    }, 200);
    
    // Ajustar cuando cambie el tamaño de la ventana
    window.addEventListener('resize', () => {
      const newMaxDigits = Math.floor(window.innerWidth * window.innerHeight / 10000);
      // Actualizar la densidad
      while (binaryBackground.childElementCount > newMaxDigits) {
        binaryBackground.removeChild(binaryBackground.firstChild);
      }
    });
  }
  
  // Inicializar la animación de fondo binaria cuando el DOM esté listo
  createBinaryBackground();
});
