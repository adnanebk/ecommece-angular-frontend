import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {Product} from '../../models/product';
import {ProductCategory} from '../../models/product-category';
import {ImageService} from '../../services/image.service';
import {saveAs} from 'file-saver';
@Component({
  selector: 'app-product-editing',
  templateUrl: './product-editing.component.html',
  styleUrls: ['./product-editing.component.css']
})
export class ProductEditingComponent implements OnInit {
  products: Product[];
  productHeaders: string[];
  productFields: any[];
  categoryNames: string[];
  pageSize = 20;
  size = 20;
  page = 1;
  sort: string;
  search = '';
  direction: string;
  errors: any[] = [];
  batchEnable: boolean;
  isProductSwitch = true;
  categories: ProductCategory[];
  hasFileUploading: boolean[] = [] ;
  private SelectedProducts: Product[] = [];



  constructor(private httpService: HttpService, private imageService: ImageService) {

  }

  ngOnInit(): void {
    this.productFields =  [...Product.fields];
    this.productHeaders = [...Product.headers];

    this.fetchProducts(this.page);
    this.httpService.getProductCategories().subscribe(resp => {
      this.categoryNames = resp.map(c => c.categoryName);
      this.categories = resp;
    });
  }
  handleDataChanged(index: number) {
    this.httpService.updateProduct(this.products[index]).subscribe(resp => {
        this.products[index] = {...resp};
      },
      errors => Array.isArray(errors) ? this.errors = errors : this.errors = [errors]
    );
  }
  handleDataAdded() {
    this.httpService.saveProduct(this.products[0]).subscribe(resp => {
        this.products[0] = {...resp};

      },
      errors => Array.isArray(errors) ? this.errors = errors : this.errors = [errors]
    );
  }

  handleDataDeleted($event: Product) {
    this.httpService.removeProduct($event.id).subscribe();
  }


  handleUploadFile($event: { file: File; index: number }) {
    this.imageService.uploadImage($event.file).subscribe(
      (res: string) => {
        this.hasFileUploading[$event.index] = false;
        if (this.products[$event.index].imageUrl !== $event.file.name)
        {
          const prod = this.products[$event.index];
          prod.imageUrl = res.toString();
          // setTimeout(() => {
          this.products[$event.index] = {...prod};
         // }, 4000);
        }


      },
      (err) => {
        this.errors = [err];
        this.hasFileUploading[$event.index] = false;
      });
  }

  getNewProduct() {
    return new Product();
  }
  fetchProducts(page?: number) {
    this.httpService.getProductList
    (page - 1, this.pageSize, this.sort, this.direction , 0, this.search).subscribe(resp => {
      this.products = [...resp.data];
      this.size = resp.page.totalElements;
    });
  }


  handleDataSorted($event: { sort: string; direction: string }) {
    this.sort = $event.sort;
    this.direction = $event.direction;
    this.fetchProducts();
  }

  handleDataSearched($event: string) {
    this.search = $event;
    this.fetchProducts();
  }

  changeProductswitch(b: boolean) {
    this.isProductSwitch = b;
    if (b) {
      this.categoryNames = this.categories.map(c => c.categoryName);
    }
  }

  handleUpdateAll($products: Product[]) {
    this.httpService.updateProducts($products).subscribe(products => {
      this.products = this.products.map(prod => {
             const pr =  products.find(p => p.id === prod.id);
             if (pr) {
               return pr;
             }
             return  prod;
      });
    },
      errors => Array.isArray(errors) ? this.errors = errors : this.errors = [errors]
    );
  }

  handleRemoveAll($products: Product[]) {
   this.httpService.deleteProducts($products.map(pr => pr.id)).subscribe(() => {
     this.products = this.products.filter( p => !$products.includes(p));
   } );
  }

  reloadData() {
    this.fetchProducts(this.page);
  }

  handleSelectedElements($products: Product[]) {
    this.SelectedProducts = $products;
  }
  saveToExcel(){
    this.httpService.saveProductsToExcel(this.SelectedProducts.length > 0 ? this.SelectedProducts : this.products)
      .subscribe(resp => {
      const blob = new Blob([resp], { type: 'application/vnd.ms.excel' }  );
      const file = new File([blob], 'products-' + new Date().toLocaleDateString()  + '.xlsx',
                                                { type: 'application/vnd.ms.excel' });
      saveAs(file);
    });
  }

  loadFromExcel($input: HTMLInputElement) {
    this.errors = [];
    const file: File = $input.files[0];
    this.httpService.saveProductsFromExcel(file).subscribe(products => {
    products.forEach(p => this.products.unshift(p));
    $input.value = '';
    },
        errors => {
          $input.value = '';
          Array.isArray(errors) ? this.errors = errors : this.errors = [errors];
        }, () => $input.value = ''
   );
}
}
