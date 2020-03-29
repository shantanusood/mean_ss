import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NavComponent } from './nav/nav.component';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { TutoringComponent, AutocompletePipeExtData } from './tutoring/tutoring.component';
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
import { SearchComponent, AutocompletePipeStartsWith } from './docs/search/search.component';
import { LeftpanComponent } from './docs/leftpan/leftpan.component';
import { DocpanComponent } from './docs/docpan/docpan.component';
import { IgxAutocompleteModule, IgxDropDownModule, IgxInputGroupModule } from 'igniteui-angular';
import { HomedocComponent } from './docs/docpan/homedoc/homedoc.component';
import { ExtdocComponent } from './docs/docpan/extdoc/extdoc.component';
import { StratdocComponent } from './docs/docpan/stratdoc/stratdoc.component';
import { PredictdocComponent } from './docs/docpan/predictdoc/predictdoc.component';
import { LeftComponent } from './tutoring/left/left.component';
import { MainComponent } from './tutoring/main/main.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    TutoringComponent,
    AutocompletePipeExtData,
    FiunanceComponent,
    HealthComponent,
    ResearchComponent,
    DocsComponent,
    SearchComponent,
    LeftpanComponent,
    DocpanComponent,
    AutocompletePipeStartsWith,
    HomedocComponent,
    ExtdocComponent,
    StratdocComponent,
    PredictdocComponent,
    LeftComponent,
    MainComponent
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
    BrowserAnimationsModule,
    IgxAutocompleteModule,
    IgxDropDownModule,
    IgxInputGroupModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
