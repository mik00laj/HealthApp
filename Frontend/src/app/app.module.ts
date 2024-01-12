import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { TablesComponent } from './pages/tables/tables.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AsideComponent } from './components/aside/aside.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ChartsComponent } from './pages/charts/charts.component';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TableTemperatureComponent } from './shared/table-temperature/table-temperature.component';
import { TableSaturationComponent } from './shared/table-saturation/table-saturation.component';
import { TableHearthrateComponent } from './shared/table-hearthrate/table-hearthrate.component';
import { TableWeightComponent } from './shared/table-weight/table-weight.component';
import { TableRespirationComponent } from './shared/table-respiration/table-respiration.component';
import { TablePressureComponent } from './shared/table-pressure/table-pressure.component';
import { MapComponent } from './pages/map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    TablesComponent,
    DashboardComponent,
    AsideComponent,
    NavbarComponent,
    FooterComponent,
    ChartsComponent,
    TableTemperatureComponent,
    TableSaturationComponent,
    TableHearthrateComponent,
    TableWeightComponent,
    TableRespirationComponent,
    TablePressureComponent,
    MapComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
