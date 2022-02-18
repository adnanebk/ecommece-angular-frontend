import {Component, Input, OnInit} from '@angular/core';
import {ProductCategory} from '../../models/product-category';
import {CategoryService} from "../../services/category.service";

@Component({
  selector: 'app-category-editing',
  templateUrl: './category-editing.component.html',
  styleUrls: ['./category-editing.component.css']
})
export class CategoryEditingComponent implements OnInit {
  categoryFields: any[];
  categoryHeaders: any[];
  @Input() categories: ProductCategory[];
  errors: any[] = [];

  constructor(private categoryService: CategoryService) {
  }

  ngOnInit(): void {
    this.categoryFields = [...ProductCategory.fields];
    this.categoryHeaders = [...ProductCategory.headers];
  }

  handleCategoryAdded() {
    this.categoryService.saveCategory(this.categories[0]).subscribe(resp => {
        this.categories[0] = resp;
      },
      errors => Array.isArray(errors) ? this.errors = errors : this.errors = [errors]
    );
  }

  handleCategoryChanged(index: number) {
    this.categoryService.updateCategory(this.categories[index]).subscribe(resp => {
        this.categories[index] = resp;
      },
      errors => Array.isArray(errors) ? this.errors = errors : this.errors = [errors]
    );
  }

  handleCategoryDeleted({data,index}) {
    this.categoryService.removeCategory(data.id).subscribe();
    this.categories.splice(index, 1);
  }

  getNewProductCategory() {
    return new ProductCategory();
  }
}
