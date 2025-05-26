// Funcionalidad específica para la página home
document.addEventListener('DOMContentLoaded', function() {
  const progressFill = document.getElementById('progressFill');
  const startupScreen = document.getElementById('startupScreen');
  const osContainer = document.getElementById('osContainer');
  
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
    
    // Ocultar la pantalla de inicio inmediatamente
    startupScreen.classList.add('fade-out');
  } else {
    console.log("Mostrando pantalla de inicio");
    
    // Mostrar la pantalla de inicio (ya está visible por defecto en el HTML)
    
    // Animar barra de progreso
    setTimeout(() => {
      progressFill.style.width = '100%';
    }, 500);
    
    // Después de completar la carga, mostrar el escritorio
    setTimeout(() => {
      startupScreen.classList.add('fade-out');
    }, 2500);
  }
  
  // Update clock
  setInterval(updateClock, 1000);
  
  // Initial clock update
  updateClock();
  
  // Referencia al icono Home para tratamiento especial
  const homeIcon = document.querySelector('.desktop-icon.active-app');
  
  // Add event listeners to all desktop icons
  const desktopIcons = document.querySelectorAll('.desktop-icon');
  desktopIcons.forEach(icon => {
    icon.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Detectar si este es el icono Home y ya estamos en home
      if (this === homeIcon) {
        // Mostrar animación de negación
        showDenyAnimation(this);
        return; // No continuar con la navegación
      }
      
      // Para todos los demás iconos, proceder normalmente
      
      // Get icon position for animation origin
      const rect = this.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;
      
      // Get destination URL
      const destination = this.getAttribute('href');
      
      // Get app name from the icon label
      const appName = this.querySelector('.icon-label').textContent;
      
      // Create app window
      launchApp(appName, destination, originX, originY);
    });
  });
});

// Función para mostrar animación de negación en el icono de Home
function showDenyAnimation(icon) {
  // Añadir clase para la animación
  icon.classList.add('deny-animation');
  
  // Crear un mensaje temporal
  const denyMessage = document.createElement('div');
  denyMessage.className = 'deny-message';
  denyMessage.textContent = "Ya estas en Home";
  
  // Posicionar el mensaje por encima del icono
  const rect = icon.getBoundingClientRect();
  denyMessage.style.left = `${rect.left + rect.width/2}px`;
  denyMessage.style.top = `${rect.top + rect.height + 10}px`;
  
  // Agregar y luego remover el mensaje
  document.body.appendChild(denyMessage);
  
  // Remover la clase después de que termine la animación
  setTimeout(() => {
    icon.classList.remove('deny-animation');
    document.body.removeChild(denyMessage);
  }, 1000);
}

// Clock update function
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  const clockElement = document.getElementById('osClock');
  if (clockElement) {
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
  }
}

// Función de lanzamiento de aplicación con efecto de escáner digital
function launchApp(appName, destination, originX, originY) {
  // Obtener el elemento del icono que se hizo clic
  const icons = document.querySelectorAll('.desktop-icon');
  let clickedIcon;
  
  // Encontrar el icono que se hizo clic
  icons.forEach(icon => {
    const rect = icon.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Comprueba si las coordenadas del clic están cerca del centro de este icono
    if (Math.abs(centerX - originX) < 10 && Math.abs(centerY - originY) < 10) {
      clickedIcon = icon;
    }
  });
  
  // Si encontramos el icono, aplicamos el efecto de escaneo
  if (clickedIcon) {
    // Añadir clase para posicionamiento relativo si no la tiene
    if (window.getComputedStyle(clickedIcon).position === 'static') {
      clickedIcon.style.position = 'relative';
    }
    
    // Crear efecto de línea de escaneo
    const scanLine = document.createElement('div');
    scanLine.className = 'icon-scan-effect';
    clickedIcon.appendChild(scanLine);
    
    // Crear efecto de pixelado
    const pixelate = document.createElement('div');
    pixelate.className = 'icon-pixelate';
    clickedIcon.appendChild(pixelate);
    
    // Hacer brillar el icono brevemente
    clickedIcon.style.boxShadow = 'var(--terminal-glow)';
    clickedIcon.style.transition = 'box-shadow 0.5s';
    setTimeout(() => {
      clickedIcon.style.boxShadow = 'none';
    }, 800);
  }
  
  // Añadir el efecto de texto
  const launchText = document.createElement('div');
  launchText.className = 'launch-text';
  launchText.innerHTML = `LAUNCHING ${appName.toUpperCase()}...`;
  launchText.style.top = `${window.innerHeight / 2}px`;
  launchText.style.left = `${window.innerWidth / 2}px`;
  document.body.appendChild(launchText);
  
  // Crear efecto de flash de pantalla
  const flash = document.createElement('div');
  flash.className = 'screen-flash';
  document.body.appendChild(flash);
  
  // Esperar a que se complete la animación
  setTimeout(() => {
    if (destination && destination !== '#') {
      // Registrar la transición antes de navegar - SOLO CON ICONOS
      if (window.TransitionManager) {
        window.TransitionManager.startTransition(destination);
      }
      
      // Limpiar efectos del icono antes de navegar
      if (clickedIcon) {
        const effectsToRemove = clickedIcon.querySelectorAll('.icon-scan-effect, .icon-pixelate');
        effectsToRemove.forEach(effect => effect.remove());
      }
      
      // Navegar directamente a la página de destino sin animación de oscurecimiento
      window.location.href = destination;
    } else {
      // Para aplicaciones sin destinos (Terminal, Juegos, Configuración)
      // Limpiar efectos del icono
      if (clickedIcon) {
        const effectsToRemove = clickedIcon.querySelectorAll('.icon-scan-effect, .icon-pixelate');
        effectsToRemove.forEach(effect => effect.remove());
      }
      
      // Eliminar efectos globales
      document.body.removeChild(flash);
      document.body.removeChild(launchText);
      
      // Mostrar ventana de aplicación con efecto glitch
      const appWindow = document.createElement('div');
      appWindow.className = 'app-window glitch-in';
      
      // Crear encabezado de ventana de aplicación
      const appHeader = document.createElement('div');
      appHeader.className = 'app-window-header';
      appHeader.innerHTML = `<div>${appName}</div><div class="close-button">×</div>`;
      appWindow.appendChild(appHeader);
      
      // Crear contenido de ventana de aplicación
      const appContent = document.createElement('div');
      appContent.className = 'app-window-content';
      appContent.innerHTML = `
        <div class="terminal-text">
          <span class="text-line">SYS:: ${appName.toUpperCase()} MODULE INITIALIZED</span>
          <span class="text-line">ERR:: MODULE IMPLEMENTATION NOT FOUND</span>
          <span class="text-line">SYS:: DISPLAYING DEFAULT MESSAGE</span>
          <span class="text-line terminal-cursor-line">/// La aplicación ${appName} no está implementada en esta demo. Haz clic en × para cerrar. ///<span class="terminal-cursor"></span></span>
        </div>
      `;
      appWindow.appendChild(appContent);
      
      // Añadir al body
      document.body.appendChild(appWindow);
      
      // Añadir funcionalidad al botón de cierre
      const closeButton = appWindow.querySelector('.close-button');
      closeButton.addEventListener('click', () => {
        appWindow.classList.add('glitch-out');
        setTimeout(() => {
          document.body.removeChild(appWindow);
        }, 800);
      });
    }
  }, 1200);
}