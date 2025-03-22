import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  email: string;
  displayName: string;
}

interface SignUpData {
  email: string;
  password: string;
  displayName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/users`;
  private currentUser = new BehaviorSubject<User | null>(null);
  private authState = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    // Check for stored user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.currentUser.next(user);
      this.authState.next(true);
    }
  }

  isAuthenticated(): Observable<boolean> {
    return this.authState.asObservable();
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser.asObservable();
  }

  async signIn(email: string, password: string): Promise<void> {
    try {
      console.log('Attempting to sign in with:', email);
      const response = await firstValueFrom(
        this.http.get<User[]>(`${this.apiUrl}?email=${email}`)
      );
      console.log('Sign in response:', response);

      const user = response?.[0];
      if (user) {
        // In a real app, we would hash the password and compare properly
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUser.next(user);
        this.authState.next(true);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      if (error instanceof HttpErrorResponse) {
        console.error('HTTP Error:', error.status, error.message);
      }
      throw error;
    }
  }

  async signUp(email: string, password: string, displayName: string): Promise<void> {
    try {
      console.log('Attempting to sign up with:', { email, displayName });
      const newUser: SignUpData = {
        email,
        password, // In a real app, we would hash the password
        displayName
      };

      const createdUser = await firstValueFrom(
        this.http.post<User>(this.apiUrl, newUser)
      );
      console.log('Created user:', createdUser);

      if (createdUser) {
        localStorage.setItem('user', JSON.stringify(createdUser));
        this.currentUser.next(createdUser);
        this.authState.next(true);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      if (error instanceof HttpErrorResponse) {
        console.error('HTTP Error:', error.status, error.message);
      }
      throw error;
    }
  }

  signOut(): void {
    localStorage.removeItem('user');
    this.currentUser.next(null);
    this.authState.next(false);
  }
} 