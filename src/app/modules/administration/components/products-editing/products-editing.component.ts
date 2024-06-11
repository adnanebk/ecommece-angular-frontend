import {Component, OnInit} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {CategoryService} from "../../../../core/services/category.service";
import {ProductService} from "../../../../core/services/product.service";
import {Product} from "../../../../core/models/product";
import {DataPage} from "../../../../core/models/dataPage";
import {saveAs} from 'file-saver';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Category} from "../../../../core/models/category";
import {ApiError, FieldError} from "../../../../core/models/api-error";
import {DataSource} from "../../../../shared/editable-table/models/data.source";


@Component({
    selector: 'app-products-editing',
    templateUrl: './products-editing.component.html',
    styleUrls: ['./products-editing.component.scss']
})
export class ProductsEditingComponent implements OnInit {
    productPage: DataPage = {size: 8, number: 1, sortProperty: 'lastUpdated', sortDirection: 'DESC'};
    dataSource = new DataSource<Product>();
    productForm!: FormGroup;
    errors: FieldError[]=[];

    constructor(private productService: ProductService, private categoryService: CategoryService, private toastrService: ToastrService,
    ) {
    }

    ngOnInit(): void {
        this.createForm();
        this.setDatasourceSchema();
        this.fetchProducts();
    }
    private setDatasourceSchema() {
        this.categoryService.getCategories().subscribe(categories => {
                this.dataSource.schema = [
                    {name: 'sku', display: 'Sku', type: 'text'},
                    {name: 'name', display: 'Name', type: 'text'},
                    {name: 'description', display: 'Description', type: 'textArea'},
                    {name: 'unitPrice', display: 'Price', type: 'decimal'},
                    {name: 'active', display: 'Enable', type: 'bool'},
                    {name: 'unitsInStock', display: 'Quantity', type: 'number'},
                    {
                        name: 'category',
                        display: 'Category',
                        type: 'select',
                        selectOptions: {displayField: 'name', valueField: 'id', options: categories}
                    },
                    {name: 'image', display: 'Image', type: 'image', fileField: 'imageFile'},
                    {name: 'dateCreated', display: 'Newest', type: 'date', readOnly: true},
                    {name: 'lastUpdated', display: 'Last updated', type: 'date', readOnly: true},

                ];
            }
        );
    }
    fetchProducts() {
        this.productService.getProductsInPage(this.productPage).subscribe(resp => {
            this.productPage.totalSize = resp.totalElements;
            this.dataSource.setData(resp.content);
        });
    }



    addProduct(product: Product) {
        this.productService.saveProduct(product).subscribe(resp => {
            this.dataSource.onRowAdded.next(resp);
            this.successAlert();
        }, error => this.sendErrors(product, error.errors));
    }


    updateProduct(product: Product) {
        this.productService.updateProduct(product).subscribe(resp => {
            this.dataSource.onRowUpdated.next(resp);
            this.successAlert();
        }, error => this.sendErrors(product, error.errors));
    }


    updateProducts($products: Product[]) {
        this.productService.updateProducts($products).subscribe(products => {
                this.dataSource.onRowsUpdated.next(products);
                this.successAlert();
            },
            ({errors}:ApiError) => {
             errors?.forEach(error=>this.sendErrors(error?.rootBean,[error]));
                
            });
    }

    removeProduct(product: Product) {
        this.productService.removeProduct(product.id).subscribe(() => {
                this.successAlert();
                this.dataSource.onRowRemoved.next(product);
            }
        )
    }

    removeAllProducts(products: Product[]) {
        this.successAlert(products.length + " items has been removed");
        this.productService.deleteProducts(products.map(pr => pr.id)).subscribe(() => {
            this.dataSource.onRowsRemoved.next(products);
            this.productPage.number++;
            this.fetchProducts();
        });
    }

    sortProducts({sort, direction}: any) {
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
                this.successAlert(products?.ADDED.length + " items has been added and " + products?.UPDATED.length + " items has been updated");
                this.dataSource.onRowsAdded.next(products?.ADDED);
                this.dataSource.onRowsUpdated.next(products?.UPDATED);
                $input.value='';
            },
            (error:ApiError) => {
            if(error?.errors?.length)
                this.errors = error?.errors;
            else 
                this.toastrService.error(error.message);
            $input.value='';
            }
        );
    }


    private createForm() {
        this.productForm = new FormGroup({
            id: new FormControl(null),
            name: new FormControl(null, [Validators.required]),
            image: new FormControl(null, [Validators.required]),
            description: new FormControl(null, [Validators.required]),
            sku: new FormControl(null, [Validators.required]),
            unitPrice: new FormControl(null, [Validators.required]),
            category: new FormControl(null, [Validators.required]),
            active: new FormControl(false),
            unitsInStock: new FormControl(null, [Validators.required]),
        });
    }

    onPage(number: number, pageSize: number) {
        this.productPage.number = number;
        this.productPage.size = pageSize;
        this.fetchProducts();
    }

    private successAlert(msg = '') {
        this.toastrService.success('your operation has been successful ' + msg);
    }

    private sendErrors(product: Product, errors: any[]) {
        if(!product)
            this.errors=errors;
        else
        this.dataSource.onRowErrors.next({row: product, errors});

        errors?.forEach(err => {
            this.productForm.setErrors({[err.fieldName]: err.message});
        }) 
    }
}


