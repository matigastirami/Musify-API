class RoleService {
    constructor(roleModel){
        this.roleModel = roleModel;
    }

    createRole = async (description) => {
        const user = this.roleModel.build({ description });
        try {
            let saveResult = await user.save();
            //console.log(saveResult)
            return { result : true, user: user.toJSON() };
        } catch (ex) {
            throw new Error(`RoleService.createRole: ${ex.message}`);
        }
    }

    updateRole = async (id, description) => {
        try {
            let updated = await this.roleModel.update(
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

    getRole = async (id) => {
        try {
            let role = await this.roleModel.findOne({ where: { id, enddate: null } });

            if(!role){
                return { result: false, code: 'NOT_FOUND' }
            }

            return { result: true, role };
        } catch(ex) {
            throw new Error(`RoleService.getRole: ${ex.message}`);
        }
    }

    getRoles = async () => {
        try {
            let roles = await this.roleModel.findAll({ where: { enddate: null } })

            return { result: true, roles };
        } catch(ex) {
            throw new Error(`RoleService.getRoles: ${ex.message}`);
        }
    }

    deleteRole = async (id) => {
        try {
            let deleted = await this.roleModel.update(
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

            //console.log(deleted);

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