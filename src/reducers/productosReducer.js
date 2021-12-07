export default function reducer(state = { list: undefined, tie_act: undefined }, action){
	switch(action.type){
		case 'GET_PRODUCTOS':
		
		state = {
		   ...state.productos, list: action.payload.list
		}
		break;
		
		default:
		return state;
	}

	return state
}