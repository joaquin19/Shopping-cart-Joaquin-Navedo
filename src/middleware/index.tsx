import { fork } from 'redux-saga/effects'

import general from './general'
import training from './ShoppingCart'

export default function* Darwin() {
    yield fork(general);
    yield fork(training);
}