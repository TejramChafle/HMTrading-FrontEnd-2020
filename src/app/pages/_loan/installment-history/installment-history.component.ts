import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { LoanService } from './../../../services/loan.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoanPrintComponent } from '../../../components/loan-print/loan-print.component';

@Component({
    selector: 'app-installment-history',
    templateUrl: './installment-history.component.html',
    styleUrls: ['./installment-history.component.css']
})

export class InstallmentHistoryComponent implements OnInit {

    public loading = false;

    items: Array<any>;
    data: any = {};
    search: Boolean = false;
    printing: Boolean = false;
    allowed: Boolean = false;
    addInterest: Boolean = false;

    account: any = {};
    customer: any = {};
    totalCustomers: Number;
    selectedCustomer: any;

    installments: Array<any>;
    paidInstallments: Array<any>;
    selectedInstallments: Array<any>;
    pendingInstallments: Array<any>;
    records: Array<any>;
    accounts: Array<any>;
    // Router
    sub

    constructor(
        public _loanService: LoanService, public _appService: AppService, private _modalService: NgbModal,
        private router: Router,
        private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.sub = this.activatedRoute.params.subscribe(params => {
            console.log(params);
            this.customer = JSON.parse(params['customer']);
            console.log(this.customer);
            if (this.customer) {
                console.log('Get all the installments of : ' + this.customer);
                this.printing = true;
                this.getInstallmentHistory(this.customer);
            }
        });
    }

    getInstallmentHistory(params) {
        this.loading = true;
        this._loanService.getInstallmentHistory(params).subscribe(
            data => {
                this.loading = false;
                console.log(data);
                this.accounts = data.records;

                console.log('--------------------------------------------------------');
                console.log('INSTALLMENTS');
                console.log(this.customer);
                console.log(this.records);
                console.log('--------------------------------------------------------');
                this.data.months = 1;
                this.data.fine_paid = 0;
            },
            error => {
                this.loading = false;
                this._appService.notify('Oops! Unable to get the installment history.', 'Error!');
                console.log('--------------------------------------------------------');
                console.log('ERROR IN INSTALLMENTS');
                console.log(error);
                console.log('--------------------------------------------------------');
            });
    }


    // Previously used for showcasing the loan & saving account information
    onIdClick(accountId) {
        console.log(accountId);
        console.log(this.accounts);
        const result = this.accounts.find(acnt => {
            return acnt.account.account_id === accountId;
        });
        this.account = result.account;
        console.log(this.account);
    }



    // Print the loan & saving installment history table
    print(id) {
        this.printing = true;

        const popupWin = window.open('_blank');
        const printContents = document.getElementById(id).innerHTML;

        popupWin.document.open();
        popupWin.document.write(`
        <html>
            <head>
                <title></title>
                <!-- Bootstrap 3.0 -->
                <!-- Latest compiled and minified CSS -->
                <!-- Latest compiled and minified CSS -->
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
                <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
                <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
                <style>
                    @media all {
                        table, td, th {
                            border: 1px gray;
                            border-collapse: collapse;
                        }

                        /* Print Page CSS */
                        .print-footer, .print-header {
                            border: 1px solid #76d7c4;
                        }

                        .header-trapezoid {
                            border-bottom: 175px solid #76d7c4;
                            height: 175px;
                            border-left: 60px solid transparent;
                            width: 50%;
                            display: inline-block;
                            color: white;
                        }

                        .header-trapezoid > h1 {
                            line-height: 175px;
                        }

                        .footer-trapezoid {
                            border-bottom: 60px solid #76d7c4;
                            height: 60px;
                            border-left: 25px solid transparent;
                            width: 50%;
                            display: inline-block;
                            color: white;
                        }

                        .footer-trapezoid > p {
                            color: white;
                            line-height: 50px;
                        }

                        .print-terms {
                            padding-left: 15px;
                            width: 50%;
                            height: 60px;
                            text-align: left;
                            word-wrap: break-word;
                            display: inline-block;
                        }

                        .biller-info {
                            padding: 5px 0 0 15px;
                            width: 50%;
                            height: 175px;
                            text-align: left;
                            word-wrap: break-word;
                            display: inline-block;
                        }
                    }
                </style>
            </head>
            <body onload="window.print();window.close()">
            <div class="print-header">
                <div class="biller-info">
                    <h3>H.M. TRADING</h3>
                    House No. 1, Behind Petrol Pump, Kandri- 441401<br>
                    Pro: Pramod Ingole<br>
                    Office: 8806091880, 9960566547 <br>
                    Email: contact@hmtrading.biz<br>
                    www.hmtrading.biz
                </div>
                <div class="header-trapezoid text-center" style="float:right">
                    <h1>INVOICE</h1>
                </div>
            </div>
            <br>
            ${printContents}
            <div class="print-footer">
                <div class="print-terms" align="right">
                <small><b>Terms & Condititions</b><br>Late installment payment may impose the fine amount of Rs.5/- for each month.</small>
                </div>
                <div class="footer-trapezoid text-center" align="center" style="float:right">
                    <p>Thank you for your business</p>
                </div>
            </div>
            </body>
        </html>`
        );
        popupWin.document.close();
    }


