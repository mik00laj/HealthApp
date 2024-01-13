import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TableWeightDataSource, TableWeightItem } from './table-weight-datasource';
import { DataService } from '../../services/get-data.service';

@Component({
  selector: 'app-table-weight',
  templateUrl: './table-weight.component.html',
  styleUrls: ['./table-weight.component.scss']
})
export class TableWeightComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<TableWeightItem>;
  dataSource = new TableWeightDataSource();

 
  constructor(private dataService: DataService) {}

  displayedColumns = ['id', 'date','time', 'value', 'result'];
  id: number[];
  date: string[];
  time: string[];
  bodyWeightValues: number[];
  result: string[];

  selectedStartDate: Date;
  selectedEndDate: Date;
  formattedStartDate: string;
  formattedEndDate: string;

  ngOnInit(): void {
    this.createBodyWeightTable();
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
      value: this.bodyWeightValues[index],
      result: this.result[index],
    }));
  }
  calculateResult(index: number): string {
    if (index === 0) {
      return 'Normal';
    }
    const previousValue = this.bodyWeightValues[index - 1];
    const currentValue = this.bodyWeightValues[index];

    if (currentValue > previousValue) {
      return 'Gain Weight';
    } else if (currentValue < previousValue) {
      return 'Lose Weight';
    } else {
      return 'Normal';
    }
  }
  
  createBodyWeightTable() {
    this.dataService.getAllBodyWeight().subscribe((allBodyWeight) => {
      if (this.selectedStartDate && this.selectedEndDate) {
        this.formattedStartDate = this.formatDate(this.selectedStartDate);
        this.formattedEndDate = this.formatDate(this.selectedEndDate);
        // Filtrowanie na podstawie wybranego przedziału dat
        const filteredData = allBodyWeight.bodyWeight.filter(
          (entry) =>
            entry.date >= this.formattedStartDate &&
            entry.date <= this.formattedEndDate
        );
        // Mapowanie danych
        this.id = filteredData.map((entry, index) => index);
        this.date = filteredData.map((entry) => entry.date);
          this.time = filteredData.map((entry) => entry.time);
        this.bodyWeightValues = filteredData.map((entry) => entry.value);
        this.result = this.bodyWeightValues.map((value, index) =>
          this.calculateResult(index)
        );
      } else {
        this.id = allBodyWeight.bodyWeight.map((entry, index) => index);
        this.date = allBodyWeight.bodyWeight.map((entry) => entry.date);
        this.time = allBodyWeight.bodyWeight.map((entry) => entry.time);
        this.bodyWeightValues = allBodyWeight.bodyWeight.map((entry) => entry.value);
        this.result = this.bodyWeightValues.map((value, index) =>
        this.calculateResult(index)
      );
      }
      this.updateTableData();
    });
  }
  onSubmitBtn() {
    this.createBodyWeightTable();
  }
}
