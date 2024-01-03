import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  serverAddress = '192.168.0.14';
  serverPort = 4001;
  private apiUrl = `http://${this.serverAddress}:${this.serverPort}/api`; 
    
  constructor(private http: HttpClient) {}

  getLatestTemperature(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/latest-temperature`); 
  }

  getLatestHearthRate(): Observable<any> { 
    return this.http.get<any>(`${this.apiUrl}/latest-hearth-rate`); 
  }

  getLatestSaturation(): Observable<any> { 
    return this.http.get<any>(`${this.apiUrl}/latest-saturation`); 
  }
}

