import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { ProductService, Product, Review } from '@core/services/product.service';
import { CartService } from '@core/services/cart.service';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCardModule
  ],
  template: `
    <div class="max-w-6xl mx-auto" *ngIf="product$ | async as product">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <!-- Product Image -->
        <div class="relative">
          <img [src]="product.imageUrl" 
               [alt]="product.name"
               class="w-full rounded-lg shadow-lg">
          <div class="absolute top-4 right-4">
            <button mat-icon-button 
                    class="bg-white shadow-md"
                    (click)="toggleWishlist(product)">
              <mat-icon [class.text-red-500]="isInWishlist">favorite</mat-icon>
            </button>
          </div>
        </div>

        <!-- Product Info -->
        <div>
          <h1 class="text-3xl font-bold mb-4">{{ product.name }}</h1>
          <div class="flex items-center mb-4">
            <div class="flex text-yellow-400">
              <mat-icon *ngFor="let star of [1,2,3,4,5]"
                       [class.text-yellow-400]="star <= product.rating"
                       [class.text-gray-300]="star > product.rating">
                star
              </mat-icon>
            </div>
            <span class="ml-2 text-gray-600">
              ({{ product.reviews.length }} reviews)
            </span>
          </div>
          <p class="text-gray-600 mb-6">{{ product.description }}</p>
          <div class="flex items-center justify-between mb-6">
            <span class="text-3xl font-bold text-primary-600">
              ${{ product.price }}
            </span>
            <span class="text-gray-600">
              {{ product.stock }} in stock
            </span>
          </div>
          <div class="flex items-center gap-4">
            <mat-form-field class="w-24">
              <mat-label>Quantity</mat-label>
              <input matInput 
                     type="number" 
                     [(ngModel)]="quantity" 
                     min="1" 
                     [max]="product.stock">
            </mat-form-field>
            <button mat-raised-button 
                    color="primary"
                    class="flex-grow"
                    (click)="addToCart(product)"
                    [disabled]="product.stock === 0">
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <!-- Reviews Section -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-6">Customer Reviews</h2>
        <div class="grid gap-6">
          <mat-card *ngFor="let review of product.reviews" class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="font-semibold">{{ review.userName }}</h3>
                <div class="flex text-yellow-400">
                  <mat-icon *ngFor="let star of [1,2,3,4,5]"
                           [class.text-yellow-400]="star <= review.rating"
                           [class.text-gray-300]="star > review.rating">
                    star
                  </mat-icon>
                </div>
              </div>
              <span class="text-gray-500">
                {{ review.createdAt | date }}
              </span>
            </div>
            <p class="text-gray-600">{{ review.comment }}</p>
          </mat-card>
        </div>
      </section>
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product$!: Observable<Product>;
  quantity = 1;
  isInWishlist = false;

  ngOnInit(): void {
    this.product$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return this.productService.getProduct(id!);
      })
    );
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product, this.quantity);
    this.quantity = 1;
  }

  toggleWishlist(product: Product): void {
    this.isInWishlist = !this.isInWishlist;
    // TODO: Implement wishlist functionality
  }
} 