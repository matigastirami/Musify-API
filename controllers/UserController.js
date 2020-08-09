const { getStatusCode } = require("../bin/util");
const { validationResult } = require("express-validator");

class UserController {
    constructor(userService){
        this.userService = userService;
    }

    //POST api/User
    create = async (req, res) =>{
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let DTO = req.body;
        try {
            let { result, user } = await this.userService.createUser(DTO);
            //console.log(result, user)
            res.status(201).send(user)
        } catch (ex) {
            //console.log(ex)
            res.status(500).send(ex.message)
        }
    }

    //PUT api/User/:id
    update = async (req, res) => {
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let DTO = req.body;
        try {
            let {result, updated, code} = await this.userService.updateUser(req.params.id, DTO);
            if(!result){
                return res.status(getStatusCode(code)).end();
            }
            return res.status(200).send(updated);
        } catch (ex) {
            //console.log("Exeption UserController.update: ", ex);
            res.status(500).send(ex.message);
        }
    }

    search = async (req, res) =>{
        try {
            let { result, users } = await this.userService.getUsers();
            if(!result){
                return res.status(getStatusCode(code)).end();
            }
            return res.status(200).send(users);
        } catch (ex) {
            //console.log("Exeption UserController.search: ", ex);
            res.status(500).send(ex.message);
        }
    }

    get = async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let id = req.params.id;
        try {
            let { result, user, code } = await this.userService.getUser(id);
            if(!result){
                return res.status(getStatusCode(code)).end();
            }
            return res.status(200).send(user);
        } catch (ex) {
            //console.log("Exeption UserController.search: ", ex);
            res.status(500).send(ex.message);
        }
    }

    delete = async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let id = req.params.id;
        try {
            let { result, deleted, code } = await this.userService.deleteUser(id);
            if(!result){
                return res.status(getStatusCode(code)).end();
            }
            return res.status(200).send(deleted);
        } catch (ex) {
            //console.log("Exeption UserController.delete: ", ex);
            res.status(500).send(ex.message);
        }
    }

    login = async (req, res) => {
        let DTO = req.body;
        try {
            let { result, user, code } = await this.userService.login(DTO.username, DTO.password);
            if(!result){
                return res.status(getStatusCode(code)).end();
            }
            return res.status(200).send(user);
        } catch (ex) {
            //console.log("Exeption UserController.delete: ", ex);
            res.status(500).send(ex.message);
        }
    }
}

module.exports = UserController;