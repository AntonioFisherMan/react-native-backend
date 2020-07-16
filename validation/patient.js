const {check}=require("express-validator")

const validation={
    create:[
        check('fullName').isLength({min:6,max:32}),
        check('phone').isLength({min:9,max:12})
    ]
}

module.exports=validation