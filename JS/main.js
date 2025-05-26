// Funcionalidad común para todas las páginas
document.addEventListener('DOMContentLoaded', function() {
    // Menú hamburguesa - Funcionalidad
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu .nav-link');
    
    // Toggle del menú al hacer click en la hamburguesa
    if (hamburgerMenu) {
      hamburgerMenu.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
      });
    }
    
    // Cerrar el menú al hacer click en un enlace
    if (mobileLinks.length > 0) {
      mobileLinks.forEach(link => {
        link.addEventListener('click', function(e) {
          // Prevenir navegación inmediata para que se vea la animación
          e.preventDefault();
          
          // Obtener el destino
          const href = this.getAttribute('href');
          
          // Cerrar el menú con animación
          hamburgerMenu.classList.remove('active');
          mobileMenu.classList.remove('active');
          document.body.style.overflow = 'auto';
          
          // Navegar después de un breve retraso para ver la animación de cierre
          setTimeout(() => {
            window.location.href = href;
          }, 300);
        });
      });
    }
    
    // Calcular la edad actual basada en la fecha de nacimiento (Útil para about.html)
    window.calculateAge = function() {
      const birthDate = new Date('2007-01-25');
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age;
    };
  });

  // Añade esto al final de tu main.js actual

document.addEventListener('DOMContentLoaded', function() {
  // Verificar si estamos entrando desde otra página con transición
  if (window.TransitionManager) {
    const transition = window.TransitionManager.checkTransition();
    if (transition) {
      console.log(`Transición detectada desde: ${transition.fromPage} con efecto: ${transition.effect}`);
    }
  }
  
  // Configurar transiciones para todos los enlaces de navegación
  if (window.TransitionManager) {
    // Establecer el efecto de transición predeterminado - puedes cambiarlo por cualquiera de estos:
    // EFFECTS.GLITCH, EFFECTS.SCANLINE, EFFECTS.MATRIX, EFFECTS.PIXELATE, EFFECTS.CRT
    window.TransitionManager.setDefaultEffect(window.TransitionManager.EFFECTS.GLITCH);
    
    // Aplicar transiciones a los enlaces del menú principal
    window.TransitionManager.setupLinkTransitions('header .nav-links .nav-link');
    
    // Aplicar transiciones a los enlaces del menú móvil
    window.TransitionManager.setupLinkTransitions('.mobile-menu .nav-link');
    
    // Aplicar diferentes efectos a enlaces específicos (opcional)
    window.TransitionManager.setupLinkTransitions('a[href="about.html"]', window.TransitionManager.EFFECTS.SCANLINE);
    window.TransitionManager.setupLinkTransitions('a[href="projects.html"]', window.TransitionManager.EFFECTS.MATRIX);
    window.TransitionManager.setupLinkTransitions('a[href="blog.html"]', window.TransitionManager.EFFECTS.PIXELATE);
    window.TransitionManager.setupLinkTransitions('a[href="contact.html"]', window.TransitionManager.EFFECTS.CRT);
  }
});

// Modificar la función existente launchApp en home.js para usar el nuevo sistema

// Localiza la función launchApp en home.js y reemplaza la parte de navegación con esto:
/*
// Esperar a que se complete la animación
setTimeout(() => {
  if (destination && destination !== '#') {
    // Usar el nuevo sistema de transiciones si está disponible
    if (window.TransitionManager) {
      // Seleccionar un efecto aleatorio para más variedad
      const effects = Object.values(window.TransitionManager.EFFECTS);
      const randomEffect = effects[Math.floor(Math.random() * effects.length)];
      
      // Iniciar la transición con un efecto aleatorio
      window.TransitionManager.startTransition(destination, randomEffect);
    } else {
      // Fallback al sistema antiguo si el nuevo no está disponible
      const fadeOut = document.createElement('div');
      fadeOut.className = 'screen-fade-out';
      document.body.appendChild(fadeOut);
      
      setTimeout(() => {
        window.location.href = destination;
      }, 600);
    }
  }
*/