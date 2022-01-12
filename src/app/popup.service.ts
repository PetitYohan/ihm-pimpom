import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PopUpService {
  constructor() {}

  makeFirePlacePopup(data: any): string {
    return (
      `` +
      `<div>Id Capteur: ${data.id}</div>` +
      `<div>Nom caserne: ${data.name}</div>`
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
