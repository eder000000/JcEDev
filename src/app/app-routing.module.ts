import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { CatalogComponent } from './catalog/catalog.component';
import { ListProComponent } from './catalog/list-pro/list-pro.component';
import { RegisterProComponent } from './catalog/register-pro/register-pro.component';
import { HomeComponent } from './home/home.component';
import { UserTableComponent } from './user-table/user-table.component';
import { PageNotFoundComponent } from './navigation/page-not-found/page-not-found.component';
import { AuthGuard } from './auth/auth.guard';
import { EditProComponent } from './catalog/edit-pro/edit-pro.component';

const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'home', component: HomeComponent },
	{ path: 'signup', component: SignupComponent },
	{ path: 'login', component: LoginComponent, canActivate:[AuthGuard]},
	
	{ path: 'listado', component: ListProComponent },

	//Admin
	{ path: 'register', component: RegisterProComponent, canActivate:[AuthGuard] },

	// Tabla usuarios
	// TODO: Child components:
	// -/users
	// -/users/:id => View More
	// -/users/:id/edit => Edit
	{ path: 'users', component: UserTableComponent, canActivate:[AuthGuard] },

	// TODO: Cambiar a componente de editar cuando se implemente
	{ path: 'editUser/:id', component: EditProComponent, canActivate:[AuthGuard]}, 

	{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})

export class AppRoutingModule {}
