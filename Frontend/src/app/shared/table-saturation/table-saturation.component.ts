import {
  AfterViewInit,
  Component,
  Input,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
  TableSaturationDataSource,
  TableSaturationItem,
} from './table-saturation-datasource';
import { DataService } from '../../services/get-data.service';

@Component({
  selector: 'app-table-saturation',
  templateUrl: './table-saturation.component.html',
  styleUrls: ['./table-saturation.component.scss'],
})
export class TableSaturationComponent implements AfterViewInit {
  @Input({ required: false }) startDate: Date;
  @Input({ required: false }) endDate: Date;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<TableSaturationItem>;
  dataSource = new TableSaturationDataSource();

  constructor(private dataService: DataService) {}

  displayedColumns = ['id', 'date', 'time', 'value', 'result'];
  id: number[];
  date: string[];
  time: string[];
  BloodSaturationValues: number[];
  result: string[];
  formattedStartDate: string;
  formattedEndDate: string;

  ngOnInit(): void {
    this.createBloodSaturationTable();

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

    if (startDate) {
      this.startDate = startDate.currentValue;
      this.createBloodSaturationTable();
    }

    if (endDate) {
      this.endDate = endDate.currentValue;
      this.createBloodSaturationTable();
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
    const day = date.getDate().toString().padStart(2, '0'); // jeżeli kalendarz wskazuje date poprawnie
    return `${year}-${month}-${day}`;
  };

  updateTableData() {
    // Mapowanie danych do tablicy TEMPERATURE_DATA zgodnie z warunkiem
    this.dataSource.data = this.id.map((_, index) => ({
      id: this.id[index],
      date: this.date[index],
      time: this.time[index],
      value: this.BloodSaturationValues[index],
      result: this.result[index],
    }));

    this.paginator._changePageSize(10);
    this.paginator._changePageSize(5);
  }

  calculateResult(value: number) {
    if (value >= 95 && value <= 100) {
      return 'Normal';
    } else if (value >= 92 && value < 95) {
      return 'Small';
    } else if (value >= 90 && value < 92) {
      return 'Too Small';
    } else if (value < 90) {
      return 'Hypoxemia';
    } else {
      return 'Undefined';
    }
  }

  createBloodSaturationTable() {
    this.dataService.getAllBloodSaturation().subscribe((allBloodSaturation) => {
      if (this.startDate && this.endDate) {
        this.formattedStartDate = this.formatDate(this.startDate);
        this.formattedEndDate = this.formatDate(this.endDate);

        // Filtrowanie na podstawie wybranego przedziału dat
        const filteredData = allBloodSaturation.bloodSaturation.filter(
          (entry) =>
            entry.date >= this.formattedStartDate &&
            entry.date <= this.formattedEndDate
        );
        // Mapowanie danych
        this.id = filteredData.map((entry, index) => index);
        this.date = filteredData.map((entry) => entry.date);
        this.time = filteredData.map((entry) => entry.time);
        this.BloodSaturationValues = filteredData.map((entry) => entry.value);
        this.result = this.BloodSaturationValues.map(this.calculateResult);
      } else {
        this.id = allBloodSaturation.bloodSaturation.map(
          (entry, index) => index
        );
        this.date = allBloodSaturation.bloodSaturation.map(
          (entry) => entry.date
        );
        this.time = allBloodSaturation.bloodSaturation.map(
          (entry) => entry.time
        );
        this.BloodSaturationValues = allBloodSaturation.bloodSaturation.map(
          (entry) => entry.value
        );
        this.result = this.BloodSaturationValues.map(this.calculateResult);
      }

      this.updateTableData();
    });
  }

}
