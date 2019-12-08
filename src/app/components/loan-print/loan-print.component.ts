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


        let today = new Date(this.inst['created_date']);
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
        popupWin.document.write(`
            <html>
                <head>
                    <title></title>
                    <!-- Bootstrap 3.0 -->
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
                            .bg-dark{ background-color: gray!important; color: #ebdef0 !important}
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
                            .hmtrading-text-right {
                                text-align: right !important;
                            }
                        }
                    </style>
                </head>
                <body onload='window.print();window.close()'>
                ${printContents}
                </body>
            </html>`
        );
        popupWin.document.close();
    }

}

