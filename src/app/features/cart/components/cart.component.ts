import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CartService } from '@core/services/cart.service';
import { Observable } from 'rxjs';
import { CartItem } from '@core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule
  ],
  template: `
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">Shopping Cart</h1>

      <ng-container *ngIf="cartItems$ | async as items">
        <div *ngIf="items.length > 0; else emptyCart">
          <!-- Cart Items -->
          <div class="space-y-4 mb-8">
            <div *ngFor="let item of items" 
                 class="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
              <img [src]="item.product.imageUrl" 
                   [alt]="item.product.name"
                   class="w-24 h-24 object-cover rounded">
              
              <div class="flex-grow">
                <h3 class="text-lg font-semibold">{{ item.product.name }}</h3>
                <p class="text-gray-600">${{ item.product.price }}</p>
              </div>

              <div class="flex items-center gap-2">
                <button mat-icon-button
                        (click)="updateQuantity(item.product.id, item.quantity - 1)"
                        [disabled]="item.quantity <= 1">
                  <mat-icon>remove</mat-icon>
                </button>
                <span class="w-8 text-center">{{ item.quantity }}</span>
                <button mat-icon-button
                        (click)="updateQuantity(item.product.id, item.quantity + 1)"
                        [disabled]="item.quantity >= item.product.stock">
                  <mat-icon>add</mat-icon>
                </button>
              </div>

              <div class="text-right min-w-[100px]">
                <div class="font-semibold">
                  ${{ item.product.price * item.quantity }}
                </div>
                <button mat-icon-button
                        color="warn"
                        (click)="removeFromCart(item.product.id)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
          </div>

          <!-- Cart Summary -->
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <div class="flex justify-between mb-4">
              <span class="text-gray-600">Subtotal</span>
              <span class="font-semibold">${{ cartTotal$ | async }}</span>
            </div>
            <div class="flex justify-between mb-4">
              <span class="text-gray-600">Shipping</span>
              <span class="font-semibold">Free</span>
            </div>
            <div class="flex justify-between mb-4 text-lg font-bold">
              <span>Total</span>
              <span>${{ cartTotal$ | async }}</span>
            </div>
            <button mat-raised-button
                    color="primary"
                    class="w-full"
                    routerLink="/checkout">
              Proceed to Checkout
            </button>
          </div>
        </div>

        <ng-template #emptyCart>
          <div class="text-center py-12">
            <mat-icon class="text-6xl text-gray-400 mb-4">shopping_cart</mat-icon>
            <h2 class="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p class="text-gray-600 mb-6">
              Add some items to your cart and they will appear here
            </p>
            <a routerLink="/products"
               mat-raised-button
               color="primary">
              Continue Shopping
            </a>
          </div>
        </ng-template>
      </ng-container>
    </div>
  `
})
export class CartComponent {
  private cartService = inject(CartService);

  cartItems$ = this.cartService.getCartItems();
  cartTotal$ = this.cartService.getCartTotal();

  updateQuantity(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeFromCart(productId: string): void {
    this.cartService.removeFromCart(productId);
  }
} 