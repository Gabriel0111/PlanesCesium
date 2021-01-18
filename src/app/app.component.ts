import {Component} from '@angular/core';
import {PlanesService} from './modules/planes/services/planes.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  constructor(private planesService: PlanesService) {
    planesService.initPlanes();
  }
}
