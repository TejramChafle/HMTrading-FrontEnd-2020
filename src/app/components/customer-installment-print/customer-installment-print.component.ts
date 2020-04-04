import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-customer-installment-print',
    styleUrls: ['./customer-installment-print.component.css'],
    templateUrl: './customer-installment-print.component.html'
})

export class CustomerInstallmentPrintComponent implements OnInit, AfterViewInit {
    @Input()
    paidInstallments: any[] = [];
    agent: String;
    count: String;
    customer: any = {};
    paymentDate: any;
    total: any;
    receiptNo: any;
    billingDate: any;
    totalInWords: String;
    modalRef: any;

    constructor(public _appService: AppService, private _modalService: NgbModal) { }

    ngOnInit() {
        this.paidInstallments = JSON.parse(localStorage.getItem('printContent'));
        this.customer = JSON.parse(localStorage.getItem('customer'));
        this.agent = JSON.parse(localStorage.getItem('agent'));

        this.total = 0;
        this.paidInstallments.forEach((inst) => {
            inst.paid_fine ? inst.paid_fine : inst.paid_fine = 0;
            inst.total = parseInt(inst.amount, 10) + parseInt(inst.paid_fine, 10);
            inst.paymentDate = this._appService.GetFormattedDate(inst.paid_date);
            // this.receiptNo = inst.installment_id;
            this.receiptNo = localStorage.getItem('receipt');
            this.total = parseInt(this.total, 10) + parseInt(inst.amount, 10) + parseInt(inst.paid_fine, 10);
        });

        this.totalInWords = this._appService.inWords(this.total);
        this.totalInWords = 'Rupees ' + this._appService.capitalizeFirstLetter(this.totalInWords);

        console.log(this.paidInstallments);
        console.log(this.customer);

        let today = new Date();
        this.billingDate = this._appService.GetFormattedDate(today);
    }

    ngAfterViewInit() {
        // window.print();
    }

    open(isPrint: Boolean) {
        this.modalRef = this._modalService.open(CustomerInstallmentPrintComponent, { centered: true, size: 'lg' });
        if (isPrint) {
            setTimeout(() => {
                this.print();
                setTimeout(() => {
                    this.modalRef.close();
                }, 300);
            }, 500);
        }
    }

    print() {
        let printContents, popupWin;
        popupWin = window.open('_blank');
        printContents = document.getElementById('print-page').innerHTML;

        popupWin.document.open();
        popupWin.document.write(this._appService.printContentHeader + printContents + this._appService.printContentFooter);
        popupWin.document.close();
    }

}
