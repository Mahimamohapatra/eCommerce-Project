import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule
  ],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(50, [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ],
  template: `
    <div class="bg-gray-50 min-h-screen">
      <div class="container mx-auto px-4 py-8">
        <!-- Category Filters -->
        <div class="mb-8 flex flex-wrap gap-4">
          <button *ngFor="let category of categories"
                  mat-stroked-button
                  [color]="selectedCategory === category ? 'primary' : ''"
                  (click)="filterByCategory(category)"
                  class="hover:bg-primary-50 transition-colors">
            {{category}}
          </button>
        </div>

        <!-- Products Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" [@listAnimation]="products.length">
          <div *ngFor="let product of products" 
               class="group relative bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
               matRipple>
            <!-- Product Image -->
            <div class="relative aspect-square overflow-hidden">
              <img [src]="product.imageUrl" 
                   [alt]="product.name"
                   class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300">
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
            </div>

            <!-- Quick Actions -->
            <div class="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button mat-mini-fab color="primary" (click)="addToCart(product); $event.stopPropagation()">
                <mat-icon>add_shopping_cart</mat-icon>
              </button>
              <button mat-mini-fab color="accent" (click)="addToWishlist(product); $event.stopPropagation()">
                <mat-icon>favorite</mat-icon>
              </button>
            </div>

            <!-- Product Info -->
            <div class="p-4">
              <h3 class="text-lg font-semibold mb-2 text-gray-900 group-hover:text-primary-600 transition-colors">
                {{product.name}}
              </h3>
              <p class="text-sm text-gray-600 mb-4 line-clamp-2">{{product.description}}</p>
              
              <div class="flex items-center justify-between">
                <span class="text-2xl font-bold text-primary-600">\${{product.price}}</span>
                <div class="flex items-center text-yellow-400">
                  <mat-icon class="text-sm">star</mat-icon>
                  <mat-icon class="text-sm">star</mat-icon>
                  <mat-icon class="text-sm">star</mat-icon>
                  <mat-icon class="text-sm">star</mat-icon>
                  <mat-icon class="text-sm">star_half</mat-icon>
                </div>
              </div>

              <!-- Stock Status -->
              <div class="mt-2 text-sm" [ngClass]="product.stock > 10 ? 'text-green-600' : 'text-orange-600'">
                {{product.stock > 10 ? 'In Stock' : product.stock + ' items left'}}
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="products.length === 0" 
             class="text-center py-16">
          <mat-icon class="text-6xl text-gray-400 mb-4">inventory_2</mat-icon>
          <h3 class="text-xl font-semibold text-gray-600">No products found</h3>
          <p class="text-gray-500">Try adjusting your filters or check back later</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  categories = ['All', 'Electronics', 'Fashion', 'Books', 'Sports', 'Home & Kitchen'];
  selectedCategory: string = 'All';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    if (category === 'All') {
      this.loadProducts();
    } else {
      this.productService.getProductsByCategory(category.toLowerCase()).subscribe({
        next: (products) => {
          this.products = products;
        },
        error: (error) => {
          console.error('Error filtering products:', error);
        }
      });
    }
  }

  addToCart(product: Product): void {
    // TODO: Implement add to cart functionality
    console.log('Adding to cart:', product);
  }

  addToWishlist(product: Product): void {
    // TODO: Implement add to wishlist functionality
    console.log('Adding to wishlist:', product);
  }
} 