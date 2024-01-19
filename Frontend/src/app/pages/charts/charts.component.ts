import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/get-data.service';
import { Chart } from 'chart.js/auto';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.scss',
})
export class ChartsComponent implements OnInit {
  charts = [
    'chartBodyTemperature',
    'chartBloodSaturation',
    'chartHearthRate',
    'chartBodyWeight',
    'chartRespirationRate',
    'chartBloodPressure',
  ];

  bodyTemperatureData: number[] = [];
  hearthRateData: number[] = [];
  bloodSaturationData: number[] = [];
  bodyWeightData: number[] = [];
  respirationRateData: number[] = [];
  bloodPressureSystolicData: number[] = [];
  bloodPressureDiastolicData: number[] = [];


  selectedStartDate: Date;
  selectedEndDate: Date;
  formattedStartDate: string;
  formattedEndDate: string;

  chartBodyTemperature: any = [];
  chartBloodSaturation: any = [];
  chartHearthRate: any = [];
  chartBodyWeight: any = [];
  chartRespirationRate: any = [];
  chartBloodPressure: any = [];
  labels = [];
  minValue: number;
  maxValue: number;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    const dateFromMonthAgo = new Date();
    dateFromMonthAgo.setMonth(dateFromMonthAgo.getMonth() - 1);
    const actualDate = new Date();
    this.selectedStartDate = dateFromMonthAgo;
    this.selectedEndDate = actualDate;
    this.formattedEndDate =  this.formatDate(actualDate);
    this.formattedStartDate = this.formatDate(dateFromMonthAgo);
    
