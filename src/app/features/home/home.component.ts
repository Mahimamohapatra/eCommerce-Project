import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerList', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ],
  template: `
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white" @fadeIn>
      <div class="absolute inset-0 bg-black opacity-30"></div>
      <div class="container mx-auto px-4 py-24 relative">
        <div class="max-w-3xl">
          <h1 class="text-4xl md:text-6xl font-bold mb-6">
            Discover Amazing Products
          </h1>
          <p class="text-xl md:text-2xl mb-8 text-gray-100">
            Shop the latest trends and get the best deals on your favorite items.
          </p>
          <div class="flex gap-4">
            <a routerLink="/products" 
               mat-raised-button 
               color="accent"
               class="text-lg px-8 py-3">
              Shop Now
            </a>
            <a routerLink="/categories" 
               mat-stroked-button 
               class="text-lg px-8 py-3 text-white border-white">
              Browse Categories
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Categories -->
    <section class="py-16 bg-gray-50" @fadeIn>
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-12 text-center">Shop by Category</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8" [@staggerList]="categories.length">
          <div *ngFor="let category of categories" 
               class="group cursor-pointer"
               [routerLink]="['/products']"
               [queryParams]="{category: category.slug}">
            <div class="relative rounded-lg overflow-hidden aspect-square mb-4">
              <img [src]="category.imageUrl" 
                   [alt]="category.name"
                   class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300">
              <div class="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                <span class="text-white text-xl font-semibold">{{category.name}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-16" @fadeIn>
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-12">
          <h2 class="text-3xl font-bold">Featured Products</h2>
          <a routerLink="/products" 
             mat-button 
             color="primary"
             class="text-lg">
            View All
            <mat-icon>arrow_forward</mat-icon>
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" [@staggerList]="featuredProducts.length">
          <mat-card *ngFor="let product of featuredProducts" 
                    class="group cursor-pointer hover:shadow-xl transition-shadow">
            <img [src]="product.imageUrl" 
                 [alt]="product.name"
                 class="w-full aspect-square object-cover">
            <mat-card-content class="p-4">
              <h3 class="text-xl font-semibold mb-2 group-hover:text-primary-600 transition-colors">
                {{product.name}}
              </h3>
              <p class="text-gray-600 mb-4 line-clamp-2">{{product.description}}</p>
              <div class="flex justify-between items-center">
                <span class="text-2xl font-bold text-primary-600">\${{product.price}}</span>
                <button mat-mini-fab 
                        color="primary" 
                        (click)="addToCart(product); $event.stopPropagation()"
                        class="transform group-hover:scale-110 transition-transform">
                  <mat-icon>add_shopping_cart</mat-icon>
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </section>

    <!-- Promotional Banner -->
    <section class="bg-gray-900 text-white py-16" @fadeIn>
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div class="mb-8 md:mb-0">
            <h2 class="text-3xl font-bold mb-4">Get 20% Off Your First Purchase</h2>
            <p class="text-gray-300 text-lg">Sign up for our newsletter and receive exclusive offers</p>
          </div>
          <button mat-raised-button 
                  color="accent"
                  class="text-lg px-8 py-3">
            Subscribe Now
          </button>
        </div>
      </div>
    </section>
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
export class HomeComponent implements OnInit {
  categories = [
    { name: 'Electronics', slug: 'electronics', imageUrl: 'https://picsum.photos/400/400?random=1' },
    { name: 'Fashion', slug: 'fashion', imageUrl: 'https://picsum.photos/400/400?random=2' },
    { name: 'Home & Kitchen', slug: 'home-kitchen', imageUrl: 'https://picsum.photos/400/400?random=3' },
    { name: 'Sports', slug: 'sports', imageUrl: 'https://picsum.photos/400/400?random=4' }
  ];

  featuredProducts: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadFeaturedProducts();
  }

  private loadFeaturedProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        // For demo, just show first 4 products as featured
        this.featuredProducts = products.slice(0, 4);
      },
      error: (error) => {
        console.error('Error loading featured products:', error);
      }
    });
  }

  addToCart(product: Product): void {
    // TODO: Implement add to cart functionality
    console.log('Adding to cart:', product);
  }
} 