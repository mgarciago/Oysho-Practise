import { Action, createReducer, on } from '@ngrx/store';
import { cartInitialState, CartState } from '../states/cart.state';
import * as cartActions from '../actions/cart.actions';

const cartReducerCreator = createReducer(
  cartInitialState,
  on(cartActions.addProducts, (state, { products }) => ({ ...state, products: [...state.products, products] })),
  on(cartActions.addProductsSuccess, (state => ({ ...state }))),
  on(cartActions.getProducts, (state => ({ ...state }))),
  on(cartActions.getProductsSuccess, (state, { products }) => ({ ...state, products: [...state.products, products] }))


);

export function cartReducer(state: CartState | undefined, action: Action) {
  return cartReducerCreator(state, action);
}
