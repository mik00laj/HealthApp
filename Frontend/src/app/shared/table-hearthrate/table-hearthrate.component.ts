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
  TableHearthrateDataSource,
  TableHearthrateItem,
} from './table-hearthrate-datasource';
import { DataService } from '../../services/get-data.service';

@Component({
  selector: 'app-table-hearthrate',
  templateUrl: './table-hearthrate.component.html',
  styleUrls: ['./table-hearthrate.component.scss'],
})
export class TableHearthrateComponent implements AfterViewInit {
  @Input({ required: false }) startDate: Date;
  @Input({ required: false }) endDate: Date;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<TableHearthrateItem>;
  dataSource = new TableHearthrateDataSource();

  constructor(private dataService: DataService) {}

  displayedColumns = ['id', 'date', 'time', 'value', 'result'];
  id: number[];
  date: string[];
  time: string[];
  hearthRateValues: number[];
  result: string[];
  formattedStartDate: string;
  formattedEndDate: string;

  ngOnInit(): void {
    this.createHearthRateTable();

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
      this.createHearthRateTable();
    }

    if (endDate) {
      this.endDate = endDate.currentValue;
      this.createHearthRateTable();
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
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  updateTableData() {
    // Mapowanie danych do tablicy TEMPERATURE_DATA zgodnie z warunkiem
    this.dataSource.data = this.id.map((_, index) => ({
      id: this.id[index],
      date: this.date[index],
      time: this.time[index],
      value: this.hearthRateValues[index],
      result: this.result[index],
    }));

    this.paginator._changePageSize(10);
    this.paginator._changePageSize(5);
  }

  calculateResult(value: number) {
    const user_age = 24;
    if (user_age >= 1 && user_age <= 3) {
      if (value >= 98 && value <= 140) {
        return 'Normal';
      } else if (value > 140) {
        return 'Tachycardia';
      } else if (value < 98) {
        return 'Bradycardia';
      } else {
        return 'Undefined';
      }
    } else if (user_age > 3 && user_age <= 5) {
      if (value >= 80 && value <= 120) {
        return 'Normal';
      } else if (value > 120) {
        return 'Tachycardia';
      } else if (value < 80) {
        return 'Bradycardia';
      } else {
        return 'Undefined';
      }
    } else if (user_age > 5 && user_age <= 12) {
      if (value >= 75 && value <= 118) {
        return 'Normal';
      } else if (value > 118) {
        return 'Tachycardia';
      } else if (value < 75) {
        return 'Bradycardia';
      } else {
        return 'Undefined';
      }
    } else if (user_age > 12 && user_age <= 18) {
      if (value >= 60 && value <= 100) {
        return 'Normal';
      } else if (value > 140) {
        return 'Tachycardia';
      } else if (value < 60) {
        return 'Bradycardia';
      } else {
        return 'Undefined';
      }
    } else if (user_age > 18) {
      if (value >= 60 && value <= 100) {
        return 'Normal';
      } else if (value > 100) {
        return 'Tachycardia';
      } else if (value < 60) {
        return 'Bradycardia';
      } else {
        return 'Undefined';
      }
    }
  }

  createHearthRateTable() {
    this.dataService.getAllHearthRate().subscribe((allHearthRate) => {
      if (this.startDate && this.endDate) {
        this.formattedStartDate = this.formatDate(this.startDate);
        this.formattedEndDate = this.formatDate(this.endDate);

        // Filtrowanie na podstawie wybranego przedziału dat
        const filteredData = allHearthRate.hearthRate.filter(
          (entry) =>
            entry.date >= this.formattedStartDate &&
            entry.date <= this.formattedEndDate
        );

        // Mapowanie danych
        this.id = filteredData.map((entry, index) => index);
        this.date = filteredData.map((entry) => entry.date);
        this.time = filteredData.map((entry) => entry.time);
        this.hearthRateValues = filteredData.map((entry) => entry.value);
        this.result = this.hearthRateValues.map(this.calculateResult);
      } else {
        this.id = allHearthRate.hearthRate.map((entry, index) => index);
        this.date = allHearthRate.hearthRate.map((entry) => entry.date);
        this.time = allHearthRate.hearthRate.map((entry) => entry.time);
        this.hearthRateValues = allHearthRate.hearthRate.map(
          (entry) => entry.value
        );
        this.result = this.hearthRateValues.map(this.calculateResult);
      }

      this.updateTableData();
    });
  }

}