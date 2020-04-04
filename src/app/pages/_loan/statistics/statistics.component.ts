import { Component, OnInit } from '@angular/core';
// import { Router, ActivatedRoute } from '@angular/router';

import { LoanService } from 'src/app/services/loan.service';
import { AppService } from 'src/app/app.service';

@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.css']
})

export class StatisticsComponent implements OnInit {

    public loading = false;
    // statistics: Array<any>;
    items: Array<any>;
    data: any = {};
    search: Boolean = false;
    printing: Boolean = false;
    allowed: Boolean = false;
    agent: any = {};
    totalCustomers: Number;
    selectedCustomer: any;

    installments: Array<any>;
    disbursement: Array<any>;
    savings: Array<any>;
    loan: Array<any>;

    totalLoanDisbursed;
    totalSavingReceived;
    totalInstallmentReceived;
    totalInterestPaid;
    totalSavingFinePaid;
    totalLoanFinePaid;

    // Router
    sub
    id

    constructor(
        public _loanService: LoanService,
        public _appService: AppService,
        // private router: Router
        ) {
            this.data.interest = 3;
    }

    ngOnInit() {
        let params = {year: 2018};
        this.getStatistics(params);
    }

    getStatistics(params) {
        this.loading = true;
        this._loanService.getStatistics(params).subscribe(
            data => {
                this.loading = false;
                console.log(data);
                this.calculateStatistics(data);
                localStorage.setItem('statistics', JSON.stringify(data));
            },
            error => {
                this.loading = false;
                // this._appService.notify('Oops! Unable to get the statistics information.', 'Error!');
                console.log('--------------------------------------------------------');
                console.log('ERROR IN STATISTICS');
                console.log(error);
                console.log('--------------------------------------------------------');
            });
    }


    print(id) {
        this.printing = true;

        let popupWin = window.open('_blank');
        let printContents = document.getElementById(id).innerHTML;

        popupWin.document.open();
        popupWin.document.write(`
            <html>
            <head>
                <title></title>
                <!-- Bootstrap 3.0 -->
                <!-- Latest compiled and minified CSS -->
                <link rel="stylesheet" type="text/css" media='all' href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous" media="all">
                <style>
                    @media all {
                        table, td, th {
                            border: 1px gray;
                            border-collapse: collapse;
                        }

                        .bg-dark{ background-color: gray!important; color: #ebdef0 !important}
                    }
                </style>
            </head>
        <body onload="window.print();window.close()">
        <br><br>
        <div align="center">
            <b><u>H.M. TRADING</u></b><br>
            House No. 1, Behind Petrol Pump, Kandri- 441401<br>
            Pro: Pramod Ingole<br>
            Office: 8806091880, 9960566547 <br>
            Email: contact@hmtrading.biz<br>
            www.hmtrading.biz
        </div>
        <br>
        <hr>
        ${printContents}
        </body>
            </html>`
        );

        popupWin.document.close();
    }

    /* viewInstallments(id) {
        this.router.navigate(['loan-installments', id]);
    } */

    calculateStatistics(data) {
        this.disbursement = data.loan.disbursement;
        this.savings = data.loan.saving;
        this.loan = data.loan.loan;

        // Disbursment
        this.totalLoanDisbursed = 0;
        this.disbursement.forEach((data)=> {
            this.totalLoanDisbursed += parseInt(data.loan_disbursed);
        });

        // Loan
        this.totalInstallmentReceived = 0;
        this.totalInterestPaid = 0;
        this.totalLoanFinePaid = 0;
        this.loan.forEach((data)=> {
            this.totalInstallmentReceived += parseInt(data.installment_received);
            this.totalInterestPaid += parseInt(data.interest_paid);
            this.totalLoanFinePaid += parseInt(data.fine_paid);
        });

        // Savings
        this.totalSavingReceived  = 0;
        this.totalSavingFinePaid = 0;
        this.savings.forEach((data)=> {
            this.totalSavingReceived  += parseInt(data.saving_received);
            this.totalSavingFinePaid += parseInt(data.fine_paid);
        });
    }

}
