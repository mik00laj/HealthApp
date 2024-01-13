import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface TableSaturationItem {
  id: number;
  date: string,
  time: string;
  value: number;
  result: string;
}

const BLOOD_SATURATION_DATA: TableSaturationItem[] = [
  {id:1,date:"2024-01-01",time:"5:36",value:94.6,result:'Small'},
  {id:0,date:"2024-01-01",time:"11:52",value:91.3,result:'Too Small'},
  {id:2,date:"2024-01-01",time:"18:58",value:98.7,result:'Normal'},
  {id:3,date:"2024-01-01",time:"23:21",value:88.1,result:'Hypoxemia'},
  {id:4,date:"2024-01-01",time:"8:23",value:93,result:'Small'},
  {id:6,date:"2024-01-01",time:"11:08",value:93.6,result:'Small'},
  {id:7,date:"2024-01-01",time:"17:23",value:88.4,result:'Hypoxemia'},
  {id:8,date:"2024-01-01",time:"22:28",value:91.3,result:'Too Small'},
  {id:9,date:"2024-01-01",time:"7:47",value:98.8,result:'Normal'},
  ]


export class TableSaturationDataSource extends DataSource<TableSaturationItem> {
  data: TableSaturationItem[] = BLOOD_SATURATION_DATA;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor() {
    super();
  }


  connect(): Observable<TableSaturationItem[]> {
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

  private getPagedData(data: TableSaturationItem[]): TableSaturationItem[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }


  private getSortedData(data: TableSaturationItem[]): TableSaturationItem[] {
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
        default: return 0;
  }});
  }
}

function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
