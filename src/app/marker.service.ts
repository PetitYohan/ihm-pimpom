import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { PopUpService } from "./popup.service";
import * as L from "leaflet";
import { Feu } from "./feu";

@Injectable({
  providedIn: "root",
})
export class MarkerService {
  capteursData: any;
  circleMarker: any;
  circleList = [];
  fireList = [];
  idClick = 1;
  map;

  constructor(private http: HttpClient, private popupService: PopUpService) { }

  static scaledRadius(val: number, maxVal: number): number {
    return 1000 * (val / maxVal) + 75;
  }

  makeCircleMarkers(map: L.map, data): void {
    this.map = map;
    for (const c of data) {
      const lon = c.coordinates[0];
      const lat = c.coordinates[1];
      const circle = L.circle([lat, lon], {
        radius: MarkerService.scaledRadius(c.intensity, 9),
      });
      circle.bindPopup(this.popupService.makeCapteurPopup(c));
      circle.myCustomID = c.id;
      circle.addTo(map);
      circle.on("click", (e) => {
        this.idClick = e.target.myCustomID;
      });
      this.circleList[c.id] = circle;
    }
  }

  updateCircleMarkers(map: L.map, id, intensity) {
    var i: number;
    for (i = 1; i <= 60; i++) {
      if (this.circleList[i].myCustomID == id) {
        map.removeLayer(this.circleList[i]);
      }
    }
    const lon = this.circleList[id].getLatLng().lng;
    const lat = this.circleList[id].getLatLng().lat;
    const circle = L.circle([lat, lon], {
      radius: MarkerService.scaledRadius(intensity, 9),
    });
    circle.bindPopup(
      this.popupService.makeCapteurPopup({ id: id, intensity: intensity })
    );
    circle.myCustomID = id;
    circle.addTo(map);
    circle.on("click", (e) => {
      this.idClick = e.target.myCustomID;
    });
    this.circleList[id] = circle;
  }

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
    if (typeof this.fireList.find((x) => x.myCustomID === data.id) !== "undefined") {
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
}
