import { Component } from '@angular/core';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss'
})
export class TablesComponent {
  selectedStartDate: Date;
  selectedEndDate: Date;

  changeDate(event: any, isEndDate: boolean = false) {
    if(isEndDate) {
      this.selectedEndDate = event.value
    } else {
      this.selectedStartDate = event.value;
    }
  }
}
