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
    const dateFromWeekAgo = new Date();
    dateFromWeekAgo.setDate(dateFromWeekAgo.getDate() - 7);
    const actualDate = new Date();
    this.selectedStartDate = dateFromWeekAgo;
    this.selectedEndDate = actualDate;
    this.formattedEndDate =  this.formatDate(actualDate);
    this.formattedStartDate = this.formatDate(dateFromWeekAgo);
  }

  formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = (date.getDate()).toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  changeDate(event: any, isEndDate: boolean = false) {
    if(isEndDate) {
      if(this.selectedEndDate){this.formattedEndDate = this.formatDate(event.value)}

    } else {
      if(this.selectedStartDate){      this.formattedStartDate = this.formatDate(event.value)}
    }
  }

}


