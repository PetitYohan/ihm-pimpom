import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { Capteur } from "./capteur";
import { Feu } from "./feu";
import { MarkerService } from "./marker.service";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  idCapteur: number;
  slide = false;
  getCapteursValue: Capteur[] = [
    { id: 0, intensity: 0 },
    { id: 1, intensity: 0 },
    { id: 2, intensity: 0 },
    { id: 3, intensity: 0 },
  ];
  getFeuxValue: Feu[] = [{ id: 0, intensity: 0, positionX: 0, positionY: 0 }];

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private httpClient: HttpClient,
    private markerService: MarkerService
  ) {
    setInterval(() => this.onActualisation(), 15000);
  }

  sliderToggle() {
    this.slide = !this.slide;
  }

  getFeux() {
    this.httpClient
      .get("http://localhost:8000/getFeux")
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

  capteurChangedHandler(c) {
    console.log(c);
  }

  onActualisation(): any {
    this.getFeux();
  }
}
