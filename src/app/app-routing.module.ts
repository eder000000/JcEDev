import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { CatalogComponent } from './catalog/catalog.component';
import { ListProComponent } from './catalog/list-pro/list-pro.component';
import { ProDetailsComponent } from './catalog/pro-details/pro-details.component';
import { RegisterProComponent } from './catalog/register-pro/register-pro.component';
import { HomeComponent } from './home/home.component';
import { UserTableComponent } from './user-table/user-table.component';

const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'home', component: HomeComponent },
	{ path: 'signup', component: SignupComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'catalog', component: CatalogComponent },
	{ path: 'register', component: RegisterProComponent },
	{ path: 'listado', component: ListProComponent },
	{ path: 'detalle', component: ProDetailsComponent },
	{ path: 'users', component: UserTableComponent }
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
