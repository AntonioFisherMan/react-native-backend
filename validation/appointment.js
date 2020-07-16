const {check}=require('express-validator')

const validation={
    create:[
        check('dentNumber').isInt({min:1,max:32}),
        check('diagnosis').isLength({min:3,max:30}),
        check('price').isInt({min:0,max:30000}),
    ]
}

module.exports=validation