import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/get-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  latestBodyTemperature: number;
  latestHearthRate: number;
  latestBloodSaturation: number;
  latestBodyWeight: number;
  latestRespirationRate: number;
  latestBloodPressureSystolic: number;
  latestBloodPressureDiastolic: number;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getLatestBodyTemperature().subscribe((bodyTemperature) => {
      this.latestBodyTemperature =
        bodyTemperature?.latestBodyTemperature?.value;
    });

    this.dataService.getLatestHearthRate().subscribe((hearthRate) => {
      this.latestHearthRate = hearthRate?.latestHearthRate?.value;
    });

    this.dataService.getLatestBloodSaturation().subscribe((bloodSaturation) => {
      this.latestBloodSaturation = bloodSaturation?.latestSaturation?.value;
    });

    this.dataService.getLatestBodyWeight().subscribe((bodyWeight) => {
      this.latestBodyWeight = bodyWeight?.latestBodyWeight?.value;
    });

    this.dataService.getLatestRespirationRate().subscribe((respirationRate) => {
      this.latestRespirationRate =
        respirationRate?.latestRespirationRate?.value;
    });

    this.dataService.getLatestBloodPressure().subscribe((bloodPressure) => {
      this.latestBloodPressureSystolic =
        bloodPressure?.latestBloodPressure?.valueSystolic;
      this.latestBloodPressureDiastolic =
        bloodPressure?.latestBloodPressure?.valueDiastolic;
    });

    setInterval(() => {
      this.dataService
        .getLatestBodyTemperature()
        .subscribe((bodyTemperature) => {
          this.latestBodyTemperature =
            bodyTemperature?.latestBodyTemperature?.value;
        });
    }, 500);

    setInterval(() => {
      this.dataService.getLatestHearthRate().subscribe((hearthRate) => {
        this.latestHearthRate = hearthRate?.latestHearthRate?.value;
      });
    }, 500);

    setInterval(() => {
      this.dataService
        .getLatestBloodSaturation()
        .subscribe((bloodSaturation) => {
          this.latestBloodSaturation =
            bloodSaturation?.latestBloodSaturation?.value;
        });
    }, 500);

    setInterval(() => {
      this.dataService.getLatestBodyWeight().subscribe((bodyWeight) => {
        this.latestBodyWeight = bodyWeight?.latestBodyWeight?.value;
      });
    }, 500);

    setInterval(() => {
      this.dataService
        .getLatestRespirationRate()
        .subscribe((respirationRate) => {
          this.latestRespirationRate =
            respirationRate?.latestRespirationRate?.value;
        });
    }, 500);

    setInterval(() => {
      this.dataService.getLatestBloodPressure().subscribe((bloodPressure) => {
        this.latestBloodPressureSystolic =
          bloodPressure?.latestBloodPressure?.valueSystolic;
        this.latestBloodPressureDiastolic =
          bloodPressure?.latestBloodPressure?.valueDiastolic;
        console.log(this.latestBloodPressureDiastolic);
      });
    }, 500);
  }
}
