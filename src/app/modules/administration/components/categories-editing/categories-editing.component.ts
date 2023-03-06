import {Component, OnInit} from '@angular/core';
import {DataPage} from "../../../../core/models/dataPage";
import {ApiError, DataSource, Field} from "../../../../shared/editable-table/editable-table.component";
import {Category} from "../../../../core/models/category";
import {CategoryService} from "../../../../core/services/category.service";
import {ToastrService} from "ngx-toastr";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-categories-editing',
    templateUrl: './categories-editing.component.html',
    styleUrls: ['./categories-editing.component.css']
})
export class CategoriesEditingComponent implements OnInit {

    dataPage: DataPage = {size: 8, number: 1};
    dataSource = new DataSource<Category>();
    categoryForm!: FormGroup;

    constructor(private categoryService: CategoryService, private toastrService: ToastrService,
    ) {

    }

    ngOnInit(): void {
        this.createForm();
        this.dataSource.fields = [{name:"name", display:"Name",type:'text'}];
        this.fetchCategories();
    }

    private fetchCategories() {
        this.categoryService.getCategories().subscribe(resp => {
                this.dataSource.setData(resp);
            }
        );
    }


    addCategory(category: Category) {
        this.categoryService.saveCategory(category).subscribe(resp => {
            this.dataSource.onRowAdded.next(resp);
            this.successAlert();
        }, errors => this.sendErrors(category,errors));
    }


    updateCategory(category: Category) {
        this.categoryService.updateCategory(category).subscribe(resp => {
            this.dataSource.onRowUpdated.next(resp);
            this.successAlert();
        }, errors => this.sendErrors(category,errors));
    }

    removeCategory(category: Category) {
        this.categoryService.removeCategory(category.id).subscribe(() => {
                this.successAlert();
                this.dataSource.onRowRemoved.next(category);
            }
        )
    }


    sortCategories({sort, direction}: any) {
        this.dataPage.sortProperty = sort;
        this.dataPage.sortDirection = direction;
        this.fetchCategories();
    }

    private successAlert() {
        this.toastrService.success('your operation has been successful');
    }

    private createForm() {
        this.categoryForm = new FormGroup({
            id: new FormControl(null),
            name: new FormControl(null, [Validators.required]),
        });
    }
    private sendErrors(category: Category, errors: ApiError[]) {
        this.dataSource.onRowErrors.next({row:category,errors:errors});
    }
}

