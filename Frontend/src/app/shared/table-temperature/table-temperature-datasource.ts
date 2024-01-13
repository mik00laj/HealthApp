import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface TableTemperatureItem {
  id: number;
  date: string,
  time: string;
  value: number;
  result: string;
}

const BODY_TEMPERATURE_DATA: TableTemperatureItem[] = [
  {id:1,date:"2024-01-01",time:"7:51",value:38.6,result:'Fever'},
  {id:0,date:"2024-01-01",time:"11:34",value:40.8,result:'High Fever'},
  {id:2,date:"2024-01-01",time:"18:27",value:38,result:'Fever'},
  {id:3,date:"2024-01-01",time:"21:19",value:38.8,result:'Fever'},
  {id:4,date:"2024-01-01",time:"6:10",value:40,result:'High Fever'},
  {id:6,date:"2024-01-01",time:"12:19",value:40.2,result:'High Fever'},
  {id:7,date:"2024-01-01",time:"15:58",value:35.7,result:'Too Small'},
  {id:8,date:"2024-01-01",time:"22:31",value:36.6,result:'Normal'},
  {id:9,date:"2024-01-01",time:"8:44",value:36.9,result:'Normal'},
  ]


/**
 * Data source for the TableTemperature view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class TableTemperatureDataSource extends DataSource<TableTemperatureItem> {
  data: TableTemperatureItem[] = BODY_TEMPERATURE_DATA;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<TableTemperatureItem[]> {
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(observableOf(this.data), this.paginator.page, this.sort.sortChange)
        .pipe(map(() => {
          return this.getPagedData(this.getSortedData([...this.data ]));
        }));
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: TableTemperatureItem[]): TableTemperatureItem[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: TableTemperatureItem[]): TableTemperatureItem[] {
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

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
