import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent implements OnInit {

  @Output() onSearch = new EventEmitter<string>(true);

  constructor() {
  }

  ngOnInit(): void {
  }

  doSearch(value: string) {
    this.onSearch.emit(value);
    // this.router.navigate(['/products'], { queryParams: { search: value} });
  }
}
