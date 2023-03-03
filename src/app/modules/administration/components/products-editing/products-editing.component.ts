import {Component, OnInit} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {CategoryService} from "../../../../core/services/category.service";
import {ProductService} from "../../../../core/services/product.service";
import {Product} from "../../../../core/models/product";
import {DataSource, Field} from "../../../../shared/editable-table/editable-table.component";
import {DataPage} from "../../../../core/models/dataPage";
import {saveAs} from 'file-saver';

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

  productPage: DataPage = {size:8,number:1,sortProperty:'lastUpdated',sortDirection:'DESC'};
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
    this.categoryService.getCategories().subscribe(resp => {
        this.dataSource.nestedObjects.push({property:'category',valueField: 'id', displayField: 'name', options: resp});
        }
    );
  }

  fetchProducts() {
      this.productService.getProductsInPage(this.productPage).subscribe(resp => {
        this.dataSource.totalSize=this.productPage.totalSize = resp.totalElements;
        this.dataSource.data=resp.content;
    });
  }

  addProduct(product:Product) {
      this.setProductImageFile(product);
      this.productService.saveProduct(product).subscribe(resp => {
          this.dataSource.onDataChanged.next({type:'add',data:resp});
           this.successAlert();
        }, errors => this.dataSource.onRowErrors.next(Array.from(errors)));
  }


    updateProduct(product:Product) {
      this.setProductImageFile(product);
      this.productService.updateProduct(product).subscribe(resp => {
          this.dataSource.onDataChanged.next({type:'update',data:resp});
          this.successAlert();
    }, errors =>   this.dataSource.onRowErrors.next(Array.from(errors)));
  }


    updateProducts($products: Product[]) {
    this.productService.updateProducts($products).subscribe(products => {
        this.dataSource.onDataChanged.next({type:'updateAll',data:products});
            this.successAlert();
        },
        errors => Array.from(errors).length && this.toastrService.error(errors[0].message, 'Error'));
  }

  removeProduct(product:Product) {
              this.productService.removeProduct(product.id).subscribe(() => {
                  this.successAlert();
                  this.dataSource.onDataChanged.next({type:'delete',data:product});
          }
      )
  }

  removeAllProducts(products: Product[]) {
      this.successAlert(products.length+" items has been removed");
    this.productService.deleteProducts(products.map(pr => pr.id)).subscribe(() => {
      this.dataSource.onDataChanged.next({type:'deleteAll',data:products});
      this.productPage.number++;
      this.fetchProducts();
    });
  }

  sortProducts({sort, direction}:any) {
    this.productPage.sortProperty = sort;
    this.productPage.sortDirection = direction;
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



    addOrUpdateFromExcel($input: HTMLInputElement) {
        const file: File = $input.files![0];
        this.productService.addOrUpdateProductsFromExcel(file).subscribe(products => {
                this.successAlert(products?.ADDED.length +" items has been added and "+products?.UPDATED.length+" items has been removed");
                this.dataSource.onDataChanged.next({type:'addAll',data:products?.ADDED});
                this.dataSource.onDataChanged.next({type: 'updateAll', data: products?.UPDATED});
                $input.value = '';
            },
            errors => {
                $input.value = '';
                this.toastrService.error(errors[0].message, 'Error');
            }, () => $input.value = ''
        );
    }

    private setProductImageFile(product: Product) {
        product.imageFile = this.dataSource.uploadedFiles.find(upFile => upFile.property === 'image')?.file;
    }
    onPageChanged(pageData: {page:number,pageSize:number}) {
        this.productPage.number=pageData.page;
        this.productPage.size=pageData.pageSize;
        this.fetchProducts()
    }



    private successAlert(msg='') {
        this.toastrService.success('your operation has been successful '+msg);
    }

}


