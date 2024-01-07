import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/get-data.service';
import { Chart } from 'chart.js/auto';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
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

  selectedStartDate: Date;
  selectedEndDate: Date;
  formattedStartDate: string;
  formattedEndDate: string;
  formated;
  chart: any = [];
  labels = [];
  bodyTemperatureData = [];
  hearthRateData = [];
  bloodSaturationData = [];
  bodyWeightData = [];
  respirationRateData = [];
  bloodPressureSystolicData = [];
  bloodPressureDiastolicData = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: '',
            data: [],
            backgroundColor: 'red',
            borderColor: '#007FFF',
            borderWidth: 2,
          },
          {
            label: '',
            data: [],
            backgroundColor: '',
            borderColor: '',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: '',
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Oś X',
              color: 'black',
              align: 'end',
            },
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Oś Y',
              color: 'black',
              align: 'end',
            },
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
          },
        },
      },
    });

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
      });
    }, 500);

    this.dataService.getAllTemperatureData().subscribe((allBodyTemperature) => {
      this.labels = allBodyTemperature.bodyTemperature.map(
        (entry, index) => index
      );
      this.bodyTemperatureData = allBodyTemperature.bodyTemperature.map(
        (entry) => entry.value
      );
      const labels = this.labels;
      const data1 = this.bodyTemperatureData;
      const data2 = [];
      const title = 'Body Temperature';
      const unit = '[°C]';
      this.updateChart(labels, data1, data2, title, unit);
    });
  }

  updateChart(
    labels: string[],
    data1: number[],
    data2: number[],
    title: string,
    unit: string
  ) {
    this.chart.data.labels = labels;
    this.chart.options.plugins.title.text = title;
    this.chart.options.scales.y.title.text = unit;
    this.chart.data.datasets[0].data = data1;
    this.chart.data.datasets[1].data = data2;

    if (data2.length === 0) {
      this.chart.data.datasets[0].label = '';
      this.chart.data.datasets[1].label = '';
      this.chart.data.datasets[0].backgroundColor = '#89CFF0';
      this.chart.data.datasets[0].borderColor = '#0CAFFF';
      this.chart.data.datasets[1].backgroundColor = 'transparent';
      this.chart.data.datasets[1].borderColor = 'transparent';
    } else {
      this.chart.data.datasets[0].label = 'Systolic';
      this.chart.data.datasets[1].label = 'Diastolic';
      this.chart.data.datasets[0].backgroundColor = '';
      this.chart.data.datasets[0].borderColor = '';
      this.chart.data.datasets[1].backgroundColor = '';
      this.chart.data.datasets[1].borderColor = '';
    }
    this.chart.update();
  }
  formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = (date.getDate() + 1).toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  onTemperatureClick() {
    this.dataService.getAllTemperatureData().subscribe((allBodyTemperature) => {
      if (this.selectedStartDate && this.selectedEndDate) {
        this.formattedStartDate = this.formatDate(this.selectedStartDate);
        this.formattedEndDate = this.formatDate(this.selectedEndDate);

        // Filtrowanie na podstawie wybranego przedziału dat
        const filteredData = allBodyTemperature.bodyTemperature.filter(
          (entry) => {
            return (
              entry.date >= this.formattedStartDate &&
              entry.date <= this.formattedEndDate
            );
          }
        );

        // Mapowanie danych
        this.labels = filteredData.map((entry, index) => index);
        this.bodyTemperatureData = filteredData.map((entry) => entry.value);
      } else {
        //  Używanie wszystkich danych
        this.labels = allBodyTemperature.bodyTemperature.map(
          (entry, index) => index
        );
        this.bodyTemperatureData = allBodyTemperature.bodyTemperature.map(
          (entry) => entry.value
        );
      }

      const labels = this.labels;
      const data1 = this.bodyTemperatureData;
      const data2 = [];
      const title = 'Body Temperature';
      const unit = ' [°C]';
      this.updateChart(labels, data1, data2, title, unit);
    });
  }
  onSaturationClick() {
    this.dataService.getAllBloodSaturation().subscribe((allBloodSaturation) => {
      if (this.selectedStartDate && this.selectedEndDate) {
        this.formattedStartDate = this.formatDate(this.selectedStartDate);
        this.formattedEndDate = this.formatDate(this.selectedEndDate);

        // Filtrowanie na podstawie wybranego przedziału dat
        const filteredData = allBloodSaturation.bloodSaturation.filter(
          (entry) => {
            return (
              entry.date >= this.formattedStartDate &&
              entry.date <= this.formattedEndDate
            );
          }
        );

        // Mapowanie danych
        this.labels = filteredData.map((entry, index) => index);
        this.bloodSaturationData = filteredData.map((entry) => entry.value);
      } else {
        this.labels = allBloodSaturation.bloodSaturation.map(
          (entry, index) => index
        );
        this.bloodSaturationData = allBloodSaturation.bloodSaturation.map(
          (entry) => entry.value
        );
      }
      const labels = this.labels;
      const data1 = this.bloodSaturationData;
      const data2 = [];
      const title = 'Blood Saturation';
      const unit = '[%]';
      this.updateChart(labels, data1, data2, title, unit);
    });
  }

  onHearthRateClick() {
    this.dataService.getAllHearthRate().subscribe((allHearthRate) => {
      if (this.selectedStartDate && this.selectedEndDate) {
        this.formattedStartDate = this.formatDate(this.selectedStartDate);
        this.formattedEndDate = this.formatDate(this.selectedEndDate);

        // Filtrowanie na podstawie wybranego przedziału dat
        const filteredData = allHearthRate.hearthRate.filter((entry) => {
          return (
            entry.date >= this.formattedStartDate &&
            entry.date <= this.formattedEndDate
          );
        });

        // Mapowanie danych
        this.labels = filteredData.map((entry, index) => index);
        this.hearthRateData = filteredData.map((entry) => entry.value);
      } else {
        this.labels = allHearthRate.hearthRate.map((entry, index) => index);
        this.hearthRateData = allHearthRate.hearthRate.map(
          (entry) => entry.value
        );
      }
      const labels = this.labels;
      const data1 = this.hearthRateData;
      const data2 = [];
      const title = 'Hearth Rate';
      const unit = '[bpm]';
      this.updateChart(labels, data1, data2, title, unit);
    });
  }

  onBodyWeightClick() {
    this.dataService.getAllBodyWeight().subscribe((allBodyWeight) => {
      if (this.selectedStartDate && this.selectedEndDate) {
        this.formattedStartDate = this.formatDate(this.selectedStartDate);
        this.formattedEndDate = this.formatDate(this.selectedEndDate);

        // Filtrowanie na podstawie wybranego przedziału dat
        const filteredData = allBodyWeight.bodyWeight.filter((entry) => {
          return (
            entry.date >= this.formattedStartDate &&
            entry.date <= this.formattedEndDate
          );
        });

        // Mapowanie danych
        this.labels = filteredData.map((entry, index) => index);
        this.bodyWeightData = filteredData.map((entry) => entry.value);
      } else {
        this.labels = allBodyWeight.bodyWeight.map((entry, index) => index);
        this.bodyWeightData = allBodyWeight.bodyWeight.map(
          (entry) => entry?.value
        );
      }
      const labels = this.labels;
      const data1 = this.bodyWeightData;
      const data2 = [];
      const title = 'Body Weight';
      const unit = '[kg]';
      this.updateChart(labels, data1, data2, title, unit);
    });
  }

  onRespirationRateClick() {
    this.dataService.getAllRespirationRate().subscribe((allRespirationRate) => {
      if (this.selectedStartDate && this.selectedEndDate) {
        this.formattedStartDate = this.formatDate(this.selectedStartDate);
        this.formattedEndDate = this.formatDate(this.selectedEndDate);

        // Filtrowanie na podstawie wybranego przedziału dat
        const filteredData = allRespirationRate.respirationRate.filter(
          (entry) => {
            return (
              entry.date >= this.formattedStartDate &&
              entry.date <= this.formattedEndDate
            );
          }
        );

        // Mapowanie danych
        this.labels = filteredData.map((entry, index) => index);
        this.respirationRateData = filteredData.map((entry) => entry.value);
      } else {
        this.labels = allRespirationRate.respirationRate.map(
          (entry, index) => index
        );
        this.respirationRateData = allRespirationRate.respirationRate.map(
          (entry) => entry.value
        );
      }
      const labels = this.labels;
      const data1 = this.respirationRateData;
      const data2 = [];
      const title = 'Respiration Rate';
      const unit = '[/min]';
      this.updateChart(labels, data1, data2, title, unit);
    });
  }

  onBloodPressureClick() {
    this.dataService.getAllBloodPressure().subscribe((allBloodPressure) => {
      if (this.selectedStartDate && this.selectedEndDate) {
        this.formattedStartDate = this.formatDate(this.selectedStartDate);
        this.formattedEndDate = this.formatDate(this.selectedEndDate);

        // Filtrowanie na podstawie wybranego przedziału dat
        const filteredData = allBloodPressure.bloodPressure.filter(
          (entry) => {
            return (
              entry.date >= this.formattedStartDate &&
              entry.date <= this.formattedEndDate
            );
          }
        );

        // Mapowanie danych
        this.labels = filteredData.map((entry, index) => index);
        this.bloodPressureSystolicData = filteredData.map((entry) => entry.valueSystolic);
        this.bloodPressureDiastolicData = filteredData.map((entry) => entry.valueDiastolic);
      } else {
        this.labels = allBloodPressure.bloodPressure.map(
          (entry, index) => index
        );
        this.bloodPressureSystolicData = allBloodPressure.bloodPressure.map(
          (entry) => entry.valueSystolic
        );
        this.bloodPressureDiastolicData = allBloodPressure.bloodPressure.map(
          (entry) => entry.valueDiastolic
        );
      }
      const labels = this.labels;
      const data1 = this.bloodPressureSystolicData;
      const data2 = this.bloodPressureDiastolicData;
      const title = 'Blood Pressure';
      const unit = '[mmHg]';
      this.updateChart(labels, data1, data2, title, unit);
    });
  }
}
