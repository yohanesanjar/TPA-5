let { checkEmail, createUser, editTodo, detailTodo, createTodo, deleteTodo, deleteAllTodo, deleteUser } = require('../mongodb/db')
let { getHashedPassword } = require('./function')

async function registerUser(req, res) {
    try {
        let {name, email, password, confirmPassword } = req.body
        if(name == '' || email == '' || password == '' || confirmPassword == '') {
            res.render('register', {
                message: 'Input Name, Email and Password!',
                messageClass: 'alert-danger'
            });
            return
        }
        if(password.length < 6 || confirmPassword < 6) {
            res.render('register', {
                message: 'Password must be at least 6 characters',
                messageClass: 'alert-danger'
            });
            return
        }
        if(password === confirmPassword) {
            let checking = await checkEmail(email)
            if(checking) {
                res.render('register', {
                    message: 'User already registered.',
                    messageClass: 'alert-danger'
                })
                return
            }
            let hashedPassword = getHashedPassword(password)
            createUser(name, email, hashedPassword)
            res.render('login', {
                message: 'Registration Complete. Please login to continue.',
                messageClass: 'alert-success'
            });
            return
        } else {
            res.render('register', {
                message: 'Password does not match.',
                messageClass: 'alert-danger'
            });
            return
        }
    } catch(err) {
        console.log(err)
    }
}

async function addTodoUser(req, res) {
    try {
        let { title, desc, dueDate } = req.body
        if (title == '' || desc == '' || dueDate == '') {
            res.render('todo/add', {
                message: 'Input Title ,desc, and dueDate!',
                messageClass: 'alert-danger'
            })
            return
        }
        createTodo(req.user.id, title, desc, dueDate)
        res.redirect('/todo')
    } catch(err) {
        console.log(err)
    }
}

async function deleteTodoUser(req, res) {
    try {
        deleteTodo(req.user.id, req.body.id)
        res.redirect('/todo')
    } catch (error) {
        console.log(error)
    }
}

async function deleteAllTodoUser(req, res) {
    try {
        deleteAllTodo(req.user.id)
        res.redirect('/todo')
    } catch (error) {
        console.log(error)
    }
}

async function editTodoUser(req, res) {
    try {
        let { title, desc, dueDate, id } = req.body
        editTodo(req.user.id, req.body.id, title, desc, dueDate)
        res.redirect('/todo')
    } catch (error) {
        console.log(error)
    }
}

async function detailTodoUser(req, res) {
    try {
        let { title, dueDate, desc, id } = req.body
        detailTodo(req.user.id, req.body.id, title, desc, dueDate)
        res.redirect('/todo')
    } catch (error) {
        console.log(error)
    }
}

async function deleteUserAccount(req, res) {
    try {
        let id = req.user.id
        let { resp } = req.body
        if (resp == 'yes') {
            deleteUser(id)
            res.render('login', {
                message: 'Succes Deleted Account, Please Register',
                messageClass: 'alert-success'
            });
        } else {
            res.redirect('/todo')
        }
    } catch(error) {
        console.log(error)
    }
}

// sjdoaho


module.exports = { registerUser, addTodoUser, deleteTodoUser,deleteAllTodoUser, editTodoUser, detailTodoUser, deleteUserAccount }
