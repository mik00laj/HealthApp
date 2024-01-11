import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface TableTemperatureItem {
  id: number;
  date: string,
  value: number;
  result: string;
}

const BODY_WEIGHT_DATA: TableTemperatureItem[] = [
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


/**
 * Data source for the TableTemperature view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class TableTemperatureDataSource extends DataSource<TableTemperatureItem> {
  data: TableTemperatureItem[] = BODY_WEIGHT_DATA;
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
        case 'value': return compare(+a.value, +b.value, isAsc);
        case 'date': return compare(a.date, b.date, isAsc);
        default: return 0;
    }});
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
