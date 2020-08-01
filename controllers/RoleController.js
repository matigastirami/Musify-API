const { RoleService } = require("../services");
const { getStatusCode } = require("../bin/util");
const { validationResult } = require("express-validator");

class RoleController {
    constructor(){
    }

    //POST api/role
    async create(req, res){
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let DTO = req.body;
        let service = new RoleService();
        try {
            let { result, user } = await service.createRole(DTO.description);
            console.log(result, user)
            res.status(201).send(user)
        } catch (ex) {
            console.log(ex)
            res.status(500).send(ex.message)
        }
    }

    //PUT api/role/:id
    async update(req, res){
        let DTO = req.body;
        let service = new RoleService();
        try {
            let {result, updated, code} = await service.updateRole(req.params.id, DTO.description);
            if(!result){
                return res.status(getStatusCode(code)).end();
            }
            return res.status(200).send(updated);
        } catch (ex) {
            console.log("Exeption RoleController.update: ", ex);
            res.status(500).send(ex.message);
        }
    }

    async search(req, res){
        let service = new RoleService();
        try {
            let { result, roles } = await service.getRoles();
            if(!result){
                return res.status(getStatusCode(code)).end();
            }
            return res.status(200).send(roles);
        } catch (ex) {
            console.log("Exeption RoleController.search: ", ex);
            res.status(500).send(ex.message);
        }
    }

    async get(req, res){
        let id = req.params.id;
        let service = new RoleService();
        try {
            let { result, role, code } = await service.getRole(id);
            if(!result){
                return res.status(getStatusCode(code)).end();
            }
            return res.status(200).send(role);
        } catch (ex) {
            console.log("Exeption RoleController.search: ", ex);
            res.status(500).send(ex.message);
        }
    }

    async delete(req, res){
        let id = req.params.id;
        let service = new RoleService();
        try {
            let { result, deleted, code } = await service.deleteRole(id);
            if(!result){
                return res.status(getStatusCode(code)).end();
            }
            return res.status(200).send(deleted);
        } catch (ex) {
            console.log("Exeption RoleController.delete: ", ex);
            res.status(500).send(ex.message);
        }
    }
}

module.exports = new RoleController();