import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LoanService } from './../../../services/loan.service';
import { AppService } from 'src/app/app.service';

@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.css']
})

export class StatisticsComponent implements OnInit {

    public loading = false;
    statistics: Array<any>;
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

    total_loan_disbursed;
    total_saving_received
    total_installment_received
    total_interest_paid
    total_saving_fine_paid
    total_loan_fine_paid

    // Router
    sub
    id

    constructor(
        public _loanService: LoanService,
        public _appService: AppService,
        private router: Router,
        private activatedRoute: ActivatedRoute ) {
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
                this.statistics = data;

                this.disbursement = data.loan.disbursement;
                this.savings = data.loan.saving;
                this.loan = data.loan.loan;

                // Disbursment
                this.total_loan_disbursed = 0;
                this.disbursement.forEach((data)=> {
                    this.total_loan_disbursed += parseInt(data.loan_disbursed);
                });

                // Loan
                this.total_installment_received = 0;
                this.total_interest_paid = 0;
                this.total_loan_fine_paid = 0;
                this.loan.forEach((data)=> {
                    this.total_installment_received += parseInt(data.installment_received);
                    this.total_interest_paid += parseInt(data.interest_paid);
                    this.total_loan_fine_paid += parseInt(data.fine_paid);
                });

                // Savings
                this.total_saving_received  = 0;
                this.total_saving_fine_paid = 0;
                this.savings.forEach((data)=> {
                    this.total_saving_received  += parseInt(data.saving_received);
                    this.total_saving_fine_paid += parseInt(data.fine_paid);
                });

                console.log('--------------------------------------------------------');
                console.log('STATISTICS');
                console.log(this.statistics);
                console.log('--------------------------------------------------------');
            },
            error => {
                this.loading = false;
                this._appService.notify('Oops! Unable to get the statistics information.', 'Error!');
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

    viewInstallments(id) {
        this.router.navigate(['loan-installments', id]);
    }

}
