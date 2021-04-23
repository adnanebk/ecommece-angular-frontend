import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class SortService {

  constructor() {
  }

  private columnSortedSource = new Subject<ColumnSortedEvent>();

  public columnToSorted = this.columnSortedSource.asObservable();

  public columnSorted(event: ColumnSortedEvent) {
    this.columnSortedSource.next(event);
  }

  public SortByColumn(T, event: ColumnSortedEvent): Object[] {
    if (event.objectType) {
      T.sort((a: any, b: any) => {
        if ((a[event.objectType][event.sortColumn]) < (b[event.objectType][event.sortColumn])) {
          return -1;
        } else if ((a[event.objectType][event.sortColumn]) > (b[event.objectType][event.sortColumn])) {
          return 1;
        } else {
          return 0;
        }
      });
    } else {
      T.sort((a: any, b: any) => {
        if ((a[event.sortColumn]) < (b[event.sortColumn])) {
          return -1;
        } else if ((a[event.sortColumn]) > (b[event.sortColumn])) {
          return 1;
        } else {
          return 0;
        }
      });
    }
    if (event.sortDirection === 'desc') {
      T.reverse();
    }
    return T;
  }
}

export interface ColumnSortedEvent {
  objectType: string;
  sortColumn: string;
  sortDirection: string;
}

// export interface ColumnToSortedEvent {
//   ObjectType: string;
//   sortColumn: string;
//   sortDirection: string;
// }
