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
  TableWeightDataSource,
  TableWeightItem,
} from './table-weight-datasource';
import { DataService } from '../../services/get-data.service';

@Component({
  selector: 'app-table-weight',
  templateUrl: './table-weight.component.html',
  styleUrls: ['./table-weight.component.scss'],
})
export class TableWeightComponent implements AfterViewInit {
  @Input({ required: false }) startDate: Date;
  @Input({ required: false }) endDate: Date;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<TableWeightItem>;
  dataSource = new TableWeightDataSource();

  constructor(private dataService: DataService) {}

  displayedColumns = ['id', 'date', 'time', 'value', 'result'];
  id: number[];
  date: string[];
  time: string[];
  bodyWeightValues: number[];
  result: string[];

  formattedStartDate: string;
  formattedEndDate: string;

  ngOnInit(): void {
    this.createBodyWeightTable();

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
      this.createBodyWeightTable();
    }

    if (endDate) {
      this.endDate = endDate.currentValue;
      this.createBodyWeightTable();
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
      value: this.bodyWeightValues[index],
      result: this.result[index],
    }));

    this.paginator._changePageSize(10);
    this.paginator._changePageSize(5);
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
    } else if (currentValue == previousValue) {
      return 'Normal';
    } else {
      return 'Undefined';
    }
  }

  createBodyWeightTable() {
    this.dataService.getAllBodyWeight().subscribe((allBodyWeight) => {
      if (this.startDate && this.endDate) {
        this.formattedStartDate = this.formatDate(this.startDate);
        this.formattedEndDate = this.formatDate(this.endDate);
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
        this.bodyWeightValues = allBodyWeight.bodyWeight.map(
          (entry) => entry.value
        );
        this.result = this.bodyWeightValues.map((value, index) =>
          this.calculateResult(index)
        );
      }
      this.updateTableData();
    });
  }

}
