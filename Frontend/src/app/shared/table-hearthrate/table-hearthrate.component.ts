import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TableHearthrateDataSource, TableHearthrateItem } from './table-hearthrate-datasource';
import { DataService } from '../../services/get-data.service';

@Component({
  selector: 'app-table-hearthrate',
  templateUrl: './table-hearthrate.component.html',
  styleUrls: ['./table-hearthrate.component.scss']
})
export class TableHearthrateComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<TableHearthrateItem>;
  dataSource = new TableHearthrateDataSource();

 
  constructor(private dataService: DataService) {}

  displayedColumns = ['id', 'date', 'value', 'result'];
  id: number[];
  date: string[];
  hearthRateValues: number[];
  result: string[];

  selectedStartDate: Date;
  selectedEndDate: Date;
  formattedStartDate: string;
  formattedEndDate: string;

  ngOnInit(): void {
    this.createHearthRateTable();
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
      value: this.hearthRateValues[index],
      result: this.result[index],
    }));
  }

  createHearthRateTable() {
    this.dataService.getAllHearthRate().subscribe((allHearthRate) => {
      if (this.selectedStartDate && this.selectedEndDate) {
        this.formattedStartDate = this.formatDate(this.selectedStartDate);
        this.formattedEndDate = this.formatDate(this.selectedEndDate);

        // Filtrowanie na podstawie wybranego przedziału dat
        const filteredData = allHearthRate.hearthRate.filter(
          (entry) =>
            entry.date >= this.formattedStartDate &&
            entry.date <= this.formattedEndDate
        );

        // Mapowanie danych
        this.id = filteredData.map((entry, index) => index);
        this.date = filteredData.map((entry) => entry.date);
        this.hearthRateValues = filteredData.map((entry) => entry.value);
        this.result = this.hearthRateValues.map((value) =>
          value > 37 ? 'High' : 'Normal'
        );
      } else {
        this.id = allHearthRate.hearthRate.map((entry, index) => index);
        this.date = allHearthRate.hearthRate.map((entry) => entry.date);
        this.hearthRateValues = allHearthRate.hearthRate.map((entry) => entry.value);
        this.result = this.hearthRateValues.map((value) =>value > 37 ? 'High' : 'Normal');
      }

      this.updateTableData();
    });
  }
  onSubmitBtn() {
    this.createHearthRateTable();
  }
}
