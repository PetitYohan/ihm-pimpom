import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { PopUpService } from "./popup.service";
import * as L from "leaflet";
import { Feu } from "./feu";

@Injectable({
  providedIn: "root",
})
export class MarkerService {
  fireList = [];
  idClick = 1;
  map;
  fireplaceList: any[];

  constructor(private http: HttpClient, private popupService: PopUpService) {}

  addFire(data: Feu) {
    var iconFire = L.icon({
      iconUrl: "../assets/icons/fire.png",
      iconSize: [19.2, 25.6], // size of the icon
      iconAnchor: [9.6, 12.8], // point of the icon which will correspond to marker's location
    });
    const fire = L.marker([data.positionY, data.positionX], { icon: iconFire })
      .addTo(this.map)
      .bindPopup(
        this.popupService.makeFirePopup({
          id: data.id,
          intensity: data.intensity,
        })
      );
    fire.myCustomID = data.id;
    this.fireList.push(fire);
  }

  updateFire(data: Feu) {
    if (
      typeof this.fireList.find((x) => x.myCustomID === data.id) !== "undefined"
    ) {
      this.map.removeLayer(this.fireList.find((x) => x.myCustomID === data.id));
    }
    this.addFire(data);
  }

  deleteFire(data: Feu) {
    const toremove = this.fireList.find((x) => x.myCustomID === data.id);
    this.map.removeLayer(toremove);
  }

  updateFeu(feux: Feu[], data: Feu) {
    const exist = feux.find((x) => x.id === data.id);
    if (typeof exist !== "undefined") {
      if (exist.intensity == 0) {
        this.deleteFire(data);
        const index = feux.indexOf(exist);
        if (index > -1) {
          feux.splice(index, 1);
        }
      } else {
        feux.find((x) => x.id === data.id).intensity = data.intensity;
        this.updateFire(data);
      }
    } else {
      const feu = new Feu();
      feu.id = data.id;
      feu.intensity = data.intensity;
      feu.positionX = data.positionX;
      feu.positionY = data.positionY;
      feux.push(feu);
      this.addFire(feu);
    }
  }

  addCaserne(map: L.map, data: any[]) {
    this.map = map;
    var iconFirePlace = L.icon({
      iconUrl: "../assets/icons/fireplace.png",
      iconSize: [14.26, 11.92], // size of the icon
      iconAnchor: [7.13, 5.96], // point of the icon which will correspond to marker's location
    });
    for (const fp of data) {
      const fireplace = L.marker([fp.coordinates[0], fp.coordinates[1]], {
        icon: iconFirePlace,
      })
        .addTo(this.map)
        .bindPopup(
          this.popupService.makeFirePlacePopup({
            id: fp.id,
            name: fp.name,
          })
        );
      console.log(fireplace);
    }
  }
}