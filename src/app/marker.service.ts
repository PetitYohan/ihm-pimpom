import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { PopUpService } from "./popup.service";
import * as L from "leaflet";
import { Feu } from "./feu";
import { Camion } from "./camion";

@Injectable({
  providedIn: "root",
})
export class MarkerService {
  fireList = [];
  idClick = 1;
  map;
  fireplaceList = [];
  camionList = [];

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
      this.fireplaceList.push(fireplace);
    }
  }

  updateCamion(camions: Camion[], data: Camion) {
    const exist = camions.find((x) => x.id === data.id);
    if (typeof exist !== "undefined") {
      console.log("exist déja");
      if (exist.positionX == 0) {
        this.deleteCamion(data);
        const index = camions.indexOf(exist);
        if (index > -1) {
          camions.splice(index, 1);
        }
      } else {
        camions.find((x) => x.id === data.id).positionX = data.positionX;
        camions.find((x) => x.id === data.id).positionY = data.positionY;
        console.log("update");
        this.updateTruck(data);
      }
    } else {
      const camion = new Camion();
      camion.id = data.id;
      camion.capacite = data.capacite;
      camion.positionX = data.positionX;
      camion.positionY = data.positionY;
      camions.push(camion);
      this.addTruck(camion);
    }
  }

  updateTruck(data: Camion) {
    if (
      typeof this.camionList.find((x) => x.myCustomID === data.id) !== "undefined"
    ) {
      console.log(this.camionList.find((x) => x.myCustomID === data.id));
      this.map.removeLayer(this.camionList.find((x) => x.myCustomID === data.id));
    }
    this.addTruck(data);
  }

  addTruck(data: Camion) {
    var iconTruck = L.icon({
      iconUrl: "../assets/icons/camion-de-pompiers.png",
      iconSize: [16, 16], // size of the icon
      iconAnchor: [8, 8], // point of the icon which will correspond to marker's location
    });
    const camion = L.marker([data.positionY, data.positionX], {
      icon: iconTruck,
    })
      .addTo(this.map)
      .bindPopup(
        this.popupService.makeCamionPopup({
          id: data.id,
          capacite: data.capacite,
          type: data.type,
        })
      );
    camion.myCustomID = data.id;
    this.camionList.push(camion);
  }

  deleteCamion(data: Camion) {
    const toremove = this.camionList.find((x) => x.myCustomID === data.id);
    this.map.removeLayer(toremove);
  }
}
