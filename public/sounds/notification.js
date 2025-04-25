// Este archivo contiene funciones para reproducir una notificación sonora
// La reproducción de audio requiere interacción del usuario en la mayoría de navegadores

// Variables para almacenar las instancias de Audio
let notificationAudio = null;
let newUserAudio = null;
let completedPaymentAudio = null;

// Función para inicializar el audio (debe llamarse después de interacción del usuario)
export function initNotificationSound() {
  // Crear elementos de audio y precargarlos
  notificationAudio = new Audio('/sounds/notification.mp3');
  newUserAudio = new Audio('/sounds/squirtle.mp3');
  completedPaymentAudio = new Audio('/sounds/notification.mp3');
  
  notificationAudio.volume = 0.7;
  newUserAudio.volume = 0.7;
  completedPaymentAudio.volume = 0.7;
  
  notificationAudio.load();
  newUserAudio.load();
  completedPaymentAudio.load();
  
  console.log('Sonidos de notificación inicializados correctamente');
  
  // Reproducir un sonido silencioso para "desbloquear" el audio en navegadores
  const unlockAudio = () => {
    // Intentamos reproducir y pausar rápidamente para desbloquear
    Promise.all([
      notificationAudio.play().then(() => {
        notificationAudio.pause();
        notificationAudio.currentTime = 0;
      }),
      newUserAudio.play().then(() => {
        newUserAudio.pause();
        newUserAudio.currentTime = 0;
      }),
      completedPaymentAudio.play().then(() => {
        completedPaymentAudio.pause();
        completedPaymentAudio.currentTime = 0;
      })
    ])
    .then(() => {
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

// Función para reproducir el sonido general de notificación
export function playNotificationSound() {
  // Si el audio no está inicializado, inicializarlo
  if (!notificationAudio) {
    initNotificationSound();
  }
  
  // Intentar reproducir el sonido
  if (notificationAudio) {
    // Resetear el audio para poder reproducirlo múltiples veces
    notificationAudio.currentTime = 0;
    notificationAudio.play().catch(error => {
      console.warn('No se pudo reproducir el sonido de notificación:', error);
    });
  } else {
    console.warn('El audio no está inicializado. Llama a initNotificationSound() primero.');
  }
}

// Función específica para reproducir el sonido cuando entra un nuevo usuario
export function playNewUserSound() {
  // Si el audio no está inicializado, inicializarlo
  if (!newUserAudio) {
    initNotificationSound();
  }
  
  // Intentar reproducir el sonido de nuevo usuario (Squirtle)
  if (newUserAudio) {
    // Resetear el audio para poder reproducirlo múltiples veces
    newUserAudio.currentTime = 0;
    newUserAudio.play().catch(error => {
      console.warn('No se pudo reproducir el sonido de nuevo usuario:', error);
    });
  } else {
    console.warn('El audio no está inicializado. Llama a initNotificationSound() primero.');
  }
}

// Función específica para reproducir el sonido cuando se completa un pago
export function playCompletedPaymentSound() {
  // Si el audio no está inicializado, inicializarlo
  if (!completedPaymentAudio) {
    initNotificationSound();
  }
  
  // Intentar reproducir el sonido de pago completado
  if (completedPaymentAudio) {
    // Resetear el audio para poder reproducirlo múltiples veces
    completedPaymentAudio.currentTime = 0;
    completedPaymentAudio.play().catch(error => {
      console.warn('No se pudo reproducir el sonido de pago completado:', error);
    });
  } else {
    console.warn('El audio no está inicializado. Llama a initNotificationSound() primero.');
  }
}