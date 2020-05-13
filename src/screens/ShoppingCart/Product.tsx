import React, { Component } from 'react'
import { connect } from 'react-redux'

import Layout from '../../layout'
import { dataPagination, typeActions } from '../../types'
import { Table, Actions, Form, Modal } from '../../components'
import { actionsReducers } from '../../reducers'
import { productFunctions } from '../../constants'
import DocumentTable from './DocumentTable'

const { getActions, getTable, getModal, breadcrumb, NewForm } = productFunctions;

interface Props extends React.Props<Products> {
	getProducts: (data: any) => void;
	saveProduct: () => void;
	onPayOrder: (data: any) => void;
	addSearchStringSelected: (data) => void;
	getDataForm: (data: any) => void;

	getAssociatedDocuments: (data: any) => void;
	saveAssociatedDocument: () => void;
	deleteAssociatedDocument: (data: any) => void;

	getAssociatedTests: (data: any) => void;
	saveAssociatedTests: () => void;
	deleteAssociatedTests: (data: any) => void;

	getResetPage: () => void;
	load: (data: any) => void;

	order: any;
	trainingIdSelected: number;
	dataForm: any;
	documents: Array<any>;
	tests: Array<any>;

	columns: Array<string>;
	pagination: dataPagination;
	actions: any;  // PERMISOS
}

interface State {
	actions: Array<typeActions>;
	bodyModal: Array<any>;
	id: any;
	modal: boolean;
	form: boolean;
	alert: boolean;
}

class Products extends Component<Props, State> {
	constructor(props) {
		super(props);
		this.props.order.items = [];
		this.state = {
			actions: [],
			bodyModal: [],
			id: {},
			modal: false,
			form: false,
			alert: false,
		}
		this.props.getProducts({});
	}

	componentDidMount() {
		var actions = [];
		actions = getActions(this.onNew, this.onReturn, this.state.form);
		this.setState({ actions });
		this.forceUpdate();
	}

	componentDidUpdate(prevProps, prevState) {
		var actions = [];
		actions = getActions(this.onNew, this.onReturn, this.state.form);
		if (JSON.stringify(this.state.actions) != JSON.stringify(actions)) {
			this.setState({ actions });
		}
	}

	onNew = () => {
		var actions = [];
		this.props.load(NewForm(this.saveProduct, onchange, this.props.dataForm));
		actions = getActions(this.onNew, this.onReturn, !this.state.form);
		this.setState({ actions, form: true });
	}


	onSee = (data: any) => {
		var body = getModal({ ...data });
		this.setState({ bodyModal: body, modal: true });
	}

	onPayOrder = (id) => {
		this.setState({ id: id, alert: true });
	}

	saveProduct = () => {
		this.props.saveProduct();
		this.onReturn();
	}

	onReturn = () => {
		var actions = [];
		var transForm = false;
		transForm = !this.state.form;
		actions = getActions(this.onNew, this.onReturn, transForm);
		this.setState({
			actions, form: transForm
		});
	}

	updateTest = () => {
		this.props.saveProduct();
		this.onReturn();
	}

	onConfirm = () => {
		this.props.onPayOrder(this.state.id);
		this.setState({ id: {}, alert: false });
	}

	onCancel = () => this.setState({ id: {}, alert: false });

	getTitle = () => {
		return { icon: 'fas fa-shopping-cart', title: 'Shopping Cart - Products' }
	}

	render() {
		const { actions, alert, form, modal, bodyModal } = this.state;

		return (
			<Layout
				subHeader={this.getTitle()}
				breadcrumb={breadcrumb}
				alert={alert}
				alertTitle={'Confirm Pay the order?'}
				confirmAlert={this.onConfirm}
				cancelAlert={this.onCancel}
			>
				<div className='row'>
					{
						<div className="container-fluid" style={{ fontSize: 16 }}>
							<br />
							<div className="row">
								<div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
									<strong>Order:</strong> {this.props.order.number}
								</div>
								<div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
								</div>
								<div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
									<button onClick={this.onPayOrder} className="btn btn-primary  mt-2 mb-2 waves-effect waves-themed" title="New Training"><i className="fas fa-plus"></i> Pay the order</button>
								</div>
							</div>
							<br />
						</div>
					}
					<Actions actions={actions} />
					<Modal title={'Product Detail'} body={bodyModal} view={modal} onClick={() => this.setState({ modal: false })} />
					{
						form ?
							<Form /> :
							<DocumentTable refSelectedDocs={() => { }} selRowIds={[]} data={this.props.order.items} />
					}
				</div>
			</Layout>
		)
	}
}

const mapStateToProps = state => {
	return ({
		columns: state.trainings.columns,
		order: state.trainings.order,
		trainingIdSelected: state.trainings.trainingIdSelected,
		dataForm: state.trainings.dataForm,
		documents: state.trainings.documents,
		tests: state.trainings.tests,
		pagination: state.config.pagination,
		actions: state.auth.actions,
	})
};

const mapDispatchToProps = dispatch => ({
	getProducts: (data) => {
		dispatch({ type: actionsReducers.GET_ORDER, payload: data });
	},
	saveProduct: () => {
		dispatch({ type: actionsReducers.CREATE_PRODUCT });
	},
	onPayOrder: (data) => {
		dispatch({ type: actionsReducers.PAY_ORDER, payload: data });
	},
	getDataForm: (data) => {
		dispatch({
			type: actionsReducers.GET_DATA_FORM,
			payload: data
		});
	},
	load: (data) => {
		dispatch({ type: actionsReducers.INITIAL_VALUES_FORM_EDIT, payload: data })
	},
	getResetPage: () => {
		dispatch({ type: actionsReducers.RESET_PAGINATION });
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(Products)