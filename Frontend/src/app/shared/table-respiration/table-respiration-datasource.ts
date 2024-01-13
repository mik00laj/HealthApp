import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface TableRespirationItem {
  id: number;
  date: string,
  time: string;
  value: number;
  result: string;
}

const RESPIRATION_RATE_DATA: TableRespirationItem[] = [
  {id:0,date:"2024-01-01",time:"7:23",value:12,result:'Normal'},
  {id:1,date:"2024-01-01",time:"13:29",value:18,result:'Normal'},
  {id:2,date:"2024-01-01",time:"15:29",value:11,result:'Lungs issue'},
  {id:3,date:"2024-01-01",time:"22:50",value:13,result:'Normal'},
  {id:4,date:"2024-01-02",time:"7:37",value:10,result:'Lungs issue'},
  {id:6,date:"2024-01-02",time:"12:13",value:19,result:'Normal'},
  {id:7,date:"2024-01-02",time:"16:35",value:11,result:'Lungs issue'},
  {id:8,date:"2024-01-02",time:"22:37",value:20,result:'Normal'},
  {id:9,date:"2024-01-03",time:"6:36",value:16,result:'Normal'},
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
        case 'date': return compare(a.date, b.date, isAsc);
        case 'time': return compare(a.time, b.time, isAsc);
        case 'value': return compare(+a.value, +b.value, isAsc);
        case 'result': return compare(+a.value, +b.value, isAsc);
      }
    });
  }
}

function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
