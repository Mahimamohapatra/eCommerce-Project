import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ProductService, Product } from '@core/services/product.service';
import { CartService } from '@core/services/cart.service';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule
  ],
  template: `
    <div class="mb-8">
      <div class="flex flex-col md:flex-row gap-4 mb-6">
        <mat-form-field class="w-full md:w-1/3">
          <mat-label>Search Products</mat-label>
          <input matInput 
                 type="text" 
                 [(ngModel)]="searchQuery"
                 (ngModelChange)="searchQuerySubject.next($event)"
                 placeholder="Search by name or description">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <mat-form-field class="w-full md:w-1/4">
          <mat-label>Category</mat-label>
          <mat-select [(ngModel)]="selectedCategory"
                     (ngModelChange)="selectedCategorySubject.next($event)">
            <mat-option value="">All Categories</mat-option>
            <mat-option *ngFor="let category of categories" 
                       [value]="category.id">
              {{ category.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field class="w-full md:w-1/4">
          <mat-label>Sort By</mat-label>
          <mat-select [(ngModel)]="sortBy"
                     (ngModelChange)="sortBySubject.next($event)">
            <mat-option value="name">Name</mat-option>
            <mat-option value="price_asc">Price: Low to High</mat-option>
            <mat-option value="price_desc">Price: High to Low</mat-option>
            <mat-option value="rating">Rating</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <mat-card *ngFor="let product of filteredProducts$ | async"
                class="product-card hover:shadow-lg transition-shadow">
        <img [src]="product.imageUrl"
             [alt]="product.name"
             class="w-full h-48 object-cover">
        <mat-card-content class="p-4">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-xl font-semibold">{{ product.name }}</h3>
            <span class="text-2xl font-bold text-primary-600">${{ product.price }}</span>
          </div>
          <p class="text-gray-600 mb-4">{{ product.description | slice:0:100 }}...</p>
          <div class="flex items-center mb-4">
            <div class="flex text-yellow-400">
              <mat-icon *ngFor="let star of [1,2,3,4,5]"
                       [class.text-yellow-400]="star <= product.rating"
                       [class.text-gray-300]="star > product.rating">
                star
              </mat-icon>
            </div>
            <span class="ml-2 text-gray-600">({{ product.reviews.length }} reviews)</span>
          </div>
          <div class="flex justify-between items-center">
            <a [routerLink]="['/products', product.id]"
               mat-stroked-button
               color="primary">
              View Details
            </a>
            <button mat-raised-button
                    color="primary"
                    (click)="addToCart(product)">
              Add to Cart
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  categories = [
    { id: 'electronics', name: 'Electronics' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'books', name: 'Books' },
    { id: 'home', name: 'Home & Living' }
  ];

  searchQuery = '';
  selectedCategory = '';
  sortBy = 'name';

  searchQuerySubject = new BehaviorSubject<string>('');
  selectedCategorySubject = new BehaviorSubject<string>('');
  sortBySubject = new BehaviorSubject<string>('name');

  products$!: Observable<Product[]>;
  filteredProducts$!: Observable<Product[]>;

  ngOnInit(): void {
    this.products$ = this.productService.getProducts();

    this.filteredProducts$ = combineLatest([
      this.products$,
      this.searchQuerySubject.pipe(startWith('')),
      this.selectedCategorySubject.pipe(startWith('')),
      this.sortBySubject.pipe(startWith('name'))
    ]).pipe(
      map(([products, search, category, sort]) => {
        let filtered = products;

        // Apply search filter
        if (search) {
          const searchLower = search.toLowerCase();
          filtered = filtered.filter(product =>
            product.name.toLowerCase().includes(searchLower) ||
            product.description.toLowerCase().includes(searchLower)
          );
        }

        // Apply category filter
        if (category) {
          filtered = filtered.filter(product => product.category === category);
        }

        // Apply sorting
        switch (sort) {
          case 'name':
            filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'price_asc':
            filtered = [...filtered].sort((a, b) => a.price - b.price);
            break;
          case 'price_desc':
            filtered = [...filtered].sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            filtered = [...filtered].sort((a, b) => b.rating - a.rating);
            break;
        }

        return filtered;
      })
    );
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
} 