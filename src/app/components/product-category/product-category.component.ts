import { Component, OnInit } from '@angular/core';
import {HttpService} from '../../services/http.service';
import {ProductCategory} from '../../models/product-category';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit {
   productCategories: ProductCategory[];
  params: {};
  constructor(private httpService: HttpService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe( (paramQ) => {
      this.params = {search: paramQ.search};
    } );
    this.fetchData();
  }
fetchData(){
  this.httpService.getProductCategories().subscribe(
    data => {
      this.productCategories = data;
    }
  );
}
}
