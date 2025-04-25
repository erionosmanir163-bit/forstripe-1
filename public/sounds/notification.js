// Este archivo contiene funciones para reproducir una notificación sonora
// La reproducción de audio requiere interacción del usuario en la mayoría de navegadores

// Variable para almacenar la instancia de Audio
let audioElement = null;

// Función para inicializar el audio (debe llamarse después de interacción del usuario)
export function initNotificationSound() {
  // Crear un elemento de audio y precargarlo
  audioElement = new Audio('/sounds/notification.mp3');
  audioElement.volume = 0.7;
  audioElement.load();
  console.log('Sonido de notificación inicializado correctamente');
  
  // Reproducir un sonido silencioso para "desbloquear" el audio en navegadores
  const unlockAudio = () => {
    audioElement.play()
      .then(() => {
        audioElement.pause();
        audioElement.currentTime = 0;
        console.log('Audio desbloqueado por interacción del usuario');
        // Eliminar los event listeners después de desbloquear
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('touchstart', unlockAudio);
        document.removeEventListener('keydown', unlockAudio);
      })
      .catch(error => {
        console.warn('No se pudo desbloquear el audio:', error);
      });
  };
  
  // Agregar listeners para capturar interacción del usuario
  document.addEventListener('click', unlockAudio);
  document.addEventListener('touchstart', unlockAudio);
  document.addEventListener('keydown', unlockAudio);
  
  return true;
}

// Función para reproducir el sonido de notificación
export function playNotificationSound() {
  // Si el audio no está inicializado, inicializarlo
  if (!audioElement) {
    initNotificationSound();
  }
  
  // Intentar reproducir el sonido
  if (audioElement) {
    // Resetear el audio para poder reproducirlo múltiples veces
    audioElement.currentTime = 0;
    audioElement.play().catch(error => {
      console.warn('No se pudo reproducir el sonido de notificación:', error);
    });
  } else {
    console.warn('El audio no está inicializado. Llama a initNotificationSound() primero.');
  }
}