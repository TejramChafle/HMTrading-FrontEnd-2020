import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { LoanService } from 'src/app/services/loan.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoanPrintComponent } from 'src/app/components/loan-print/loan-print.component';

@Component({
    selector: 'app-installment-history',
    templateUrl: './installment-history.component.html',
    styleUrls: ['./installment-history.component.css']
})

export class InstallmentHistoryComponent implements OnInit {

    public loading = false;
    
    data: any = {};
    allowed: Boolean = false;
    account: any = {};
    customer: any = {};
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
            this.customer = JSON.parse(params['customer']);
            if (this.customer) {
                this.getInstallmentHistory(this.customer);
            }
        });
    }

    getInstallmentHistory(params) {
        this.loading = true;
        this._loanService.getInstallmentHistory(params).subscribe(
            data => {
                this.loading = false;
                // console.log(data);
                this.accounts = data.records;

                // console.log('--------------------------------------------------------');
                // console.log('INSTALLMENTS');
                // console.log(this.customer);
                // console.log('--------------------------------------------------------');
                this.data.months = 1;
                this.data.fine_paid = 0;
            },
            error => {
                this.loading = false;
                this._appService.notify('Oops! Unable to get the installment history.', 'Error!');
                // console.log('--------------------------------------------------------');
                // console.log('ERROR IN INSTALLMENTS');
                // console.log(error);
                // console.log('--------------------------------------------------------');
            });
    }


    // Previously used for showcasing the loan & saving account information
    onIdClick(accountId) {
        // console.log(accountId);
        // console.log(this.accounts);
        const result = this.accounts.find(acnt => {
            return acnt.account.account_id === accountId;
        });
        this.account = result.account;
        // console.log(this.account);
    }



    // Print the loan & saving installment history table
    print(id) {

        const popupWin = window.open('_blank');
        const printContents = document.getElementById(id).innerHTML;

        popupWin.document.open();
        popupWin.document.write(this._appService.printContentHeader + printContents + this._appService.printContentFooter);
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

        // console.log('--------------------------------------------------------');
        // console.log('params :');
        // console.log(params);
        // console.log('--------------------------------------------------------');

        this.loading = true;
        this._loanService.addLoanInstallment(params).subscribe(
            data => {
                this.loading = false;
                // console.log(data);
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
                // console.log('--------------------------------------------------------');
                // console.log('ERROR IN ADD SAVING SERVICE RESPONSE');
                // console.log(error);
                // console.log('--------------------------------------------------------');
            });
    }


    calculateEMI(account) {
        // console.log(account);
        this.account = account;
        // this.data.interest = (parseInt(this.account.balance) - parseInt(this.account.amount)) / 12;
        // this.data.principal = this.account.amount/12;
        this.data.account_type = account.account.type;
        if (account.transactions.length) {
            this.data.principal = account.transactions[account.transactions.length - 1]['balance'];

            // console.log("account.transactions[account.transactions.length - 1]['created_date'] : ", account.transactions[account.transactions.length - 1]['created_date']);
            // this.data.pending_months = (new Date().getTime())-(new Date(account.transactions[account.transactions.length - 1]['created_date']).getTime());
            this.data.pending_months = (new Date().getTime())-(new Date(account.transactions[account.transactions.length - 1]['created_date'].replace(' ', 'T')).getTime());
        } else {
            this.data.principal = account.account.amount;
            // this.data.pending_months = (new Date().getTime())-(new Date(account.account.created_date).getTime());
            this.data.pending_months = (new Date().getTime())-(new Date(account.account.created_date.replace(' ', 'T')).getTime());
        }
        this.data.pending_months = Math.floor(this.data.pending_months/(1000*60*60*24)/30);
        this.data.interest = ((parseInt(this.data.principal) * 3) / 100) * this.data.pending_months;
        this.data.interest = this.data.interest.toFixed(2);
        // this.data.principal = this.data.principal.toFixed(2);
        this.data.amount = 0;
        this.data.interest_paid = 0;
    }


    printPayment(customer, payment, transaction_id) {

        // console.log('---------------------------------------------------------');
        // console.log('PRINT RECEIPT');
        // console.log(customer);
        // console.log('---------------------------------------------------------');

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

    createLoanAccount() {
        if (!this.data.amount) {
            this.allowed = false;
            return false;
        } else {
            this.allowed = true;
        }

        // console.log(this.data.amount);

        let params = {
            customer_id: this.customer.customer_id,
            amount: this.data.amount,
            created_date: this.data.created_date
            // balance: this.data.balance
        };

        // console.log(params);

        this.loading = true;
        this._loanService.createLoanAccount(params).subscribe(
            data => {
                this.loading = false;
                if (data.split(':')[0] === 'success') {
                    this._appService.notify('Loan account created successfully.', 'Success!');
                    // Refresh the customer list
                    this.ngOnInit();
                } else {
                    this._appService.notify('Failed : ' + data.split(':')[1], 'Error!');
                }
            },
            error => {
                this.loading = false;
                this._appService.notify('Sorry, we cannot process your request.', 'Error!');
            }
        );
    }

}
