import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface TableHearthrateItem {
  id: number;
  date: string,
  time: string;
  value: number;
  result: string;
}

const HEARTH_RATE_DATA: TableHearthrateItem[] = [
  {id:0,date:"2024-01-01",time:"8:57",value:107,result:'Tachycardia'},
  {id:1,date:"2024-01-01",time:"11:12",value:94,result:'Normal'},
  {id:2,date:"2024-01-01",time:"16:48",value:71,result:'Normal'},
  {id:3,date:"2024-01-01",time:"23:07",value:93,result:'Normal'},
  {id:4,date:"2024-01-02",time:"8:35",value:150,result:'Tachycardia'},
  {id:6,date:"2024-01-02",time:"10:16",value:94,result:'Normal'},
  {id:7,date:"2024-01-02",time:"17:34",value:115 ,result:'Normal'},
  {id:8,date:"2024-01-02",time:"21:26",value:130,result:'Tachycardia'},
  {id:9,date:"2024-01-03",time:"6:00",value:87,result:'Normal'},
  ]

export class TableHearthrateDataSource extends DataSource<TableHearthrateItem> {
  data: TableHearthrateItem[] = HEARTH_RATE_DATA;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor() {
    super();
  }

  connect(): Observable<TableHearthrateItem[]> {
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

  private getPagedData(data: TableHearthrateItem[]): TableHearthrateItem[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }
  private getSortedData(data: TableHearthrateItem[]): TableHearthrateItem[] {
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
        case 'result': return compare(+a.result, +b.value, isAsc);
        default: return 0;
      }
    });
  }
}


function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
