import { ThisReceiver } from '@angular/compiler';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Categories, CategoriesElements } from '../services/products/models/products.interface';
import { ProductsService } from '../services/products/products.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  allCategories: CategoriesElements[] = [];
  showCategories: boolean = false;
  constructor(private productsService: ProductsService) { }


  ngOnInit(): void {
    this.getAllCategories()
  }

  async getAllCategories() {
    await this.productsService.getCategories().subscribe({
      next: (result) => {
        this.allCategories = result;
      },
      error: (error) => {
        console.error(error)
      }
    })
  }

  showCategoriesToggle() {
    this.showCategories = !this.showCategories;
  }
}
