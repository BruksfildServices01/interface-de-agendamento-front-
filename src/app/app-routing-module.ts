import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// =======================
// APP (INTERNO)
// =======================
import { AppointmentCreate } from './scheduling-system/appointment-create/appointment-create';
import { AppointmentList } from './scheduling-system/appointment-list/appointment-list';
import { BarberProductList } from './scheduling-system/barber-product-list/barber-product-list';
import { Clients } from './scheduling-system/clients/clients';
import { HomeMenu } from './scheduling-system/home-menu/home-menu';

// =======================
// PUBLIC
// =======================
import { PublicBooking } from './scheduling-system/public-cliente/public-booking/public-booking';

// =======================
// AUTH
// =======================
import { LoginPage } from './scheduling-system/login-page/login-page';
import { RegisterPage } from './scheduling-system/login-page/register-page/register-page';

// =======================
// LAYOUTS
// =======================
import { AppLayout } from './scheduling-system/app-layout/app-layout';
import { AuthLayout } from './scheduling-system/auth-layout/auth-layout';
import { PublicLayout } from './scheduling-system/public-layout/public-layout';

// =======================
// GUARDS
// =======================
import { AuthGuard } from './service/auth/guard';
import { NoAuthGuard } from './service/auth/no-auth.guard';

const routes: Routes = [

  // 🌍 PÚBLICO (link do barbeiro)
  {
    path: 'public',
    component: PublicLayout,
    children: [
      { path: ':slug', component: PublicBooking }
    ]
  },

  // 🔓 AUTH (login / register)
  {
    path: 'auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        component: LoginPage,
        canActivate: [NoAuthGuard],
      },
      {
        path: 'register',
        component: RegisterPage,
        canActivate: [NoAuthGuard],
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },

  // 🔒 APP INTERNO (PROTEGIDO)
  {
    path: '',
    component: AppLayout,
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomeMenu },

      // 📆 Agendamentos
      { path: 'appointments/list', component: AppointmentList },
      { path: 'appointments/create', component: AppointmentCreate },

      // ✂️ Serviços
      { path: 'barber-products', component: BarberProductList },

      // 👥 Clientes  ✅ AQUI
      { path: 'clientes', component: Clients },

      // default
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },

  // ❌ FALLBACK
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
