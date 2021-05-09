import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';

import {ProductsService} from './products.service';
import {Product, Products} from '../model/product';
import {Data, Router} from '@angular/router';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products$!: Observable<Products>;
  sortByControl!: FormControl;

  constructor(private productsService: ProductsService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.products$ = this.productsService.getProducts();
    this.sortByControl = new FormControl('');
    this.sortByControl.valueChanges.subscribe((val) => this.productsService.sortProducts(val));
  }

  deleteProduct(product: Product): void {
    this.productsService.deleteProduct(product);
  }

  displayProductDetails(product: Product): void {
    console.log('product', product);
    this.router.navigate([`/products/${product.id}`]);
  }
}
