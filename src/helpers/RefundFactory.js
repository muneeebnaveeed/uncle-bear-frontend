import _ from 'lodash';

class RefundFactory {
    constructor({
        initialProducts = [],
        products,
        setProducts,
        discount,
        setDiscount,
        deductionFromBalance,
        setDeductionFromBalance,
    }) {
        this.initialProducts = initialProducts;
        this.products = products;
        this.setProducts = setProducts;

        this.discount = discount;
        this.setDiscount = setDiscount;

        this.balance = -1;

        this.deductionFromBalance = deductionFromBalance;
        this.setDeductionFromBalance = setDeductionFromBalance;
    }

    setInitialProducts = (products) => {
        this.initialProducts = [...products];
    };

    handleIncrease = (name) => {
        const updatedProducts = _.cloneDeep([...this.products]);
        const index = updatedProducts.findIndex((e) => e.name === name);

        if (index === -1) return;

        updatedProducts[index].qty++;

        const initialProduct = this.initialProducts.find((e) => e._id === updatedProducts[index]._id);
        console.log(initialProduct?.qty, updatedProducts[index].qty);
        if (initialProduct?.qty < updatedProducts[index].qty) return;

        this.products = _.cloneDeep([...updatedProducts]);
        this.setProducts(_.cloneDeep([...updatedProducts]));
    };

    handleDelete = (name) => {
        const updatedProducts = [...this.products];
        const index = updatedProducts.findIndex((e) => e.name === name);

        if (index === -1) return;

        updatedProducts.splice(index, 1);

        this.products = updatedProducts;
        this.setProducts(updatedProducts);
    };

    handleDecrease = (name) => {
        const updatedProducts = _.cloneDeep([...this.products]);
        const index = updatedProducts.findIndex((e) => e.name === name);

        if (index === -1) return;

        const product = updatedProducts[index];

        product.qty--;

        if (product.qty <= 0) return;

        this.products = updatedProducts;
        this.setProducts(updatedProducts);
    };

    getSubtotal = () => {
        const prices = [0, 0];
        this.products.forEach((p) => prices.push(p.qty * p.salePrice));
        return prices.reduce((a, b) => a + b);
    };

    handleChangeDiscount = (event) => {
        const discount = event.target.value;
        this.discount = discount;
        this.setDiscount(discount);
    };

    getTotal = () => {
        const subtotal = this.getSubtotal();
        const ratioedDiscount = Number(this.discount) / 100;
        const absoluteDiscount = subtotal * ratioedDiscount;
        const t = subtotal - absoluteDiscount;
        return t;
    };

    setBalance = (balance) => {
        this.balance = balance;
    };

    getDeductionFromBalance = () => {
        const total = this.getTotal();
        return total * (Number(this.deductionFromBalance) / 100);
    };

    getChange = () => {
        // console.log (this.getDeductionFromBalance());
        const total = this.getTotal();
        const raw = total - this.getDeductionFromBalance();
        if (raw <= this.balance) return this.balance - raw + (this.getDeductionFromBalance() - this.balance);

        return total - this.balance;
    };

    resetBill = () => {
        this.products = [];
        this.setProducts([]);
        this.discount = '';
        this.setDiscount('');
    };
}

export default RefundFactory;
