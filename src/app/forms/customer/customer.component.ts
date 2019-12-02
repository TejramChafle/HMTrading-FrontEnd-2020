import { DrawService } from './../../services/draw.service';
import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from 'src/app/app.service';

@Component({
    selector: 'app-customer',
    templateUrl: './customer.component.html',
    styleUrls: ['./customer.component.css']
})

export class CustomerComponent implements OnInit {
    public loading = false;
    statuses: Array<any>;

    isEmailInvalid: Boolean = false;
    isPhoneInvalid: Boolean = false;
    isPriceInvalid: Boolean = false;

    @Input() formdata: any = {};
    @Input() agents: Array<any>;
    @Input() items: Array<any>;

    // tslint:disable-next-line: variable-name
    constructor(public _activeModal: NgbActiveModal, public _drawService: DrawService, public _appService: AppService) {
        this.statuses = [
            { id: 1, name: 'Yes' },
            { id: 0, name: 'No' }
        ];
    }

    ngOnInit() {
        if (this.formdata.customer_id) {
            this.formdata.agent_id = this.formdata.agent.customer_id;
            this.formdata.item_id = this.formdata.item.item_id;
        } else if (this._appService.agent) {
            this.formdata.agent_id = this._appService.agent.customer_id;
        }
    }

    addCustomer() {

        console.log('---------------------------------------------------------------');
        console.log(this.formdata);
        console.log('---------------------------------------------------------------');

        if (this.formdata.customer_id) {
            delete this.formdata.installment;
            delete this.formdata.item;
            delete this.formdata.agent;
            delete this.formdata.total;
            delete this.formdata.balance;
            delete this.formdata.totalInstPrice;
            this.formdata.down_payment = parseInt(this.formdata.down_payment, 10);
        }

        const phone = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;
        if (this.formdata.mobile_number && !phone.test(this.formdata.mobile_number.toLowerCase())) {
            this.isPhoneInvalid = true;
            return false;
        } else {
            this.isEmailInvalid = false;
            this.isPhoneInvalid = false;
            this.isPriceInvalid = false;
        }

        const re = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        if (this.formdata.email && !re.test(this.formdata.email.toLowerCase())) {
            this.isEmailInvalid = true;
            return false;
        } else {
            this.isEmailInvalid = false;
            this.isPhoneInvalid = false;
            this.isPriceInvalid = false;
        }


        if (this.formdata.down_payment && (isNaN(this.formdata.down_payment) || this.formdata.down_payment <= 0)) {
            this.isPriceInvalid = true;
            return false;
        } else {
            this.isEmailInvalid = false;
            this.isPhoneInvalid = false;
            this.isPriceInvalid = false;
        }

        if (this.formdata.down_payment === null) {
            delete this.formdata.down_payment;
        }

        console.log('-----------------------------------------------------------------');
        console.log('FORM DATA');
        console.log(this.formdata);
        console.log('-----------------------------------------------------------------');

        this.loading = true;
        this._drawService.addCustomer(this.formdata).subscribe(
            data => {
                console.log(data);

                this.loading = false;
                if (!isNaN(data) && !this.formdata.customer_id) {
                    this._appService.notify('Customer has been added successfully.', 'Success!');
                    this._activeModal.close(true);
                } else if (data === true && this.formdata.customer_id) {
                    this._appService.notify('Customer information updated successfully.', 'Success!');
                    this._activeModal.close(true);
                } else if (data.split(':')[0] === 'Error') {
                    this._appService.notify(data.split(':')[1], 'Error!');
                }
            },
            error => {
                this.loading = false;
                console.log(error._body);
                this._appService.notify('Unable to process your request. Duplicate entry for card number', 'Error!');
            });
    }
}
