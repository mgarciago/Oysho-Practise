import { Injectable } from '@angular/core';
import { ApiProductsService } from './api/api-products.service';
import { ApiCategories, ApiList, ApiProducts } from './api/models/api-products.interface';
import { Products, CategoriesElements, ImageKind, ImageSize, ImageUrlOptions, ProductDetails } from './models/products.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';



@Injectable({
  providedIn: 'root',
})
export class ProductsService {

  constructor(private apiProductsService: ApiProductsService) { }

  getCategories(): Observable<CategoriesElements[]> {
    return this.apiProductsService.getCategories().pipe(
      map((ApiCategories) => {
        return ApiCategories.categories.map((category) => ({
          id: category.id,
          name: category.name,
          nameEn: category.nameEn,
          description: category.description,
        }))
      })
    )
  }

  getProductsList(id: string): Observable<Products[]> {
    return this.apiProductsService.getList(id).pipe(
      map((ApiList) => {
        return ApiList.products.filter((product) => {
          return product.name !== '';
        })
          .map((product) => ({
            id: product.id,
            name: product.name,
            nameEn: product.nameEn,
            image: this.getProductImages(product),
            longDescription: product.bundleProductSummaries[0]?.detail?.longDescription,
            price: product.bundleProductSummaries[0]?.detail?.colors[0]?.sizes[0]?.price,
            formattedPrice: this.getPrices(product),
            color: this.getColors(product)
          }))
      })
    )
  }

  getProductImages(product: ApiProducts) {
    const imageArray: string[] = [];
    product?.bundleProductSummaries[0]?.detail?.colors?.forEach((color) => {
      imageArray.push(this.getImageURL(color.image, { kind: 2, size: 1 }));
    });
    return imageArray;
  }

  getColors(product: ApiProducts) {
    const colorArray: string[] = [];
    product?.bundleProductSummaries[0]?.detail?.colors?.forEach((color) => {
      colorArray.push(this.getImageURL(color.image, { kind: ImageKind.color, size: ImageSize.small }));
    });
    return colorArray;
  }

  getImageURL(
    image: any,
    { kind = ImageKind.modelZoom, size = ImageSize.large }: ImageUrlOptions = {}
  ): string {
    return `${environment.imageBaseUrl}${image.url}_${kind}_1_${size}.jpg?t=${image.timestamp}`;
  }

  getPrices(product: ApiProducts) {
    let pricesFormatted: string = "";
    product?.bundleProductSummaries[0]?.detail?.colors?.forEach((color) => {
      color.sizes.forEach((size) => {
        pricesFormatted = this.insertDecimal(Number(size.price))
      });
    });
    return pricesFormatted;
  }

  insertDecimal(number: number) {
    return Number((number / 100).toFixed(2)).toString();
  }

  getProductDetails(categoryId: string, productId: string): Observable<ProductDetails> {
    return this.apiProductsService.getDetails(categoryId, productId).pipe(
      map((ApiProducts) => ({
        id: ApiProducts.id,
        name: ApiProducts.name,
        nameEn: ApiProducts.nameEn,
        image: this.getProductImages(ApiProducts),
        longDescription: ApiProducts.bundleProductSummaries[0]?.detail?.longDescription,
        price: ApiProducts.bundleProductSummaries[0]?.detail?.colors[0]?.sizes[0]?.price,
        formattedPrice: this.getPrices(ApiProducts),
        color: this.getColors(ApiProducts),
      }))
    )
  }

}
