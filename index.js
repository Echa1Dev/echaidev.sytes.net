document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let activeWindow = null;
    let windows = {};
    let zIndex = 100;
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    
    // Inicializar ventanas
    const windowsElements = document.querySelectorAll('.window');
    windowsElements.forEach(windowEl => {
      const windowId = windowEl.id;
      const windowName = windowId.replace('-window', '');
      
      // Posición inicial aleatoria (dentro de límites seguros)
      const maxX = window.innerWidth - 400;
      const maxY = window.innerHeight - 300;
      const randomX = Math.max(50, Math.min(maxX, Math.random() * maxX));
      const randomY = Math.max(50, Math.min(maxY, Math.random() * 200));
      
      windowEl.style.left = `${randomX}px`;
      windowEl.style.top = `${randomY}px`;
      
      // Almacenar referencia a la ventana
      windows[windowName] = {
        element: windowEl,
        isOpen: false,
        isMinimized: false
      };
      
      // Agregar listeners para los controles de la ventana
      setupWindowControls(windowEl, windowName);
    });
    
    // Configurar iconos de escritorio
    const desktopIcons = document.querySelectorAll('.desktop-icon');
    desktopIcons.forEach(icon => {
      icon.addEventListener('click', function() {
        const windowName = this.getAttribute('data-window');
        openWindow(windowName);
      });
      
      // Efecto de doble clic (simulado con un solo clic por simplicidad)
      icon.addEventListener('dblclick', function(e) {
        e.preventDefault(); // Prevenir selección de texto
      });
    });
    
    // Configurar botón de inicio y menú
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');
    
    startButton.addEventListener('click', function() {
      startMenu.classList.toggle('hidden');
    });
    
    // Cerrar menú inicio al hacer clic en cualquier otro lugar
    document.addEventListener('click', function(e) {
      if (!startMenu.classList.contains('hidden') && 
          !startButton.contains(e.target) && 
          !startMenu.contains(e.target)) {
        startMenu.classList.add('hidden');
      }
    });
    
    // Configurar ítems del menú inicio
    const startMenuItems = document.querySelectorAll('.start-menu-item');
    startMenuItems.forEach(item => {
      item.addEventListener('click', function() {
        const windowName = this.getAttribute('data-window');
        if (windowName) {
          openWindow(windowName);
          startMenu.classList.add('hidden');
        } else if (this.id === 'shutdown') {
          // Simulación de apagado
          document.body.style.opacity = '0';
          setTimeout(() => {
            alert('Gracias por visitar EchaiDev OS');
            document.body.style.opacity = '1';
            startMenu.classList.add('hidden');
          }, 1000);
        }
      });
    });
    
    // Configurar botones de características en la ventana de inicio
    const featureButtons = document.querySelectorAll('.feature-button');
    featureButtons.forEach(button => {
      button.addEventListener('click', function() {
        const windowName = this.getAttribute('data-window');
        if (windowName) {
          openWindow(windowName);
        }
      });
    });
    
    // Actualizar la hora en la barra de tareas
    updateTime();
    setInterval(updateTime, 60000); // Actualizar cada minuto
    
    // Efecto de parpadeo en la terminal
    const terminalCursor = document.querySelector('.terminal-cursor');
    if (terminalCursor) {
      terminalCursor.style.animation = 'blink 1s infinite';
    }
    
    // Abrir la ventana de inicio automáticamente
    setTimeout(() => {
      openWindow('home');
    }, 500);
    
    // Funciones auxiliares
    
    // Configurar controles de ventana (minimizar, maximizar, cerrar)
    function setupWindowControls(windowEl, windowName) {
      // Configurar controles
      const closeBtn = windowEl.querySelector('.window-button.close');
      const minBtn = windowEl.querySelector('.window-button.minimize');
      const maxBtn = windowEl.querySelector('.window-button.maximize');
      
      if (closeBtn) {
        closeBtn.addEventListener('click', function() {
          closeWindow(windowName);
        });
      }
      
      if (minBtn) {
        minBtn.addEventListener('click', function() {
          minimizeWindow(windowName);
        });
      }
      
      if (maxBtn) {
        maxBtn.addEventListener('click', function() {
          maximizeWindow(windowName);
        });
      }
      
      // Hacer la ventana arrastrable por la barra de título
      const header = windowEl.querySelector('.window-header');
      if (header) {
        header.addEventListener('mousedown', function(e) {
          if (e.target.closest('.window-button')) return;
          
          isDragging = true;
          activeWindow = windowEl;
          bringToFront(windowEl);
          
          const rect = windowEl.getBoundingClientRect();
          dragOffsetX = e.clientX - rect.left;
          dragOffsetY = e.clientY - rect.top;
          
          windowEl.style.transition = 'none';
        });
      }
      
      // Click en la ventana para ponerla al frente
      windowEl.addEventListener('mousedown', function() {
        bringToFront(windowEl);
      });
    }
    
    // Evento global para mover ventanas
    document.addEventListener('mousemove', function(e) {
      if (isDragging && activeWindow) {
        const newX = e.clientX - dragOffsetX;
        const newY = e.clientY - dragOffsetY;
        
        // Limitar dentro de la pantalla
        const maxX = window.innerWidth - activeWindow.offsetWidth;
        const maxY = window.innerHeight - activeWindow.offsetHeight;
        
        activeWindow.style.left = `${Math.max(0, Math.min(maxX, newX))}px`;
        activeWindow.style.top = `${Math.max(0, Math.min(maxY, newY))}px`;
      }
    });
    
    document.addEventListener('mouseup', function() {
      if (isDragging && activeWindow) {
        activeWindow.style.transition = 'transform 0.2s, opacity 0.2s';
        isDragging = false;
        activeWindow = null;
      }
    });
    
    // Abrir ventana
    function openWindow(windowName) {
      const windowObj = windows[windowName];
      if (!windowObj) return;
      
      // Actualizar estado
      windowObj.isOpen = true;
      windowObj.isMinimized = false;
      
      // Mostrar la ventana
      windowObj.element.classList.add('active');
      windowObj.element.classList.remove('minimized');
      
      // Poner la ventana al frente
      bringToFront(windowObj.element);
      
      // Actualizar la barra de tareas
      updateTaskbar();
    }
    
    // Cerrar ventana
    function closeWindow(windowName) {
      const windowObj = windows[windowName];
      if (!windowObj) return;
      
      // Actualizar estado
      windowObj.isOpen = false;
      windowObj.isMinimized = false;
      
      // Ocultar la ventana
      windowObj.element.classList.remove('active');
      windowObj.element.classList.remove('minimized');
      
      // Actualizar la barra de tareas
      updateTaskbar();
    }
    
    // Minimizar ventana
    function minimizeWindow(windowName) {
      const windowObj = windows[windowName];
      if (!windowObj) return;
      
      // Actualizar estado
      windowObj.isMinimized = true;
      
      // Ocultar la ventana
      windowObj.element.classList.remove('active');
      windowObj.element.classList.add('minimized');
      
      // Actualizar la barra de tareas
      updateTaskbar();
    }
    
    // Maximizar ventana
    function maximizeWindow(windowName) {
      const windowObj = windows[windowName];
      if (!windowObj || !windowObj.isOpen) return;
      
      const windowEl = windowObj.element;
      
      // Verificar si la ventana ya está maximizada
      if (windowEl.classList.contains('maximized')) {
        // Restaurar tamaño
        windowEl.classList.remove('maximized');
        windowEl.style.width = windowEl.dataset.prevWidth || '600px';
        windowEl.style.height = windowEl.dataset.prevHeight || '400px';
        windowEl.style.left = windowEl.dataset.prevLeft || '100px';
        windowEl.style.top = windowEl.dataset.prevTop || '100px';
      } else {
        // Guardar tamaño actual
        windowEl.dataset.prevWidth = windowEl.style.width;
        windowEl.dataset.prevHeight = windowEl.style.height;
        windowEl.dataset.prevLeft = windowEl.style.left;
        windowEl.dataset.prevTop = windowEl.style.top;
        
        // Maximizar
        windowEl.classList.add('maximized');
        windowEl.style.width = '100%';
        windowEl.style.height = 'calc(100% - 30px)';
        windowEl.style.left = '0';
        windowEl.style.top = '0';
      }
    }
    
    // Traer ventana al frente
    function bringToFront(windowEl) {
      windowEl.style.zIndex = zIndex++;
      
      // Actualizar clase active para todas las ventanas
      for (const name in windows) {
        if (windows[name].element === windowEl) {
          windows[name].element.classList.add('active');
        } else {
          windows[name].element.classList.remove('active');
        }
      }
      
      // Actualizar la barra de tareas
      updateTaskbar();
    }
    
    // Actualizar barra de tareas
    function updateTaskbar() {
      const activeWindowsContainer = document.getElementById('active-windows');
      activeWindowsContainer.innerHTML = '';
      
      for (const name in windows) {
        if (windows[name].isOpen) {
          const taskbarItem = document.createElement('div');
          taskbarItem.className = 'taskbar-item';
          if (!windows[name].isMinimized) {
            taskbarItem.classList.add('active');
          }
          
          // Agregar icono
          const icon = document.createElement('div');
          icon.className = 'taskbar-item-icon';
          icon.id = `taskbar-${name}-icon`;
          icon.style.backgroundImage = document.getElementById(`${name}-window-icon`).style.backgroundImage;
          
          // Agregar texto
          const text = document.createElement('div');
          text.className = 'taskbar-item-text';
          text.textContent = name.charAt(0).toUpperCase() + name.slice(1);
          
          taskbarItem.appendChild(icon);
          taskbarItem.appendChild(text);
          
          // Agregar listener para restablecer la ventana
          taskbarItem.addEventListener('click', function() {
            if (windows[name].isMinimized) {
              windows[name].isMinimized = false;
              windows[name].element.classList.add('active');
              windows[name].element.classList.remove('minimized');
              bringToFront(windows[name].element);
            } else {
              if (windows[name].element.classList.contains('active')) {
                minimizeWindow(name);
              } else {
                bringToFront(windows[name].element);
              }
            }
          });
          
          activeWindowsContainer.appendChild(taskbarItem);
        }
      }
    }
    
    // Actualizar hora en la barra de tareas
    function updateTime() {
      const timeElement = document.querySelector('.taskbar-time');
      if (timeElement) {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}`;
      }
    }
    
    // Ajustar tamaño de ventanas al cambiar el tamaño de la ventana
    window.addEventListener('resize', function() {
      for (const name in windows) {
        const windowEl = windows[name].element;
        const rect = windowEl.getBoundingClientRect();
        
        // Asegurar que las ventanas no se salgan de la pantalla
        if (rect.right > window.innerWidth) {
          windowEl.style.left = `${window.innerWidth - rect.width}px`;
        }
        
        if (rect.bottom > window.innerHeight) {
          windowEl.style.top = `${window.innerHeight - rect.height}px`;
        }
      }
    });
    
    // Simular prompt de terminal
    const terminalWindow = document.getElementById('terminal-window');
    if (terminalWindow) {
      const terminalOutput = terminalWindow.querySelector('.terminal-output');
      const content = terminalOutput.innerHTML;
      
      terminalWindow.addEventListener('click', function() {
        // Simula que se escriben comandos
        let commandIndex = 0;
        const commands = [
          'dir',
          'cd proyectos',
          'cls',
          'echo Bienvenido a EchaiDev OS!',
          'help'
        ];
        
        if (this.dataset.commandsStarted) return;
        this.dataset.commandsStarted = true;
        
        function typeCommand(command) {
          let i = 0;
          terminalOutput.innerHTML = content.replace('<span class="terminal-cursor">_</span>', '');
          terminalOutput.innerHTML += '<span id="typing"></span><span class="terminal-cursor">_</span>';
          const typingElement = document.getElementById('typing');
          
          const typeInterval = setInterval(() => {
            if (i < command.length) {
              typingElement.textContent += command[i];
              i++;
            } else {
              clearInterval(typeInterval);
              setTimeout(() => {
                // Procesar comando
                processCommand(command);
                
                // Preparar para el siguiente comando
                commandIndex++;
                if (commandIndex < commands.length) {
                  setTimeout(() => {
                    typeCommand(commands[commandIndex]);
                  }, 1000);
                }
              }, 500);
            }
          }, 100);
        }
        
        function processCommand(command) {
          let output = '';
          
          switch (command.toLowerCase()) {
            case 'dir':
              output = 'Directorio de C:\\ECHAIDEV\n\n' +
                      '05/05/2025  16:24    <DIR>          proyectos\n' +
                      '05/05/2025  16:12    <DIR>          documentos\n' +
                      '05/05/2025  15:08           2,048   readme.txt\n' +
                      '05/05/2025  14:33    <DIR>          portfolio\n';
              break;
            case 'cd proyectos':
              output = 'C:\\ECHAIDEV\\PROYECTOS>';
              break;
            case 'cls':
              terminalOutput.innerHTML = '';
              output = 'C:\\ECHAIDEV\\PROYECTOS>';
              break;
            case 'echo bienvenido a echaidev os!':
            case 'echo Bienvenido a EchaiDev OS!':
              output = 'Bienvenido a EchaiDev OS!\n\nC:\\ECHAIDEV\\PROYECTOS>';
              break;
            case 'help':
              output = 'Comandos disponibles:\n' +
                      'DIR     - Lista archivos y carpetas\n' +
                      'CD      - Cambia de directorio\n' +
                      'CLS     - Limpia la pantalla\n' +
                      'ECHO    - Muestra un mensaje\n' +
                      'HELP    - Muestra ayuda\n\n' +
                      'C:\\ECHAIDEV\\PROYECTOS>';
              break;
            default:
              output = `'${command}' no se reconoce como un comando interno o externo,\n` +
                      'programa o archivo por lotes ejecutable.\n\n' +
                      'C:\\ECHAIDEV\\PROYECTOS>';
          }
          
          terminalOutput.innerHTML = terminalOutput.innerHTML.replace('<span id="typing"></span><span class="terminal-cursor">_</span>', command);
          terminalOutput.innerHTML += '\n' + output + '<span class="terminal-cursor">_</span>';
        }
        
        // Iniciar secuencia de comandos
        setTimeout(() => {
          typeCommand(commands[commandIndex]);
        }, 1000);
      });
    }
  });