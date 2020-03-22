import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NavComponent } from './nav/nav.component';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { TutoringComponent } from './tutoring/tutoring.component';
import { FiunanceComponent } from './fiunance/fiunance.component';
import { HealthComponent } from './health/health.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ResearchComponent } from './home/research/research.component';
import { DocsComponent } from './docs/docs.component';
import { SearchComponent } from './docs/search/search.component';
import { LeftpanComponent } from './docs/leftpan/leftpan.component';
import { DocpanComponent } from './docs/docpan/docpan.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    TutoringComponent,
    FiunanceComponent,
    HealthComponent,
    ResearchComponent,
    DocsComponent,
    SearchComponent,
    LeftpanComponent,
    DocpanComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatFormFieldModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
