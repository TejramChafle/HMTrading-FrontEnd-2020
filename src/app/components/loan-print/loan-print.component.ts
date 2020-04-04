import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-loan-print',
    templateUrl: './loan-print.component.html',
})

export class LoanPrintComponent implements OnInit, AfterViewInit {

    @Input()
    paidInstallments: any[] = [];
    installments: any[] = [];
    // paidInstallments: Array<any>;
    agent: String;
    count: String;
    totalPaid: any;
    // inst = {};
    inst: any = {};
    account = {};
    receiptNo: String;
    total: any;
    billingDate: any;
    customer: any;
    totalInWords: String;
    isAgentPrint: Boolean = false;
    modalRef: any;

    constructor(public _appService: AppService, private _modalService: NgbModal) {}

    ngOnInit() {
        this.totalPaid = 0;
        this.inst       = JSON.parse(localStorage.getItem('payment'));
        this.customer   = JSON.parse(localStorage.getItem('customer'));
        this.account    = JSON.parse(localStorage.getItem('account'));
        this.receiptNo = this.inst['transaction_id'];


        let today = new Date(this.inst['created_date'].replace(' ', 'T'));
        this.billingDate = this._appService.GetFormattedDate(today);

        this.totalPaid = this.inst['total'];
        this.totalInWords = this._appService.inWords(this.totalPaid);
        this.totalInWords = 'Rupees ' + this._appService.capitalizeFirstLetter(this.totalInWords);

        console.log('---------------------------------------------------------------------');
        console.log('Total Paid in numbers : ' + this.totalPaid);
        console.log(this.totalInWords);
        console.log(this.paidInstallments);
        console.log('---------------------------------------------------------------------');
    }

    ngAfterViewInit() {
        // window.print();
    }

    open(isPrint: Boolean) {
        this.modalRef = this._modalService.open(LoanPrintComponent, { centered: true, size: 'lg' });
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

