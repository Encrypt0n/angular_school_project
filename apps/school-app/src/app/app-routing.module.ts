import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserDetailComponent } from './pages/user/detail/detail.component';
import { UserEditComponent } from './pages/user/edit/edit.component';
import { UserComponent } from './pages/user/user.component';
import { SubjectDetailComponent } from './pages/subject/detail/detail.component';
import { SubjectEditComponent } from './pages/subject/edit/edit.component';
import { SubjectComponent } from './pages/subject/subject.component';
import { ResultDetailComponent } from './pages/result/detail/detail.component';
import { ResultEditComponent } from './pages/result/edit/edit.component';
import { ResultComponent } from './pages/result/result.component';
import { AboutComponent } from './pages/about/about.component';



const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', pathMatch: 'full', component: DashboardComponent },

  { path: 'users', pathMatch: 'full', component: UserComponent },
  { path: 'users/add', pathMatch: 'full', component: UserEditComponent },
  { path: 'users/:id', pathMatch: 'full', component: UserDetailComponent },
  { path: 'users/:id/edit', pathMatch: 'full', component: UserEditComponent },

  { path: 'subjects', pathMatch: 'full', component: SubjectComponent },
  { path: 'subjects/add', pathMatch: 'full', component: SubjectEditComponent },
  { path: 'subjects/:id', pathMatch: 'full', component: SubjectDetailComponent },
  { path: 'subjects/:id/edit', pathMatch: 'full', component: SubjectEditComponent },

  { path: 'results', pathMatch: 'full', component: ResultComponent },
  { path: 'results/add', pathMatch: 'full', component: ResultEditComponent },
  { path: 'results/:studentId/:id', pathMatch: 'full', component: ResultDetailComponent },
  { path: 'results/:studentId/:id/edit', pathMatch: 'full', component: ResultEditComponent },

  { path: 'about', pathMatch: 'full', component: AboutComponent },
  
  { path: 'register', pathMatch: 'full', component: RegisterComponent },
  { path: 'login', pathMatch: 'full', component: LoginComponent },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
