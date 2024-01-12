import { AfterViewInit, Component, ViewChild } from '@angular/core';
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
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<TableTemperatureItem>;
  dataSource = new TableTemperatureDataSource();

  constructor(private dataService: DataService) {}

  displayedColumns = ['id', 'date', 'value', 'result'];
  id: number[];
  date: string[];
  bodyTemperatureValues: number[];
  result: string[];

  selectedStartDate: Date;
  selectedEndDate: Date;
  formattedStartDate: string;
  formattedEndDate: string;

  ngOnInit(): void {
    this.createBodyTemperatureTable();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  updateTableData() {
    // Mapowanie danych do tablicy TEMPERATURE_DATA zgodnie z warunkiem
    this.dataSource.data = this.id.map((_, index) => ({
      id: this.id[index],
      date: this.date[index],
      value: this.bodyTemperatureValues[index],
      result: this.result[index],
    }));
  }
  calculateResult(value: number){
      if (value <= 35) {
        return 'Hypothermia';
      } else if (value > 35 && value < 36) {
        return 'Too Small';
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
      if (this.selectedStartDate && this.selectedEndDate) {
        this.formattedStartDate = this.formatDate(this.selectedStartDate);
        this.formattedEndDate = this.formatDate(this.selectedEndDate);
        // Filtrowanie na podstawie wybranego przedziału dat
        const filteredData = allBodyTemperature.bodyTemperature.filter(
          (entry) =>
            entry.date >= this.formattedStartDate &&
            entry.date <= this.formattedEndDate
        );
        // Mapowanie danych
        this.id = filteredData.map((entry, index) => index);
        this.date = filteredData.map((entry) => entry.date);
        this.bodyTemperatureValues = filteredData.map((entry) => entry.value);
        this.result = this.bodyTemperatureValues.map(this.calculateResult);

      } else {
        this.id = allBodyTemperature.bodyTemperature.map((entry, index) => index);
        this.date = allBodyTemperature.bodyTemperature.map((entry) => entry.date);
        this.bodyTemperatureValues = allBodyTemperature.bodyTemperature.map((entry) => entry.value);
        this.result = this.bodyTemperatureValues.map(this.calculateResult);
      }
      this.updateTableData();
    });
  }
  onSubmitBtn() {
    this.createBodyTemperatureTable();
  }
}