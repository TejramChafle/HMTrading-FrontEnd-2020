import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxLoadingModule } from 'ngx-loading';

import { AppRoutingModule } from './app-routing.module';
import { routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// reusable dialog components import
import { CustomerComponent } from './forms/customer/customer.component';
import { ItemComponent } from './forms/item/item.component';
import { AgentComponent } from './forms/agent/agent.component';
import { LoanCustomerComponent } from './forms/loan-customer/loan-customer.component';
import { DrawSchemeComponent } from './forms/draw-scheme/draw-scheme.component';

import { AlertComponent } from './components/alert/alert.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { PrintComponent } from './components/print/print.component';
import { LoanPrintComponent } from './components/loan-print/loan-print.component';
import { CustomerInstallmentPrintComponent } from './components/customer-installment-print/customer-installment-print.component';
import { DrawCustomersPrintComponent } from './components/draw-customers-print/draw-customers-print.component';
import { DrawAgentCustomerPrintComponent } from './components/draw-agent-customer-print/draw-agent-customer-print.component';

@NgModule({
    declarations: [
        AppComponent,
        CustomerComponent,
        ItemComponent,
        AgentComponent,
        LoanCustomerComponent,
        AlertComponent,
        ConfirmComponent,
        PrintComponent,
        routingComponents,
        LoanPrintComponent,
        CustomerInstallmentPrintComponent,
        DrawCustomersPrintComponent,
        DrawAgentCustomerPrintComponent,
        DrawSchemeComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        NgbModule,
        NgxLoadingModule
    ],
    entryComponents: [
        CustomerComponent,
        ItemComponent,
        AgentComponent,
        LoanCustomerComponent,
        AlertComponent,
        ConfirmComponent,
        PrintComponent,
        LoanPrintComponent,
        CustomerInstallmentPrintComponent,
        DrawCustomersPrintComponent,
        DrawAgentCustomerPrintComponent,
        DrawSchemeComponent
    ],
    providers: [NgbActiveModal],
    bootstrap: [AppComponent]
})
export class AppModule { }
