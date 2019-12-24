import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { TutoringComponent } from './tutoring/tutoring.component';
import { FiunanceComponent } from './fiunance/fiunance.component';
import { HealthComponent } from './health/health.component';
import { TestComponent } from './test/test.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'education', component: TutoringComponent},
  {path: 'finance', component: FiunanceComponent},
  {path: 'health', component: HealthComponent},
  {path: 'test', component: TestComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
