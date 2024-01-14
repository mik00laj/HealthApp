import { AfterViewInit, Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TablePressureDataSource, TablePressureItem } from './table-pressure-datasource';
import { DataService } from '../../services/get-data.service';

@Component({
  selector: 'app-table-pressure',
  templateUrl: './table-pressure.component.html',
  styleUrls: ['./table-pressure.component.scss']
})
export class TablePressureComponent implements AfterViewInit {
  @Input({ required: false }) startDate: Date;
  @Input({ required: false }) endDate: Date;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<TablePressureItem>;
  dataSource = new TablePressureDataSource();

 
  constructor(private dataService: DataService) {}

  displayedColumns = ['id', 'date', 'systolic', 'diastolic', 'result'];
  id: number[];
  date: string[];
  time: string[];
  bloodPressureSystolicValues: number[];
  bloodPressureDiastolicValues: number[];
  result: string[];

  formattedStartDate: string;
  formattedEndDate: string;

  ngOnInit(): void {
    this.createBlooPressureTable();

    if (!this.startDate) {
      this.startDate = new Date();
      this.startDate.setMonth(this.startDate.getMonth() - 1);
    }

    if (!this.endDate) {
      this.endDate = new Date();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { startDate, endDate } = changes;

    if(startDate) {
      this.startDate = startDate.currentValue;
      this.createBlooPressureTable();
    }

    if(endDate) {
      this.endDate = endDate.currentValue;
      this.createBlooPressureTable();
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
      systolic: this.bloodPressureSystolicValues[index],
      diastolic: this.bloodPressureDiastolicValues[index],
      result: this.result[index],
    }));

    this.paginator._changePageSize(10);
    this.paginator._changePageSize(5);
  }

  calculateResult(systolic: number, diastolic: number): string {
    if (systolic < 120 && diastolic < 80) {
      return 'Normal';
    } else if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
      return 'Elevated';
    } else if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
      return 'Hypertension stage 1';
    } else if (systolic >= 140 || diastolic >= 90) {
      return 'Hypertension stage 2';
    } else if (systolic > 180 || diastolic > 120) {
      return 'Hypertensive crisis';
    } else {
      return 'Undefined';
    }
  }

  createBlooPressureTable() {
    this.dataService.getAllBloodPressure().subscribe((allBloodPressure) => {
      if (this.startDate && this.endDate) {
        this.formattedStartDate = this.formatDate(this.startDate);
        this.formattedEndDate = this.formatDate(this.endDate);

        // Filtrowanie na podstawie wybranego przedziału dat
        const filteredData = allBloodPressure.bloodPressure.filter(
          (entry) =>
            entry.date >= this.formattedStartDate &&
            entry.date <= this.formattedEndDate
        );

        // Mapowanie danych
        this.id = filteredData.map((entry, index) => index);
        this.date = filteredData.map((entry) => entry.date);
        this.time = filteredData.map((entry) => entry.time); 
        this.bloodPressureSystolicValues = filteredData.map((entry, index) => entry.valueSystolic);
        this.bloodPressureDiastolicValues = filteredData.map((entry, index) => entry.valueDiastolic);
        this.result = filteredData.map((entry) =>
        this.calculateResult(entry.valueSystolic, entry.valueDiastolic)
      );
      } else {
        this.id = allBloodPressure.bloodPressure.map((entry, index) => index);
        this.date = allBloodPressure.bloodPressure.map((entry) => entry.date);
        this.time = allBloodPressure.bloodPressure.map((entry) => entry.time); 
        this.bloodPressureSystolicValues = allBloodPressure.bloodPressure.map((entry, index) => entry.valueSystolic);
        this.bloodPressureDiastolicValues = allBloodPressure.bloodPressure.map((entry, index) => entry.valueDiastolic);
        this.result = allBloodPressure.bloodPressure.map((entry) =>
        this.calculateResult(entry.valueSystolic, entry.valueDiastolic)
      );
      }

      this.updateTableData();
    });
  }

}
