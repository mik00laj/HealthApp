import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataTableDataSource, DataTableItem } from './data-table-datasource';
import { DataService } from '../../services/get-data.service';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<DataTableItem>;
  dataSource = new DataTableDataSource();

  constructor(private dataService: DataService) {}

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
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
    this.createBodyTemperatureTable() 
    
  }

  ngAfterViewInit(): void {
    this.createBodyTemperatureTable() 
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
    // Mapowanie danych do tablicy EXAMPLE_DATA zgodnie z warunkiem
    this.dataSource.data = this.id.map((_, index) => ({
      id: this.id[index],
      date: this.date[index],
      value: this.bodyTemperatureValues[index],
      result: this.result[index],
    }));
  }

  createBodyTemperatureTable() {
    this.dataService.getAllTemperatureData().subscribe((allBodyTemperature) => {
      if (this.selectedStartDate && this.selectedEndDate) {
        this.formattedStartDate = this.formatDate(this.selectedStartDate);
        this.formattedEndDate = this.formatDate(this.selectedEndDate);

        // Filtrowanie na podstawie wybranego przedziału dat
        const filteredData = allBodyTemperature.bodyTemperature.filter(
          (entry) => entry.date >= this.formattedStartDate && entry.date <= this.formattedEndDate
        );

        // Mapowanie danych
        this.id = filteredData.map((entry,index) => index);
        this.date = filteredData.map((entry) => entry.date);
        this.bodyTemperatureValues = filteredData.map((entry) => entry.value);
        this.result = this.bodyTemperatureValues.map(value => (value > 37 ? 'High' : 'Normal'));

      } else {
        this.id = allBodyTemperature.bodyTemperature.map((entry,index) => index);
        this.date = allBodyTemperature.bodyTemperature.map((entry) => entry.date);
        this.bodyTemperatureValues = allBodyTemperature.bodyTemperature.map((entry) => entry.value);
        this.result = this.bodyTemperatureValues.map(value => (value > 37 ? 'High' : 'Normal'));
      }

      this.updateTableData();
    });
  }
}
