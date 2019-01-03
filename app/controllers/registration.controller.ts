let params = {body: {}, condition: {}, pick: ['email', 'fullName', 'password', 'status' ]}

export class RegistrationController {
  constructor() {
  }
  signup(req, res) {
    req.body.status = 'active'
    req.checkBody('email', 'Enter a valid email address.').isEmail().isLength({ min: 3 , max: 100 })
    req.checkBody('fullName', 'Full Name must be between 2 and 50 characters in length.').isLength({ min: 2 , max: 50 })
    req.checkBody('password', 'Password should be at least 6 chars long.').isLength({ min: 6 })
    req.model('User').create(params, data => {
      const token = data.generateToken()
      res.setHeader('x-access-token', token)
      return res.status(201).send({
        success: true,
        data: data,
        token: token,
        message: 'Congrats! You have successfully registered'
      })
    })
  }
}
