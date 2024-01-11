import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface TableRespirationItem {
  id: number;
  date: string,
  value: number;
  result: string;
}

const RESPIRATION_RATE_DATA: TableRespirationItem[] = [
  {id:0,date:"2024-01-11",value:70,result:'normal'},
  {id:1,date:"2024-01-11",value:70,result:'normal'},
  {id:2,date:"2024-01-11",value:70,result:'normal'},
  {id:3,date:"2024-01-11",value:70,result:'normal'},
  {id:4,date:"2024-01-11",value:70,result:'normal'},
  {id:6,date:"2024-01-11",value:70,result:'normal'},
  {id:7,date:"2024-01-11",value:70,result:'normal'},
  {id:8,date:"2024-01-11",value:70,result:'normal'},
  {id:9,date:"2024-01-11",value:70,result:'normal'},
  ]

export class TableRespirationDataSource extends DataSource<TableRespirationItem> {
  data: TableRespirationItem[] = RESPIRATION_RATE_DATA;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor() {
    super();
  }


  connect(): Observable<TableRespirationItem[]> {
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


  private getPagedData(data: TableRespirationItem[]): TableRespirationItem[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }


  private getSortedData(data: TableRespirationItem[]): TableRespirationItem[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'id': return compare(+a.id, +b.id, isAsc);
        case 'value': return compare(+a.value, +b.value, isAsc);
        case 'date': return compare(a.date, b.date, isAsc);
        default: return 0;
      }
    });
  }
}

function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
