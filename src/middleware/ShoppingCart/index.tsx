import { takeLatest, fork } from 'redux-saga/effects';
import { actionsReducers } from '../../reducers'

import * as training from './product'

function* ProductsModule() {
	yield takeLatest(actionsReducers.GET_ORDER, training.getProducts);
	yield takeLatest(actionsReducers.CREATE_PRODUCT, training.saveProduct);
	yield takeLatest(actionsReducers.PAY_ORDER, training.payOrder);
}

export default function* main() {
	yield fork(ProductsModule);
}