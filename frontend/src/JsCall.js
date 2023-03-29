import { Component } from "react"
import { IISMethods } from "./config/IISMethods"

export default class _JsCall extends Component {    
    validateForm = (formdata, validations, key, formname) => {
        // debugger
        // console.log(formdata)
        // console.log(validations)
        var hasError
        if(key){
            let value = formdata[key]
            let field = IISMethods.getobjectfromarray(validations, 'field', key)

            if(field.type === "text"){
                hasError ||= !value.match(new RegExp(field.regex))
                    || parseFloat(value) < field.minvalue
                    || parseFloat(value) > field.maxvalue
                    || value.length > field.maxlength
                    || value.length < field.minlength
            }
            else {
                hasError = false
            }

            hasError ||= !value && field.required 
            hasError &&= value || field.required 

        }
        else {
            validations.map((data) => {
                data.formfields.map((fields) => {
                    var temphasError = this.validateForm(formdata, validations, fields.field, formname)
                    hasError ||= temphasError
                })
            })
        }
        // console.log(hasError)
        return hasError
    }
}