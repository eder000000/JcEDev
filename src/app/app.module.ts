import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from 'src/environments/environment';
import { PageNotFoundComponent } from './navigation/page-not-found/page-not-found.component';

import { HttpClientModule } from '@angular/common/http';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { RegisterProComponent } from './catalog/register-pro/register-pro.component';
import { ListProComponent } from './catalog/list-pro/list-pro.component';
import { ProDetailsComponent } from './catalog/pro-details/pro-details.component';
import { CatalogComponent } from './catalog/catalog.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { FooterComponent } from './navigation/footer/footer.component';
import { ContentComponent } from './navigation/content/content.component';
import { AuthService } from './auth/auth.service';
import { OficiosComponent } from './job/oficios/oficios.component';
import { FirebaseService } from './firebase/firebase.service';
import { HerokuAddressService } from './heroku-address/heroku-address.service';
import { UserTableComponent } from './user-table/user-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { AuthGuard } from './auth/auth.guard';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { UserTableDialogComponent } from './user-table/user-table-dialog/user-table-dialog.component';
import { EditProComponent } from './catalog/edit-pro/edit-pro.component';
import { FooterMainComponent } from './navigation/footer-main/footer-main.component';
import { FindAJobComponent } from './navigation/find-a-job/find-a-job.component';
import { IntroComponent } from './navigation/intro/intro.component';
import { PrivacyComponent } from './navigation/privacy/privacy.component';
import { VerifiedProfessionalsComponent } from './navigation/verified-professionals/verified-professionals.component';
import { ProfessionalCardErrorComponent } from './catalog/professional-card-error/professional-card-error.component';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		SignupComponent,
		RegisterProComponent,
		ListProComponent,
		ProDetailsComponent,
		CatalogComponent,
		HomeComponent,
		HeaderComponent,
		SidenavListComponent,
		FooterComponent,
		ContentComponent,
		OficiosComponent,
		UserTableComponent,
		PageNotFoundComponent,
		UserTableDialogComponent, 
		EditProComponent,
		FooterMainComponent,
		FindAJobComponent,
		IntroComponent,
		PrivacyComponent,
		VerifiedProfessionalsComponent,   
		EditProComponent, 
		ProfessionalCardErrorComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		MaterialModule,
		AppRoutingModule,
		FlexLayoutModule,
		AngularFirestoreModule,
		AngularFireDatabaseModule,
		AngularFireStorageModule,
		AngularFireModule.initializeApp(environment.firebaseConfig),
		HttpClientModule,
		MatTableModule,
		MatCardModule,
		MatDialogModule,
		MatButtonModule
	], 
	providers: [ AuthService, AuthGuard ],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
