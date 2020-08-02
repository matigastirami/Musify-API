const { getStatusCode } = require("../bin/util");
const { validationResult } = require("express-validator");

class RoleController {
    constructor(roleService){
        this.roleService = roleService;
    }

    //POST api/role
    create = async (req, res) =>{
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let DTO = req.body;
        try {
            let { result, user } = await this.roleService.createRole(DTO.description);
            //console.log(result, user)
            res.status(201).send(user)
        } catch (ex) {
            //console.log(ex)
            res.status(500).send(ex.message)
        }
    }

    //PUT api/role/:id
    update = async (req, res) => {
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let DTO = req.body;
        try {
            let {result, updated, code} = await this.roleService.updateRole(req.params.id, DTO.description);
            if(!result){
                return res.status(getStatusCode(code)).end();
            }
            return res.status(200).send(updated);
        } catch (ex) {
            //console.log("Exeption RoleController.update: ", ex);
            res.status(500).send(ex.message);
        }
    }

    search = async (req, res) =>{
        try {
            let { result, roles } = await this.roleService.getRoles();
            if(!result){
                return res.status(getStatusCode(code)).end();
            }
            return res.status(200).send(roles);
        } catch (ex) {
            //console.log("Exeption RoleController.search: ", ex);
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
            let { result, role, code } = await this.roleService.getRole(id);
            if(!result){
                return res.status(getStatusCode(code)).end();
            }
            return res.status(200).send(role);
        } catch (ex) {
            //console.log("Exeption RoleController.search: ", ex);
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
            let { result, deleted, code } = await this.roleService.deleteRole(id);
            if(!result){
                return res.status(getStatusCode(code)).end();
            }
            return res.status(200).send(deleted);
        } catch (ex) {
            //console.log("Exeption RoleController.delete: ", ex);
            res.status(500).send(ex.message);
        }
    }
}

module.exports = RoleController;