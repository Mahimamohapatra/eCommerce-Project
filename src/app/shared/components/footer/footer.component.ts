import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <footer class="bg-gray-900 text-white py-12">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-xl font-bold mb-4">eCommerce</h3>
            <p class="text-gray-400">
              Your one-stop shop for all your needs. Quality products, great prices, and excellent service.
            </p>
          </div>
          
          <div>
            <h4 class="text-lg font-semibold mb-4">Quick Links</h4>
            <ul class="space-y-2">
              <li>
                <a routerLink="/products" class="text-gray-400 hover:text-white transition-colors">
                  Products
                </a>
              </li>
              <li>
                <a routerLink="/categories" class="text-gray-400 hover:text-white transition-colors">
                  Categories
                </a>
              </li>
              <li>
                <a routerLink="/cart" class="text-gray-400 hover:text-white transition-colors">
                  Cart
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 class="text-lg font-semibold mb-4">Customer Service</h4>
            <ul class="space-y-2">
              <li>
                <a routerLink="/contact" class="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a routerLink="/faq" class="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a routerLink="/shipping" class="text-gray-400 hover:text-white transition-colors">
                  Shipping Information
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 class="text-lg font-semibold mb-4">Follow Us</h4>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <mat-icon>facebook</mat-icon>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <mat-icon>twitter</mat-icon>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <mat-icon>instagram</mat-icon>
              </a>
            </div>
          </div>
        </div>

        <div class="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {{currentYear}} eCommerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
} 