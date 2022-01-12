import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { Camion } from "./camion";
import { Feu } from "./feu";
import { MarkerService } from "./marker.service";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  idCapteur: number;
  getFeuxValue: Feu[] = [{ id: 0, intensity: 0, positionX: 0, positionY: 0 }];
  getCamionsValue: Camion[] = [
    { id: 0, capacite: 0, positionX: 0, positionY: 0, type: "" },
  ];

  constructor(
    private httpClient: HttpClient,
    private markerService: MarkerService
  ) {
    setInterval(() => this.onActualisation(), 15000);
  }

  getFeux() {
    this.httpClient
      .get("http://localhost:8080/getFeux")
      .subscribe((data: any) => {
        if (typeof data.feux !== "undefined") {
          for (const resp of data.feux) {
            const feu = new Feu();
            feu.id = resp.id;
            feu.intensity = resp.intensity;
            feu.positionX = resp.positionX;
            feu.positionY = resp.positionY;
            this.getFeuxValue.push(feu);
            this.markerService.updateFeu(this.getFeuxValue, resp);
          }
        }
      });
  }

  getCamions() {
    this.httpClient
      .get("http://localhost:8080/getCamions")
      .subscribe((data: any) => {
        console.log(data);
        if (typeof data.camions !== "undefined") {
          for (const resp of data.camions) {
            console.log("création camion");
            const camion = new Camion();
            camion.id = resp.id;
            camion.capacite = resp.capacite;
            camion.positionX = resp.positionX;
            camion.positionY = resp.positionY;
            camion.type = resp.type;
            this.getCamionsValue.push(camion);
            this.markerService.updateCamion(this.getCamionsValue, resp);
          }
        }
      });
  }

  onActualisation(): any {
    this.getFeux();
    this.getCamions();
  }
}
