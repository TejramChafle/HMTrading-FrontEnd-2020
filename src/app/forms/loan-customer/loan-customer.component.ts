import { Component, OnInit } from '@angular/core';
import { LoanService } from '../../services/loan.service';
import { AppService } from 'src/app/app.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoanPrintComponent } from '../../components/loan-print/loan-print.component';

@Component({
    selector: 'app-loan-customer',
    templateUrl: './loan-customer.component.html',
    styleUrls: ['./loan-customer.component.css']
})

export class LoanCustomerComponent implements OnInit {
    public loading = false;
    formdata: any = {};
    isEmailInvalid: Boolean = false;
    isPhoneInvalid: Boolean = false;
    isPriceInvalid: Boolean = false;

    accounts: Array<any>;

    constructor(
        public _appService: AppService,
        private _loanService: LoanService,
        private _modalService: NgbModal,
        public _activeModal: NgbActiveModal
    ) {
        this.accounts = [
            { name: 'Saving' },
            { name: 'Loan' }
        ];
        this.formdata.type = 'Saving';
        this.formdata.amount = 1000;
    }

    ngOnInit() {
    }


    addCustomer() {

        console.log('---------------------------------------------------------------');
        console.log(this.formdata);
        console.log('---------------------------------------------------------------')

        var phone = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;
        if (this.formdata.phone && !phone.test(this.formdata.phone.toLowerCase())) {
            this.isPhoneInvalid = true;
            return false;
        } else {
            this.isEmailInvalid = false;
            this.isPhoneInvalid = false;
            this.isPriceInvalid = false;
        }

        var re = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        if (this.formdata.email && !re.test(this.formdata.email.toLowerCase())) {
            this.isEmailInvalid = true;
            return false;
        } else {
            this.isEmailInvalid = false;
            this.isPhoneInvalid = false;
            this.isPriceInvalid = false;
        }


        if (this.formdata.amount && (isNaN(this.formdata.amount) || this.formdata.amount <= 0)) {
            this.isPriceInvalid = true;
            return false;
        } else {
            this.isEmailInvalid = false;
            this.isPhoneInvalid = false;
            this.isPriceInvalid = false;
        }

        if (this.formdata.amount === null) {
            delete this.formdata.amount;
        }

        console.log('-----------------------------------------------------------------');
        console.log('FORM DATA');
        console.log(this.formdata);
        console.log('-----------------------------------------------------------------');

        this.loading = true;
        this._loanService.addLoanCustomer(this.formdata).subscribe(
            data => {
                console.log(data);
                this.loading = false;
                this._activeModal.close(true);

                if (data) {
                    this._appService.notify('Customer has been added successfully.', 'Success!');
                    // Take the print of the recently added transaction if the record entered first time and amount is added
                    this.print(this.formdata, data);
                } else {
                    this._appService.notify('Customer information updated successfully.', 'Success!');
                }
            },
            error => {
                this.loading = false;
                console.log(error._body);
                this._appService.notify('Oops! Something went wrong.. Unable to process your request.', 'Error!');
            });
    }


    print(customer, result) {

        customer['customer_id'] = result['customer_id'];
        console.log('---------------------------------------------------------');
        console.log('PRINT RECEIPT');
        console.log(customer);
        console.log('---------------------------------------------------------');

        let trans = {
            transaction_id: result['transaction_id'],
            type: 'Saving',
            previous_balance: 0,
            interest_paid: 0,
            fine_paid: 0,
            balance: this.formdata.amount,
            amount: this.formdata.amount,
            total: this.formdata.amount,
            created_date: new Date()
        };

        localStorage.setItem('payment', JSON.stringify(trans));
        localStorage.setItem('customer', JSON.stringify(customer));

        // this.router.navigate(['loan-print']);
        const print = new LoanPrintComponent(this._appService, this._modalService);
        print.open(true);
    }

}
