import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from './product.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private storageKey = 'cart_items';
  private itemCount = new BehaviorSubject<number>(0);

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {
    const savedCart = localStorage.getItem(this.storageKey);
    if (savedCart) {
      this.cartItems.next(JSON.parse(savedCart));
    }
  }

  private saveCart(items: CartItem[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    this.cartItems.next(items);
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
      this.saveCart([...currentItems]);
    } else {
      this.saveCart([...currentItems, { product, quantity }]);
    }
  }

  removeFromCart(productId: string): void {
    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.filter(item => item.product.id !== productId);
    this.saveCart(updatedItems);
  }

  updateQuantity(productId: string, quantity: number): void {
    const currentItems = this.cartItems.value;
    const itemToUpdate = currentItems.find(item => item.product.id === productId);

    if (itemToUpdate) {
      itemToUpdate.quantity = quantity;
      this.saveCart([...currentItems]);
    }
  }

  clearCart(): void {
    this.saveCart([]);
  }

  getCartTotal(): Observable<number> {
    return this.cartItems.pipe(
      map(items => items.reduce((total, item) => total + (item.product.price * item.quantity), 0))
    );
  }

  getItemCount(): Observable<number> {
    return this.itemCount.asObservable();
  }
} 