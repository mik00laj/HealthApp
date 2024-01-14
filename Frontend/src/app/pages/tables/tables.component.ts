import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss'
})
export class TablesComponent implements OnInit {
  selectedStartDate: Date;
  selectedEndDate: Date;
  formattedStartDate: string;
  formattedEndDate: string;

  constructor() {}

  ngOnInit(): void {
    const dateFromMonthAgo = new Date();
    dateFromMonthAgo.setMonth(dateFromMonthAgo.getMonth() - 1);
    const actualDate = new Date();
    this.selectedStartDate = dateFromMonthAgo;
    this.selectedEndDate = actualDate;
    this.formattedEndDate =  this.formatDate(actualDate);
    this.formattedStartDate = this.formatDate(dateFromMonthAgo);
  }

  changeDate(event: any, isEndDate: boolean = false) {
    if(isEndDate) {
      this.selectedEndDate = event.value
    } else {
      this.selectedStartDate = event.value;
    }
  }
  formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    // const day = (date.getDate() + 1).toString().padStart(2, '0');  // jeżeli kalendarz wskazuje date o 1 mneijsza
    const day = (date.getDate()).toString().padStart(2, '0');         // jeżeli kalendarz wskazuje date poprawnie
    return `${year}-${month}-${day}`;
  };
}


