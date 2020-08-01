const config = require('../config');
const sequelize = require('../loaders/sequelize')(config.database);
const RoleModel = require('../models/RoleModel')(sequelize);

class RoleService {
    constructor(){
        this.roleModel = RoleModel;
    }

    async createRole(description){
        const user = RoleModel.build({ description });
        try {
            let saveResult = await user.save();
            console.log(saveResult)
            return { result : true, user: user.toJSON() };
        } catch (ex) {
            throw new Error(`RoleService.createRole: ${ex.message}`);
        }
    }

    async updateRole(id, description){
        try {
            let updated = await RoleModel.update(
                {
                    description,
                    modifydate: (new Date()).setUTCHours(-6)
                },
                {
                    where: {
                        id
                    },
                    returning: true
                }
            )

            if(updated[0] == 0){
                return { result: false, code: 'NOT_FOUND' }
            }

            return {result: true, updated: updated[1][0]};
        } catch (ex) {
            throw new Error(`RoleService.updateRole: ${ex.message}`);
        }
    }

    async getRole(id){
        try {
            let role = await RoleModel.findByPk(id, { where: { enddate: null } });

            if(!role){
                return { result: false, code: 'NOT_FOUND' }
            }

            return { result: true, role };
        } catch(ex) {
            throw new Error(`RoleService.getRole: ${ex.message}`);
        }
    }

    async getRoles(){
        try {
            let roles = await RoleModel.findAll({ where: { enddate: null } })

            return { result: true, roles };
        } catch(ex) {
            throw new Error(`RoleService.getRoles: ${ex.message}`);
        }
    }

    async deleteRole(id){
        try {
            let deleted = await RoleModel.update(
                {
                    enddate: (new Date()).setUTCHours(-6)
                },
                {
                    where: {
                        id
                    },
                    returning: true
                }
            );

            console.log(deleted);

            if(!deleted[0]){
                return { result: false, code: 'NOT_FOUND' };    
            }

            return { result: true, deleted: deleted[1][0] };
        } catch (ex) {
            throw new Error(`RoleService.deleteRoles: ${ex.message}`);
        }
    }
}

module.exports = RoleService;