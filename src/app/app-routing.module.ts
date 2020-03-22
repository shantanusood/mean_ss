import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { TutoringComponent } from './tutoring/tutoring.component';
import { FiunanceComponent } from './fiunance/fiunance.component';
import { HealthComponent } from './health/health.component';
import { DocsComponent } from './docs/docs.component';
import { ResearchComponent } from './home/research/research.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'external', component: TutoringComponent},
  {path: 'predict', component: FiunanceComponent},
  {path: 'strategy', component: HealthComponent},
  {path: 'docs', component: DocsComponent},
  {path: ':type/:id', component: ResearchComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
