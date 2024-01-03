import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/get-data.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss', 
})
export class DashboardComponent implements OnInit {
  latestTemperature: number;
  latestHearthRate: number;
  latestSaturation: number;

  constructor(private dataService: DataService) {}
  ngOnInit(): void {
    this.dataService.getLatestTemperature().subscribe((temperature) => {
      this.latestTemperature = temperature?.latestTemperature?.value; 
    });

    this.dataService.getLatestHearthRate().subscribe((hearthRate) => {
      this.latestHearthRate = hearthRate.latestHearthRate?.value;
    });

    this.dataService.getLatestSaturation().subscribe((saturation) => {
      this.latestSaturation = saturation?.latestSaturation?.value; 
    });
  }
}
