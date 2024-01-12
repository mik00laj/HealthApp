import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface TablePressureItem {
  id: number;
  date: string,
  systolic: number;
  diastolic: number;
  result: string;
}

const BLOOD_PRESSURE_DATA: TablePressureItem[] = [
  {id:0,date:"2024-01-11",systolic:140,diastolic:90,result:'normal'},
  {id:1,date:"2024-01-11",systolic:140,diastolic:90,result:'normal'},
  {id:2,date:"2024-01-11",systolic:140,diastolic:90,result:'normal'},
  {id:3,date:"2024-01-11",systolic:140,diastolic:90,result:'normal'},
  {id:4,date:"2024-01-11",systolic:130,diastolic:80,result:'normal'},
  {id:6,date:"2024-01-11",systolic:120,diastolic:80,result:'normal'},
  {id:7,date:"2024-01-11",systolic:110,diastolic:70,result:'To Small'},
  {id:8,date:"2024-01-11",systolic:140,diastolic:90,result:'normal'},
  {id:9,date:"2024-01-11",systolic:140,diastolic:90,result:'normal'},
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
        case 'systolic': return compare(+a.systolic, +b.systolic, isAsc);
        case 'diastolic': return compare(+a.diastolic, +b.diastolic, isAsc);
        case 'date': return compare(a.date, b.date, isAsc);
        default: return 0;
      }
    });
  }
}

function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
