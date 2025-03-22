import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatMenuModule,
    MatDividerModule,
    FormsModule
  ],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
  template: `
    <div class="bg-[#131921] text-white">
      <!-- Top Navigation Bar -->
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between py-2">
          <!-- Logo -->
          <a routerLink="/" class="flex items-center space-x-2">
            <mat-icon class="text-3xl">shopping_basket</mat-icon>
            <span class="text-2xl font-bold">eStore</span>
          </a>

          <!-- Search Bar -->
          <div class="flex-1 max-w-2xl mx-8">
            <div class="relative">
              <input 
                type="text" 
                placeholder="Search products..."
                class="w-full px-4 py-2 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                [@fadeInOut]
              >
              <button class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-500">
                <mat-icon>search</mat-icon>
              </button>
            </div>
          </div>

          <!-- Right Navigation Items -->
          <div class="flex items-center space-x-6">
            <ng-container *ngIf="!(isAuthenticated$ | async); else authenticatedUser">
              <a mat-button routerLink="/auth/login" 
                 class="text-white hover:text-primary-200 transition-colors">
                Sign In
              </a>
              <a mat-raised-button 
                 color="accent"
                 routerLink="/auth/register"
                 class="hidden md:inline-block">
                Start Here
              </a>
            </ng-container>

            <ng-template #authenticatedUser>
              <div class="relative group">
                <button mat-button [matMenuTriggerFor]="userMenu" 
                        class="flex items-center space-x-1 text-white hover:text-primary-200">
                  <mat-icon>account_circle</mat-icon>
                  <span class="hidden md:inline">Account & Lists</span>
                  <mat-icon>arrow_drop_down</mat-icon>
                </button>
                <mat-menu #userMenu="matMenu" class="mt-2">
                  <a mat-menu-item routerLink="/profile">
                    <mat-icon>person</mat-icon>
                    <span>Your Profile</span>
                  </a>
                  <a mat-menu-item routerLink="/orders">
                    <mat-icon>shopping_bag</mat-icon>
                    <span>Your Orders</span>
                  </a>
                  <a mat-menu-item routerLink="/wishlist">
                    <mat-icon>favorite</mat-icon>
                    <span>Your Wishlist</span>
                  </a>
                  <mat-divider></mat-divider>
                  <button mat-menu-item (click)="signOut()">
                    <mat-icon>exit_to_app</mat-icon>
                    <span>Sign Out</span>
                  </button>
                </mat-menu>
              </div>
            </ng-template>

            <!-- Cart Button -->
            <a routerLink="/cart" 
               class="flex items-center space-x-2 text-white hover:text-primary-200 transition-colors">
              <div class="relative">
                <mat-icon 
                  [matBadge]="cartItemCount$ | async" 
                  matBadgeColor="accent"
                  class="text-2xl"
                >shopping_cart</mat-icon>
              </div>
              <span class="hidden md:inline">Cart</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Categories Navigation -->
      <div class="bg-[#232f3e] py-2">
        <div class="container mx-auto px-4">
          <nav class="flex items-center space-x-6 text-sm">
            <a *ngFor="let category of categories"
               [routerLink]="['/products']"
               [queryParams]="{category: category.toLowerCase()}"
               class="text-white hover:text-primary-200 transition-colors"
               routerLinkActive="text-primary-200">
              {{category}}
            </a>
          </nav>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    .mat-badge-content {
      font-size: 10px;
      width: 18px;
      height: 18px;
      line-height: 18px;
    }
  `]
})
export class HeaderComponent {
  private cartService = inject(CartService);
  private authService = inject(AuthService);

  cartItemCount$ = this.cartService.getItemCount();
  isAuthenticated$ = this.authService.isAuthenticated();

  categories = [
    'All',
    'Electronics',
    'Fashion',
    'Books',
    'Sports',
    'Home & Kitchen',
    'Beauty',
    'Toys',
    'Automotive'
  ];

  async signOut(): Promise<void> {
    try {
      this.authService.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }
} 