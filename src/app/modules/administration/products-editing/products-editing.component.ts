import {Component, OnInit} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {CategoryService} from "../../../core/services/category.service";
import {ProductService} from "../../../core/services/product.service";
import {Product} from "../../../core/models/product";
import {DataSource, Field} from "../../../shared/editable-table/editable-table.component";
import {ProductPage} from "../../../core/models/productPage";
import {saveAs} from 'file-saver';
import {firstValueFrom, lastValueFrom} from "rxjs";

const fields: Field[] = [new Field('sku','Sku'), new Field('name','Name'),
    new Field('description','Description','textArea'), new Field('unitPrice','Price','decimal'),
    new Field('image','Image','image'), new Field('active','Enable','bool'),
    new Field('unitsInStock','Quantity','number'),new Field('category','Category','select'),
    new Field('dateCreated','Newest','date',true),new Field('lastUpdated','Last updated','date',true)
    ]
@Component({
  selector: 'app-products-editing',
  templateUrl: './products-editing.component.html',
  styleUrls: ['./products-editing.component.scss']
})
export class ProductsEditingComponent  implements OnInit {

  productPage: ProductPage = {pageSize:8,page:1,sort:'lastUpdated',direction:'desc'};
  dataSource =  new DataSource<Product>();

  constructor(private productService: ProductService, private categoryService: CategoryService, private toastrService: ToastrService,
  ) {

  }

  ngOnInit(): void {
    this.dataSource.fields = fields;
    this.fetchCategories();
    this.fetchProducts();
  }

  private fetchCategories() {
    this.categoryService.getProductCategories().subscribe(resp => {
            this.dataSource.nestedObjects.set('category', {valueField: 'id', displayField: 'name', options: resp});
        }
    );
  }

  fetchProducts() {
    this.productService.gePagedProducts(this.productPage).subscribe(resp => {
        this.productPage.totalSize = resp.page.totalElements;
        this.dataSource.data=resp.data;
        this.dataSource.totalSize=this.productPage.totalSize;
    });
  }

  addProduct(product:Product) {
      product.file=this.dataSource.uploadedFiles.get('image');
    this.productService.saveProduct(product).subscribe(resp => {
          this.dataSource.onRowAdded.next(resp);
           this.successAlert();
        }, errors => this.dataSource.onRowErrors.next(Array.from(errors)));
  }

  updateProduct(product:Product) {
      product.file=this.dataSource.uploadedFiles.get('image');
      this.productService.updateProduct(product).subscribe(resp => {
          this.dataSource.onRowUpdated.next(resp);
          this.successAlert();
    }, errors =>   this.dataSource.onRowErrors.next(Array.from(errors)));
  }


    updateProducts($products: Product[]) {
    this.productService.updateProducts($products).subscribe(products => {
        this.dataSource.onRowsUpdated.next(products);
            this.successAlert();
        },
        errors => Array.from(errors).length && this.toastrService.error(errors[0].message, 'Error'));
  }

  removeProduct(product:Product) {
              this.productService.removeProduct(product.id).subscribe(() => {
                  this.successAlert();
                  this.dataSource.onRowRemoved.next(product);
          }
      )
  }

  removeAllProducts($products: Product[]) {
      this.successAlert();
    this.productService.deleteProducts($products.map(pr => pr.id)).subscribe(() => {
      this.dataSource.onRowsRemoved.next($products);
      this.productPage.page++;
      this.fetchProducts();
    });
  }

  sortProducts({sort, direction}:any) {
    this.productPage.sort = sort;
    this.productPage.direction = direction;
    this.fetchProducts();
  }



   saveToExcel() {
      this.productService.downloadProductsAsExcel(this.dataSource.data).subscribe(resp => {
          const blob = new Blob([resp], {type: 'application/vnd.ms.excel'});
          const file = new File([blob], 'products-' + new Date().toLocaleDateString() + '.xlsx',
              {type: 'application/vnd.ms.excel'});
          saveAs(file);
        });
  }



    insertFromExcel(file: File) {
    this.productService.saveProductsFromExcel(file).subscribe(products => {
          this.toastrService.success('your operation has been successful');
          this.dataSource.onRowsAdded.next(products);
        },
        errors => errors[0] && this.toastrService.error(errors[0].message, 'Error')
    );
  }

    onPageChanged(pageData: {page:number,pageSize:number}) {
        this.productPage.page=pageData.page;
        this.productPage.pageSize=pageData.pageSize;
        this.fetchProducts()
    }



    private successAlert() {
        this.toastrService.success('your operation has been successful');
    }

}


