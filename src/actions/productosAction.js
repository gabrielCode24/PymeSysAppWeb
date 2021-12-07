export function getProductos(_list){
    return function(dispatch){
        dispatch({
            type: 'GET_PRODUCTOS',
            payload: {
                list: _list
            }
        })
    }
}