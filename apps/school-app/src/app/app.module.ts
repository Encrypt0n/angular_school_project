import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavComponent } from './shared/nav/nav.component';
import { UserComponent } from './pages/user/user.component';
import { UserDetailComponent } from './pages/user/detail/detail.component';
import { UserEditComponent } from './pages/user/edit/edit.component';
import { SubjectComponent } from './pages/subject/subject.component';
import { SubjectDetailComponent } from './pages/subject/detail/detail.component';
import { SubjectEditComponent } from './pages/subject/edit/edit.component';
import { ResultComponent } from './pages/result/result.component';
import { ResultDetailComponent } from './pages/result/detail/detail.component';
import { ResultEditComponent } from './pages/result/edit/edit.component';
import { AboutComponent } from './pages/about/about.component';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { FooterComponent } from './shared/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    UserComponent,
    UserEditComponent,
    UserDetailComponent,
    SubjectComponent,
    SubjectEditComponent,
    SubjectDetailComponent,
    ResultComponent,
    ResultEditComponent,
    ResultDetailComponent,
    AboutComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
