import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TableRespirationDataSource, TableRespirationItem } from './table-respiration-datasource';
import { DataService } from '../../services/get-data.service';

@Component({
  selector: 'app-table-respiration',
  templateUrl: './table-respiration.component.html',
  styleUrls: ['./table-respiration.component.scss']
})
export class TableRespirationComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<TableRespirationItem>;
  dataSource = new TableRespirationDataSource();

 
  constructor(private dataService: DataService) {}
  displayedColumns = ['id', 'date','time', 'value', 'result'];
  id: number[];
  date: string[];
  time: string[];
  respirationRateValues: number[];
  result: string[];

  selectedStartDate: Date;
  selectedEndDate: Date;
  formattedStartDate: string;
  formattedEndDate: string;

  ngOnInit(): void {

    this.createRespirationRateTable();
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
      value: this.respirationRateValues[index],
      result: this.result[index],
    }));
  }

  calculateResult(value:number){
    const user_age = 24
    if(user_age >= 1 && user_age  <= 3 ){
      if (value >= 24 && value <= 40) {
        return 'Normal';
    } else{
      return 'Lungs issue'
    }
    }else if(user_age  > 3 && user_age  <= 6){
      if (value >= 22 && value <= 34) {
        return 'Normal';
    } else{
      return 'Lungs issue'
    }
    }else if(user_age  > 6 && user_age  <= 12){
      if (value >= 18 && value <= 30) {
        return 'Normal';
    } else{
      return 'Lungs issue'
    }      
    }else if(user_age  > 12 && user_age  <= 18){
      if (value >= 12 && value <= 16) {
        return 'Normal';
    } else{
      return 'Lungs issue'
    }
    }else if(user_age  > 18){
      if (value >= 12 && value <= 20) {
        return 'Normal';
    } else{
      return 'Lungs issue'
      }
    }
    
  }
  
  createRespirationRateTable() {
    this.dataService.getAllRespirationRate().subscribe((allRespirationRate) => {
      if (this.selectedStartDate && this.selectedEndDate) {
        this.formattedStartDate = this.formatDate(this.selectedStartDate);
        this.formattedEndDate = this.formatDate(this.selectedEndDate);

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
        this.id = allRespirationRate.respirationRate.map((entry, index) => index);
        this.date = allRespirationRate.respirationRate.map((entry) => entry.date);  
        this.time = allRespirationRate.respirationRate.map((entry) => entry.time);
        this.respirationRateValues = allRespirationRate.respirationRate.map((entry) => entry.value);
        this.result = this.respirationRateValues.map(this.calculateResult);
      }

      this.updateTableData();
    });
  }
  onSubmitBtn() {
    this.createRespirationRateTable();
  }
}
