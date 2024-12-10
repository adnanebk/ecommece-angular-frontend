import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {CategoryService} from "../../../../core/services/category.service";
import {ProductService} from "../../../../core/services/product.service";
import {Product} from "../../../../core/models/product";
import {DataPage} from "../../../../core/models/dataPage";
import {saveAs} from 'file-saver';
import {FormControl, Validators} from "@angular/forms";
import {Category} from "../../../../core/models/category";
import {ApiError, FieldError} from "../../../../core/models/api-error";
import {DataSource} from "../../../../shared/editable-table/models/data.source";
import {Schema} from 'src/app/shared/editable-table/models/schema';
import {forkJoin} from 'rxjs';
import {Images} from "../../../../shared/editable-table/editable-table.component";
import {MatDialog} from "@angular/material/dialog";
import {CdkDragRelease, moveItemInArray} from "@angular/cdk/drag-drop";


@Component({
    selector: 'app-products-editing',
    templateUrl: './products-editing.component.html',
    styleUrls: ['./products-editing.component.scss']
})
export class ProductsEditingComponent implements OnInit {
    productPage: DataPage = {size: 8, number: 1, sortProperty: 'lastUpdated', sortDirection: 'DESC'};
    dataSource!: DataSource<Product>;
    errors: FieldError[] = [];
    selectedImages: string[] = [];
    ImagesProductId?: number;
    @ViewChild('zoomedImagesCont') zoomedImagesModal!: TemplateRef<any>;


    constructor(private productService: ProductService, private categoryService: CategoryService, private toastrService: ToastrService,
                public dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.setDatasource();
    }

    private setDatasource() {
        forkJoin([this.categoryService.getCategories(), this.productService.getProductsInPage(this.productPage)])
            .subscribe(([categories, products]) => {
                this.productPage.totalSize = products.totalElements;
                this.dataSource = new DataSource<Product>(this.createSchema(categories), products.content);
            });
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
        this.errors = [];
        this.productService.updateProducts($products).subscribe(products => {
                this.dataSource.onRowsUpdated.next(products);
                this.successAlert();
            },
            ({errors}: ApiError) => {
                errors?.forEach(error => this.sendErrors(error?.rootBean, [error]));

            });
    }

    removeProduct(product: Product) {
        this.productService.removeProduct(product.id).subscribe(() => {
                this.successAlert();
                this.dataSource.onRowRemoved.next(product);
            }
        )
    }

    removeProducts(products: Product[]) {
        this.successAlert(products.length + " items has been removed");
        this.productService.deleteProducts(products.map(pr => pr.id)).subscribe(() => {
            this.dataSource.onRowsRemoved.next(products);
        });
    }

    sortProducts({sort, direction}: any) {
        this.productPage.number = 1;
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
            },
            (error: ApiError) => {
                if (error?.errors?.length)
                    this.errors = error?.errors;
                else
                    this.toastrService.error(error.message);
            }
        );
    }

    onPage(number: number, pageSize: number) {
        this.productPage.number = number;
        this.productPage.size = pageSize;
        this.fetchProducts();
    }

    private createSchema(categories: Category[]): Schema[] {
        return [
            {name: 'sku', display: 'Sku', type: 'text', formControl: new FormControl(null, [Validators.required])},
            {name: 'name', display: 'Name', type: 'text', formControl: new FormControl(null, [Validators.required])},
            {
                name: 'description',
                display: 'Description',
                type: 'textArea',
                formControl: new FormControl(null, [Validators.required, Validators.minLength(10)])
            },
            {
                name: 'unitPrice',
                display: 'Price',
                type: 'decimal',
                formControl: new FormControl(null, [Validators.required, Validators.pattern(/^-?\d*[.,]?\d{0,2}$/)])
            },
            {
                name: 'unitsInStock',
                display: 'Quantity',
                type: 'number',
                formControl: new FormControl(1, [Validators.required, Validators.pattern(/^\d+$/)])
            },
            {
                name: 'category',
                display: 'Category',
                type: 'select',
                selectOptions: {displayField: 'name', valueField: 'id', options: categories},
                formControl: new FormControl(null, [Validators.required])
            },
            {
                name: 'images',
                display: 'Images',
                type: 'image',
                fileField: 'imageFile',
                formControl: new FormControl(null, [Validators.required])
            },
            {name: 'active', display: 'Enable', type: 'bool', formControl: new FormControl(false)},
            {name: 'dateCreated', display: 'Newest', type: 'date', readOnly: true, formControl: new FormControl(null)},
            {
                name: 'lastUpdated',
                display: 'Last updated',
                type: 'date',
                readOnly: true,
                formControl: new FormControl(null)
            },

        ];
    }

    private successAlert(msg = '') {
        this.toastrService.success('your operation has been successful ' + msg);
    }

    private sendErrors(product: Product, errors: FieldError[]) {
        if (!product)
            this.errors = errors;
        else {
            this.dataSource.onRowErrors.next({row: product, errors});
        }
    }

    onImageClicked({itemId, urls}: Images) {
        this.ImagesProductId = itemId;
        this.selectedImages = urls;
        this.dialog.open(this.zoomedImagesModal, {
            width: '400px', height: '400px'
        });
    }

    uploadFile(input: HTMLInputElement) {
        if (!input?.files?.length)
            return;
        const file = input.files[0];
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            let tempUrl = event.target?.result as string ;
            this.selectedImages.push(tempUrl);
            const index = this.selectedImages.length-1;
            this.productService.addImage(file, this.ImagesProductId!).subscribe({
                next:(image)=> {
                    this.selectedImages.splice(index, 1, image.url);
                    this.toastrService.success("images has been successfully updated");
                },
                error:()=>this.selectedImages=this.selectedImages.filter(url=>url!=tempUrl)
            })
        });
        reader.readAsDataURL(file);
    }

    removeImage(image: string) {
        this.selectedImages = this.selectedImages.filter(img => image != img);
        this.productService.updateImages(this.selectedImages, this.ImagesProductId!).subscribe(() => {
            const product = this.dataSource.data.find(product => product.id == this.ImagesProductId);
            product!.images = this.selectedImages;
            this.toastrService.success("images has been successfully updated")
        });
    }

    trackByIndex(i: any, item: any): string {
        return i;
    }

    dropImage($event: CdkDragRelease, startIndex:number) {
        const targetImageUrl = ($event.event.target as HTMLElement).getAttribute('src');
        const endIndex = this.selectedImages.findIndex(img=>img===targetImageUrl);
        moveItemInArray(this.selectedImages, startIndex, endIndex);
        this.productService.updateImages(this.selectedImages, this.ImagesProductId!).subscribe(()=> this.toastrService.success("images has been successfully updated"))
    }
}


