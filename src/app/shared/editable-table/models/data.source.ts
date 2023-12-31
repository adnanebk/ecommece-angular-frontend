import {Subject} from "rxjs";
import {Schema} from "./schema";
import {ApiError} from "./api.error";

export class DataSource<Type> {
    schema: Schema[] = [];
    private _data: Type[] = [];
    private backedData: Type[] = [];
    onRowErrors = new Subject<{ row: Type, errors: ApiError[] }>();
    onRowAdded = new Subject<Type>();
    onRowsAdded = new Subject<Type[]>();
    onRowUpdated = new Subject<Type>();
    onRowsUpdated = new Subject<Type[]>();
    onRowRemoved = new Subject<Type>();
    onRowsRemoved = new Subject<Type[]>();
    identifier = '';

    get data(): Type[] {
        return this._data;
    }

    public setData(data: Type[]) {
        this._data = data;
        this.backupData();
    }

    public backupData() {
        this.backedData = [];
        this.data.forEach(e => this.backedData.push({...e}));
    }

    public roleBack() {
        this._data = [];
        this.backedData.forEach(e => this._data.push({...e}));
    }
}
