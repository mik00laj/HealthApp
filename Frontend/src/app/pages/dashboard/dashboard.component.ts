import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/get-data.service';
import { Chart } from 'chart.js/auto';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  user_age = 24
  user_weight:number = 70

  latestData: any = {
    latestBodyTemperature: null,
    latestBloodSaturation: null,
    latestHearthRate: null,
    latestBodyWeight: null,
    latestRespirationRate: null,
    latestBloodPressureSystolic: null,
    latestBloodPressureDiastolic: null
  }
  latestResult = {
    latestBodyTemperatureResult: '',
    latestBloodSaturationResult: null,
    latestHearthRateResult: null,
    latestBodyWeightResult:null,
    latestRespirationRateResult: null,
    latestBloodPressureResult: null,
  }

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

  chart: any = [];
  labels = [];
  title:string

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.updateLatestData()
    this.onBodyTemperatureClick()
    this.createChart()
  }

  updateLatestData(): void {
    const fetchLatestData = () => {
      this.fetchLatestDataFor('BodyTemperature', 'latestBodyTemperature');
      this.fetchLatestDataFor('HearthRate', 'latestHearthRate');
      this.fetchLatestDataFor('BloodSaturation', 'latestBloodSaturation');
      this.fetchLatestDataFor('BodyWeight', 'latestBodyWeight');
      this.fetchLatestDataFor('RespirationRate', 'latestRespirationRate');
      
    };
    fetchLatestData();
    this.dataService.getLatestBloodPressure().subscribe((latestbloodPressure) => {
      this.latestData.latestBloodPressureSystolic = latestbloodPressure?.latestBloodPressure?.valueSystolic;
      this.latestData.latestBloodPressureDiastolic = latestbloodPressure?.latestBloodPressure?.valueDiastolic;
    });
    

    setInterval(fetchLatestData, 500);
    setInterval(() => {
      this.dataService.getLatestBloodPressure().subscribe((latestbloodPressure) => {
        this.latestData.latestBloodPressureSystolic = latestbloodPressure?.latestBloodPressure?.valueSystolic;
        this.latestData.latestBloodPressureDiastolic = latestbloodPressure?.latestBloodPressure?.valueDiastolic;
      });

      this.calculateBodyTemperatureResult(this.latestData.latestBodyTemperature)
      this.calculateBloodSaturationResult(this.latestData.latestBloodSaturation)
      this.calculateHearthRateResult(this.latestData.latestHearthRate)
      this.calculateBodyWeightResult(this.latestData.latestBodyWeight)
      this.calculateRespirationRateResult(this.latestData.latestRespirationRate)
      this.calculateBloodPressureResult(this.latestData.latestBloodPressureSystolic,this.latestData.latestBloodPressureDiastolic)
    }, 500);
  }

  fetchLatestDataFor(dataType: string, ...properties: string[]): void {
    this.dataService[`getLatest${dataType}`]().subscribe((latestData) => {
      properties.forEach((property) => {
        this.latestData[property] = latestData ? latestData[property]?.value : null;
      });
    });
  }
  calculateBodyTemperatureResult(currentValue: number){
    if (currentValue <= 35) {
      this.latestResult.latestBodyTemperatureResult = 'Hypothermia';
    } else if (currentValue > 35 && currentValue < 36) {
      this.latestResult.latestBodyTemperatureResult = 'Too Small';
    } else if (currentValue >= 36 && currentValue <= 37) {
      this.latestResult.latestBodyTemperatureResult = 'Normal';
    } else if (currentValue > 37 && currentValue <37.9) {
      this.latestResult.latestBodyTemperatureResult = 'Too High';
    } else if (currentValue >= 37.9 && currentValue < 39.9) {
      this.latestResult.latestBodyTemperatureResult = 'Fever';
    } else if (currentValue >= 39) {
      this.latestResult.latestBodyTemperatureResult = 'High Fever';
    }else {
      this.latestResult.latestBodyTemperatureResult = 'Undefined';
    } 
  };

  calculateBloodSaturationResult(currentValue: number){
    if (currentValue >= 95 && currentValue <= 100) {
      this.latestResult.latestBloodSaturationResult =  'Normal';
    } else if (currentValue >= 92 && currentValue < 95) {
      this.latestResult.latestBloodSaturationResult =  'Small';
    } else if (currentValue >= 90 && currentValue < 92) {
      this.latestResult.latestBloodSaturationResult =  'Too Small';
    } else if (currentValue < 90) {
      this.latestResult.latestBloodSaturationResult =  'Hypoxemia';
    }else {
      this.latestResult.latestBloodSaturationResult = 'Undefined';
    }
  }
  calculateHearthRateResult(currentValue:number){
    const user_age = 24
    if(user_age >= 1 && user_age  <= 3 ){
      if (currentValue >= 98  && currentValue <= 140) {
        this.latestResult.latestHearthRateResult = 'Normal';
    } else if(currentValue > 140){
      this.latestResult.latestHearthRateResult = 'Tachycardia'
    }
    else if(currentValue < 98){
      this.latestResult.latestHearthRateResult = 'Bradycardia'
    }else {
      this.latestResult.latestHearthRateResult = 'Undefined';
    }
    }else if(user_age  > 3 && user_age  <= 5){
      if (currentValue >= 80   && currentValue <= 120 ) {
        this.latestResult.latestHearthRateResult = 'Normal';
    } else if(currentValue > 120 ){
      this.latestResult.latestHearthRateResult = 'Tachycardia'
    }
    else if(currentValue < 80){
      this.latestResult.latestHearthRateResult = 'Bradycardia'
    }else {
      this.latestResult.latestHearthRateResult = 'Undefined';
    }
    }else if(user_age  > 5  && user_age  <= 12){
      if (currentValue >= 75   && currentValue <= 118 ) {
        this.latestResult.latestHearthRateResult = 'Normal';
    } else if(currentValue > 118 ){
      this.latestResult.latestHearthRateResult = 'Tachycardia'
    }
    else if(currentValue < 75 ){
      this.latestResult.latestHearthRateResult = 'Bradycardia'
    }else {
      this.latestResult.latestHearthRateResult = 'Undefined';
    }   
    }else if(user_age  > 12  && user_age  <= 18){
      if (currentValue >= 60   && currentValue <= 100 ) {
        this.latestResult.latestHearthRateResult = 'Normal';
    } else if(currentValue > 140){
      this.latestResult.latestHearthRateResult = 'Tachycardia'
    }
    else if(currentValue < 60){
      this.latestResult.latestHearthRateResult = 'Bradycardia'
    }else {
      this.latestResult.latestHearthRateResult = 'Undefined';
    }
    }else if(user_age  > 18){
      if (currentValue >= 60   && currentValue <= 100) {
        this.latestResult.latestHearthRateResult = 'Normal';
    } else if(currentValue > 100){
      this.latestResult.latestHearthRateResult = 'Tachycardia'
    }
    else if(currentValue < 60 ){
      this.latestResult.latestHearthRateResult = 'Bradycardia'
    }else {
      this.latestResult.latestHearthRateResult = 'Undefined';
    }
    }
  }

  calculateBodyWeightResult(currentValue: number) {
    const user_weight = this.user_weight
    if (currentValue > user_weight) {
      this.latestResult.latestBodyWeightResult = 'Gain Weight';
    } else if (currentValue < user_weight) {
      this.latestResult.latestBodyWeightResult = 'Lose Weight';
    } else {
      this.latestResult.latestBodyWeightResult =  'Normal';
    }
  }

  calculateRespirationRateResult(currentValue:number){
    const user_age = this.user_age
    if(user_age >= 1 && user_age  <= 3 ){
      if (currentValue >= 24 && currentValue <= 40) {
        this.latestResult.latestRespirationRateResult =  'Normal';
    } else{
      this.latestResult.latestRespirationRateResult = 'Lungs issue'
    }
    }else if(user_age  > 3 && user_age  <= 6){
      if (currentValue >= 22 && currentValue <= 34) {
        this.latestResult.latestRespirationRateResult = 'Normal';
    } else{
      this.latestResult.latestRespirationRateResult = 'Lungs issue'
    }
    }else if(user_age  > 6 && user_age  <= 12){
      if (currentValue >= 18 && currentValue <= 30) {
        this.latestResult.latestRespirationRateResult = 'Normal';
    } else{
      this.latestResult.latestRespirationRateResult = 'Lungs issue'
    }      
    }else if(user_age  > 12 && user_age  <= 18){
      if (currentValue >= 12 && currentValue <= 16) {
        this.latestResult.latestRespirationRateResult = 'Normal';
    } else{
      this.latestResult.latestRespirationRateResult = 'Lungs issue'
    }
    }else if(user_age  > 18){
      if (currentValue >= 12 && currentValue <= 20) {
        this.latestResult.latestRespirationRateResult = 'Normal';
    } else{
      this.latestResult.latestRespirationRateResult = 'Lungs issue'
      }
    }
  }

  calculateBloodPressureResult(systolic: number, diastolic: number) {
    if (systolic < 120 && diastolic < 80) {
      this.latestResult.latestBloodPressureResult = 'Normal';
    } else if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
      this.latestResult.latestBloodPressureResult = 'Elevated';
    } else if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
      this.latestResult.latestBloodPressureResult = 'Hypertension stage 1';
    } else if (systolic >= 140 || diastolic >= 90) {
      this.latestResult.latestBloodPressureResult = 'Hypertension stage 2';
    } else if (systolic > 180 || diastolic > 120) {
      this.latestResult.latestBloodPressureResult = 'Hypertensive crisis';
    } else {
      this.latestResult.latestBloodPressureResult = 'Undefined';
    }
  }

  createChart(){
    this.chart = new Chart('chart', {
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

  onChartClick(
    dataType: string,
    loadDataMethod: () => Observable<any>,
    property: string,
    chartTitle: string,
    unit: string
  ) {
    loadDataMethod().subscribe((data) => {
      if (this.selectedStartDate && this.selectedEndDate) {
        this.formattedStartDate = this.formatDate(this.selectedStartDate);
        this.formattedEndDate = this.formatDate(this.selectedEndDate);
        // Filtrowanie danych
        const filteredData = data[dataType].filter((entry, index) => {
          return (
            entry.date >= this.formattedStartDate && entry.date <= this.formattedEndDate
          );
        });
        // Mapowanie danych
        this.labels = filteredData.map((entry, index) => entry.date);
        this[property] = filteredData.map((entry, index) => entry.value);
      } else {
        // Używanie wszystkich danych
        this.labels = data[dataType].map((entry, index) => entry.date);
        this[property] = data[dataType].map((entry, index) => entry.value);
      }
      this.updateChart(this.labels, this[property], [], chartTitle, unit);
    });
  }

  // Funkcje obsługujące kliknięcia dla różnych typów danych
  onBodyTemperatureClick() {
    this.onChartClick(
      'bodyTemperature',
      this.dataService.getAllBodyTemperature.bind(this.dataService),
      'bodyTemperatureData',
      'Body Temperature',
      '[°C]'
    );
    this.title = 'Body Temperture'
  }

  onBloodSaturationClick() {
    this.onChartClick(
      'bloodSaturation',
      this.dataService.getAllBloodSaturation.bind(this.dataService),
      'bloodSaturationData',
      'Blood Saturation',
      '[%]'
    );
    this.title = 'Blood Saturation'
  }

  onHearthRateClick() {
    this.onChartClick(
      'hearthRate',
      this.dataService.getAllHearthRate.bind(this.dataService),
      'hearthRateData',
      'Hearth Rate',
      '[bpm]'
    );
    this.title = 'Hearth Rate'
  }

  onBodyWeightClick() {
    this.onChartClick(
      'bodyWeight',
      this.dataService.getAllBodyWeight.bind(this.dataService),
      'bodyWeightData',
      'Body Weight',
      '[kg]'
    );
    this.title = 'Body Weight'
  }

  onRespirationRateClick() {
    this.onChartClick(
      'respirationRate',
      this.dataService.getAllRespirationRate.bind(this.dataService),
      'respirationRateData',
      'Respiration Rate',
      '[/min]'
    );
    this.title = 'Respiration Rate'
  }

  onBloodPressureClick() {
    this.dataService.getAllBloodPressure().subscribe((allBloodPressure) => {
      if (this.selectedStartDate && this.selectedEndDate) {
        this.formattedStartDate = this.formatDate(this.selectedStartDate);
        this.formattedEndDate = this.formatDate(this.selectedEndDate);

        // Filtrowanie na podstawie wybranego przedziału dat
        const filteredData = allBloodPressure.bloodPressure.filter(
          (entry, index) => {
            return (
              entry.date >= this.formattedStartDate && entry.date <= this.formattedEndDate
            );
          }
        );

        // Mapowanie danych
        this.labels = filteredData.map((entry, index) => entry.date);
        this.bloodPressureSystolicData = filteredData.map((entry, index) => entry.valueSystolic);
        this.bloodPressureDiastolicData = filteredData.map((entry, index) => entry.valueDiastolic);
      } else {
        this.labels = allBloodPressure.bloodPressure.map((entry, index) =>  entry.date);
        this.bloodPressureSystolicData = allBloodPressure.bloodPressure.map((entry, index) => entry.valueSystolic);
        this.bloodPressureDiastolicData = allBloodPressure.bloodPressure.map((entry, index) => entry.valueDiastolic);
        
      }
      const labels = this.labels;
      const data1 = this.bloodPressureSystolicData;
      const data2 = this.bloodPressureDiastolicData;
      this.title = 'Blood Pressure';
      const unit = '[mmHg]';
      this.updateChart(labels, data1, data2, this.title, unit);
    });
  }
  onUpdateChart(){
    if(this.title ==='Body Temperture'){this.onBodyTemperatureClick()}
    if(this.title ==='Blood Saturation'){this.onBloodSaturationClick()}
    if(this.title ==='Hearth Rate'){this.onHearthRateClick()}
    if(this.title ==='Body Weight'){this.onBodyWeightClick()}
    if(this.title ==='Respiration Rate'){this.onRespirationRateClick()}
    if(this.title ==='Blood Pressure'){this.onBloodPressureClick()}
  }
} 