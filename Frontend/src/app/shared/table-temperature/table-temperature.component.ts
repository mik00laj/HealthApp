import { AfterViewInit, Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TableTemperatureDataSource, TableTemperatureItem } from './table-temperature-datasource';
import { DataService } from '../../services/get-data.service';

@Component({
  selector: 'app-table-temperature',
  templateUrl: './table-temperature.component.html',
  styleUrls: ['./table-temperature.component.scss']
})
export class TableTemperatureComponent implements AfterViewInit {
  @Input({ required: false }) startDate: Date;
  @Input({ required: false }) endDate: Date;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<TableTemperatureItem>;
  dataSource = new TableTemperatureDataSource();

  constructor(private dataService: DataService) {}

  displayedColumns = ['id', 'date','time', 'value', 'result'];
  id: number[];
  date: string[];
  time: string[];
  bodyTemperatureValues: number[];
  result: string[];
  formattedStartDate: string;
  formattedEndDate: string;

  ngOnChanges(changes: SimpleChanges): void {
    const { startDate, endDate } = changes;

    if(startDate) {
      this.startDate = startDate.currentValue;
      this.createBodyTemperatureTable();
    }

    if(endDate) {
      this.endDate = endDate.currentValue;
      this.createBodyTemperatureTable();
    }
  }

  ngOnInit(): void {
    this.createBodyTemperatureTable();

    if (!this.startDate) {
      this.startDate = new Date();
      this.startDate.setMonth(this.startDate.getMonth() - 1);
    }

    if (!this.endDate) {
      this.endDate = new Date();
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    // const day = (date.getDate() + 1).toString().padStart(2, '0');  // jeżeli kalendarz wskazuje date o 1 mneijsza
    const day = (date.getDate()).toString().padStart(2, '0');         // jeżeli kalendarz wskazuje date poprawnie
    return `${year}-${month}-${day}`;
  };

  updateTableData() {
    // Mapowanie danych do tablicy TEMPERATURE_DATA zgodnie z warunkiem
    this.dataSource.data = this.id.map((_, index) => ({
      id: this.id[index],
      date: this.date[index],
      time: this.time[index],
      value: this.bodyTemperatureValues[index],
      result: this.result[index],
    }));

    this.paginator._changePageSize(10);
    this.paginator._changePageSize(5);
  }

  calculateResult(value: number){
      if (value <= 35) {
        return 'Hypothermia';
      } else if (value > 35 && value < 36) {
        return 'Too low';
      } else if (value >= 36 && value <= 37) {
        return 'Normal';
      } else if (value > 37 && value <37.9) {
        return 'Too High';
      } else if (value >= 37.9 && value < 39.9) {
        return 'Fever';
      } else if (value >= 39) {
        return 'High Fever';
      }else {
        return 'Undefined';
      }
    };

  
  createBodyTemperatureTable() {
    this.dataService.getAllBodyTemperature().subscribe((allBodyTemperature) => {
      if (this.startDate && this.endDate) {
        this.formattedStartDate = this.formatDate(this.startDate);
        this.formattedEndDate = this.formatDate(this.endDate);
        // Filtrowanie na podstawie wybranego przedziału dat
        const filteredData = allBodyTemperature.bodyTemperature.filter(
          (entry) =>
            entry.date >= this.formattedStartDate &&
            entry.date <= this.formattedEndDate
        );
        // Mapowanie danych
        this.id = filteredData.map((entry, index) => index);
        this.date = filteredData.map((entry) => entry.date);
        this.time = filteredData.map((entry) => entry.time);
        this.bodyTemperatureValues = filteredData.map((entry) => entry.value);
        this.result = this.bodyTemperatureValues.map(this.calculateResult);

      } else {
        this.id = allBodyTemperature.bodyTemperature.map((entry, index) => index);
        this.date = allBodyTemperature.bodyTemperature.map((entry) => entry.date);
        this.time = allBodyTemperature.bodyTemperature.map((entry) => entry.time);
        this.bodyTemperatureValues = allBodyTemperature.bodyTemperature.map((entry) => entry.value);
        this.result = this.bodyTemperatureValues.map(this.calculateResult);
      }
      this.updateTableData();
    });
  }
}