    this.createCharts();
    this.createBodyTemperatureChart();
    this.createBloodSaturationChart();
    this.createHearthRateChart();
    this.createBodyWeightChart();
    this.createRespirationRateChart();
    this.createBloodPressureChart();
  }

  formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    // const day = (date.getDate() + 1).toString().padStart(2, '0');  // jeżeli kalendarz wskazuje date o 1 mneijsza
    const day = (date.getDate()).toString().padStart(2, '0');         // jeżeli kalendarz wskazuje date poprawnie
    return `${year}-${month}-${day}`;
  };

  createChart(
    chart: any,
    dataType: string,
    loadDataMethod: () => Observable<any>,
    property: string,
    chartTitle: string,
    unit: string
  ) {
    loadDataMethod().subscribe((data) => {
      if (this.selectedStartDate && this.selectedEndDate) {
        // this.formattedStartDate = this.formatDate(this.selectedStartDate);
        // this.formattedEndDate = this.formatDate(this.selectedEndDate);
        
        // Filtrowanie danych
        const filteredData = data[dataType].filter((entry, index) => {
          return (
            entry.date >= this.formattedStartDate &&
            entry.date <= this.formattedEndDate
          );
        });
        // Mapowanie danych
        if (this.formattedStartDate === this.formattedEndDate) {
          this.labels = filteredData.map((entry, index) => entry.time);
        } else {
          this.labels = filteredData.map((entry, index) => entry.date);
        }
        this[property] = filteredData.map((entry, index) => entry.value);
      } else {
        // Używanie wszystkich danych
        this.labels = data[dataType].map((entry, index) => entry.date);
        this[property] = data[dataType].map((entry, index) => entry.value);
      }
      this.minValue = Math.min(...this[property]) - 0.1*Math.min(...this[property]) ;
      this.maxValue = Math.max(...this[property]) + 0.1*Math.max(...this[property]);
      this.updateChart(
        chart,
        this.labels,
        this[property],
        [],
        chartTitle,
        unit
      );
    });
  }
  createCharts(): void {
    this.charts.forEach((chardId) => {
      this[chardId] = new Chart(chardId, {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              label: '',
              data: [],
              backgroundColor: '',
              borderColor: '',
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
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: false,
              text: '',
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Date[YYYY-MM-DD]',
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
    });
  }
  // Funkcje obsługujące kliknięcia dla różnych typów danych
  createBodyTemperatureChart() {
    this.createChart(
      this.chartBodyTemperature,
      'bodyTemperature',
      this.dataService.getAllBodyTemperature.bind(this.dataService),
      'bodyTemperatureData',
      'Body Temperature',
      '[°C]'
    );
  }

  createBloodSaturationChart() {
    this.createChart(
      this.chartBloodSaturation,
      'bloodSaturation',
      this.dataService.getAllBloodSaturation.bind(this.dataService),
      'bloodSaturationData',
      'Blood Saturation',
      '[%]'
    );
  }

  createHearthRateChart() {
    this.createChart(
      this.chartHearthRate,
      'hearthRate',
      this.dataService.getAllHearthRate.bind(this.dataService),
      'hearthRateData',
      'Hearth Rate',
      '[bpm]'
    );
  }

  createBodyWeightChart() {
    this.chartBodyWeight,
      this.createChart(
        this.chartBodyWeight,
        'bodyWeight',
        this.dataService.getAllBodyWeight.bind(this.dataService),
        'bodyWeightData',
        'Body Weight',
        '[kg]'
      );
  }

  createRespirationRateChart() {
    this.createChart(
      this.chartRespirationRate,
      'respirationRate',
      this.dataService.getAllRespirationRate.bind(this.dataService),
      'respirationRateData',
      'Respiration Rate',
      '[/min]'
    );
  }

  createBloodPressureChart() {
    this.dataService.getAllBloodPressure().subscribe((allBloodPressure) => {
      if (
        this.selectedStartDate &&
        this.selectedEndDate
      ) {
        this.formattedStartDate = this.formatDate(
          this.selectedStartDate
        );
        this.formattedEndDate = this.formatDate(
          this.selectedEndDate
        );

        // Filtrowanie na podstawie wybranego przedziału dat
        const filteredData = allBloodPressure.bloodPressure.filter(
          (entry, index) => {
            return (
              entry.date >= this.formattedStartDate &&
              entry.date <= this.formattedEndDate
            );
          }
        );
        // Mapowanie danych
        this.labels = filteredData.map((entry, index) => entry.date);
        this.bloodPressureSystolicData = filteredData.map(
          (entry, index) => entry.valueSystolic
        );
        this.bloodPressureDiastolicData = filteredData.map(
          (entry, index) => entry.valueDiastolic
        );
      } else {
        this.labels = allBloodPressure.bloodPressure.map(
          (entry, index) => entry.date
        );
        this.bloodPressureSystolicData = allBloodPressure.bloodPressure.map(
          (entry, index) => entry.valueSystolic
        );
        this.bloodPressureDiastolicData = allBloodPressure.bloodPressure.map(
          (entry, index) => entry.valueDiastolic
        );
      }
      const labels = this.labels;
      const data1 = this.bloodPressureSystolicData;
      const data2 = this.bloodPressureDiastolicData;
      const title = 'Blood Pressure';
      this.minValue = Math.min(...this.bloodPressureDiastolicData ) - 0.1 *Math.min(...this.bloodPressureDiastolicData);
      this.maxValue = Math.max(...this.bloodPressureSystolicData) + 0.1*Math.min(...this.bloodPressureDiastolicData);
      const unit = '[mmHg]';
      this.updateBloodPressure(labels, data1, data2, title, unit);
    });
  }

  updateChart(
    chart: any,
    labels: string[],
    data1: number[],
    data2: number[],
    title: string,
    unit: string
  ) {
    chart.data.labels = labels;
    chart.options.plugins.title.text = title;
    chart.options.scales.y.title.text = unit;
    chart.data.datasets[0].data = data1;
    chart.data.datasets[1].data = data2;
    chart.data.datasets[0].label = '';
    chart.data.datasets[1].label = '';
    chart.options.scales.y.min = this.minValue;
    chart.options.scales.y.max = this.maxValue;
    chart.data.datasets[0].backgroundColor = '#89CFF0';
    chart.data.datasets[0].borderColor = '#0CAFFF';
    chart.data.datasets[1].backgroundColor = 'transparent';
    chart.data.datasets[1].borderColor = 'transparent';
    chart.update();
  }

  updateBloodPressure(
    labels: string[],
    data1: number[],
    data2: number[],
    title: string,
    unit: string
  ) {
    this.chartBloodPressure.data.labels = labels;
    this.chartBloodPressure.options.plugins.title.text = title;
    this.chartBloodPressure.options.scales.y.title.text = unit;
    this.chartBloodPressure.data.datasets[0].data = data1;
    this.chartBloodPressure.data.datasets[1].data = data2;
    this.chartBloodPressure.options.scales.y.min = this.minValue;
    this.chartBloodPressure.options.scales.y.max = this.maxValue;
    this.chartBloodPressure.data.datasets[0].label = 'Systolic';
    this.chartBloodPressure.data.datasets[1].label = 'Diastolic';
    this.chartBloodPressure.data.datasets[0].backgroundColor = '';
    this.chartBloodPressure.data.datasets[0].borderColor = '';
    this.chartBloodPressure.data.datasets[1].backgroundColor = '';
    this.chartBloodPressure.data.datasets[1].borderColor = '';
    this.chartBloodPressure.update();
  }

  onDateChanged(event: any, isEndDate: boolean = false){
    if(isEndDate) {
      if(this.selectedEndDate){this.formattedEndDate = this.formatDate(event.value)}

    } else {
      if(this.selectedStartDate){      this.formattedStartDate = this.formatDate(event.value)}
    }

    this.createBodyTemperatureChart();
    this.createHearthRateChart();
    this.createBloodPressureChart();
    this.createBloodSaturationChart();
    this.createBodyWeightChart();
    this.createRespirationRateChart();
}
}
