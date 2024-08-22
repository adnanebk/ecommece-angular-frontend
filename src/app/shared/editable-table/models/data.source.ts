import {Subject} from "rxjs";
import {Schema} from "./schema";
import {ApiError} from "./api.error";

export class DataSource<Type extends { [key: string | symbol]: any}> {
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
    identifier = 'id';

    get data(): Type[] {
        return this._data;
    }

    constructor(schema: Schema[],data: Type[]) {
        this.schema = schema;
        this.setData(data);
    }

    public setData(data: Type[]) {
        this._data = data;
        this.backupData();
    }

    public backupData() {
        this.backedData = [];
        this.data.forEach(e => this.backedData.push({...e}));
    }

    public roleBack(index?: number) {
        if(index){
            this._data[index] = {...this.backedData[index]};
            return;
        }
        this._data = [];
        this.backedData.forEach(e => this._data.push({...e}));
    }
}
