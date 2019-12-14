import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

import { AgentsComponent } from './pages/_draw/agents/agents.component';
import { CustomersComponent } from './pages/_draw/customers/customers.component';
import { InstallmentsComponent } from './pages/_draw/installments/installments.component';
import { ItemsComponent } from './pages/_draw/items/items.component';
import { LuckDrawComponent } from './pages/_draw/luck-draw/luck-draw.component';
import { PaymentsComponent } from './pages/_draw/payments/payments.component';
import { AddCustomerInstallmentComponent } from './pages/_draw/add-customer-installment/add-customer-installment.component';
import { SchemeComponent } from './pages/_draw/scheme/scheme.component';

import { LoanCustomersComponent } from './pages/_loan/loan-customers/loan-customers.component';
import { TransactionsComponent } from './pages/_loan/transactions/transactions.component';
import { InstallmentHistoryComponent } from './pages/_loan/installment-history/installment-history.component';
import { StatisticsComponent } from './pages/_loan/statistics/statistics.component';

import { AuthGuard } from './guards/auth.guard';
import { ConfGuard } from './guards/conf.guard';

const routes: Routes = [
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo : '/home', pathMatch : 'full' },
    { path: 'login', component: LoginComponent, canActivate: [ConfGuard] },

    // Draw
    { path: 'agents', component: AgentsComponent, canActivate: [AuthGuard] },
    { path: 'agents/:id', component: AgentsComponent, canActivate: [AuthGuard] },

    { path: 'customers', component: CustomersComponent, canActivate: [AuthGuard] },
    { path: 'customers/:id', component: CustomersComponent, canActivate: [AuthGuard] },

    { path: 'installments', component: InstallmentsComponent, canActivate: [AuthGuard] },
    { path: 'installments/:id', component: InstallmentsComponent, canActivate: [AuthGuard] },

    { path: 'items', component: ItemsComponent, canActivate: [AuthGuard] },
    { path: 'lucky-draw', component: LuckDrawComponent, canActivate: [AuthGuard] },

    { path: 'payments', component: PaymentsComponent, canActivate: [AuthGuard] },
    { path: 'payments/:id', component: PaymentsComponent, canActivate: [AuthGuard] },

    { path: 'add-installment/:id', component: AddCustomerInstallmentComponent, canActivate: [AuthGuard] },
    { path: 'scheme', component: SchemeComponent, canActivate: [AuthGuard] },

    // Loan
    { path: 'loan-customers', component: LoanCustomersComponent, canActivate: [AuthGuard] },
    { path: 'installment-history/:customer', component: InstallmentHistoryComponent, canActivate: [AuthGuard] },
    { path: 'statistics', component: StatisticsComponent, canActivate: [AuthGuard] },
    { path: 'transactions', component: TransactionsComponent, canActivate: [AuthGuard] },
    { path: 'transactions/:id', component: TransactionsComponent, canActivate: [AuthGuard] },

    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [
    HomeComponent,
    LoginComponent,

    CustomersComponent,
    InstallmentsComponent,
    AgentsComponent,
    ItemsComponent,
    LuckDrawComponent,
    PaymentsComponent,
    AddCustomerInstallmentComponent,
    SchemeComponent,

    // Loan routing
    LoanCustomersComponent,
    // AddLoanCustomersComponent,
    TransactionsComponent,
    // LoanPrintComponent,
    StatisticsComponent,
    InstallmentHistoryComponent,
    PageNotFoundComponent
]
