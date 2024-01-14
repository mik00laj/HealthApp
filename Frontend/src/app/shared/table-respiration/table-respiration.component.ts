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
  TableRespirationDataSource,
  TableRespirationItem,
} from './table-respiration-datasource';
import { DataService } from '../../services/get-data.service';

@Component({
  selector: 'app-table-respiration',
  templateUrl: './table-respiration.component.html',
  styleUrls: ['./table-respiration.component.scss'],
})
export class TableRespirationComponent implements AfterViewInit {
  @Input({ required: false }) startDate: Date;
  @Input({ required: false }) endDate: Date;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<TableRespirationItem>;
  dataSource = new TableRespirationDataSource();

  constructor(private dataService: DataService) {}
  displayedColumns = ['id', 'date', 'time', 'value', 'result'];
  id: number[];
  date: string[];
  time: string[];
  respirationRateValues: number[];
  result: string[];
  formattedStartDate: string;
  formattedEndDate: string;

  ngOnInit(): void {
    this.createRespirationRateTable();

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
      this.createRespirationRateTable();
    }

    if (endDate) {
      this.endDate = endDate.currentValue;
      this.createRespirationRateTable();
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
      value: this.respirationRateValues[index],
      result: this.result[index],
    }));

    this.paginator._changePageSize(10);
    this.paginator._changePageSize(5);
  }

  calculateResult(value: number) {
    const user_age = 24;
    if (user_age >= 1 && user_age <= 3) {
      if (value >= 24 && value <= 40) {
        return 'Normal';
      } else if (value < 24 || value > 40) {
        return 'Lungs issue';
      } else {
        return ' Undefined';
      }
    } else if (user_age > 3 && user_age <= 6) {
      if (value >= 22 && value <= 34) {
        return 'Normal';
      } else if (value < 22 || value > 34) {
        return 'Lungs issue';
      } else {
        return ' Undefined';
      }
    } else if (user_age > 6 && user_age <= 12) {
      if (value >= 18 && value <= 30) {
        return 'Normal';
      } else if (value < 18 || value > 30) {
        return 'Lungs issue';
      } else {
        return ' Undefined';
      }
    } else if (user_age > 12 && user_age <= 18) {
      if (value >= 12 && value <= 16) {
        return 'Normal';
      } else if (value < 12 || value > 16) {
        return 'Lungs issue';
      } else {
        return 'Undefined';
      }
    } else if (user_age > 18) {
      if (value >= 12 && value <= 20) {
        return 'Normal';
      } else if (value < 12 || value > 20) {
        return 'Lungs issue';
      } else {
        return 'Undefined';
      }
    } else {
      return 'Undefined';
    }
  }

  createRespirationRateTable() {
    this.dataService.getAllRespirationRate().subscribe((allRespirationRate) => {
      if (this.startDate && this.endDate) {
        this.formattedStartDate = this.formatDate(this.startDate);
        this.formattedEndDate = this.formatDate(this.endDate);

        // Filtrowanie na podstawie wybranego przedziału dat
        const filteredData = allRespirationRate.respirationRate.filter(
          (entry) =>
            entry.date >= this.formattedStartDate &&
            entry.date <= this.formattedEndDate
        );

        // Mapowanie danych
        this.id = filteredData.map((entry, index) => index);
        this.date = filteredData.map((entry) => entry.date);
        this.time = filteredData.map((entry) => entry.time);
        this.respirationRateValues = filteredData.map((entry) => entry.value);
        this.result = this.respirationRateValues.map(this.calculateResult);
      } else {
        this.id = allRespirationRate.respirationRate.map(
          (entry, index) => index
        );
        this.date = allRespirationRate.respirationRate.map(
          (entry) => entry.date
        );
        this.time = allRespirationRate.respirationRate.map(
          (entry) => entry.time
        );
        this.respirationRateValues = allRespirationRate.respirationRate.map(
          (entry) => entry.value
        );
        this.result = this.respirationRateValues.map(this.calculateResult);
      }

      this.updateTableData();
    });
  }
}
