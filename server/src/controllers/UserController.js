const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

module.exports = class UserController {
    static async register(req,res){
        const {name,email,phone,password,confirmpassword} = req.body;
        if(!name){
            res.status(422).json({message: 'O nome é obrigátorio'})
            return
        }
        if(!email){
            res.status(422).json({message: 'O e-mail é obrigátorio'})
            return
        }
        if(!phone){
            res.status(422).json({message: 'O telefone é obrigátorio'})
            return
        }
        if(!password){
            res.status(422).json({message: 'A senha é obrigátorio'})
            return
        }
        if(!confirmpassword){
            res.status(422).json({message: 'A confirmação de senha é obrigátorio'})
            return
        }

        if(password !== confirmpassword){
            res.status(422).json({message: 'A senha e a confirmação de senha não são iguais'})
            return
        }

        //check if users

        const userExists = await User.findOne({email:email})
        if(userExists){
            res.status(422).json({message: 'Por favor ultilize outro e-mail'})
            return
        }

        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        const user = User({
            name:name,
            email:email,
            phone:phone,
            password:passwordHash
        })

        try{
            const newUser = await user.save();
            await createUserToken(newUser, req, res)

        }catch(error){
            res.status(500).json({message:error})
        }
    }

    static async login(req, res){
        const {name,email,phone,password,confirmpassword} = req.body;
        if(!email){
            res.status(422).json({message: 'O e-mail é obrigátorio'})
            return
        }
        if(!password){
            res.status(422).json({message: 'A senha é obrigátorio'})
            return
        }
        const user = await User.findOne({email:email})
        if(!user){
            res.status(422).json({message: 'Não há usuário cadastrado neste e-mail'})
            return
        }

        //Chekar password

        const checkPassword = await bcrypt.compare(password, user.password)
        if(!checkPassword){
            res.status(422).json({message: 'Senha Inválida'})
            return
        }

        //Deu bom

        await createUserToken(user, req, res)
    }   
    //Ver se token está sendo usado
    static async checkUser(req, res) {
        let currentUser
        if(req.headers.authorization){
            const token = getToken(req) //usa o helpers para pegar oo token
            
            const decoded = jwt.verify(token, 'nossosecret') //decodificar o jwt e pegar informações
            
            currentUser = await User.findById(decoded.id) //usuário a partir do token
            
            currentUser.password = undefined
        }else{
            let currentUser = null
        }

        res.status(200).send(currentUser)
    }
    static async getUserById(req, res) {
        const id = req.params.id
        const user = await User.findById(id).select("-password")
        if(!user){
            res.status(422).json({message: 'usuário não encontrado!'})
            return
        }
        res.status(422).json({
            user
        })

    }
    static async editUser(req, res) {
       const id = req.params.id 

       const token = getToken(req)
       const user = await getUserByToken(token)
       
       const {name,email,phone,password,confirmpassword} = req.body;
       
         
       if(req.file){
            user.image = req.file.filename
       }


       //validação
       if(!name){
        res.status(422).json({message: 'O nome é obrigátorio'})
        return
        }
        if(!email){
            res.status(422).json({message: 'O e-mail é obrigátorio'})
            return
        }

        //pra nãoo rescrever um email já criado
        const userExists = await User.findOne({email:email})

        if(user.email !== email && userExists){
            res.status(422).json({message: 'Por favor ultilize outro email!'})
            return
        }
        user.email = email

        if(!phone){
            res.status(422).json({message: 'O telefone é obrigátorio'})
            return
        }
        user.phone = phone

        if(password !== confirmpassword){
            res.status(422).json({message: 'A senha e a confirmação de senha não são iguais'})
            return
        }else if(password === confirmpassword && password != null){

            //gerar uma nova senha

            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)

            user.password = passwordHash
        }

        try {
            await User.findOneAndUpdate(
                {_id: user._id},
                {$set:user},
                {new:true}
            )
            res.status(200).json({
                message: "Usuário atualizado com Sucesso!"
            })
        }catch(err){
            res.status(500).json({message: err})
            return
        }
       
    }
    
}