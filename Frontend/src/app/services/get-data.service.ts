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

  getLatestBodyTemperature(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/latest-body-temperature`); 
  }

  getLatestHearthRate(): Observable<any> { 
    return this.http.get<any>(`${this.apiUrl}/latest-hearth-rate`); 
  }

  getLatestBloodSaturation(): Observable<any> { 
    return this.http.get<any>(`${this.apiUrl}/latest-blood-saturation`); 
  }

  getLatestBodyWeight(): Observable<any> { 
    return this.http.get<any>(`${this.apiUrl}/latest-body-weight`); 
  }

  getLatestRespirationRate(): Observable<any> { 
    return this.http.get<any>(`${this.apiUrl}/latest-respiration-rate`); 
  }

  getLatestBloodPressure(): Observable<any> { 
    return this.http.get<any>(`${this.apiUrl}/latest-blood-pressure`); 
  }
}

