import {Component, OnInit} from '@angular/core';
import {DataPage} from "../../../core/models/dataPage";
import {DataSource, Field} from "../../../shared/editable-table/editable-table.component";
import {Category} from "../../../core/models/category";
import {CategoryService} from "../../../core/services/category.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-categories-editing',
  templateUrl: './categories-editing.component.html',
  styleUrls: ['./categories-editing.component.css']
})
export class CategoriesEditingComponent implements OnInit {

  dataPage: DataPage = {size:8,number:1};
  dataSource =  new DataSource<Category>();

  constructor( private categoryService: CategoryService, private toastrService: ToastrService,
  ) {

  }

  ngOnInit(): void {
    this.dataSource.fields = [new Field("name","Name")];
    this.fetchCategories();
  }

  private fetchCategories() {
    this.categoryService.getCategories().subscribe(resp => {
      this.dataSource.data=resp;
        }
    );
  }



  addCategory(category:Category) {
    this.categoryService.saveCategory(category).subscribe(resp => {
      this.dataSource.onRowAdded.next(resp);
      this.successAlert();
    }, errors => this.dataSource.onRowErrors.next(Array.from(errors)));
  }




  updateCategory(category:Category) {
    this.categoryService.updateCategory(category).subscribe(resp => {
      this.dataSource.onRowUpdated.next(resp);
      this.successAlert();
    }, errors =>   this.dataSource.onRowErrors.next(Array.from(errors)));
  }

  removeCategory(category:Category) {
    this.categoryService.removeCategory(category.id).subscribe(() => {
          this.successAlert();
          this.dataSource.onRowRemoved.next(category);
        }
    )
  }



  sortCategorys({sort, direction}:any) {
    this.dataPage.sortProperty = sort;
    this.dataPage.sortDirection = direction;
    this.fetchCategories();
  }

  private successAlert() {
    this.toastrService.success('your operation has been successful');
  }

}

