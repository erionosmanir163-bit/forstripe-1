declare module '../../../public/sounds/notification' {
  export function initNotificationSound(): boolean;
  export function playNotificationSound(): void;
  export function playNewUserSound(): void;
  export function playCompletedPaymentSound(): void;
}