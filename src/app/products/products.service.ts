import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {Product, Products} from '../model/product';
import {switchMap, tap} from 'rxjs/operators';

const imagePlaceholder = 'assets/product-placeholder2.png';

const productDB = [
  {
    id: 1,
    name: 'Product 1',
    description: 'Product 1 Description',
    price: 100,
    image: imagePlaceholder,
    creationDate: 1609452000000
  } as Product,
  {
    id: 2,
    name: 'Product 2',
    description: 'Product 2 Description',
    price: 100,
    image: imagePlaceholder,
    creationDate: 1609711200000
  } as Product,
  {
    id: 3,
    name: 'Product 3',
    description: 'Product 3 Description',
    price: 100,
    image: imagePlaceholder,
    creationDate: 1609884000000
  } as Product,
  {
    id: 4,
    name: 'Product 4',
    description: 'Product 4 Description',
    price: 100,
    image: imagePlaceholder,
    creationDate: 1610056800000
  } as Product,
  {
    id: 5,
    name: 'Product 5',
    description: 'Product 5 Description',
    price: 100,
    image: imagePlaceholder,
    creationDate: 1610229600000
  } as Product,
];

const localStorageProducts = 'products';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private productsSubject: BehaviorSubject<Products> = new BehaviorSubject<Products>([]);

  constructor() {
  }

  getProducts(): Observable<Products> {
    return of(this.getFromStorage() || productDB).pipe(
      tap(products => this.saveToStorage(products)),
      switchMap(() => this.productsSubject.asObservable())
    );
  }

  getProductById(id: number): Product | null {
    const products = this.getFromStorage();
    if (products?.length) {
      const index = products.findIndex(p => p.id === id);
      return products[index];
    } else {
      return null;
    }
  }

  deleteProduct(product: Product): void {
    const products = this.getFromStorage();
    if (products?.length) {
      const index = products.findIndex(p => p.id === product.id);
      products.splice(index, 1);
      this.saveToStorage(products);
    }
  }

  saveProduct(product: Product): void {
    const products = this.getFromStorage();
    if (products?.length) {
      const index = products.findIndex(p => p.id === product.id);
      const productToSave = {...products[index]};
      products[index] = {...products[index], name: product.name, description: product.description, price: product.price};
      this.saveToStorage(products);
    }
  }

  addProduct(product: Product): Product {
    let products = this.getFromStorage();
    if (!products) {
      products = [];
    }
    product.id = this.getNextId(products);
    product.creationDate = (new Date()).valueOf();
    product.image = imagePlaceholder;
    products.push(product);
    this.saveToStorage(products);
    return product;
  }

  sortProducts(sortByProperty: string): void {
    let products = this.getFromStorage();
    if (products?.length) {
      products = products.sort((a: any, b: any) => (a[sortByProperty] > b[sortByProperty]) ? 1 : ((b[sortByProperty] > a[sortByProperty]) ? -1 : 0));
      this.saveToStorage(products);
    }
  }

  private getFromStorage(): Products | null {
    const storedProducts = localStorage.getItem(localStorageProducts);
    return storedProducts ? (JSON.parse(storedProducts) as Products) : null;
  }

  private saveToStorage(products: Products): void {
    localStorage.setItem(localStorageProducts, JSON.stringify(products));
    this.productsSubject.next(products);
  }

  private getNextId(products: Products): number {
    return (products.sort((a: any, b: any) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))[products.length - 1]).id + 1;
  }
}
