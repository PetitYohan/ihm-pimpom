import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PopUpService {
  constructor() {}

  makeCapteurPopup(data: any): string {
    return (
      `` +
      `<div>Id Capteur: ${data.id}</div>` +
      `<div>Intensité détectée: ${data.intensity}</div>`
    );
  }
  
  makeFirePopup(data: any): string {
    return (
      `` +
      `<div>Id Feu: ${data.id}</div>` +
      `<div>Intensité Feu: ${data.intensity}</div>`
    );
  }
}
