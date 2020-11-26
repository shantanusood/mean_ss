import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoronaComponent } from './corona/corona.component';
import { EducationComponent } from './education/education.component';
import { HomeComponent } from './home/home.component';
import { TutoringComponent } from './tutoring/tutoring.component';
import { FiunanceComponent } from './fiunance/fiunance.component';
import { ProgressComponent } from './fiunance/progress/progress.component';
import { HealthComponent } from './health/health.component';
import { DocsComponent } from './docs/docs.component';
import { HomedocComponent } from './docs/docpan/homedoc/homedoc.component';
import { ExtdocComponent } from './docs/docpan/extdoc/extdoc.component';
import { StratdocComponent } from './docs/docpan/stratdoc/stratdoc.component';
import { PredictdocComponent } from './docs/docpan/predictdoc/predictdoc.component';
import { ResearchComponent } from './home/research/research.component';
import { TechieComponent } from './techie/techie.component';
import { AdminComponent } from './admin/admin.component';
import { SubscribeComponent } from './subscribe/subscribe.component';

const routes: Routes = [
  {path: '', component: CoronaComponent},
  {path: 'tutor', component: EducationComponent},
  {path: 'tech', component: TechieComponent},
  {path: 'explore', component: HomeComponent},
  {path: 'external', component: TutoringComponent},
  {path: 'predict', component: FiunanceComponent},
  {path: 'progress', component: ProgressComponent},
  {path: 'strategy', component: HealthComponent},
  {path: 'admin', component: AdminComponent},
  {path: 'docs', component: DocsComponent},
  {path: 'subscribe', component: SubscribeComponent},
  {path: 'docs/home', component: HomedocComponent},
  {path: 'docs/ext', component: ExtdocComponent},
  {path: 'docs/strat', component: StratdocComponent},
  {path: 'docs/predict', component: PredictdocComponent},
  {path: ':type/:id', component: ResearchComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
