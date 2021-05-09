import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductsService} from '../products.service';
import {Product} from '../../model/product';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private productService: ProductsService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30)]],
      description: ['', Validators.maxLength(200)],
      price: ['', Validators.required],
      creationDate: [''],
      id: [''],
      image: ['']
    });

    this.route.paramMap.subscribe(params => {
      const id = parseInt(params.get('id') || '');
      if (id !== 0) {
        const product = this.productService.getProductById(id);
        console.log('patch', product);
        this.form.patchValue(product as Product);
      } else {
        this.form.reset();
      }
    });
  }

  submit(): void {
    if (this.form.controls.id.value === null) {
      const newProduct = this.productService.addProduct(this.form.getRawValue());
      this.router.navigate([`/products/${newProduct.id}`]);
    } else {
      this.productService.saveProduct(this.form.getRawValue());
    }
  }
}
