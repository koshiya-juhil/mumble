import _Config from "./Config"
import _JsCall from '../JsCall'

export var Config = new _Config()
export var JsCall = new _JsCall()

class _IISMethods {

    getindexfromarray = (array, key, value) => {
        return array.findIndex(o => o[key] == value)
    }
    
    getobjectfromarray = (array, key, value) => {
        return array.find(o => o[key] === value )
    }

    getmultupleobjectsfromarray = (arr, key, value) => {
        return arr.filter(o => o[key] === value)
    }

    getobjectfromdoublekey = (arr, key1, value1, key2, value2) => {
        return arr.find(o => o[key1] === value1 && o[key2] === value2)
    }

    getmultipleobjectsfromdoublekey = (arr, key1, value1, key2, value2) => {
        return arr.filter(o => o[key1] === value1 && o[key2] === value2)
    }

}

export var IISMethods = new _IISMethods()