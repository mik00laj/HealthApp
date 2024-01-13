import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface TablePressureItem {
  id: number;
  date: string,
  time: string,
  systolic: number;
  diastolic: number;
  result: string;
}

const BLOOD_PRESSURE_DATA: TablePressureItem[] = [
  {id:0,date:"2024-01-01",time:'5:04',systolic:145,diastolic:121,result:'Hypertension stage 2'},
  {id:1,date:"2024-01-01",time:'13:16',systolic:114,diastolic:87,result:'Hypertension stage 1'},
  {id:2,date:"2024-01-01",time:'16:56',systolic:118,diastolic:81,result:'Hypertension stage 1'},
  {id:3,date:"2024-01-01",time:'22:23',systolic:115,diastolic:68,result:'Normal'},
  {id:4,date:"2024-01-02",time:'7:38',systolic:156,diastolic:56,result:'Hypertension stage 2'},
  {id:6,date:"2024-01-02",time:'11:11',systolic:163,diastolic:65,result:'Normal'},
  {id:7,date:"2024-01-02",time:'16:45',systolic:100,diastolic:63,result:'Normal'},
  {id:8,date:"2024-01-02",time:'21:36',systolic:105,diastolic:57,result:'Normal'},
  {id:9,date:"2024-01-03",time:'5:26',systolic:100,diastolic:64,result:'Hypertension stage 2'},
  ]


export class TablePressureDataSource extends DataSource<TablePressureItem> {
  data: TablePressureItem[] = BLOOD_PRESSURE_DATA;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor() {
    super();
  }


  connect(): Observable<TablePressureItem[]> {
    if (this.paginator && this.sort) {

      return merge(observableOf(this.data), this.paginator.page, this.sort.sortChange)
        .pipe(map(() => {
          return this.getPagedData(this.getSortedData([...this.data ]));
        }));
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }


  disconnect(): void {}

  private getPagedData(data: TablePressureItem[]): TablePressureItem[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }


  private getSortedData(data: TablePressureItem[]): TablePressureItem[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'id': return compare(+a.id, +b.id, isAsc);
        case 'date': return compare(a.date, b.date, isAsc);
        case 'time': return compare(a.time, b.time, isAsc);
        case 'systolic': return compare(+a.systolic, +b.systolic, isAsc);
        case 'diastolic': return compare(+a.diastolic, +b.diastolic, isAsc);
        case 'result': return compare(+a.systolic, +b.systolic, isAsc);
        default: return 0;
      }
    });
  }
}

function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
