import {Component, Input, OnInit} from '@angular/core';
import {ProductCategory} from '../../models/product-category';
import {ActivatedRoute} from '@angular/router';
import {CategoryService} from "../../services/category.service";

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit {
  productCategories: ProductCategory[];
  params: {};
  @Input() isMenu: false;

  constructor(private categoryService: CategoryService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((paramQ) => {
      this.params = {search: paramQ.search};
    });
    this.fetchData();
  }

  fetchData() {
    this.categoryService.getProductCategories().subscribe(
      data => {
        this.productCategories = data;
      }
    );
  }
}