    addInstallment() {

        let params = {
            account_id: this.account.account.account_id,
            customer_id: this.customer.customer_id,
            amount: this.data.amount ? this.data.amount : 0,
            interest_paid: this.data.interest_paid ? this.data.interest_paid : 0,
            fine_paid: this.data.fine_paid ? this.data.fine_paid : 0,
            balance: 0,
            type: this.account.account.type
        };

        if (this.account.account.type == 'Loan') {
            this.account.transactions.length ?
                params.balance = this.account.transactions[this.account.transactions.length - 1]['balance'] :
                params.balance = this.account.account.amount;
        } else {
            this.account.transactions.length ?
                params.balance = this.account.transactions[this.account.transactions.length - 1]['balance'] :
                params.balance = 0;
        }

        console.log('--------------------------------------------------------');
        console.log('params :');
        console.log(params);
        console.log('--------------------------------------------------------');

        this.loading = true;
        this._loanService.addLoanInstallment(params).subscribe(
            data => {
                this.loading = false;
                console.log(data);
                if (this.data.account == 'Saving') {
                    this._appService.notify('Saving amount added successfully');
                } else {
                    this._appService.notify('Loan installment amount added successfully');
                }

                this.ngOnInit();


                // Now print the payment
                params['previous_balance'] = params['balance'];
                if (this.account.account.type == 'Loan') {
                    this.account.transactions.length ?
                        params.balance = parseInt(this.account.transactions[this.account.transactions.length - 1]['balance']) - parseInt(this.data.amount) :
                        params.balance = parseInt(this.account.account.amount) - parseInt(this.data.amount);
                } else {
                    this.account.transactions.length ?
                        params.balance = parseInt(this.account.transactions[this.account.transactions.length - 1]['balance']) + parseInt(this.data.amount) :
                        params.balance = this.data.amount;
                }
                this.printPayment(this.customer, params, data);
            },
            error => {
                this.loading = false;
                this._appService.notify('Oops! Unable to process your request.');
                console.log('--------------------------------------------------------');
                console.log('ERROR IN ADD SAVING SERVICE RESPONSE');
                console.log(error);
                console.log('--------------------------------------------------------');
            });
    }


    calculateEMI(account) {
        console.log(account);
        this.account = account;
        // this.data.interest = (parseInt(this.account.balance) - parseInt(this.account.amount)) / 12;
        // this.data.principal = this.account.amount/12;
        this.data.account_type = account.account.type;
        if (account.transactions.length) {
            this.data.principal = account.transactions[account.transactions.length - 1]['balance'];
        } else {
            this.data.principal = account.account.amount;
        }

        this.data.interest = (parseInt(this.data.principal) * 3) / 100;

        console.log(this.data.principal);
        this.data.interest = this.data.interest.toFixed(2);
        // this.data.principal = this.data.principal.toFixed(2);
        this.data.amount = 0;
        this.data.interest_paid = 0;
    }


    printPayment(customer, payment, transaction_id) {

        console.log('---------------------------------------------------------');
        console.log('PRINT RECEIPT');
        console.log(customer);
        console.log('---------------------------------------------------------');

        let trans = {
            transaction_id: transaction_id,
            type: payment['type'],
            previous_balance: payment['previous_balance'],
            fine_paid: payment['fine_paid'],
            interest_paid: payment['interest_paid'],
            balance: payment['balance'],
            amount: payment['amount'],
            total: parseInt(payment['amount']) + parseInt(payment['fine_paid']) + parseInt(payment['interest_paid']),
            created_date: new Date()
        };

        localStorage.setItem('payment', JSON.stringify(trans));
        localStorage.setItem('customer', JSON.stringify(customer));

        // this.router.navigate(['loan-print']);
        const print = new LoanPrintComponent(this._appService, this._modalService);
        print.open(true);
    }

}
