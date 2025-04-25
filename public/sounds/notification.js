/**
 * Utilidad para reproducir sonidos de notificación
 * Este script se puede cargar desde cualquier página y proporciona funciones
 * para reproducir sonidos a través de los altavoces del computador
 */

// Función para reproducir un sonido desde una URL
function playSound(soundUrl) {
  return new Promise((resolve, reject) => {
    // Crear un nuevo elemento de audio
    const audio = new Audio(soundUrl);
    
    // Asegurarse que se usarán los altavoces del sistema
    audio.setSinkId = audio.setSinkId || function() { return Promise.resolve(); };
    
    // Intentar usar el dispositivo de salida predeterminado (altavoces)
    audio.setSinkId('default')
      .then(() => {
        console.log('Reproduciendo sonido a través de los altavoces');
        
        // Configurar volumen al máximo para asegurar que se escuche
        audio.volume = 1.0;
        
        // Agregar listeners para eventos
        audio.onended = () => {
          console.log('Reproducción de sonido completada');
          resolve(true);
        };
        
        audio.onerror = (error) => {
          console.error('Error reproduciendo el sonido:', error);
          reject(error);
        };
        
        // Intentar reproducir el sonido
        const playPromise = audio.play();
        
        // Manejar la promesa de reproducción (navegadores modernos)
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Reproducción iniciada correctamente');
            })
            .catch(error => {
              console.error('Error iniciando la reproducción:', error);
              
              // Si hay error de interacción del usuario, intentamos una alternativa
              if (error.name === 'NotAllowedError') {
                console.warn('Reproducción bloqueada por falta de interacción del usuario');
                // No rechazamos la promesa, ya que esto es un comportamiento esperado
                resolve(false);
              } else {
                reject(error);
              }
            });
        }
      })
      .catch(error => {
        console.error('Error configurando dispositivo de salida de audio:', error);
        
        // Si falla setSinkId, intentamos reproducir de todos modos
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Reproducción alternativa iniciada correctamente');
              resolve(true);
            })
            .catch(err => {
              console.error('Error en reproducción alternativa:', err);
              reject(err);
            });
        }
      });
  });
}

// Reproducir el sonido Squirtle
window.playSquirtleSound = function() {
  return playSound('/sounds/squirtle.mp3');
};

// Reproducir sonido de notificación de pago completado
window.playPaymentCompletedSound = function() {
  return playSound('/sounds/notification.mp3');
};

// Exportar las funciones
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    playSound,
    playSquirtleSound: window.playSquirtleSound,
    playPaymentCompletedSound: window.playPaymentCompletedSound
  };
}

console.log('Sistema de notificaciones de audio cargado correctamente');