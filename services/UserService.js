const { comparePassword, hashPassword } = require('../bin/util');

class UserService {
    constructor(userModel, roleModel){
        this.userModel = userModel;
        this.roleModel = roleModel;
    }

    createUser = async ({ name, surname, email, password, role_id, image_path = null, image_url = null }) => {
        const user = this.userModel.build({ 
            name, 
            surname, 
            email, 
            password, 
            role_id, 
            image_path, 
            image_url,
            created: (new Date()).setUTCHours(-6)
        });

        try {
            let saveResult = await user.save();
            //console.log(saveResult)
            return { result : true, user: user.toJSON() };
        } catch (ex) {
            throw new Error(`UserService.createUser: ${ex.message}`);
        }
    }

    updateUser = async (id, { name, surname, email, password, role_id, image_path = null, image_url = null }) => {
        try {
            let updated = await this.userModel.update(
                {
                    name, 
                    surname, 
                    email, 
                    password, 
                    role_id, 
                    image_path, 
                    image_url,
                    updated: (new Date()).setUTCHours(-6)
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
            throw new Error(`UserService.updateUser: ${ex.message}`);
        }
    }

    getUser = async (id) => {
        try {
            let user = await this.userModel.findOne({ where: { id, deleted: null } });

            if(!user){
                return { result: false, code: 'NOT_FOUND' }
            }

            return { result: true, user };
        } catch(ex) {
            throw new Error(`UserService.getUser: ${ex.message}`);
        }
    }

    getUsers = async () => {
        try {
            let users = await this.userModel.findAll({ where: { deleted: null } })

            return { result: true, users: users.map(user => user.toJSON()) };
        } catch(ex) {
            throw new Error(`RoleService.getUsers: ${ex.message}`);
        }
    }

    deleteUser = async (id) => {
        try {
            let deleted = await this.userModel.update(
                {
                    deleted: (new Date()).setUTCHours(-6)
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

    login = async (email, password) => {
        let user = await this.userModel.findOne({ where: { email, deleted: null }, include: [this.roleModel] });

        if(!user){
            return { result: false, code: 'NOT_FOUND' } 
        }

        let isPasswordCorrect = await comparePassword(password, user.password);

        if(!isPasswordCorrect)
            return { result: false, code: 'UNAUTHORIZED' };

        return { 
            result: true,
            user
        }
    }
}

module.exports = UserService;