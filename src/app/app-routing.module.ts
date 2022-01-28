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
import { PageNotFoundComponent } from './navigation/page-not-found/page-not-found.component';
import { RemoteDbService } from './remote-db/remote-db.service';

const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'home', component: HomeComponent },
	{ path: 'signup', component: SignupComponent },
	{ path: 'login', component: LoginComponent },
	
	{ path: 'listado/:id', component: ListProComponent,
		children: [
			{ path: '', redirectTo: 'listado', pathMatch: 'full' },
			{ path: 'detalle', component: ProDetailsComponent }
		]
	},

	//Admin
	{ path: 'register', component: RegisterProComponent },

	//Tabla usuarios
	{ path: 'users', component: UserTableComponent },
	{ path: 'editUser/:id', component: ProDetailsComponent}, //Cambiar a componente de editar cuando se implemente
	{ path: 'viewUser/:id', component: ProDetailsComponent},

	{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
