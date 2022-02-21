import {Component, OnInit} from '@angular/core';
import {Product} from '../../models/product';
import {ProductCategory} from '../../models/product-category';
import {ImageService} from '../../services/image.service';
import {saveAs} from 'file-saver';
import {ToastrService} from 'ngx-toastr';
import {Selects} from '../../Shared/editable-table/editable-table.component';
import {ProductService} from "../../services/product.service";
import {CategoryService} from "../../services/category.service";

@Component({
  selector: 'app-product-editing',
  templateUrl: './product-editing.component.html',
  styleUrls: ['./product-editing.component.css']
})
export class ProductEditingComponent implements OnInit {
  products: Product[] = [];
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
  isProductSwitched = true;
  categories: ProductCategory[];
  private SelectedProducts: Product[] = [];
  categorySelects = new Selects();


  constructor(private productService: ProductService, private categoryService: CategoryService, private imageService: ImageService,
              private toastrService: ToastrService) {

  }

  ngOnInit(): void {
    this.productFields = [...Product.fields];
    this.productHeaders = [...Product.headers];

    this.fetchProducts(this.page);
    this.categoryService.getProductCategories().subscribe(resp => {
      this.categoryNames = resp.map(c => c.name);
      this.categories = resp;
      this.categorySelects.set('category', {valueField: 'id', displayField: 'name', options: resp});
    });
  }

  fetchProducts(page?: number) {
    this.productService.gePagedProducts
    (page - 1, this.pageSize, this.sort, this.search, this.direction).subscribe(resp => {
      this.products = [...resp.data];
      this.size = resp.page.totalElements;
    });
  }

  addNewProduct() {
    this.productService.saveProduct(this.products[0]).subscribe(resp => {
        this.products[0] = {...resp};
        this.toastrService.success('your operation has been successful');

      },
      errors => Array.isArray(errors) ? this.errors = errors : this.errors = [errors]
    );
  }

  updateProduct(index: number) {
    this.productService.updateProduct(this.products[index]).subscribe(resp => {
        this.products[index] = {...resp};
        this.toastrService.success('your operation has been successful');
      },
      errors => Array.isArray(errors) ? this.errors = errors : this.errors = [errors]
    );
  }

  updateProducts($products: Product[]) {
    this.productService.updateProducts($products).subscribe(products => {
        this.toastrService.success('your operation has been successful');
        this.products = this.products.map(prod => products.find(p => p.id === prod.id) || prod);
      },
      errors => Array.isArray(errors) ? this.toastrService.error(errors[0].formattedName + ' ' + errors[0].message, 'Error')
        : this.errors = [errors]
    );
  }

  removeProduct({index, data}) {
    this.productService.removeProduct(data.id).subscribe(() => {
      this.toastrService.success('your operation has been successful');
      this.products.splice(index, 1);
    });
  }

  removeAllProducts($products: Product[]) {
    this.toastrService.success('your operation has been successful');
    this.productService.deleteProducts($products.map(pr => pr.id)).subscribe(() => {
      this.products = this.products.filter(p => !$products.includes(p));
    });
  }

  SortProduct({sort, direction}) {
    this.sort = sort;
    this.direction = direction;
    this.fetchProducts();
  }

  SearchProducts(search: string) {
    this.search = search;
    this.fetchProducts();
  }

  handleUploadImage({file, completionFunc}) {
    this.imageService.uploadImage(file).subscribe(
      (res: string) => {
        completionFunc(res, "image");
      },
      (err) => {
        this.errors = [err];
      }
    );
  }


  switchToProducts(b: boolean) {
    this.isProductSwitched = b;
    if (this.isProductSwitched) {
      this.categoryNames = this.categories.map(c => c.name);
    }
  }

  reloadData() {
    this.fetchProducts();
  }

  handleSelectedElements($products: Product[]) {
    this.SelectedProducts = $products;
  }

  saveToExcel() {
    this.productService.saveProductsToExcel(this.SelectedProducts.length > 0 ? this.SelectedProducts : this.products)
      .subscribe(resp => {
        this.toastrService.success('your operation has been successful');
        const blob = new Blob([resp], {type: 'application/vnd.ms.excel'});
        const file = new File([blob], 'products-' + new Date().toLocaleDateString() + '.xlsx',
          {type: 'application/vnd.ms.excel'});
        saveAs(file);
      });
  }

  loadFromExcel($input: HTMLInputElement) {
    this.errors = [];
    const file: File = $input.files[0];
    this.productService.saveProductsFromExcel(file).subscribe(products => {
        this.toastrService.success('your operation has been successful');
        products.forEach(p => this.products.unshift(p));
        $input.value = '';
      },
      errors => {
        $input.value = '';
        Array.isArray(errors) ? this.errors = errors : this.errors = [errors];
      }, () => $input.value = ''
    );
  }

  getNewProduct() {
    return new Product();
  }

  switchBatch(isChecked: boolean) {
    this.batchEnable = isChecked;
    this.reloadData();
  }
}
