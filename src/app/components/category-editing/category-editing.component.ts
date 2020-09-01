import {Component, Input, OnInit} from '@angular/core';
import {ProductCategory} from '../../models/product-category';
import {HttpService} from '../../services/http.service';

@Component({
  selector: 'app-category-editing',
  templateUrl: './category-editing.component.html',
  styleUrls: ['./category-editing.component.css']
})
export class CategoryEditingComponent implements OnInit {
  categoryFields: any[];
  categoryHeaders: any[];
  categoryNames: string[];
  @Input() categories: ProductCategory[];
  errors: any[];
  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.categoryFields =  [...ProductCategory.fields];
    this.categoryHeaders = [...ProductCategory.headers];
  }

  handleCategoryAdded() {
    this.errors = [];
    this.httpService.saveCategory(this.categories[0]).subscribe(resp => {
      this.categories[0] = {...resp};
      },
      errors => Array.isArray(errors) ? this.errors = errors : this.errors.push(errors)
    );
  }
  handleCategoryChanged(index: number) {
    this.errors = [];
    this.httpService.updateCategory(this.categories[index]).subscribe(resp => {
      this.categories[index] = {...resp};
      },
      errors => Array.isArray(errors) ? this.errors = errors : this.errors.push(errors)
    );
  }

  handleCategoryDeleted($event: ProductCategory) {
    this.errors = [];
    this.httpService.removeCategory($event.id).subscribe();
  }
  getNewProductCategory() {
    return new ProductCategory();
  }
}
