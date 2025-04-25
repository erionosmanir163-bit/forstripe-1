/**
 * Declaración de tipos global para las funciones de notificación de audio
 */

interface Window {
  /**
   * Reproduce el sonido de Squirtle a través de los altavoces del computador
   * @returns Una promesa que se resuelve cuando el sonido termina de reproducirse
   */
  playSquirtleSound: () => Promise<boolean>;
  
  /**
   * Reproduce el sonido de notificación de pago completado a través de los altavoces del computador
   * @returns Una promesa que se resuelve cuando el sonido termina de reproducirse
   */
  playPaymentCompletedSound: () => Promise<boolean>;
}