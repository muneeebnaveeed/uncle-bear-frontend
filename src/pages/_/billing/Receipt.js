import React from 'react';
import { Table } from 'reactstrap';
import dayjs from 'dayjs';
import { connect } from 'react-redux';
import { When } from 'react-if';
import FormatNumber from '../../../components/Common/FormatNumber';

class Receipt extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            today: new Date(),
        };
    }

    getDiscountAmount = (discount, total) => total * (discount / 100);

    render() {
        const { shop, billId, customer, products, subtotal, total } = this.props;
        const discount = this.props.discount ? Number(this.props.discount) : 0;
        return (
            <div
                className={`tw-w-full tw-h-full tw-flex tw-justify-center tw-bg-gray-50 ${this.props.className || ''}`}
            >
                <div className="tw-w-[50mm] tw-h-[500mm] tw-bg-gray-100 tw-flex tw-flex-col tw-items-center tw-p-4">
                    <div className="tw-w-[40px] tw-h-[40px] rounded-full tw-bg-gray-500 tw-mb-4" />
                    <h4 className="tw-text-[12px] tw-mb-2">
                        <span className="tw-font-bold tw-uppercase">Shop:</span> {shop?.address}
                    </h4>
                    <h4 className="tw-text-[12px] tw-mb-2">
                        <span className="tw-font-bold tw-uppercase">Bill#</span> {billId}
                    </h4>
                    <When condition={customer}>
                        <h4 className="tw-text-[12px] tw-font-bold tw-uppercase tw-mb-2">Customer</h4>
                        <h4 className="tw-text-[12px] tw-mb-1">{customer?.name}</h4>
                        <h4 className="tw-text-[12px] tw-mb-1">{customer?.phone}</h4>
                        <h4 className="tw-text-[12px] tw-mb-2">{customer?.type}</h4>
                    </When>
                    <table className="mb-0 table-striped tw-w-[20mm] tw-text-[10px] tw-mb-4">
                        <thead className="tw-text-white tw-bg-gray-500">
                            <tr>
                                <th className="tw-px-3">#</th>
                                <th className="tw-px-3">Product</th>
                                <th className="tw-px-3">Qty</th>
                                <th className="tw-px-3">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p, index) => (
                                <tr key={`bill-invoice-product-${index}`}>
                                    <td className="tw-align-middle tw-px-1">{index + 1}</td>
                                    <td className="tw-align-middle tw-px-1">{p.name}</td>
                                    <td className="tw-align-middle tw-px-1">{p.qty}</td>
                                    <td className="tw-align-middle tw-px-1">{p.qty * p.salePrice}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="tw-w-[50mm] tw-px-4 tw-flex tw-flex-col tw-items-end tw-mt-2">
                        <h5 className="tw-text-[8px] tw-mb-1">
                            <span className="tw-font-bold tw-uppercase">Subtotal:</span>{' '}
                            <FormatNumber number={subtotal} />
                        </h5>
                        <h5 className="tw-text-[8px] tw-mb-1">
                            <span className="tw-font-bold tw-uppercase">Discount:</span>{' '}
                            {this.getDiscountAmount(discount, total)}
                        </h5>
                        <h5 className="tw-text-[8px] tw-mb-1">
                            <span className="tw-font-bold tw-uppercase">Total:</span> <FormatNumber number={total} />
                        </h5>
                    </div>
                    <div className="tw-w-full tw-h-[10px] tw-bg-gray-500 tw-mb-2" />
                    <div className="tw-w-full tw-h-[30px] tw-flex tw-gap-2 tw-justify-around tw-mb-4">
                        <div className="tw-h-[30px] tw-w-1/2 tw-bg-gray-500" />
                        <div className="tw-h-[30px] tw-w-1/2 tw-bg-gray-500" />
                    </div>
                    <h5 className="tw-text-[12px] tw-mb-1">
                        <span className="tw-font-bold tw-uppercase">Contact:</span> 3200
                    </h5>
                    <h5 className="tw-text-[12px] tw-mb-1">
                        <span className="tw-font-bold tw-uppercase">
                            {dayjs(this.state.today).format('D MMM YYYY h[:]mm A')}
                        </span>
                    </h5>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({ shop: state.globals.shop });

export default Receipt;
