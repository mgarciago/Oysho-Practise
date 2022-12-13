import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { CategoriesElements, Products } from 'src/app/core/services/products/models/products.interface';
import { ProductsService } from 'src/app/core/services/products/products.service';


@Component({
  selector: 'app-products',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  public productList!: Products[];
  public categoriesID?: string | null;
  public filter?: string;
  constructor(private ProductsService: ProductsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.categoriesID = params.get('categoryId');
      if (this.categoriesID) {
        this.getProductsList(this.categoriesID)
      }
    })
  }

  getProductsList(id: string) {
    this.ProductsService.getProductsList(id).subscribe({
      next: (result) => {
        this.productList = result;
        console.log(this.productList)
      },
      error: (error) => {
        console.log(error)
      }
    })
  }


}