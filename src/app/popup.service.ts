import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class PopUpService {
  constructor() {}

  makeFirePlacePopup(data: any): string {
    return (
      `` +
      `<div>Id caserne: ${data.id}</div>` +
      `<div>Nom caserne: ${data.name}</div>`
    );
  }

  makeFirePopup(data: any): string {
    return (
      `` +
      `<div>Id feu: ${data.id}</div>` +
      `<div>Intensité feu: ${data.intensity}</div>`
    );
  }

  makeCamionPopup(data: any): string {
    return (
      `` +
      `<div>Id camion: ${data.id}</div>` +
      `<div>Capacite camion: ${data.capacite}</div>` +
      `<div>Type camion: ${data.type}</div>`
    );
  }
}
